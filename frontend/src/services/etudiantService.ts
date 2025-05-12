import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface Etudiant {
    id_etudiant: number;
    nom: string;
    prenom: string;
    email: string;
    specialite: string;
    annee_promotion: number;
    provenance: string | null;
    photo_path: string | null;
    numero_anonymat: string | null;
}

const etudiantService = {
    getAllEtudiants: async (): Promise<Etudiant[]> => {
        const response = await axios.get(`${API_URL}/etudiants/`);
        return response.data;
    },

    getEtudiant: async (id: number): Promise<Etudiant> => {
        const response = await axios.get(`${API_URL}/etudiants/${id}/`);
        return response.data;
    },

    createEtudiant: async (etudiant: Omit<Etudiant, 'id_etudiant'>): Promise<Etudiant> => {
        const response = await axios.post(`${API_URL}/etudiants/`, etudiant);
        return response.data;
    },

    updateEtudiant: async (id: number, etudiant: Partial<Etudiant>): Promise<Etudiant> => {
        const response = await axios.put(`${API_URL}/etudiants/${id}/`, etudiant);
        return response.data;
    },

    deleteEtudiant: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/etudiants/${id}/`);
    }
};

export default etudiantService; 