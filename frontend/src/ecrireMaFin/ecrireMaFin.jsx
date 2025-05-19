import React, { useState, useRef, useEffect } from "react";
import { FileText, Briefcase, Scissors, Smile, Frown, Coffee, Heart, Type, ImageIcon, Video, Music, ChevronLeft, ChevronRight, Check, Edit, Trash2, Send, Loader } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import './ecrireMaFin.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Ecrire = () => {
  const navigate = useNavigate();
  
  // Align with backend EndPage.TYPE_CHOICES
  const TYPES = [
    { id: "démission", label: "Démission", icon: <FileText /> },
    { id: "départ", label: "Départ", icon: <Briefcase /> },
    { id: "rupture", label: "Rupture", icon: <Scissors /> },
    { id: "ABANDON", label: "Abandon d’études", icon: <FileText /> },
  ];

  // Align with backend EndPage.TON_CHOICES
  const TONES = [
    { id: "DRAMATIQUE", label: "Dramatique", icon: <Heart /> },
    { id: "IRONIQUE", label: "Ironique", icon: <Coffee /> },
    { id: "HUMORISTIQUE", label: "Humoristique", icon: <Coffee /> },
    { id: "SERIEUX", label: "Sérieux", icon: <Heart /> },
    { id: "OPTIMISTE", label: "Optimiste", icon: <Smile /> },
    { id: "NOSTALGIQUE", label: "Nostalgique", icon: <Heart /> },
    { id: "POETIQUE", label: "Poétique", icon: <Type /> },
    { id: "SARCASTIQUE", label: "Sarcastique", icon: <Coffee /> },
    { id: "REFLEXIF", label: "Réflexif", icon: <Heart /> },
    { id: "EMOTIF", label: "Émotif", icon: <Heart /> },
  ];

  // Align with backend EndPage.EXPRESSION_CHOICES
  const EXPRESSIONS = [
    { id: "triste", label: "Triste", icon: <Frown /> },
    { id: "colère", label: "Colère", icon: <Frown /> },
    { id: "joie", label: "Joie", icon: <Smile /> },
    { id: "surpris", label: "Surprise", icon: <Smile /> },
  ];

  // Extended form state to match backend fields
  const [form, setForm] = useState({
    step: 1,
    type: null,
    ton: null,
    expression: null,
    titre: "",
    version_des_faits: "",
    perspective: "",
    fin_voulue: "",
    couleur: "#A99",
    police: "Arial",
    taille: "MOYEN",
    avatar_pseudo: "",
    avatar_mode: "RELAX",
    avatar_sexe: "MASCULIN",
    content: [], // { type: "image" | "file" | "photo", file: File, url: string }
    photo: null, // Single photo file
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const imageRef = useRef(null);
  const fileRef = useRef(null);
  const photoRef = useRef(null);
  const containerRef = useRef(null);

  // Axios instance with base URL
  const api = axios.create({
    baseURL: 'http://192.168.85.213:8000/api/',
  });

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [form.step]);

  useEffect(() => () => {
    form.content.forEach((item) => {
      if (item.url) {
        URL.revokeObjectURL(item.url);
      }
    });
    if (form.photo?.url) {
      URL.revokeObjectURL(form.photo.url);
    }
  }, [form.content, form.photo]);

  const updateForm = (updates) => setForm((prev) => ({ ...prev, ...updates }));

  const nextStep = () => updateForm({ step: Math.min(form.step + 1, 6) });
  const prevStep = () => updateForm({ step: Math.max(form.step - 1, 1) });

  const handleFileUpload = (type, e) => {
    const files = e.target.files;
    if (!files.length) return;
    const maxSize = 5 * 1024 * 1024;
    const validTypes = {
      image: ["image/jpeg", "image/png"],
      file: ["application/pdf", "text/plain"], // Adjust based on allowed file types
      photo: ["image/jpeg", "image/png"],
    };
    const newItems = Array.from(files).map((file) => {
      if (file.size > maxSize) {
        alert(`Le fichier ${file.name} dépasse 5 Mo.`);
        return null;
      }
      if (!validTypes[type].includes(file.type)) {
        alert(`Type de fichier non supporté pour ${file.name}.`);
        return null;
      }
      return { type, content: file.name, url: URL.createObjectURL(file), file };
    }).filter(Boolean);

    if (type === "photo") {
      updateForm({ photo: newItems[0] });
    } else {
      updateForm({ content: [...form.content, ...newItems] });
    }
    e.target.value = null;
  };

  const handleRemoveItem = (index) => {
    const item = form.content[index];
    if (item.url) {
      URL.revokeObjectURL(item.url);
    }
    updateForm({ content: form.content.filter((_, i) => i !== index) });
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Vous devez être connecté pour publier.");
        setIsPublishing(false);
        return;
      }

      const formData = new FormData();
      formData.append("titre", form.titre);
      formData.append("version_des_faits", form.version_des_faits);
      formData.append("type", form.type || "");
      formData.append("ton", form.ton || "");
      formData.append("expression", form.expression || "");
      formData.append("fin_voulue", form.fin_voulue);
      formData.append("perspective", form.perspective);
      formData.append("couleur", form.couleur);
      formData.append("police", form.police);
      formData.append("taille", form.taille);
      formData.append("avatar_pseudo", form.avatar_pseudo);
      formData.append("avatar_mode", form.avatar_mode);
      formData.append("avatar_sexe", form.avatar_sexe);

      // Append photo (required)
      if (form.photo?.file) {
        formData.append("photo", form.photo.file, form.photo.content);
      } else {
        alert("Une photo est requise.");
        setIsPublishing(false);
        return;
      }

      // Append images and files
      form.content.forEach((item, index) => {
        if (item.type === "image" && item.file) {
          formData.append("images", item.file, item.content);
        } else if (item.type === "file" && item.file) {
          formData.append("files", item.file, item.content);
        }
      });

      const response = await api.post("endpage/create/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 10000,
      });

      alert("Message publié !");
      navigate(`/result/${response.data.id}`); // Navigate to ResultPage with end_page_id
    } catch (error) {
      console.error("Erreur lors de la publication:", error);
      alert("Erreur lors de la publication. Veuillez réessayer.");
      navigate('/3d-choice'); // Fallback navigation
    }
    setIsPublishing(false);
  };

  const OptionCard = ({ item, isSelected, onSelect }) => (
    <motion.div
      className={`option-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(item.id)}
      role="button"
      tabIndex={0}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="option-icon">{item.icon}</div>
      <h3>{item.label}</h3>
      {isSelected && <Check size={16} />}
    </motion.div>
  );

  const renderSelector = (title, items, key) => (
    <div className="step-content">
      <h2>{title}</h2>
      <div className="options-grid">
        {items.map((item) => (
          <OptionCard
            key={item.id}
            item={item}
            isSelected={form[key] === item.id}
            onSelect={(id) => updateForm({ [key]: id })}
          />
        ))}
      </div>
    </div>
  );

  const renderFormFields = () => (
    <div className="step-content">
      <h2>Remplissez les détails</h2>
      <div className="form-fields">
        <input
          type="text"
          placeholder="Titre"
          value={form.titre}
          onChange={(e) => updateForm({ titre: e.target.value })}
        />
        <textarea
          placeholder="Racontez votre version des faits..."
          value={form.version_des_faits}
          onChange={(e) => updateForm({ version_des_faits: e.target.value })}
          className="testimony-textarea"
        />
        <textarea
          placeholder="Votre perspective..."
          value={form.perspective}
          onChange={(e) => updateForm({ perspective: e.target.value })}
          className="testimony-textarea"
        />
        <input
          type="text"
          placeholder="Fin voulue (optionnel)"
          value={form.fin_voulue}
          onChange={(e) => updateForm({ fin_voulue: e.target.value })}
        />
        <input
          type="color"
          value={form.couleur}
          onChange={(e) => updateForm({ couleur: e.target.value })}
        />
        <select
          value={form.police}
          onChange={(e) => updateForm({ police: e.target.value })}
        >
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
        <select
          value={form.taille}
          onChange={(e) => updateForm({ taille: e.target.value })}
        >
          <option value="PETIT">Petit</option>
          <option value="MOYEN">Moyen</option>
          <option value="GRAND">Grand</option>
        </select>
        <input
          type="text"
          placeholder="Pseudo de l'avatar (optionnel)"
          value={form.avatar_pseudo}
          onChange={(e) => updateForm({ avatar_pseudo: e.target.value })}
        />
        <select
          value={form.avatar_mode}
          onChange={(e) => updateForm({ avatar_mode: e.target.value })}
        >
          <option value="RELAX">Relax</option>
          <option value="PRO">Pro</option>
        </select>
        <select
          value={form.avatar_sexe}
          onChange={(e) => updateForm({ avatar_sexe: e.target.value })}
        >
          <option value="MASCULIN">Masculin</option>
          <option value="FEMININ">Féminin</option>
        </select>
      </div>
    </div>
  );

  const renderMediaEditor = () => (
    <div className="step-content">
      <h2>Ajoutez des médias</h2>
      <div className="editor-container">
        <div className="media-controls">
          <button onClick={() => photoRef.current?.click()}><ImageIcon size={16} /> Photo (obligatoire)</button>
          <input
            type="file"
            ref={photoRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileUpload("photo", e)}
          />
          <button onClick={() => imageRef.current?.click()}><ImageIcon size={16} /> Images</button>
          <input
            type="file"
            ref={imageRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload("image", e)}
          />
          <button onClick={() => fileRef.current?.click()}><FileText size={16} /> Fichiers</button>
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            accept=".pdf,.txt"
            multiple
            onChange={(e) => handleFileUpload("file", e)}
          />
        </div>
        {(form.photo || form.content.length > 0) && (
          <div className="media-preview">
            {form.photo && (
              <div className="media-item">
                <img src={form.photo.url} alt={form.photo.content} />
                <button onClick={() => updateForm({ photo: null })}><Trash2 size={16} /></button>
              </div>
            )}
            {form.content.map((item, index) => (
              <div key={index} className="media-item">
                {item.type === "image" ? (
                  <img src={item.url} alt={item.content} />
                ) : (
                  <div>{item.content}</div>
                )}
                <button onClick={() => handleRemoveItem(index)}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="step-content">
      <h2>Aperçu de votre message</h2>
      <div className="preview-content">
        <div className="preview-header">
          {form.titre && <h2>{form.titre}</h2>}
          {form.type && <span>{TYPES.find(t => t.id === form.type)?.label}</span>}
          {form.ton && <span>{TONES.find(t => t.id === form.ton)?.label}</span>}
          {form.expression && <span>{EXPRESSIONS.find(e => e.id === form.expression)?.label}</span>}
        </div>
        {form.version_des_faits && <div className="preview-testimony">{form.version_des_faits}</div>}
        {form.perspective && <div className="preview-perspective">{form.perspective}</div>}
        {form.fin_voulue && <div className="preview-fin-voulue">{form.fin_voulue}</div>}
        {form.photo && <img src={form.photo.url} alt="Photo principale" />}
        {form.content.map((item, index) => (
          <div key={index}>
            {item.type === "image" ? (
              <img src={item.url} alt={item.content} />
            ) : (
              <div>Fichier: {item.content}</div>
            )}
          </div>
        ))}
        {!form.photo && !form.content.length && <p>Aucun média ajouté.</p>}
      </div>
      <button onClick={handlePublish} disabled={isPublishing}>
        {isPublishing ? <Loader className="animate-spin" size={16} /> : <><Send size={16} /> Publier</>}
      </button>
    </div>
  );

  const renderStep = () => {
    switch (form.step) {
      case 1: return renderSelector("Quel type de départ ?", TYPES, "type");
      case 2: return renderSelector("Quel ton adopter ?", TONES, "ton");
      case 3: return renderSelector("Quelle émotion exprimer ?", EXPRESSIONS, "expression");
      case 4: return renderFormFields();
      case 5: return renderMediaEditor();
      case 6: return renderPreview();
      default: return null;
    }
  };

  return (
    northern lights effect
    <div className="ecrire-container" ref={containerRef}>
      <div className="ecrire-header">
        <h1>Créez votre message</h1>
      </div>
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(form.step / 6) * 100}%` }}></div>
        </div>
        <div className="progress-steps">
          {["Type", "Ton", "Émotion", "Détails", "Médias", "Aperçu"].map((label, i) => {
            const num = i + 1;
            return (
              <div
                key={num}
                className={`progress-step ${form.step >= num ? "completed" : ""} ${form.step === num ? "active" : ""}`}
                onClick={() => {
                  if (
                    num === 1 ||
                    (num === 2 && form.type) ||
                    (num === 3 && form.type && form.ton) ||
                    (num === 4 && form.type && form.ton && form.expression) ||
                    (num === 5 && form.type && form.ton && form.expression) ||
                    (num === 6 && form.type && form.ton && form.expression)
                  ) updateForm({ step: num });
                }}
              >
                <div className="step-number">{num}</div>
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <AnimatePresence>
        <motion.div
          key={form.step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
      <div className="ecrire-footer">
        <button onClick={prevStep} disabled={form.step === 1}>Précédent</button>
        {form.step < 6 ? (
          <button
            onClick={nextStep}
            disabled={
              (form.step === 1 && !form.type) ||
              (form.step === 2 && !form.ton) ||
              (form.step === 3 && !form.expression) ||
              (form.step === 4 && (!form.titre || !form.version_des_faits || !form.perspective))
            }
          >
            Suivant
          </button>
        ) : (
          <button onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? <Loader size={16} /> : "Publier"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Ecrire;