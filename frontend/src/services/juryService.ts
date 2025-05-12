import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface Note {
    id: number;
    id_etudiant: number;
    id_ecue: number;
    note_initiale: number | null;
    note_rattrapage: number | null;
    annee_scolaire: string;
}

export interface UE {
    id_ue: number;
    code_ue: string;
    nom_ue: string;
    ecues: ECUE[];
}

export interface ECUE {
    id_ecue: number;
    code_ecue: string;
    nom_ecue: string;
    coefficient: number;
}

export interface JuryData {
    etudiant: {
        id_etudiant: number;
        nom: string;
        prenom: string;
        photo_path: string | null;
        provenance: string | null;
    };
    notes: Note[];
    ues: UE[];
}

const juryService = {
    getJuryData: async (id_etudiant: number, annee_scolaire: string): Promise<JuryData> => {
        const response = await axios.get(`${API_URL}/jury/${id_etudiant}/${annee_scolaire}/`);
        return response.data;
    },

    getJuryList: async (annee_scolaire: string): Promise<JuryData[]> => {
        const response = await axios.get(`${API_URL}/jury/list/${annee_scolaire}/`);
        return response.data;
    },

    updateNote: async (id: number, note: Partial<Note>): Promise<Note> => {
        const response = await axios.put(`${API_URL}/jury/note/${id}/`, note);
        return response.data;
    },

    calculateUEMoyenne: (notes: Note[], ecues: ECUE[]): number => {
        let totalPoints = 0;
        let totalCoeff = 0;

        notes.forEach(note => {
            const ecue = ecues.find(e => e.id_ecue === note.id_ecue);
            if (ecue) {
                const noteValue = note.note_rattrapage || note.note_initiale;
                if (noteValue !== null) {
                    totalPoints += noteValue * ecue.coefficient;
                    totalCoeff += ecue.coefficient;
                }
            }
        });

        return totalCoeff > 0 ? totalPoints / totalCoeff : 0;
    }
};

export default juryService; 