"use client"

import React, { useState, useRef } from "react"
import "./ecrireMaFin.jsx"
import { FileText, Briefcase, Scissors, Smile, Frown, Zap, Coffee, Heart, MessageCircle, Type, ImageIcon, Video, Music, ChevronLeft, ChevronRight, X, Check, Edit, Trash2, Send, BookOpen } from 'lucide-react'

const Ecrire = () => {
  // Main state
  const [step, setStep] = useState(1)
  const [departureType, setDepartureType] = useState(null)
  const [tone, setTone] = useState(null)
  const [testimony, setTestimony] = useState("")
  const [contentItems, setContentItems] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)

  // Text content state
  const [textContent, setTextContent] = useState("")
  const [fontFamily, setFontFamily] = useState("Source Serif 4")
  const [fontSize, setFontSize] = useState("16px")
  const [textColor, setTextColor] = useState("#2d2a26")

  // Media refs
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const audioInputRef = useRef(null)

  // Navigation functions
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  // Content management
  const handleAddText = () => {
    if (!textContent.trim()) return

    setContentItems([
      ...contentItems,
      {
        type: "text",
        content: textContent,
        style: {
          fontFamily,
          fontSize,
          color: textColor,
        },
      },
    ])

    resetTextForm()
  }

  const handleUpdateText = () => {
    if (editingIndex === null || !textContent.trim()) return

    const newItems = [...contentItems]
    newItems[editingIndex] = {
      type: "text",
      content: textContent,
      style: {
        fontFamily,
        fontSize,
        color: textColor,
      },
    }

    setContentItems(newItems)
    resetTextForm()
  }

  const resetTextForm = () => {
    setTextContent("")
    setFontFamily("Source Serif 4")
    setFontSize("16px")
    setTextColor("#2d2a26")
    setEditingIndex(null)
  }

  const handleEditItem = (index) => {
    const item = contentItems[index]
    setEditingIndex(index)

    if (item.type === "text") {
      setTextContent(item.content)
      setFontFamily(item.style?.fontFamily || "Source Serif 4")
      setFontSize(item.style?.fontSize || "16px")
      setTextColor(item.style?.color || "#2d2a26")
    }
  }

  const handleRemoveItem = (index) => {
    setContentItems(contentItems.filter((_, i) => i !== index))
  }

  // Media handling
  const triggerFileInput = (inputRef) => {
    inputRef.current?.click()
  }

  const handleFileUpload = (type, e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newItems = [...contentItems]
    
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file)
      newItems.push({
        type,
        content: file.name,
        url
      })
    })

    setContentItems(newItems)
    e.target.value = null // Reset input
  }

  // Get title for preview
  const getPreviewTitle = () => {
    let title = ""
    
    switch (departureType) {
      case "demission":
        title = "Lettre de démission"
        break
      case "rupture":
        title = "Annonce de rupture"
        break
      case "depart":
        title = "Message d'adieu"
        break
      default:
        title = "Mon message"
    }

    return title
  }

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderTypeSelector()
      case 2:
        return renderToneSelector()
      case 3:
        return renderTestimonyInput()
      case 4:
        return renderContentEditor()
      case 5:
        return renderPreview()
      default:
        return null
    }
  }

  // Step 1: Type Selector
  const renderTypeSelector = () => {
    const types = [
      {
        id: "demission",
        title: "Démission",
        description: "Quitter un emploi ou une fonction",
        icon: <FileText />,
      },
      {
        id: "rupture",
        title: "Rupture",
        description: "Fin d'une relation personnelle",
        icon: <Scissors />,
      },
      {
        id: "depart",
        title: "Départ",
        description: "Quitter un lieu ou un groupe",
        icon: <Briefcase />,
      },
    ]

    return (
      <div className="step-content">
        <h2>Quel type de départ souhaitez-vous exprimer ?</h2>
        <div className="options-container">
          {types.map((type) => (
            <div
              key={type.id}
              className={`option ${departureType === type.id ? "selected" : ""}`}
              onClick={() => setDepartureType(type.id)}
            >
              <div className="option-icon">{type.icon}</div>
              <h3>{type.title}</h3>
              <p>{type.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Step 2: Tone Selector
  const renderToneSelector = () => {
    const tones = [
      {
        id: "triste",
        title: "Triste",
        description: "Exprimer de la tristesse ou du regret",
        icon: <Frown />,
        class: "sadness",
      },
      {
        id: "heureux",
        title: "Heureux",
        description: "Montrer de la joie ou du soulagement",
        icon: <Smile />,
        class: "humor",
      },
      {
        id: "enrage",
        title: "En rage",
        description: "Exprimer de la colère ou de la frustration",
        icon: <Zap />,
        class: "rage",
      },
      {
        id: "neutre",
        title: "Neutre",
        description: "Ton professionnel et mesuré",
        icon: <Coffee />,
        class: "",
      },
      {
        id: "reconnaissant",
        title: "Reconnaissant",
        description: "Montrer de la gratitude",
        icon: <Heart />,
        class: "nostalgia",
      },
    ]

    return (
      <div className="step-content">
        <h2>Quel ton souhaitez-vous adopter ?</h2>
        <div className="options-container">
          {tones.map((tone) => (
            <div
              key={tone.id}
              className={`option ${tone.id === tone ? "selected" : ""}`}
              onClick={() => setTone(tone.id)}
            >
              <div className={`option-icon emotion-icon ${tone.class}`}>{tone.icon}</div>
              <h3>{tone.title}</h3>
              <p>{tone.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Step 3: Testimony Input
  const renderTestimonyInput = () => {
    return (
      <div className="step-content">
        <h2>Partagez votre version de l'histoire</h2>
        <div className="testimony-container">
          <textarea
            placeholder="Racontez votre expérience et les raisons de votre départ..."
            value={testimony}
            onChange={(e) => setTestimony(e.target.value)}
          />
          <div className="testimony-tips">
            <h4>Conseils pour votre témoignage :</h4>
            <ul>
              <li>Soyez honnête mais respectueux</li>
              <li>Exprimez vos sentiments avec authenticité</li>
              <li>Partagez ce que vous avez appris de cette expérience</li>
              <li>Mentionnez les aspects positifs, même dans une situation difficile</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Step 4: Content Editor
  const renderContentEditor = () => {
    return (
      <div className="step-content">
        <h2>Personnalisez votre message</h2>
        <div className="editor-container">
          <div className="editor-controls">
            <div className="control-group">
              <label htmlFor="font-family">Police d'écriture</label>
              <select
                id="font-family"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <option value="Source Serif 4">Source Serif</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Inter">Inter</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="font-size">Taille</label>
              <select
                id="font-size"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
              >
                <option value="14px">Petit</option>
                <option value="16px">Normal</option>
                <option value="18px">Grand</option>
                <option value="20px">Très grand</option>
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="text-color">Couleur</label>
              <input
                type="color"
                id="text-color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
            </div>
          </div>

          <div className="editor-main">
            <textarea
              placeholder="Saisissez votre texte ici..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              style={{
                fontFamily,
                fontSize,
                color: textColor,
              }}
            />
          </div>

          <div className="editor-actions">
            {editingIndex !== null ? (
              <div className="edit-actions">
                <button className="btn-primary" onClick={handleUpdateText}>
                  <Check size={16} /> Mettre à jour
                </button>
                <button className="btn-secondary" onClick={resetTextForm}>
                  <X size={16} /> Annuler
                </button>
              </div>
            ) : (
              <button className="btn-primary" onClick={handleAddText} disabled={!textContent.trim()}>
                <Type size={16} /> Ajouter ce texte
              </button>
            )}
          </div>

          <div className="media-controls">
            <h3>Ajouter des médias</h3>
            <div className="media-buttons">
              <button className="media-button" onClick={() => triggerFileInput(imageInputRef)}>
                <ImageIcon size={18} /> Images
              </button>
              <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload("image", e)}
              />

              <button className="media-button" onClick={() => triggerFileInput(videoInputRef)}>
                <Video size={18} /> Vidéos
              </button>
              <input
                type="file"
                ref={videoInputRef}
                className="hidden"
                accept="video/*"
                multiple
                onChange={(e) => handleFileUpload("video", e)}
              />

              <button className="media-button" onClick={() => triggerFileInput(audioInputRef)}>
                <Music size={18} /> Audio
              </button>
              <input
                type="file"
                ref={audioInputRef}
                className="hidden"
                accept="audio/*"
                multiple
                onChange={(e) => handleFileUpload("audio", e)}
              />
            </div>
          </div>

          {contentItems.length > 0 && (
            <div className="media-preview">
              <h3>Contenu ajouté</h3>
              <div className="media-grid">
                {contentItems.map((item, index) => (
                  <div key={index} className="media-item">
                    {item.type === "text" ? (
                      <div
                        style={{
                          fontFamily: item.style?.fontFamily,
                          fontSize: item.style?.fontSize,
                          color: item.style?.color,
                          padding: "1rem",
                          height: "100%",
                          overflow: "hidden",
                        }}
                      >
                        {item.content.length > 100
                          ? item.content.substring(0, 100) + "..."
                          : item.content}
                      </div>
                    ) : item.type === "image" ? (
                      <img src={item.url || "/placeholder.svg"} alt={item.content} />
                    ) : item.type === "video" ? (
                      <video src={item.url} controls />
                    ) : (
                      <div className="audio-preview">
                        <Music size={24} />
                        <audio src={item.url} controls />
                      </div>
                    )}
                    <div className="media-item-actions">
                      {item.type === "text" && (
                        <button
                          className="edit-media"
                          onClick={() => handleEditItem(index)}
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      <button
                        className="remove-media"
                        onClick={() => handleRemoveItem(index)}
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
    )
  }

  // Step 5: Preview
  const renderPreview = () => {
    return (
      <div className="preview-container">
        <h3>Aperçu de votre message</h3>
        <div className="preview-content">
          <div className="preview-header">
            <div className="preview-meta">
              {departureType && (
                <span className={`preview-type ${departureType}`}>
                  {departureType === "demission"
                    ? "Démission"
                    : departureType === "rupture"
                    ? "Rupture"
                    : "Départ"}
                </span>
              )}
              {tone && (
                <span className={`preview-tone ${tone}`}>
                  {tone === "triste"
                    ? "Triste"
                    : tone === "heureux"
                    ? "Heureux"
                    : tone === "enrage"
                    ? "En rage"
                    : tone === "neutre"
                    ? "Neutre"
                    : "Reconnaissant"}
                </span>
              )}
            </div>
            <h2 className="preview-title">{getPreviewTitle()}</h2>
          </div>

          {testimony && <div className="preview-testimony">{testimony}</div>}

          <div className="preview-main-content">
            {contentItems.map((item, index) => (
              <div key={index} className="preview-item">
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
                    {item.type === "image" ? (
                      <img src={item.url || "/placeholder.svg"} alt={item.content} />
                    ) : item.type === "video" ? (
                      <video src={item.url} controls />
                    ) : (
                      <audio src={item.url} controls />
                    )}
                  </div>
                )}
              </div>
            ))}

            {contentItems.length === 0 && (
              <p className="no-content">Aucun contenu ajouté. Revenez à l'étape précédente pour ajouter du contenu.</p>
            )}
          </div>
        </div>

        <div className="preview-actions">
          <button className="btn-primary">
            <Send size={16} /> Finaliser et envoyer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ecrire-container">
      <header className="ecrire-header">
        <div className="quill-decoration">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 4L8.5 15.5M8.5 15.5L7 17M8.5 15.5L13.5 20.5M7 17L4 20M7 17L3 16"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1>Créez votre message d'adieu</h1>
        <div className="step-indicator">
          {[1, 2, 3, 4, 5].map((num) => (
            <React.Fragment key={num}>
              <div className={`step ${step === num ? "active" : ""}`}>{num}</div>
              {num < 5 && <div className="step-line"></div>}
            </React.Fragment>
          ))}
        </div>
      </header>

      <main className="ecrire-body">
        <div className="ecrire-content">{renderStepContent()}</div>
      </main>

      <footer className="ecrire-footer">
        <button
          className="btn-secondary"
          onClick={prevStep}
          disabled={step === 1}
        >
          <ChevronLeft size={16} /> Précédent
        </button>
        {step < 5 ? (
          <button
            className="btn-primary"
            onClick={nextStep}
            disabled={(step === 1 && !departureType) || (step === 2 && !tone)}
          >
            Suivant <ChevronRight size={16} />
          </button>
        ) : (
          <button className="btn-primary">
            <BookOpen size={16} /> Publier
          </button>
        )}
      </footer>
    </div>
  )
}

export default Ecrire
