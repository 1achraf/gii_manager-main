# GII Manager

GII Manager est une application web pour la gestion des étudiants et des jurys de l'école d'ingénieurs. Elle permet de gérer les étudiants, les jurys, les anonymats, les plans de salles et les justificatifs d'absences.

## Fonctionnalités

- Gestion des étudiants (ajout, modification, suppression)
- Affichage des jurys de semestre
- Génération des numéros d'anonymat
- Gestion des plans de salles (en développement)
- Gestion des justificatifs d'absences (en développement)

## Prérequis

- Python 3.12 ou supérieur
- Node.js 18 ou supérieur
- PostgreSQL

## Installation

### Backend (Django)

1. Créer un environnement virtuel Python :
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Sur Linux/Mac
# ou
.\venv\Scripts\activate  # Sur Windows
```

2. Installer les dépendances Python :
```bash
pip install -r requirements.txt
```

3. Configurer la base de données PostgreSQL :
- Créer une base de données PostgreSQL
- Modifier les paramètres de connexion dans `backend/gii_manager/settings.py`

4. Appliquer les migrations :
```bash
python3 manage.py migrate
```

5. Créer un superutilisateur (optionnel) :
```bash
python3 manage.py createsuperuser
```

6. Lancer le serveur Django :
```bash
python3 manage.py runserver
```

### Frontend (React)

1. Installer les dépendances Node.js :
```bash
cd frontend
npm install
```

2. Lancer le serveur de développement :
```bash
npm start
```

## Structure du Projet

```
gii_manager/
├── backend/                 # Application Django
│   ├── gii_manager/        # Configuration Django
│   ├── etudiants/          # Application de gestion des étudiants
│   ├── anonymats/          # Application de gestion des anonymats
│   └── requirements.txt    # Dépendances Python
└── frontend/               # Application React
    ├── src/
    │   ├── components/    # Composants React
    │   ├── services/      # Services API
    │   └── App.tsx        # Application principale
    └── package.json       # Dépendances Node.js
```

## API Endpoints

### Étudiants
- `GET /api/etudiants/` : Liste tous les étudiants
- `POST /api/etudiants/` : Crée un nouvel étudiant
- `GET /api/etudiants/{id}/` : Récupère un étudiant
- `PUT /api/etudiants/{id}/` : Met à jour un étudiant
- `DELETE /api/etudiants/{id}/` : Supprime un étudiant

### Anonymats
- `POST /api/anonymats/generate/` : Génère les numéros d'anonymat
- `GET /api/anonymats/etudiant/?id_etudiant={id}` : Récupère l'anonymat d'un étudiant

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 