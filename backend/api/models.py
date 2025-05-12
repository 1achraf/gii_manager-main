# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Absence(models.Model):
    id_absence = models.AutoField(primary_key=True)
    id_etudiant = models.ForeignKey('Etudiant', models.DO_NOTHING, db_column='id_etudiant', blank=True, null=True)
    date_debut = models.DateTimeField(blank=True, null=True)
    date_fin = models.DateTimeField(blank=True, null=True)
    justificatif_path = models.CharField(max_length=255, blank=True, null=True)
    statut = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'absence'


class Anonymat(models.Model):
    id_anonymat = models.AutoField(primary_key=True)
    id_etudiant = models.ForeignKey('Etudiant', models.DO_NOTHING, db_column='id_etudiant', blank=True, null=True)
    numero_anonymat = models.CharField(unique=True, max_length=50, blank=True, null=True)
    annee_scolaire = models.CharField(max_length=9, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'anonymat'


class ApiPlacement(models.Model):
    id_placement = models.AutoField(primary_key=True)
    rangee = models.IntegerField()
    place = models.IntegerField()
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField()
    id_etudiant = models.ForeignKey('Etudiant', models.DO_NOTHING)
    id_salle = models.ForeignKey('Salle', models.DO_NOTHING)
    class Meta:
        managed = False
        db_table = 'api_placement'
        unique_together = (('id_salle', 'rangee', 'place', 'date_debut', 'date_fin'),)


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Ecue(models.Model):
    id_ecue = models.AutoField(primary_key=True)
    id_ue = models.ForeignKey('Ue', models.DO_NOTHING, db_column='id_ue', blank=True, null=True)
    code_ecue = models.CharField(unique=True, max_length=50, blank=True, null=True)
    nom_ecue = models.CharField(max_length=100, blank=True, null=True)
    coefficient = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ecue'


class Etudiant(models.Model):
    id_etudiant = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100, blank=True, null=True)
    prenom = models.CharField(max_length=100, blank=True, null=True)
    photo_path = models.CharField(max_length=255, blank=True, null=True)
    provenance = models.CharField(max_length=100, blank=True, null=True)
    email = models.CharField(unique=True, max_length=255, blank=True, null=True)
    #specialite = models.CharField(max_length=100, blank=True, null=True)
    annee_promotion = models.IntegerField(blank=True, null=True)
    promotion = models.CharField(max_length=100, blank=True, null=True)
    tag = models.CharField(max_length=100, blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'etudiant'


class EtudiantEcue(models.Model):
    id_etudiant_ecue = models.AutoField(primary_key=True)
    id_etudiant = models.ForeignKey(Etudiant, models.DO_NOTHING, db_column='id_etudiant', blank=True, null=True)
    id_ecue = models.ForeignKey(Ecue, models.DO_NOTHING, db_column='id_ecue', blank=True, null=True)
    annee_scolaire = models.CharField(max_length=9, blank=True, null=True)
    note_initiale = models.FloatField(blank=True, null=True)
    note_rattrapage = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'etudiant_ecue'
        unique_together = (('id_etudiant', 'id_ecue', 'annee_scolaire'),)


class EtudiantGroupe(models.Model):
    id_etudiant_groupe = models.AutoField(primary_key=True)
    id_etudiant = models.ForeignKey(Etudiant, models.DO_NOTHING, db_column='id_etudiant', blank=True, null=True)
    id_groupe = models.ForeignKey('Groupe', models.DO_NOTHING, db_column='id_groupe', blank=True, null=True)
    type_groupe = models.CharField(max_length=50, blank=True, null=True)
    annee_scolaire = models.CharField(max_length=9, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'etudiant_groupe'


class EtudiantSemestre(models.Model):
    id_etudiant_semestre = models.AutoField(primary_key=True)
    id_etudiant = models.ForeignKey(Etudiant, models.DO_NOTHING, db_column='id_etudiant', blank=True, null=True)
    id_semestre = models.ForeignKey('Semestre', models.DO_NOTHING, db_column='id_semestre', blank=True, null=True)
    annee_scolaire = models.CharField(max_length=9, blank=True, null=True)
    id_specialite = models.ForeignKey('Specialite', models.DO_NOTHING, db_column='id_specialite', blank=True, null=True)
    moyenne_generale = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'etudiant_semestre'
        unique_together = (('id_etudiant', 'id_semestre', 'annee_scolaire'),)


class Groupe(models.Model):
    id_groupe = models.AutoField(primary_key=True)
    nom_groupe = models.CharField(max_length=100, blank=True, null=True)
    type_groupe = models.CharField(max_length=50, blank=True, null=True)
    annee_applicable = models.CharField(max_length=9, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'groupe'
        unique_together = (('nom_groupe', 'annee_applicable'),)


class Salle(models.Model):
    id_salle = models.AutoField(primary_key=True)
    nom_salle = models.CharField(max_length=50, blank=True, null=True)
    nb_rang = models.IntegerField(blank=True, null=True)
    nb_place = models.IntegerField(blank=True, null=True)
    capacite = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'salle'


class Semestre(models.Model):
    id_semestre = models.AutoField(primary_key=True)
    nom_semestre = models.CharField(max_length=50, blank=True, null=True)
    code_semestre = models.CharField(max_length=50, blank=True, null=True)
    annee_applicable = models.CharField(max_length=9, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'semestre'


class Specialite(models.Model):
    id_specialite = models.AutoField(primary_key=True)
    nom_specialite = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'specialite'


class Stage(models.Model):
    id_stage = models.AutoField(primary_key=True)
    id_etudiant = models.ForeignKey(Etudiant, models.DO_NOTHING, db_column='id_etudiant', blank=True, null=True)
    type_stage = models.CharField(max_length=50, blank=True, null=True)
    sujet = models.CharField(max_length=255, blank=True, null=True)
    lieu = models.CharField(max_length=100, blank=True, null=True)
    date_debut = models.DateField(blank=True, null=True)
    date_fin = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stage'


class Ue(models.Model):
    id_ue = models.AutoField(primary_key=True)
    id_semestre = models.ForeignKey(Semestre, models.DO_NOTHING, db_column='id_semestre', blank=True, null=True)
    code_ue = models.CharField(unique=True, max_length=50, blank=True, null=True)
    nom_ue = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ue'

class EtudiantUe(models.Model):
    id_etudiant_ue = models.AutoField(primary_key=True)
    id_etudiant = models.ForeignKey(Etudiant, models.DO_NOTHING, db_column='id_etudiant', blank=True, null=True)
    id_ue = models.ForeignKey(Ue, models.DO_NOTHING, db_column='id_ue', blank=True, null=True)
    annee_scolaire = models.CharField(max_length=9, blank=True, null=True)
    note_initiale = models.FloatField(blank=True, null=True)
    note_rattrapage = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'etudiant_ue'
        unique_together = (('id_etudiant', 'id_ue', 'annee_scolaire'),)
