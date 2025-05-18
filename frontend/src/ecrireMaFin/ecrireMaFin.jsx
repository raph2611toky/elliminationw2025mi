"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { FileText, Briefcase, Scissors, Smile, Frown, Zap, Coffee, Heart, Type, ImageIcon, Video, Music, ChevronLeft, ChevronRight, X, Check, Edit, Trash2, Send, Sparkles, PenTool, MessageCircle, Bookmark, RefreshCw, Feather, Pause, Sunrise, CloudLightning, Laugh, Lightbulb, Clock, Compass, Award, Anchor, Droplet, Flame, Star, GalleryHorizontalEnd, GiftIcon as Gif, Sticker, Palette, Loader } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import './ecrireMaFin.css'
// Custom debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const Ecrire = () => {
  // Types de départ
  const DEPARTURE_TYPES = useMemo(
    () => [
      { id: "DEMISSION", label: "Démission", description: "Quitter un emploi ou une fonction", icon: <FileText /> },
      { id: "DEPART", label: "Départ", description: "Quitter un lieu ou un groupe", icon: <Briefcase /> },
      { id: "RUPTURE", label: "Rupture", description: "Fin d'une relation personnelle", icon: <Scissors /> },
      { id: "ABANDON", label: "Abandon d'études", description: "Arrêter un cursus académique", icon: <Bookmark /> },
      { id: "RECONCILIATION", label: "Réconciliation", description: "Renouer une relation", icon: <Heart /> },
      { id: "REDEMARRAGE", label: "Nouveau départ", description: "Recommencer à zéro", icon: <RefreshCw /> },
      { id: "TRANSITION", label: "Transition de carrière", description: "Changer de voie professionnelle", icon: <Compass /> },
      { id: "SEPARATION", label: "Séparation amicale", description: "Se séparer en bons termes", icon: <Anchor /> },
      { id: "PAUSE", label: "Pause temporaire", description: "Prendre du recul momentanément", icon: <Pause /> },
      { id: "RENOUVEAU", label: "Renouveau personnel", description: "Transformation personnelle", icon: <Sunrise /> },
    ],
    []
  );

  // Tons
  const TONE_TYPES = useMemo(
    () => [
      { id: "DRAMATIQUE", label: "Dramatique", description: "Ton intense et émotionnel", icon: <CloudLightning /> },
      { id: "IRONIQUE", label: "Ironique", description: "Ton décalé et subtil", icon: <Coffee /> },
      { id: "HUMORISTIQUE", label: "Humoristique", description: "Ton léger et amusant", icon: <Laugh /> },
      { id: "SERIEUX", label: "Sérieux", description: "Ton formel et posé", icon: <Feather /> },
      { id: "OPTIMISTE", label: "Optimiste", description: "Ton positif et encourageant", icon: <Lightbulb /> },
      { id: "NOSTALGIQUE", label: "Nostalgique", description: "Ton mélancolique et évocateur", icon: <Clock /> },
      { id: "POETIQUE", label: "Poétique", description: "Ton lyrique et imagé", icon: <Feather /> },
      { id: "SARCASTIQUE", label: "Sarcastique", description: "Ton mordant et critique", icon: <Zap /> },
      { id: "REFLEXIF", label: "Réflexif", description: "Ton introspectif et analytique", icon: <Compass /> },
      { id: "EMOTIF", label: "Émotif", description: "Ton sensible et expressif", icon: <Heart /> },
    ],
    []
  );

  // Expressions
  const EXPRESSION_TYPES = useMemo(
    () => [
      { id: "TRISTE", label: "Triste", description: "Exprimer de la tristesse", icon: <Frown /> },
      { id: "COLERE", label: "Colère", description: "Exprimer de la colère", icon: <Flame /> },
      { id: "JOIE", label: "Joie", description: "Exprimer de la joie", icon: <Smile /> },
      { id: "SOULAGEMENT", label: "Soulagement", description: "Exprimer du soulagement", icon: <Droplet /> },
      { id: "ANXIETE", label: "Anxiété", description: "Exprimer de l'anxiété", icon: <CloudLightning /> },
      { id: "ESPOIR", label: "Espoir", description: "Exprimer de l'espoir", icon: <Star /> },
      { id: "FRUSTRATION", label: "Frustration", description: "Exprimer de la frustration", icon: <Zap /> },
      { id: "FIERTE", label: "Fierté", description: "Exprimer de la fierté", icon: <Award /> },
      { id: "REGRET", label: "Regret", description: "Exprimer du regret", icon: <Clock /> },
      { id: "DETERMINATION", label: "Détermination", description: "Exprimer de la détermination", icon: <Anchor /> },
    ],
    []
  );

  // Backgrounds
  const backgrounds = useMemo(
    () => [
      { id: "bg1", url: "https://via.placeholder.com/400x200?text=Forêt", name: "Forêt" },
      { id: "bg2", url: "https://via.placeholder.com/400x200?text=Plage", name: "Plage" },
      { id: "bg3", url: "https://via.placeholder.com/400x200?text=Montagne", name: "Montagne" },
      { id: "bg4", url: "https://via.placeholder.com/400x200?text=Ville", name: "Ville" },
      { id: "bg5", url: "https://via.placeholder.com/400x200?text=Abstrait", name: "Abstrait" },
    ],
    []
  );

  // State
  const [step, setStep] = useState(1);
  const [departureType, setDepartureType] = useState(null);
  const [tone, setTone] = useState(null);
  const [expression, setExpression] = useState(null);
  const [testimony, setTestimony] = useState("");
  const [contentItems, setContentItems] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGifSelector, setShowGifSelector] = useState(false);
  const [gifSearchTerm, setGifSearchTerm] = useState("");
  const [gifs, setGifs] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Text content state
  const [textContent, setTextContent] = useState("");
  const [fontFamily, setFontFamily] = useState("Georgia");
  const [fontSize, setFontSize] = useState("16px");
  const [textColor, setTextColor] = useState("#3e2723");

  // Refs
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const containerRef = useRef(null);

  // Scroll to top on step change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      contentItems.forEach((item) => {
        if (item.url && (item.type === "image" || item.type === "video" || item.type === "audio")) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [contentItems]);

  // GIF search with Giphy API
  const searchGifs = useCallback(async (term) => {
    if (!term.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=YOUR_API_KEY&q=${term}&limit=6`
      );
      const data = await response.json();
      setGifs(data.data.map((gif) => gif.images.fixed_height.url));
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      setGifs([
        "https://via.placeholder.com/200?text=GIF+1",
        "https://via.placeholder.com/200?text=GIF+2",
        "https://via.placeholder.com/200?text=GIF+3",
        "https://via.placeholder.com/200?text=GIF+4",
        "https://via.placeholder.com/200?text=GIF+5",
        "https://via.placeholder.com/200?text=GIF+6",
      ]);
    }
    setIsLoading(false);
  }, []);

  const debouncedSearchGifs = useCallback(debounce(searchGifs, 500), [searchGifs]);

  // Navigation
  const nextStep = useCallback(() => setStep((prev) => Math.min(prev + 1, 6)), []);
  const prevStep = useCallback(() => setStep((prev) => Math.max(prev - 1, 1)), []);

  // Content management
  const handleAddText = useCallback(() => {
    if (!textContent.trim()) return;
    setContentItems((prev) => [
      ...prev,
      {
        type: "text",
        content: textContent,
        style: { fontFamily, fontSize, color: textColor },
      },
    ]);
    resetTextForm();
  }, [textContent, fontFamily, fontSize, textColor]);

  const handleUpdateText = useCallback(() => {
    if (editingIndex === null || !textContent.trim()) return;
    setContentItems((prev) => {
      const newItems = [...prev];
      newItems[editingIndex] = {
        type: "text",
        content: textContent,
        style: { fontFamily, fontSize, color: textColor },
      };
      return newItems;
    });
    resetTextForm();
  }, [editingIndex, textContent, fontFamily, fontSize, textColor]);

  const resetTextForm = useCallback(() => {
    setTextContent("");
    setFontFamily("Georgia");
    setFontSize("16px");
    setTextColor("#3e2723");
    setEditingIndex(null);
  }, []);

  const handleEditItem = useCallback((index) => {
    const item = contentItems[index];
    setEditingIndex(index);
    if (item.type === "text") {
      setTextContent(item.content);
      setFontFamily(item.style?.fontFamily || "Georgia");
      setFontSize(item.style?.fontSize || "16px");
      setTextColor(item.style?.color || "#3e2723");
    }
  }, [contentItems]);

  const handleRemoveItem = useCallback((index) => {
    const item = contentItems[index];
    if (item.url && (item.type === "image" || item.type === "video" || item.type === "audio")) {
      URL.revokeObjectURL(item.url);
    }
    setContentItems((prev) => prev.filter((_, i) => i !== index));
  }, [contentItems]);

  // Media handling
  const triggerFileInput = useCallback((inputRef) => {
    inputRef.current?.click();
  }, []);

  const handleFileUpload = useCallback((type, e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = {
      image: ["image/jpeg", "image/png", "image/gif"],
      video: ["video/mp4", "video/webm"],
      audio: ["audio/mp3", "audio/wav"],
    };

    const newItems = [...contentItems];
    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        alert(`Le fichier ${file.name} est trop volumineux (max 5MB).`);
        return;
      }
      if (!validTypes[type].includes(file.type)) {
        alert(`Type de fichier non supporté pour ${file.name}.`);
        return;
      }
      const url = URL.createObjectURL(file);
      newItems.push({
        type,
        content: file.name,
        url,
        file, // Store file for FormData
      });
    });

    setContentItems(newItems);
    e.target.value = null;
  }, [contentItems]);

  const handleSelectGif = useCallback((gifUrl) => {
    setContentItems((prev) => [
      ...prev,
      {
        type: "gif",
        content: "GIF animé",
        url: gifUrl,
      },
    ]);
    setShowGifSelector(false);
    setGifSearchTerm("");
  }, []);

  // FormData preparation
  const prepareFormData = useCallback(async () => {
    const formData = new FormData();

    // Metadata
    formData.append("departureType", departureType || "");
    formData.append("tone", tone || "");
    formData.append("expression", expression || "");
    formData.append("testimony", testimony || "");
    formData.append("background", selectedBackground || "");

    // Text content
    const textItems = contentItems.filter((item) => item.type === "text");
    formData.append("textItems", JSON.stringify(textItems));

    // Media files
    for (const item of contentItems) {
      if (item.type === "image" || item.type === "video" || item.type === "audio") {
        if (item.file) {
          formData.append(`${item.type}Files`, item.file, item.content);
        }
      } else if (item.type === "gif") {
        formData.append("gifUrls", item.url);
      }
    }

    return formData;
  }, [departureType, tone, expression, testimony, selectedBackground, contentItems]);

  // Publish handler
  const handlePublish = useCallback(async () => {
    setIsPublishing(true);
    try {
      const formData = await prepareFormData();
      // Simulate API call (replace with actual backend endpoint)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Example: await fetch("/api/publish", { method: "POST", body: formData });
      alert("Message publié avec succès !");
    } catch (error) {
      console.error("Error publishing:", error);
      alert("Erreur lors de la publication.");
    }
    setIsPublishing(false);
  }, [prepareFormData]);

  // Get preview title
  const getPreviewTitle = useCallback(() => {
    const selectedType = DEPARTURE_TYPES.find((type) => type.id === departureType);
    return selectedType ? selectedType.label : "Mon message";
  }, [departureType, DEPARTURE_TYPES]);

  // Render step content
  const renderStepContent = useCallback(() => {
    switch (step) {
      case 1:
        return renderTypeSelector();
      case 2:
        return renderToneSelector();
      case 3:
        return renderExpressionSelector();
      case 4:
        return renderTestimonyInput();
      case 5:
        return renderContentEditor();
      case 6:
        return renderPreview();
      default:
        return null;
    }
  }, [step]);

  // Step 1: Type Selector
  const renderTypeSelector = useCallback(() => {
    return (
      <motion.div
        className="step-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="step-title">
          <span className="step-emoji">👋</span> Quel type de départ souhaitez-vous exprimer ?
        </h2>
        <div className="options-grid">
          {DEPARTURE_TYPES.map((type, index) => (
            <motion.div
              key={type.id}
              className={`option-card ${departureType === type.id ? "selected" : ""}`}
              onClick={() => setDepartureType(type.id)}
              role="button"
              tabIndex={0}
              aria-label={`Sélectionner ${type.label}`}
              onKeyDown={(e) => e.key === "Enter" && setDepartureType(type.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="option-icon"
                animate={{
                  rotate: departureType === type.id ? [0, 10, -10, 10, 0] : 0,
                  scale: departureType === type.id ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                {type.icon}
              </motion.div>
              <div className="option-text">
                <h3>{type.label}</h3>
                <p>{type.description}</p>
              </div>
              {departureType === type.id && (
                <motion.div
                  className="option-check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <Check size={16} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }, [departureType, DEPARTURE_TYPES]);

  // Step 2: Tone Selector
  const renderToneSelector = useCallback(() => {
    return (
      <motion.div
        className="step-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="step-title">
          <span className="step-emoji">🎭</span> Quel ton souhaitez-vous adopter ?
        </h2>
        <div className="options-grid">
          {TONE_TYPES.map((toneOption, index) => (
            <motion.div
              key={toneOption.id}
              className={`option-card ${tone === toneOption.id ? "selected" : ""}`}
              onClick={() => setTone(toneOption.id)}
              role="button"
              tabIndex={0}
              aria-label={`Sélectionner ${toneOption.label}`}
              onKeyDown={(e) => e.key === "Enter" && setTone(toneOption.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="option-icon"
                animate={{
                  rotate: tone === toneOption.id ? [0, 10, -10, 10, 0] : 0,
                  scale: tone === toneOption.id ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                {toneOption.icon}
              </motion.div>
              <div className="option-text">
                <h3>{toneOption.label}</h3>
                <p>{toneOption.description}</p>
              </div>
              {tone === toneOption.id && (
                <motion.div
                  className="option-check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <Check size={16} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }, [tone, TONE_TYPES]);

  // Step 3: Expression Selector
  const renderExpressionSelector = useCallback(() => {
    return (
      <motion.div
        className="step-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="step-title">
          <span className="step-emoji">😊</span> Quelle émotion souhaitez-vous exprimer ?
        </h2>
        <div className="options-grid">
          {EXPRESSION_TYPES.map((expressionOption, index) => (
            <motion.div
              key={expressionOption.id}
              className={`option-card ${expression === expressionOption.id ? "selected" : ""}`}
              onClick={() => setExpression(expressionOption.id)}
              role="button"
              tabIndex={0}
              aria-label={`Sélectionner ${expressionOption.label}`}
              onKeyDown={(e) => e.key === "Enter" && setExpression(expressionOption.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="option-icon"
                animate={{
                  rotate: expression === expressionOption.id ? [0, 10, -10, 10, 0] : 0,
                  scale: expression === expressionOption.id ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                {expressionOption.icon}
              </motion.div>
              <div className="option-text">
                <h3>{expressionOption.label}</h3>
                <p>{expressionOption.description}</p>
              </div>
              {expression === expressionOption.id && (
                <motion.div
                  className="option-check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <Check size={16} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }, [expression, EXPRESSION_TYPES]);

  // Step 4: Testimony Input
  const renderTestimonyInput = useCallback(() => {
    return (
      <motion.div
        className="step-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="step-title">
          <span className="step-emoji">💬</span> Partagez votre version de l'histoire
        </h2>
        <div className="testimony-container">
          <motion.div
            className="testimony-input-wrapper"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <MessageCircle className="testimony-icon" />
            <textarea
              placeholder="Racontez votre expérience et les raisons de votre départ..."
              value={testimony}
              onChange={(e) => setTestimony(e.target.value)}
              className="testimony-textarea"
              aria-label="Témoignage personnel"
            />
            <motion.div
              className="testimony-floating-particles"
              initial={{ opacity: 0 }}
              animate={{ opacity: testimony.length > 50 ? 1 : 0 }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="floating-particle"
                  initial={{ y: 0, opacity: 0 }}
                  animate={{
                    y: -20 - Math.random() * 30,
                    opacity: [0, 0.7, 0],
                    x: (Math.random() - 0.5) * 20,
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 2,
                  }}
                >
                  {["✨", "💫", "🌟", "⭐", "💭"][i % 5]}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            className="testimony-tips"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4>
              <Sparkles size={18} /> Conseils pour votre témoignage
            </h4>
            <ul>
              <motion.li initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                Soyez honnête mais respectueux
              </motion.li>
              <motion.li initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                Exprimez vos sentiments avec authenticité
              </motion.li>
              <motion.li initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                Partagez ce que vous avez appris de cette expérience
              </motion.li>
              <motion.li initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                Mentionnez les aspects positifs, même dans une situation difficile
              </motion.li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="background-selector"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3>
            <Palette size={18} /> Choisissez un arrière-plan pour votre message
          </h3>
          <div className="background-options">
            {backgrounds.map((bg, index) => (
              <motion.div
                key={bg.id}
                className={`background-option ${selectedBackground === bg.id ? "selected" : ""}`}
                onClick={() => setSelectedBackground(bg.id)}
                role="button"
                tabIndex={0}
                aria-label={`Sélectionner l'arrière-plan ${bg.name}`}
                onKeyDown={(e) => e.key === "Enter" && setSelectedBackground(bg.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src={bg.url || "/placeholder.svg"} alt={bg.name} />
                <span>{bg.name}</span>
                {selectedBackground === bg.id && (
                  <motion.div
                    className="background-check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <Check size={16} />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }, [testimony, selectedBackground, backgrounds]);

  // Step 5: Content Editor
  const renderContentEditor = useCallback(() => {
    return (
      <div className="step-content">
        <h2 className="step-title">
          <span className="step-emoji">✏️</span> Personnalisez votre message
        </h2>
        <div className="editor-container">
          <div className="editor-controls">
            <div className="control-group">
              <label htmlFor="font-family">Police d'écriture</label>
              <select
                id="font-family"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                aria-label="Sélectionner la police d'écriture"
              >
                <option value="Georgia">Georgia</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Garamond">Garamond</option>
                <option value="Baskerville">Baskerville</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="font-size">Taille</label>
              <select
                id="font-size"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                aria-label="Sélectionner la taille de la police"
              >
                <option value="14px">Petit</option>
                <option value="16px">Normal</option>
                <option value="18px">Grand</option>
                <option value="20px">Très grand</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="text-color">Couleur</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  id="text-color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  aria-label="Sélectionner la couleur du texte"
                />
                <span className="color-value">{textColor}</span>
              </div>
            </div>
          </div>

          <div className="editor-main">
            <div className="editor-textarea-wrapper">
              <PenTool className="editor-icon" />
              <textarea
                placeholder="Saisissez votre texte ici..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                style={{
                  fontFamily,
                  fontSize,
                  color: textColor,
                }}
                className="editor-textarea"
                aria-label="Saisir le texte personnalisé"
              />
            </div>
          </div>

          <div className="editor-actions">
            {editingIndex !== null ? (
              <div className="edit-actions">
                <button
                  className="btn-primary"
                  onClick={handleUpdateText}
                  aria-label="Mettre à jour le texte"
                >
                  <Check size={16} /> Mettre à jour
                </button>
                <button
                  className="btn-secondary"
                  onClick={resetTextForm}
                  aria-label="Annuler la modification"
                >
                  <X size={16} /> Annuler
                </button>
              </div>
            ) : (
              <button
                className="btn-primary"
                onClick={handleAddText}
                disabled={!textContent.trim()}
                aria-label="Ajouter le texte saisi"
              >
                <Type size={16} /> Ajouter ce texte
              </button>
            )}
          </div>

          <div className="media-controls">
            <h3>
              <Sparkles size={20} /> Ajouter des médias
            </h3>
            <div className="media-buttons">
              <button
                className="media-button"
                onClick={() => triggerFileInput(imageInputRef)}
                aria-label="Ajouter des images"
              >
                <ImageIcon size={18} /> Images
              </button>
              <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload("image", e)}
                aria-hidden="true"
              />

              <button
                className="media-button"
                onClick={() => setShowGifSelector(true)}
                aria-label="Ajouter des GIFs"
              >
                <Gif size={18} /> GIFs
              </button>

              <button
                className="media-button"
                onClick={() => triggerFileInput(videoInputRef)}
                aria-label="Ajouter des vidéos"
              >
                <Video size={18} /> Vidéos
              </button>
              <input
                type="file"
                ref={videoInputRef}
                className="hidden"
                accept="video/*"
                multiple
                onChange={(e) => handleFileUpload("video", e)}
                aria-hidden="true"
              />

              <button
                className="media-button"
                onClick={() => triggerFileInput(audioInputRef)}
                aria-label="Ajouter des audios"
              >
                <Music size={18} /> Audio
              </button>
              <input
                type="file"
                ref={audioInputRef}
                className="hidden"
                accept="audio/*"
                multiple
                onChange={(e) => handleFileUpload("audio", e)}
                aria-hidden="true"
              />

              <button className="media-button" aria-label="Ajouter des stickers">
                <Sticker size={18} /> Stickers
              </button>
            </div>
          </div>

          {showGifSelector && (
            <div className="gif-selector">
              <div className="gif-selector-header">
                <h3>Rechercher un GIF</h3>
                <button
                  className="close-button"
                  onClick={() => setShowGifSelector(false)}
                  aria-label="Fermer le sélecteur de GIF"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="gif-search">
                <input
                  type="text"
                  placeholder="Rechercher un GIF..."
                  value={gifSearchTerm}
                  onChange={(e) => {
                    setGifSearchTerm(e.target.value);
                    debouncedSearchGifs(e.target.value);
                  }}
                  aria-label="Rechercher un GIF"
                />
                <button
                  onClick={() => searchGifs(gifSearchTerm)}
                  aria-label="Lancer la recherche de GIF"
                >
                  Rechercher
                </button>
              </div>
              <div className="gif-results">
                {isLoading ? (
                  <div className="loading">
                    <Loader className="animate-spin" />
                    <span>Chargement...</span>
                  </div>
                ) : (
                  gifs.map((gif, index) => (
                    <div
                      key={index}
                      className="gif-item"
                      onClick={() => handleSelectGif(gif)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Sélectionner le GIF ${index + 1}`}
                      onKeyDown={(e) => e.key === "Enter" && handleSelectGif(gif)}
                    >
                      <img src={gif || "/placeholder.svg"} alt={`GIF ${index + 1}`} />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {contentItems.length > 0 && (
            <div className="media-preview">
              <h3>
                <GalleryHorizontalEnd size={20} /> Contenu ajouté
              </h3>
              <div className="media-grid">
                {contentItems.map((item, index) => (
                  <div key={index} className="media-item">
                    {item.type === "text" ? (
                      <div
                        className="text-preview"
                        style={{
                          fontFamily: item.style?.fontFamily,
                          fontSize: item.style?.fontSize,
                          color: item.style?.color,
                        }}
                      >
                        {item.content.length > 100 ? item.content.substring(0, 100) + "..." : item.content}
                      </div>
                    ) : item.type === "image" || item.type === "gif" ? (
                      <img src={item.url || "/placeholder.svg"} alt={item.content} />
                    ) : item.type === "video" ? (
                      <video src={item.url} controls aria-label={`Vidéo ${item.content}`} />
                    ) : (
                      <div className="audio-preview">
                        <Music size={24} />
                        <audio src={item.url} controls aria-label={`Audio ${item.content}`} />
                      </div>
                    )}
                    <div className="media-item-actions">
                      {item.type === "text" && (
                        <button
                          className="edit-media"
                          onClick={() => handleEditItem(index)}
                          aria-label="Modifier le texte"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      <button
                        className="remove-media"
                        onClick={() => handleRemoveItem(index)}
                        aria-label="Supprimer l'élément"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, [
    fontFamily,
    fontSize,
    textColor,
    textContent,
    editingIndex,
    contentItems,
    isLoading,
    showGifSelector,
    gifSearchTerm,
    gifs,
    handleAddText,
    handleUpdateText,
    resetTextForm,
    handleEditItem,
    handleRemoveItem,
    handleFileUpload,
    handleSelectGif,
    triggerFileInput,
    debouncedSearchGifs,
    searchGifs,
  ]);

  // Step 6: Preview
  const renderPreview = () => {
    const selectedDepartureType = DEPARTURE_TYPES.find((type) => type.id === departureType);
    const selectedTone = TONE_TYPES.find((t) => t.id === tone);
    const selectedExpression = EXPRESSION_TYPES.find((e) => e.id === expression);
    const bgImage = selectedBackground ? backgrounds.find(bg => bg.id === selectedBackground)?.url : null;

    const { width, height } = useWindowSize();

    useEffect(() => {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <motion.div
        className="step-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="step-title">
          <span className="step-emoji">🎉</span> Aperçu de votre message
        </h2>

        {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}

        <div
          className="preview-content"
          style={{
            backgroundImage: bgImage
              ? `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${bgImage})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <motion.div
            className="preview-header"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="preview-meta">
              {selectedDepartureType && (
                <motion.span
                  className="preview-tag departure-tag"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.4 }}
                >
                  {selectedDepartureType.label}
                </motion.span>
              )}
              {selectedTone && (
                <motion.span
                  className="preview-tag tone-tag"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.5 }}
                >
                  {selectedTone.label}
                </motion.span>
              )}
              {selectedExpression && (
                <motion.span
                  className="preview-tag expression-tag"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.6 }}
                >
                  {selectedExpression.label}
                </motion.span>
              )}
            </div>
            <motion.h2
              className="preview-title"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {getPreviewTitle()}
            </motion.h2>
          </motion.div>

          {testimony && (
            <motion.div
              className="preview-testimony"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {testimony}
            </motion.div>
          )}

          <motion.div
            className="preview-main-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <AnimatePresence>
              {contentItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="preview-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  {item.type === "text" ? (
                    <div
                      style={{
                        fontFamily: item.style?.fontFamily,
                        fontSize: item.style?.fontSize,
                        color: item.style?.color,
                        marginBottom: "1rem",
                      }}
                    >
                      {item.content}
                    </div>
                  ) : (
                    <div className="preview-media-item">
                      {item.type === "image" || item.type === "gif" ? (
                        <img src={item.url || "/placeholder.svg"} alt={item.content} className="media-image" />
                      ) : item.type === "video" ? (
                        <video src={item.url} controls className="media-video" />
                      ) : (
                        <audio src={item.url} controls className="media-audio" />
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {contentItems.length === 0 && (
              <motion.p
                className="no-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1 }}
              >
                Aucun contenu ajouté. Revenez à l'étape précédente pour ajouter du contenu.
              </motion.p>
            )}
          </motion.div>
        </div>

        <motion.div
          className="preview-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            className="btn-publish"
            onClick={handlePublish}
            disabled={isPublishing}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
            aria-label={isPublishing ? "Publication en cours" : "Finaliser et envoyer le message"}
          >
            {isPublishing ? (
              <Loader className="animate-spin" size={16} />
            ) : (
              <>
                <Send size={16} /> Finaliser et envoyer
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="ecrire-container" ref={containerRef}>
      <motion.div
        className="ecrire-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Créez votre message d'adieu
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Exprimez-vous avec style et partagez votre histoire
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="progress-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={6}
        aria-label="Progression des étapes"
      >
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 6) * 100}%` }}
            transition={{ duration: 0.5 }}
            aria-hidden="true"
          ></motion.div>
        </div>
        <div className="progress-steps">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <motion.div
              key={num}
              className={`progress-step ${step >= num ? "completed" : ""} ${step === num ? "active" : ""}`}
              onClick={() => {
                if (
                  num === 1 ||
                  (num === 2 && departureType) ||
                  (num === 3 && departureType && tone) ||
                  (num === 4 && departureType && tone && expression) ||
                  (num === 5 && departureType && tone && expression) ||
                  (num === 6 && departureType && tone && expression)
                ) {
                  setStep(num);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Étape ${num}: ${
                num === 1
                  ? "Type"
                  : num === 2
                    ? "Ton"
                    : num === 3
                      ? "Expression"
                      : num === 4
                        ? "Témoignage"
                        : num === 5
                          ? "Contenu"
                          : "Aperçu"
              }`}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  (num === 1 ||
                    (num === 2 && departureType) ||
                    (num === 3 && departureType && tone) ||
                    (num === 4 && departureType && tone && expression) ||
                    (num === 5 && departureType && tone && expression) ||
                    (num === 6 && departureType && tone && expression))
                ) {
                  setStep(num);
                }
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + num * 0.1, duration: 0.3 }}
              whileHover={{ scale: step >= num || num === step ? 1.1 : 1 }}
            >
              <motion.div
                className="step-number"
                animate={{
                  scale: step === num ? [1, 1.2, 1] : 1,
                  backgroundColor: step >= num ? "var(--color-brown-600)" : "var(--color-brown-100)",
                  color: step >= num ? "var(--color-white)" : "var(--color-brown-700)",
                }}
                transition={{ duration: 0.3 }}
              >
                {num}
              </motion.div>
              <span className="step-label">
                {num === 1
                  ? "Type"
                  : num === 2
                    ? "Ton"
                    : num === 3
                      ? "Expression"
                      : num === 4
                        ? "Témoignage"
                        : num === 5
                          ? "Contenu"
                          : "Aperçu"}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="ecrire-content"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="ecrire-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.button
          className="btn-secondary"
          onClick={prevStep}
          disabled={step === 1}
          whileHover={{ scale: step !== 1 ? 1.05 : 1 }}
          whileTap={{ scale: step !== 1 ? 0.95 : 1 }}
          aria-label="Revenir à l'étape précédente"
        >
          <ChevronLeft size={16} /> Précédent
        </motion.button>
        {step < 6 ? (
          <motion.button
            className="btn-primary"
            onClick={nextStep}
            disabled={(step === 1 && !departureType) || (step === 2 && !tone) || (step === 3 && !expression)}
            whileHover={{
              scale: !((step === 1 && !departureType) || (step === 2 && !tone) || (step === 3 && !expression)) ? 1.05 : 1,
              boxShadow: !((step === 1 && !departureType) || (step === 2 && !tone) || (step === 3 && !expression))
                ? "0 10px 25px rgba(0,0,0,0.1)"
                : "none",
            }}
            whileTap={{
              scale: !((step === 1 && !departureType) || (step === 2 && !tone) || (step === 3 && !expression)) ? 0.95 : 1,
            }}
            aria-label="Passer à l'étape suivante"
          >
            Suivant <ChevronRight size={16} />
          </motion.button>
        ) : (
          <motion.button
            className="btn-publish"
            onClick={handlePublish}
            disabled={isPublishing}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
            aria-label={isPublishing ? "Publication en cours" : "Publier le message"}
          >
            {isPublishing ? (
              <Loader className="animate-spin" size={16} />
            ) : (
              <>
                <Sparkles size={16} /> Publier
              </>
            )}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default Ecrire;
