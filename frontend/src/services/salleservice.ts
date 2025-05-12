import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/salles/';

export interface Salle {
  id_salle: number;
  nom_salle: string;
  nb_rang: number;
  nb_place: number;
  capacite:number
}

const SalleService = {
  // Récupérer toutes les salles
  getAllSalles: async (): Promise<Salle[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  

  // Récupérer une salle par son ID
  getSalleById: async (id: number): Promise<Salle> => {
    const response = await axios.get(`${API_URL}${id}/`);
    return response.data;
  },

  // Créer une nouvelle salle
  createSalle: async (salleData: Omit<Salle, 'id_salle'>): Promise<Salle> => {
    const response = await axios.post(API_URL, salleData);
    return response.data;
  },

  // Mettre à jour une salle
  updateSalle: async (id: number, salleData: Partial<Salle>): Promise<Salle> => {
    const response = await axios.put(`${API_URL}${id}/`, salleData);
    return response.data;
  },

  // Supprimer une salle
  deleteSalle: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}${id}/`);
  },






};

export default SalleService;
