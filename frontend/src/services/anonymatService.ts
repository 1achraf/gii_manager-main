import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface Anonymat {
    id: number;
    id_etudiant: number;
    numero_anonymat: string;
    annee_scolaire: string;
}

const anonymatService = {
    generateAnonymats: async (annee_scolaire: string): Promise<Anonymat[]> => {
        const response = await axios.post(`${API_URL}/anonymats/generate/`, {
            annee_scolaire
        });
        return response.data;
    },

    getAnonymats: async (annee_scolaire: string): Promise<Anonymat[]> => {
        const response = await axios.get(`${API_URL}/anonymats/${annee_scolaire}/`);
        return response.data;
    },

    getAnonymatByStudent: async (id_etudiant: number, annee_scolaire: string): Promise<Anonymat | null> => {
        try {
            const response = await axios.get(`${API_URL}/anonymats/etudiant/${id_etudiant}/${annee_scolaire}/`);
            return response.data;
        } catch (error) {
            return null;
        }
    }
};

export default anonymatService; 