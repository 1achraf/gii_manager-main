import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Button
} from '@mui/material';
import JuryStudentEcue from './JuryStudentEcue'; // <-- à adapter selon le chemin réel

interface Etudiant {
    id_etudiant: number;
    nom: string;
    prenom: string;
    photo_path: string | null;
    provenance: string | null;
}

interface Ue {
    id_ue: number;
    nom_ue: string;
    code_ue: string;
    note_initiale: number;
    note_rattrapage: number;
}

interface Absence {
    id_absence: number;
    date_debut: string;
    date_fin: string;
    justificatif_path: string;
    statut: string;
}

interface JuryStudentUeProps {
    idEtudiant: number;
}

const JuryStudentUe: React.FC<JuryStudentUeProps> = ({ idEtudiant }) => {
    const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
    const [ues, setUes] = useState<Ue[]>([]);
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUeId, setSelectedUeId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/jury/${idEtudiant}/`);
                const data = await res.json();
                setEtudiant(data.etudiant);
                setUes(data.ues);
                setAbsences(data.absences);
            } catch (err) {
                setError("Erreur lors du chargement des données");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idEtudiant]);

    const isNonValide = ues.some(ue => (ue.note_rattrapage ?? ue.note_initiale) < 10);

    const moyenneGlobale = ues.length > 0
        ? (ues.reduce((acc, ue) => acc + (ue.note_rattrapage ?? ue.note_initiale), 0) / ues.length).toFixed(2)
        : 'N/A';

    const getCellColor = (note: number) => ({
        backgroundColor: note < 10 ? '#ffcccc' : '#ccffcc',
        fontWeight: 'bold'
    });

    const formatAbsence = (absence: Absence) => {
        const debut = new Date(absence.date_debut).toLocaleDateString();
        const fin = new Date(absence.date_fin).toLocaleDateString();
        return `UE - ${debut} → ${fin} - ${absence.justificatif_path}`;
    };

    if (loading) {
        return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
    }

    if (error || !etudiant) {
        return <Box textAlign="center" mt={4}><Typography color="error">{error}</Typography></Box>;
    }

    return (
        <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box display="flex" gap={2}>
                    <Avatar sx={{ width: 80, height: 80 }} src={`http://127.0.0.1:8000/${etudiant.photo_path?.replace(/^\/+/, '')}`} />
                        <Box>
                            <Typography>INE: {etudiant.id_etudiant}</Typography>
                            <Typography>Nom: {etudiant.nom}</Typography>
                            <Typography>Prénom: {etudiant.prenom}</Typography>
                            <Typography>Provenance: {etudiant.provenance || 'Non spécifiée'}</Typography>
                        </Box>
                    </Box>
                    <Typography>{new Date().toLocaleString()}</Typography>
                </Box>
            </Paper>

            {selectedUeId ? (
                <>
                    <Button variant="outlined" onClick={() => setSelectedUeId(null)} sx={{ mb: 2 }}>
                        ← Retour aux UE
                    </Button>
                    <JuryStudentEcue idEtudiant={etudiant.id_etudiant} idUe={selectedUeId} />
                </>
            ) : (
                <>
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
                                <TableRow>
                                    <TableCell>Code UE</TableCell>
                                    <TableCell>Nom UE</TableCell>
                                    <TableCell>1ère session</TableCell>
                                    <TableCell>2ème session</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ues.map((ue, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{ue.code_ue}</TableCell>
                                        <TableCell>{ue.nom_ue}</TableCell>
                                        <TableCell sx={getCellColor(ue.note_initiale)}>
                                            {ue.note_initiale.toFixed(2)}
                                        </TableCell>
                                        <TableCell sx={getCellColor(ue.note_rattrapage)}>
                                            {ue.note_rattrapage.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                onClick={() => setSelectedUeId(ue.id_ue)}
                                            >
                                                Afficher les notes
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="space-between" mb={3}>
                        <Typography>Moyenne globale : {moyenneGlobale}</Typography>
                        <Box>
                            <Typography variant="h6">Liste Absences</Typography>
                            {absences.map(abs => (
                                <Typography key={abs.id_absence}>
                                    {formatAbsence(abs)} - {abs.statut}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default JuryStudentUe;
