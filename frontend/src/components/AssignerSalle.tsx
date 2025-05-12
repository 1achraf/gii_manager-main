import '../style/AssignerSalle.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SalleService, { Salle } from '../services/salleservice';
import SemestreService from '../services/semestreservice';
import { generatePDF } from '../services/pdfGenerator';
import { useRef } from 'react'

interface Groupe {
  semestre: string;
  specialite: string | null;
}

interface Placement {
  etudiant: string;
  specialite: string | null;
  semestre: string;
  rangee: number;
  place: number;
  tag:string;
}

const AssignSalleView: React.FC = () => {
  // States
  const [salles, setSalles] = useState<Salle[]>([]);
  const [selectedSalleId, setSelectedSalleId] = useState<number | null>(null);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [nbRang, setNbRang] = useState(0);
  const [nbPlace, setNbPlace] = useState(0);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [semestre, setSemestre] = useState('');
  const [semestreOptions, setSemestreOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const semestreOptions = await SemestreService.getSemestreOptions();
        setSemestreOptions(semestreOptions);
      } catch (error) {
        toast.error("Erreur lors du chargement des données initiales");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);
  
  const handleDateChange = async (type: 'debut' | 'fin', value: string) => {
    if (type === 'debut') {
      setDateDebut(value);
    } else {
      setDateFin(value);
    }

    const newDateDebut = type === 'debut' ? value : dateDebut;
    const newDateFin = type === 'fin' ? value : dateFin;

    if (newDateDebut && newDateFin) {
      try {
        setIsLoading(true);
        const sallesDisponibles = await SalleService.getAllSalles();
        setSalles(sallesDisponibles);
        setCurrentStep(2);
      } catch (error) {
        toast.error("Erreur lors de la récupération des salles disponibles");
      } finally {
        setIsLoading(false);
      }
    }
  };
  

  const handleAddGroupe = () => {
    if (!semestre) {
      toast.warning("Veuillez sélectionner un semestre");
      return;
    }

    const semestreDetails = SemestreService.parseSemestreOption(semestre);

    setGroupes([...groupes, {
      semestre: semestreDetails.semestre,
      specialite: semestreDetails.specialite
    }]);

    setSemestre('');
    setCurrentStep(3);
    toast.success("Groupe ajouté avec succès");
  };

  const handleRemoveGroupe = (index: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce groupe ?')) {
      const newGroupes = groupes.filter((_, i) => i !== index);
      setGroupes(newGroupes);
      toast.info("Groupe supprimé");
    }
  };

  const handleSalleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const salleId = Number(e.target.value);
    setSelectedSalleId(salleId);
    
    if (salleId) {
      try {
        setIsLoading(true);
        const salleDetails = await SalleService.getSalleById(salleId);
        setNbRang(salleDetails.nb_rang || 0);
        setNbPlace(salleDetails.nb_place || 0);
      } catch (error) {
        toast.error("Erreur lors du chargement des détails de la salle");
      } finally {
        setIsLoading(false);
      }
    } else {
      setNbRang(0);
      setNbPlace(0);
    }
  };
  const handleGeneratePDF = () => {
    const salle = salles.find(s => s.id_salle === selectedSalleId);
    if (salle) {
        generatePDF({
            gridRef,
            salleName: salle.nom_salle,
            placements,
            dateDebut,
            dateFin,
            nbRang,
            nbPlace
        });
    }
};
  const handleAssigner = async () => {
    if (!selectedSalleId || !dateDebut || !dateFin || groupes.length === 0) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post('http://127.0.0.1:8000/api/assigner_salle/', {
        salle_id: selectedSalleId,
        date_debut: dateDebut,
        date_fin: dateFin,
        groupes: groupes
      });

      if (res.data.placements) {
        setPlacements(res.data.placements);
        toast.success("Attribution réussie !");
      } else {
        toast.error(res.data.error);
      }
    } catch (error: any) {
      let errorCustom = error.response?.data;
      console.log(errorCustom);
      toast.error(errorCustom);
      toast.error("Erreur lors de l'attribution");
    } finally {
      setIsLoading(false);
    }
  };
  // Dans AssignSalleView.tsx
 

  const renderGrid = () => {
    const grid = [];
    for (let r = 1; r <= nbRang; r++) {
      const row = [];
      for (let p = 1; p <= nbPlace; p++) {
        const etudiant = placements.find(pl => pl.rangee === r && pl.place === p);
        row.push(
          <div
            className={`seat ${etudiant ? 'occupied' : 'empty'}`}
            key={`${r}-${p}`}
          >
            {etudiant ? (
              <div className="seat-content">
                <div className="student-name">{etudiant.etudiant.split(' ')[0]}</div>
                <div className="student-semester">{etudiant.etudiant.split(' ')[1]}</div>
              </div>
            ) : (
              <div className="seat-empty">
                <div className="seat-number">Place {p}</div>
                <div className="row-number">Rang {r}</div>
              </div>
            )}
          </div>
        );
      }
      grid.push(<div className="row" key={r}>{row}</div>);
    }
    return grid;
  };

  return (
    <div className={`assign-container ${isLoading ? 'loading' : ''}`}>
      <ToastContainer position="top-right" autoClose={3000} />

      <h2>Attribution de Salle d'Examen</h2>

      <div className="stepper">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          1. Choix des dates
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          2. Sélection des groupes
        </div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          3. Attribution de la salle
        </div>
      </div>
      
      <div className="main-content">
        {/* Section Dates */}
        <div className="form-section">
          <h3>1. Sélectionner les dates</h3>
          <div className="form-group">
            <div className="date-group">
              <label>Date de début :</label>
              <input
                type="datetime-local"
                value={dateDebut}
                onChange={(e) => handleDateChange('debut', e.target.value)}
                className="form-control"
              />
            </div>

            <div className="date-group">
              <label>Date de fin :</label>
              <input
                type="datetime-local"
                value={dateFin}
                onChange={(e) => handleDateChange('fin', e.target.value)}
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* Section Groupes */}
        <div className="form-section">
          <h3>2. Sélectionner les groupes</h3>
          <div className="form-group">
            <div className="groupe-inputs">
              <div>
                <label>Semestre :</label>
                <select
                  value={semestre}
                  onChange={(e) => setSemestre(e.target.value)}
                  className="form-control"
                  disabled={!dateDebut || !dateFin}
                >
                  <option value="">-- Choisir un semestre --</option>
                  {semestreOptions.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddGroupe}
                className="btn btn-secondary"
                disabled={isLoading || !semestre || !dateDebut || !dateFin}
              >
                Ajouter un Groupe
              </button>
            </div>

            <div className="groupes-list">
              <h4>Groupes sélectionnés :</h4>
              {groupes.length === 0 ? (
                <p className="no-groupes">Aucun groupe sélectionné</p>
              ) : (
                groupes.map((g, i) => (
                  <div key={i} className="groupe-item">
                    <span>✔ {g.semestre} {g.specialite && `(${g.specialite})`}</span>
                    <button
                      onClick={() => handleRemoveGroupe(i)}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Section Sélection Salle */}
        <div className="form-section">
          <h3>3. Sélectionner une salle</h3>
          <div className="form-group">
            <select 
              value={selectedSalleId ?? ''} 
              onChange={handleSalleChange}
              className="form-control"
              disabled={!dateDebut || !dateFin || groupes.length === 0}
            >
              <option value="">-- Choisir une salle --</option>
              {salles.map(s => (
                <option key={s.id_salle} value={s.id_salle}>
                  {s.nom_salle} ({s.nb_rang * s.nb_place} places)
                </option>
              ))}
            </select>
          </div>

          {selectedSalleId && (
            <div className="salle-preview">
              <div className="salle-info">
                <div className="salle-info-item">
                  <div className="salle-info-label">Rangées</div>
                  <div className="salle-info-value">{nbRang}</div>
                </div>
                <div className="salle-info-item">
                  <div className="salle-info-label">Places par rangée</div>
                  <div className="salle-info-value">{nbPlace}</div>
                </div>
                <div className="salle-info-item">
                  <div className="salle-info-label">Capacité totale</div>
                  <div className="salle-info-value">{nbRang * nbPlace}</div>
                </div>
              </div>
              <div className="grid-container">
                {renderGrid()}
              </div>
            </div>
          )}

          {/* Bouton d'attribution final */}
          <div className="action-section">
            <button
              onClick={handleAssigner}
              className="btn btn-primary"
              disabled={isLoading || !selectedSalleId || !dateDebut || !dateFin || groupes.length === 0}
            >
              {isLoading ? 'Attribution en cours...' : 'Attribuer la salle'}
            </button>
          </div>
        </div>
      </div>
      <div className="assign-container">
            {selectedSalleId && placements.length > 0 && (
                <>
                    <button 
                        className="btn btn-primary"
                        onClick={handleGeneratePDF}
                    >
                        Sauvegarder en PDF
                    </button>

                    <div className="grid-container" ref={gridRef}>
                        <div className="grid-info">
                            <h4>Plan de la salle : {salles.find(s => s.id_salle === selectedSalleId)?.nom_salle}</h4>
                        </div>
                        {renderGrid()}
                    </div>
                </>
            )}
        </div>
    </div>
    
    
  );

};

export default AssignSalleView;
