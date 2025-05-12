from django.shortcuts import render 
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from api.models import Etudiant
from api.serializers import EtudiantSerializer
import pandas as pd
import os
import json
import psycopg2

def clean_and_extract(input_file, output_file=None, sheet_name=0):
    """Nettoie le fichier Excel, extrait les données et structure les matières par semestre et UE."""
    print(f"📂 Chargement du fichier : {input_file}")
    df = pd.read_excel(input_file, sheet_name=sheet_name, engine='openpyxl')

    df_cleaned = df.dropna(how='all')  # Supprimer les lignes entièrement vides

    if output_file is None:
        base, ext = os.path.splitext(input_file)
        output_file = f"{base}_sans_lignes_vides{ext}"
    df_cleaned.to_excel(output_file, index=False, engine='openpyxl')
    print(f"✅ Lignes vides supprimées. Fichier sauvegardé sous : {output_file}")

    if df_cleaned.shape[0] < 3:
        print("⚠️ Le fichier ne contient pas assez de lignes après nettoyage.")
        return None

    semester = str(df_cleaned.iloc[1][3])
    print(f"📌 Semestre détecté : {semester}")

    row_2 = df_cleaned.iloc[1]
    row_3 = df_cleaned.iloc[2]
    code_name_mapping = {code: name for code, name in zip(row_2, row_3) if pd.notna(code) and pd.notna(name)}

    structured_codes_noms = structure_code_name_mapping(semester, code_name_mapping)
    students_notes = extract_students_notes(df_cleaned, row_2)

    return structured_codes_noms, students_notes

from rest_framework import viewsets
from rest_framework.response import Response
import pandas as pd
from rest_framework.parsers import MultiPartParser, FormParser

class UploadDataSet(viewsets.ViewSet):
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        
        if not file:
            return Response({"message": "Aucun fichier n'a été téléchargé."}, status=400)

        if not file.name.endswith('.xlsx') and not file.name.endswith('.xls'):
            return Response({"message": "Le fichier téléchargé n'est pas un fichier Excel."}, status=400)

        try:
            df = pd.read_excel(file)
            if df.empty:
                return Response({"message": "Données insérées avec succès"}, status=400)

            # Si tu veux insérer les données dans ta base, ajoute ton code ici.
            process_and_insert_data(df)
            return Response({"message": "Données insérées avec succès", "columns": list(df.columns)}, status=200)

        except Exception as e:
            return Response({"message": f"Une erreur est survenue: {str(e)}"}, status=500)

import pandas as pd
import psycopg2
import os

