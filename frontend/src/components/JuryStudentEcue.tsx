import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress
} from '@mui/material';

interface JuryStudentEcueProps {
    idEtudiant: number;
    idUe: number;
}

interface Ecue {
    nom_ecue: string;
    code_ecue: string;
    note_initiale: number | null;
    note_rattrapage: number | null;
}

interface Absence {
    id_absence: number;
    date_debut: string;
    date_fin: string;
    justificatif_path: string;
    statut: string;
}

const JuryStudentEcue: React.FC<JuryStudentEcueProps> = ({ idEtudiant, idUe }) => {
    const [ecues, setEcues] = useState<Ecue[]>([]);
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/jury/${idEtudiant}/${idUe}/`);
                const data = await res.json();
                setEcues(data.ecues);
                setAbsences(data.absences);
            } catch (err) {
                setError("Erreur lors du chargement des ECUE");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idEtudiant, idUe]);

    const getRowColor = (noteInitiale: number | null, noteRattrapage: number | null) => {
        const note = noteRattrapage ?? noteInitiale;
        if (note === null) return {};
        return {
            backgroundColor: note < 6 ? '#ffcccc' : '#ccffcc',
            fontWeight: 'bold'
        };
    };

    const isNonValide = ecues.some(
        ecue =>
            (ecue.note_rattrapage !== null && ecue.note_rattrapage < 6) ||
            (ecue.note_rattrapage === null && ecue.note_initiale !== null && ecue.note_initiale < 6)
    );

    const moyenne = () => {
        const notes = ecues.map(ecue => ecue.note_rattrapage ?? ecue.note_initiale).filter(n => n !== null) as number[];
        if (notes.length === 0) return 'N/A';
        const moy = notes.reduce((acc, val) => acc + val, 0) / notes.length;
        return moy.toFixed(2);
    };

    const formatAbsence = (a: Absence) => {
        const debut = new Date(a.date_debut).toLocaleDateString();
        const fin = new Date(a.date_fin).toLocaleDateString();
        return `UE - ${debut} → ${fin} - ${a.justificatif_path}`;
    };

    if (loading) {
        return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
    }

    if (error) {
        return <Box textAlign="center" mt={4}><Typography color="error">{error}</Typography></Box>;
    }

    return (
        <Box>
            {/* Retiré le bouton "Retour aux UE" et le rectangle blanc */}
            
            <Typography
                color={isNonValide ? 'error' : 'success.main'}
                fontWeight="bold"
                textAlign="center"
                mb={2}
            >
                Status : {isNonValide ? 'Non Valide' : 'Valide'}
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                            <TableCell>Code ECUE</TableCell>
                            <TableCell>Nom matière</TableCell>
                            <TableCell>1ère session</TableCell>
                            <TableCell>2ème session</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ecues.map((ecue, index) => (
                            <TableRow key={index} sx={getRowColor(ecue.note_initiale, ecue.note_rattrapage)}>
                                <TableCell>{ecue.code_ecue}</TableCell>
                                <TableCell>{ecue.nom_ecue}</TableCell>
                                <TableCell>{ecue.note_initiale ?? '-'}</TableCell>
                                <TableCell>{ecue.note_rattrapage ?? '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box display="flex" justifyContent="space-between">
                <Typography>Moyenne de l'UE : {moyenne()}</Typography>
                <Box>
                    <Typography variant="h6">Liste Absences</Typography>
                    {absences.map(abs => (
                        <Typography key={abs.id_absence}>
                            {formatAbsence(abs)} - {abs.statut}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default JuryStudentEcue;
