import React, { useEffect, useState } from 'react';
import SalleService, { Salle } from '../services/salleservice';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../style/salledisplay.css'

const SalleDisplay = () => {
  const [nom, setNom] = useState('');
  const [nbRang, setNbRang] = useState(3);
  const [nbPlace, setNbPlace] = useState(3);
  const [salles, setSalles] = useState<Salle[]>([]);
  const [expandedSalle, setExpandedSalle] = useState<number | null>(null);

  useEffect(() => {
    fetchSalles();
  }, []);

  const fetchSalles = async () => {
    const data = await SalleService.getAllSalles();
    setSalles(data);
  };

  const handleCreate = async () => {
    if (!nom.trim()) return; // Prevent creation if no name is provided
    await SalleService.createSalle({ nb_rang: nbRang, nb_place: nbPlace, nom_salle:nom ,capacite : nbPlace * nbRang });
    fetchSalles();
    setNom(''); // Clear the name input after creation
  };
/*
  const renderGrille = (rows: number, cols: number) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: rows * cols }, (_, i) => (
        <div
          key={i}
          className="grid-cell"
        ></div>
      ))}
    </div>
    </div>
    
  );
*/
const renderGrille = (rows: number, cols: number) => {
    return (
      <div className="grille-container">
        <div className="grille-header">
          <div className="empty-cell"></div>
          {Array.from({ length: cols }, (_, i) => (
            <div key={i} className="grille-label">{i + 1}</div>
          ))}
        </div>
  
        {Array.from({ length: rows }, (_, row) => (
          <div key={row} className="grille-row">
            <div className="grille-label">{row + 1}</div>
            {Array.from({ length: cols }, (_, col) => (
              <div key={col} className="grille-case"></div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="container">
      {/* Create Salle Section */}
      <div className="card">
        <h2 className="title">Créer une salle</h2>
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom de la salle"
          className="input"
          required
        />
        <div className="controls">
          <div className="control-item">
            <label>Nombre de rangées :</label>
            <select
              className="select"
              value={nbRang}
              onChange={(e) => setNbRang(Number(e.target.value))}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="control-item">
            <label>Places par rangée :</label>
            <select
              className="select"
              value={nbPlace}
              onChange={(e) => setNbPlace(Number(e.target.value))}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
        <button onClick={handleCreate} className="button">
            Ajouter la salle
        </button>
        </div>

        <div >
          <p className="preview-text">Aperçu de la salle :</p>
          {renderGrille(nbRang, nbPlace)}
        </div>
      </div>

      {/* List of available Salles */}
      <div className="card">
        <h2 className="title">Liste des salles disponibles</h2>
        {salles.map((salle) => (
          <div key={salle.id_salle} className="salle-item">
            <div className="salle-header">
              
                <p className="salle-name">{salle.nom_salle}</p>
                
                <div className="salle-info">
                  Rangées : {salle.nb_rang} 
                </div>
                
                <div className="salle-info">
                Places par rangée : {salle.nb_place}
                </div>
                <div className="salle-info">
                Capacité Totale : {salle.capacite}
                </div>
              
                
              
              <button
                onClick={() =>
                  setExpandedSalle(expandedSalle === salle.id_salle ? null : salle.id_salle)
                }
                className="expand-button"
              >
                {expandedSalle === salle.id_salle ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>

            {/* Room grid preview with animation */}
            <AnimatePresence>
              {expandedSalle === salle.id_salle && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid-preview"
                >
                  {renderGrille(salle.nb_rang, salle.nb_place)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalleDisplay;
