import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    CircularProgress,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import JuryStudentUe from './JuryStudentUe'; // <-- Import du composant

interface Etudiant {
    id_etudiant: number;
    nom: string;
    prenom: string;
    promotion: string;
    photo_path: string | null;
    provenance: string | null;
}

const JuryDisplay: React.FC = () => {
    const [promotion, setPromotion] = useState('');
    const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
    const [filteredEtudiants, setFilteredEtudiants] = useState<Etudiant[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEtudiantId, setSelectedEtudiantId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePromotionSubmit = async () => {
        setLoading(true);
        setSelectedEtudiantId(null);
        setError(null);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/jury/');
            const data = await res.json();
            const allEtudiants: Etudiant[] = data.etudiants;
            console.log(allEtudiants)
            
            const filtered = allEtudiants.filter(e =>
                e.promotion != null && e.promotion.toLowerCase() === promotion.toLowerCase()
            );
            setEtudiants(filtered);
            setFilteredEtudiants(filtered);
        } catch (err) {
            console.error(err);
            setError('Erreur lors du chargement des étudiants');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = etudiants.filter(e =>
            `${e.nom} ${e.prenom}`.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredEtudiants(filtered);
    };

    return (
        <Box>
            {selectedEtudiantId ? (
                <Box>
                    <Button variant="outlined" onClick={() => setSelectedEtudiantId(null)} sx={{ mb: 2 }}>
                        ← Retour à la liste
                    </Button>
                    <JuryStudentUe idEtudiant={selectedEtudiantId} />
                </Box>
            ) : (
                <>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Sélection de la promotion
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <TextField
                                    fullWidth
                                    label="Promotion (ex: 3A, 4A, 5A)"
                                    value={promotion}
                                    onChange={(e) => setPromotion(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handlePromotionSubmit}
                                >
                                    Valider
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {etudiants.length > 0 && (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Rechercher un étudiant"
                                value={searchTerm}
                                onChange={handleSearch}
                                sx={{ mb: 2 }}
                            />
                            <List>
                                {filteredEtudiants.map(etudiant => (
                                    <ListItem
                                        key={etudiant.id_etudiant}
                                        component="button"
                                        onClick={() => setSelectedEtudiantId(etudiant.id_etudiant)}
                                    >
                                        <ListItemText primary={`${etudiant.nom} ${etudiant.prenom}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </>
            )}

            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <Typography color="error">{error}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default JuryDisplay;
