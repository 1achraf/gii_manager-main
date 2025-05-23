# Generated by Django 5.1.6 on 2025-03-03 14:17

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Absence',
            fields=[
                ('id_absence', models.AutoField(primary_key=True, serialize=False)),
                ('date_debut', models.DateTimeField(blank=True, null=True)),
                ('date_fin', models.DateTimeField(blank=True, null=True)),
                ('justificatif_path', models.CharField(blank=True, max_length=255, null=True)),
                ('statut', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': 'absence',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Ecue',
            fields=[
                ('id_ecue', models.AutoField(primary_key=True, serialize=False)),
                ('code_ecue', models.CharField(blank=True, max_length=50, null=True, unique=True)),
                ('nom_ecue', models.CharField(blank=True, max_length=100, null=True)),
                ('coefficient', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'ecue',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Etudiant',
            fields=[
                ('id_etudiant', models.AutoField(primary_key=True, serialize=False)),
                ('nom', models.CharField(blank=True, max_length=100, null=True)),
                ('prenom', models.CharField(blank=True, max_length=100, null=True)),
                ('numero_anonymat', models.CharField(blank=True, max_length=50, null=True, unique=True)),
                ('photo_path', models.CharField(blank=True, max_length=255, null=True)),
                ('provenance', models.CharField(blank=True, max_length=100, null=True)),
                ('specialite', models.CharField(blank=True, max_length=100, null=True)),
                ('annee_promotion', models.IntegerField(blank=True, null=True)),
                ('email', models.CharField(blank=True, max_length=255, null=True, unique=True)),
            ],
            options={
                'db_table': 'etudiant',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='EtudiantEcue',
            fields=[
                ('id_etudiant_ecue', models.AutoField(primary_key=True, serialize=False)),
                ('annee_scolaire', models.CharField(blank=True, max_length=9, null=True)),
                ('note_initiale', models.FloatField(blank=True, null=True)),
                ('note_rattrapage', models.FloatField(blank=True, null=True)),
            ],
            options={
                'db_table': 'etudiant_ecue',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='EtudiantGroupe',
            fields=[
                ('id_etudiant_groupe', models.AutoField(primary_key=True, serialize=False)),
                ('type_groupe', models.CharField(blank=True, max_length=50, null=True)),
                ('annee_scolaire', models.CharField(blank=True, max_length=9, null=True)),
            ],
            options={
                'db_table': 'etudiant_groupe',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='EtudiantSemestre',
            fields=[
                ('id_etudiant_semestre', models.AutoField(primary_key=True, serialize=False)),
                ('annee_scolaire', models.CharField(blank=True, max_length=9, null=True)),
                ('moyenne_generale', models.FloatField(blank=True, null=True)),
            ],
            options={
                'db_table': 'etudiant_semestre',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Groupe',
            fields=[
                ('id_groupe', models.AutoField(primary_key=True, serialize=False)),
                ('nom_groupe', models.CharField(blank=True, max_length=100, null=True)),
                ('type_groupe', models.CharField(blank=True, max_length=50, null=True)),
                ('annee_applicable', models.CharField(blank=True, max_length=9, null=True)),
            ],
            options={
                'db_table': 'groupe',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='PlacementExamen',
            fields=[
                ('id_placement', models.AutoField(primary_key=True, serialize=False)),
                ('salle', models.CharField(blank=True, max_length=50, null=True)),
                ('place', models.CharField(blank=True, max_length=50, null=True)),
                ('contrainte', models.CharField(blank=True, max_length=255, null=True)),
                ('annee_scolaire', models.CharField(blank=True, max_length=9, null=True)),
            ],
            options={
                'db_table': 'placement_examen',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Semestre',
            fields=[
                ('id_semestre', models.AutoField(primary_key=True, serialize=False)),
                ('nom_semestre', models.CharField(blank=True, max_length=50, null=True)),
                ('code_semestre', models.CharField(blank=True, max_length=50, null=True)),
                ('annee_applicable', models.CharField(blank=True, max_length=9, null=True)),
            ],
            options={
                'db_table': 'semestre',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Stage',
            fields=[
                ('id_stage', models.AutoField(primary_key=True, serialize=False)),
                ('type_stage', models.CharField(blank=True, max_length=50, null=True)),
                ('sujet', models.CharField(blank=True, max_length=255, null=True)),
                ('lieu', models.CharField(blank=True, max_length=100, null=True)),
                ('date_debut', models.DateField(blank=True, null=True)),
                ('date_fin', models.DateField(blank=True, null=True)),
            ],
            options={
                'db_table': 'stage',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Ue',
            fields=[
                ('id_ue', models.AutoField(primary_key=True, serialize=False)),
                ('code_ue', models.CharField(blank=True, max_length=50, null=True, unique=True)),
                ('nom_ue', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'db_table': 'ue',
                'managed': False,
            },
        ),
    ]
