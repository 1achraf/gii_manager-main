// utils/pdfGenerator.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import { RefObject } from 'react'; 

interface Placement {
    etudiant: string;
    rangee: number;
    place: number;
    semestre: string;
}

interface PDFGeneratorOptions {
    gridRef: RefObject<HTMLDivElement | null>; // Modifié ici
    salleName: string;
    placements: Placement[];
    dateDebut: string;
    dateFin: string;
    nbRang: number;
    nbPlace: number;
}

export const generatePDF = async ({
    gridRef,
    salleName,
    placements,
    dateDebut,
    dateFin,
    nbRang,
    nbPlace
}: PDFGeneratorOptions) => {
    if (!gridRef.current) return;

    try {
        // Créer le PDF
        const pdf = new jsPDF('l', 'mm', 'a4');
        
        // Ajouter le titre et les informations
        pdf.setFontSize(16);
        pdf.text(`Plan de salle - ${salleName}`, 15, 15);
        
        pdf.setFontSize(12);
        pdf.text(`Date de début: ${new Date(dateDebut).toLocaleString()}`, 15, 25);
        pdf.text(`Date de fin: ${new Date(dateFin).toLocaleString()}`, 15, 32);
       // pdf.text(`Configuration: ${nbRang} rangées × ${nbPlace} places`, 15, 39);
/*
        let y = 30;
        placements
            .sort((a, b) => a.rangee - b.rangee || a.place - b.place)
            .forEach((p, index) => {
                if (y > 270) { // Nouvelle page si on atteint le bas
                    pdf.addPage();
                    y = 30;
                }
                pdf.setFontSize(10);
                pdf.text(`${p.etudiant} - Semestre ${p.semestre} - Rang ${p.rangee} Place ${p.place}`, 15, y);
                y += 7;
            });
*/
        // Capturer et ajouter le plan visuel
        const canvas = await html2canvas(gridRef.current);
        const imgData = canvas.toDataURL('image/png');
        //pdf.addPage();
        const imgWidth = 280;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

        // Sauvegarder le PDF
        pdf.save(`placement_${salleName}_${new Date().toISOString()}.pdf`);
        
        toast.success('PDF généré avec succès !');
    } catch (error) {
        toast.error('Erreur lors de la génération du PDF');
        console.error('Erreur PDF:', error);
    }
};
