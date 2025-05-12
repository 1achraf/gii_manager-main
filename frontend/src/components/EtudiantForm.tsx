import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
    MenuItem
} from '@mui/material';
import etudiantService, { Etudiant } from '../services/etudiantService';

interface EtudiantFormProps {
    onSuccess: () => void;
}

const EtudiantForm: React.FC<EtudiantFormProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState<Partial<Etudiant>>({
        nom: '',
        prenom: '',
        email: '',
        provenance: '',
        specialite: '',
        annee_promotion: new Date().getFullYear(),
        photo_path: null
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await etudiantService.createEtudiant(formData as Omit<Etudiant, 'id_etudiant'>);
            setFormData({
                nom: '',
                prenom: '',
                email: '',
                provenance: '',
                specialite: '',
                annee_promotion: new Date().getFullYear(),
                photo_path: null
            });
            setError(null);
            onSuccess();
        } catch (err) {
            setError('Erreur lors de la création de l\'étudiant');
            console.error('Erreur:', err);
        }
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Ajouter un Étudiant
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Nom"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Prénom"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Provenance"
                            name="provenance"
                            value={formData.provenance}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Spécialité"
                            name="specialite"
                            value={formData.specialite}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="Informatique">Informatique</MenuItem>
                            <MenuItem value="Mathématiques">Mathématiques</MenuItem>
                            <MenuItem value="Physique">Physique</MenuItem>
                            <MenuItem value="Chimie">Chimie</MenuItem>
                            <MenuItem value="Biologie">Biologie</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Année de promotion"
                            name="annee_promotion"
                            type="number"
                            value={formData.annee_promotion}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {error && (
                            <Typography color="error" gutterBottom>
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Ajouter l'étudiant
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default EtudiantForm; 