def process_and_insert_data(df, output_file=None):
    """Nettoie le DataFrame, extrait les données, structure les matières par semestre et UE,
    puis insère les données dans la base PostgreSQL."""

    # 🔹 **1. Supprimer les lignes entièrement vides**
    df_cleaned = df.dropna(how='all')

    # 🔹 **2. Sauvegarder le fichier nettoyé si besoin**
    if output_file is None:
        output_file = "data_cleaned.xlsx"
    df_cleaned.to_excel(output_file, index=False, engine='openpyxl')
    print(f"✅ Lignes vides supprimées. Fichier sauvegardé sous : {output_file}")

    # 🔹 **3. Vérifier s'il y a assez de données**
    if df_cleaned.shape[0] < 3:
        print("⚠️ Le fichier ne contient pas assez de lignes après nettoyage.")
        return None

    # 🔹 **4. Récupérer le semestre depuis la première cellule (ligne 1, colonne 1)**
    semester = str(df_cleaned.iloc[1][3])
    print(f"📌 Semestre détecté : {semester}")

    # 🔹 **5. Extraire les codes (ligne 2) et noms (ligne 3)**
    row_2 = df_cleaned.iloc[1]  # Ligne contenant les codes
    row_3 = df_cleaned.iloc[2]  # Ligne contenant les noms
    code_name_mapping = {code: name for code, name in zip(row_2, row_3) if pd.notna(code) and pd.notna(name)}

    # 🔹 **6. Structurer le dictionnaire des UE et matières**
    structured_codes_noms = structure_code_name_mapping(semester, code_name_mapping)

    # 🔹 **7. Extraire les notes des étudiants**
    students_notes = extract_students_notes(df_cleaned, row_2)

    # 🔹 **8. Connexion à la base de données PostgreSQL**
    conn = psycopg2.connect(
        dbname='gii_polytech',
        user='postgres',
        password='postgres',
        host='localhost',
        port='5432'
    )
    cursor = conn.cursor()

    # 🔹 **9. Insertion des données dans la base de données PostgreSQL**
    # Insérer les semestres, UE, ECUE
    for code_semestre, ues in structured_codes_noms.items():
        # Insérer le semestre
        nom_semestre = f"semestre {int(''.join(filter(str.isdigit, code_semestre)))}"
        cursor.execute("""
            INSERT INTO semestre (nom_semestre, code_semestre, annee_applicable)
            VALUES (%s, %s, '2024-2025')
            RETURNING id_semestre;
        """, (nom_semestre, code_semestre))
        id_semestre = cursor.fetchone()[0]

        for ue, ecues in ues.items():
            code_ue, nom_ue = ue.split("+")
            cursor.execute("""
                INSERT INTO ue (id_semestre, code_ue, nom_ue)
                VALUES (%s, %s, %s)
                RETURNING id_ue;
            """, (id_semestre, code_ue, nom_ue))
            id_ue = cursor.fetchone()[0]

            for code_ecue, nom_ecue in ecues.items():
                cursor.execute("""
                    INSERT INTO ecue (id_ue, code_ecue, nom_ecue, coefficient)
                    VALUES (%s, %s, %s, NULL);
                """, (id_ue, code_ecue, nom_ecue))

    # Insérer les étudiants et leurs notes
    for student_id, student_data in students_notes.items():
        nom = student_data['Nom']
        prenom = student_data['Prénom']
        email = f"{prenom.lower()}.{nom.lower()}@etu.univ-amu.fr".replace(" ", "")

        # Insérer les étudiants
        cursor.execute('''
            INSERT INTO etudiant (id_etudiant, nom, prenom, email)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (id_etudiant) DO NOTHING;
        ''', (student_id, nom, prenom, email))

        # Insérer les notes dans les tables etudiant_semestre et etudiant_ecue
        for code, note in student_data['Notes'].items():
            if code.endswith('SAA'):  # Semestres
                cursor.execute('''
                    SELECT id_semestre FROM semestre WHERE code_semestre = %s;
                ''', (code,))
                id_semestre = cursor.fetchone()

                if id_semestre:
                    id_semestre = id_semestre[0]
                    cursor.execute('''
                        INSERT INTO etudiant_semestre (id_etudiant, id_semestre, moyenne_generale ,annee_scolaire)
                        VALUES (%s, %s, %s, '2024-2025');
                    ''', (student_id, id_semestre, note))
                else:
                    print(f"Semestre {code} non trouvé pour l'étudiant {student_id}.")
            else:  # ECUE
                for code_semestre, ues in structured_codes_noms.items():
                    for ue, ecues in ues.items():
                        for code_ecue, nom_ecue in ecues.items():
                            if code == code_ecue:
                                cursor.execute('''
                                    SELECT id_ecue FROM ecue WHERE code_ecue = %s;
                                ''', (code_ecue,))
                                id_ecue = cursor.fetchone()

                                if id_ecue:
                                    id_ecue = id_ecue[0]
                                    cursor.execute('''
                                        INSERT INTO etudiant_ecue (id_etudiant, id_ecue, note_initiale)
                                        VALUES (%s, %s, %s);
                                    ''', (student_id, id_ecue, note))
                                else:
                                    print(f"ECUE {code_ecue} non trouvé pour l'étudiant {student_id}.")

    # 🔹 **10. Valider et fermer la connexion**
    conn.commit()
    cursor.close()
    conn.close()

    print("Données insérées avec succès !")

# Fonctions auxiliaires
def structure_code_name_mapping(semester, code_name_mapping):
    """Structure le dictionnaire des codes et noms sous la forme :
    { "S8": { "S8U1": { "M101": "Algèbre", "M102": "Analyse" } } } """
   
    structured_dict = {semester: {}}  # On initialise avec le semestre détecté
    current_ue = None

    for code, name in code_name_mapping.items():
        if 'U' in code:  # Si c'est une UE (ex: S8U1)
            current_ue = str(code) + "+" + str(name)
            structured_dict[semester][current_ue] = {}  # Initialisation de l'UE
        else:  # C'est une matière (ex: M101)
            if current_ue:
                structured_dict[semester][current_ue][code] = name  # Ajouter la matière

    return structured_dict

def extract_students_notes(df_cleaned, row_2):
    """Extrait les informations des étudiants et leurs notes dans un dictionnaire."""
    students_notes = {}
    start_row = 4  # Ligne 6 (index 5) contient les étudiants
    subject_codes = row_2[3:]  # Les codes des matières sont en ligne 3, à partir de la colonne D

    for index, row in df_cleaned.iloc[start_row:].iterrows():
        student_number = row.iloc[0]  # "Num Étudiant" dans la colonne A
        if isinstance(student_number, str):  # Si ce n'est plus un numéro d'étudiant
            break
        student_name = row.iloc[1]  # Nom (Colonne B)
        student_firstname = row.iloc[2]  # Prénom (Colonne C)
        student_notes = {}

        for col, code in zip(range(3, len(subject_codes) + 3), subject_codes):  # À partir de la colonne D
            note = row.iloc[col]
            if pd.notna(note) and pd.notna(code):
                student_notes[code] = note

        if student_notes:  # Ajouter seulement si l'étudiant a des notes
            students_notes[student_number] = {
                "Nom": student_name,
                "Prénom": student_firstname,
                "Notes": student_notes
            }

    return students_notes
