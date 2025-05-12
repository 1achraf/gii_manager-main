import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Alert,
    CircularProgress
} from '@mui/material';

const AnonymatManager: React.FC = () => {
    const [anneeScolaire, setAnneeScolaire] = useState('2024-2025');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('http://localhost:8000/api/anonymats/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ annee_scolaire: anneeScolaire }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la génération');
            }

            setSuccess(data.message || 'Anonymats générés avec succès');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Paper sx={{ p: 4, mb: 4 }}>
                <Typography variant="h5" mb={2}>
                    Générer les numéros d'anonymat + fichiers CSV
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        label="Année scolaire"
                        value={anneeScolaire}
                        onChange={(e) => setAnneeScolaire(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Générer"}
                    </Button>
                </Box>

                {success && <Alert severity="success">{success}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
            </Paper>
        </Box>
    );
};

export default AnonymatManager;
