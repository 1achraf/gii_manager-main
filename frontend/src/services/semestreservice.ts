import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export interface SemestreOption {
  semestre_options: string[];
  annee_scolaire: string;
}

export interface SemestreDetails {
  semestre: string;
  specialite: string | null;
}

class SemestreService {
  async getSemestreOptions(): Promise<string[]> {
    try {
      const response = await axios.get<SemestreOption>(`${API_URL}/semestre_options/`);
      return response.data.semestre_options;
    } catch (error) {
      console.error('Erreur lors de la récupération des options de semestre:', error);
      throw error;
    }
  }

  // Méthode utilitaire pour parser un semestre
  parseSemestreOption(option: string): SemestreDetails {
    const parts = option.split('-');
    return {
      semestre: parts[0],
      specialite: parts.length > 1 ? parts[1] : null
    };
  }
}

export default new SemestreService();
