import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, Tabs, Tab } from '@mui/material';
import EtudiantList from './EtudiantList';
import EtudiantForm from './EtudiantForm';
import AnonymatManager from './AnonymatManager';
import JuryDisplay from './JuryDisplay';
import EtudiantUploadData from './EtudiantUploadData';
import AssignSalleView from './AssignerSalle';
import SalleDisplay from './salledisplay';

interface ToolManagerProps {
    currentTool: string;
}

const ToolManager: React.FC<ToolManagerProps> = ({ currentTool }) => {
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
    const [selectedPromotion, setSelectedPromotion] = useState<string>(''); // Promotion sélectionnée
    const [selectedTab, setSelectedTab] = useState(0);

    const handleStudentSelect = (id: number) => {
        setSelectedStudent(id);
    };
  

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const renderTool = () => {
        switch (currentTool) {
            case 'students':
                return (
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Gestion des Étudiants
                        </Typography>
                        <EtudiantForm onSuccess={() => {}} />
                        <EtudiantList onStudentSelect={handleStudentSelect} />
                    </Box>
                );
            case 'jury':
                return (
                    <Box>
                            <Typography variant="h4" gutterBottom>
                                Jurys de Semestre
                            </Typography>
                            <JuryDisplay />
                    </Box>
                );
            case 'anonymat':
                return (
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Gestion des Anonymats
                        </Typography>
                        <AnonymatManager />
                    </Box>
                );
            case 'seating':
                return (
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Plans de Salles
                        </Typography>
                        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="salle tabs">
                            <Tab label="Attribution de Salle" />
                            <Tab label="Gestion des Salles" />
                        </Tabs>
                        {selectedTab === 0 && <AssignSalleView />}
                        {selectedTab === 1 && <SalleDisplay />}
                    </Box>
                );
            case 'upload':
                return (
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                Upload de Données des Étudiants
                            </Typography>
                            <EtudiantUploadData onSuccess={() => {}} />  {/* Ajouter EtudiantUploadData */}
                        </Box>
                );
            case 'justifications':
                return (
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Gestion des Justificatifs
                        </Typography>
                        <Typography>
                            Système de gestion des justificatifs d'absences en cours de développement...
                        </Typography>
                    </Box>
                );
            default:
                return (
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Bienvenue dans GII Manager
                        </Typography>
                        <Typography>
                            Sélectionnez un outil dans le menu de gauche pour commencer.
                        </Typography>
                    </Box>
                );
        }
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` }, ml: { sm: '240px' } }}>
            {renderTool()}
        </Box>
    );
};

export default ToolManager;
