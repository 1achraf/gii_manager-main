import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import etudiantService, { Etudiant } from '../services/etudiantService';

interface EtudiantListProps {
    onStudentSelect: (id: number) => void;
}

const EtudiantList: React.FC<EtudiantListProps> = ({ onStudentSelect }) => {
    const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadEtudiants();
    }, []);

    const loadEtudiants = async () => {
        try {
            const data = await etudiantService.getAllEtudiants();
            setEtudiants(data);
        } catch (err) {
            setError('Erreur lors du chargement des étudiants');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
            try {
                await etudiantService.deleteEtudiant(id);
                setEtudiants(etudiants.filter(etudiant => etudiant.id_etudiant !== id));
            } catch (err) {
                setError('Erreur lors de la suppression');
                console.error('Erreur:', err);
            }
        }
    };

    const handleSelect = (id: number) => {
        onStudentSelect(id);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Liste des Étudiants
            </Typography>
            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Prénom</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Spécialité</TableCell>
                            <TableCell>Année de promotion</TableCell>
                            <TableCell>Provenance</TableCell>
                            <TableCell>Numéro d'Anonymat</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {etudiants.map((etudiant) => (
                            <TableRow 
                                key={etudiant.id_etudiant}
                                hover
                                onClick={() => handleSelect(etudiant.id_etudiant)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>{etudiant.id_etudiant}</TableCell>
                                <TableCell>{etudiant.nom}</TableCell>
                                <TableCell>{etudiant.prenom}</TableCell>
                                <TableCell>{etudiant.email}</TableCell>
                                <TableCell>{etudiant.specialite}</TableCell>
                                <TableCell>{etudiant.annee_promotion}</TableCell>
                                <TableCell>{etudiant.provenance}</TableCell>
                                <TableCell>{etudiant.numero_anonymat || 'Non généré'}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(etudiant.id_etudiant);
                                        }}
                                    >
                                        Supprimer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default EtudiantList; 