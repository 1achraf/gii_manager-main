import React, { useState } from 'react';
import { Box, Button, Typography, LinearProgress } from '@mui/material';
import * as XLSX from 'xlsx';
import axios from 'axios';

interface EtudiantUploadDataProps {
  onSuccess: () => void;
}

const EtudiantUploadData: React.FC<EtudiantUploadDataProps> = ({ onSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'array' });

          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          const formData = new FormData();
          formData.append('file', file);

          axios
            .post('http://localhost:8000/api/upload/', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                }
              },
            })
            .then((response) => {
              console.log(response.data.message)
              if (response.data.message === 'Données insérées avec succès') {
                onSuccess();
                setIsUploading(false);
                setUploadProgress(100);
                setErrorMessage('Traitement du fichier avec succès !')
              } else {
                setErrorMessage('Erreur lors du traitement du fichier.');
                setIsUploading(false);
              }
            })
            .catch((error) => {
              setErrorMessage('Erreur lors du traitement du fichier');
              console.log(error);
              setIsUploading(false);
            });
        } catch (error) {
          setErrorMessage('Une erreur est survenue lors du traitement du fichier.');
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setErrorMessage('Erreur lors de la lecture du fichier.');
        setIsUploading(false);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Téléchargez un fichier contenant les données des étudiants
      </Typography>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        disabled={isUploading}
      />

      {fileName && !isUploading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">Fichier sélectionné: {fileName}</Typography>
        </Box>
      )}

      {isUploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2">{uploadProgress}%</Typography>
        </Box>
      )}

      {errorMessage && (
        <Box sx={{ mt: 2, color: 'error.main' }}>
          <Typography variant="body2">{errorMessage}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default EtudiantUploadData;
