"use client"
import Card from "./card"
import { useState, useEffect, useRef } from "react"
import "./resultat.css"
import ResultatEndpage from "./ResultatEndpage"
const mockData = {
    "id": 4,
    "user": {
      "id": 4,
      "name": "Lady jenny",
      "email": "lady@gmail.com",
      "profile_url": "http://192.168.85.213:8000/media/users/profiles/default.png",
      "is_active": true
    },
    "user_profile_url": "http://192.168.85.213:8000/media/users/profiles/default.png",
    "titre": "Je démissionne de mon job",
    "version_des_faits": "J'en ai ralle bol du travail, mon patron est trop strict",
    "resumer_des_faits": "Je suis à bout au travail. Mon patron est trop strict, et honnêtement, je suis vraiment triste.",
    "identifiant": "ae3b9081-82e3-45a2-98bf-46fb62c30ee7",
    "type": "démission",
    "ton": "IRONIQUE",
    "expression": "triste",
    "fin_voulue": "Qu'elle trouve mieux",
    "perpective": "Je vais prendre du recule",
    "couleur": "#964",
    "police": "Arial",
    "taille": "PETIT",
    "mots_adieu": "Bon, écoute, je ne sais pas par où commencer. Le cœur lourd, je dois te dire que je suis à bout. Le travail, l'ambiance... et toi, avec tes exigences incessantes, ça a fini par me briser. Je suis épuisé, vidé de toute motivation. Je suis triste, profondément triste, de voir comment cette situation a dégénéré. Je m'en vais, mais je ne t'oublierai pas. Adieu.",
    "created_at": "19-05-2025",
    "updated_at": "19-05-2025",
    "images": [],
    "files": [],
    "videos": [],
    "scenarios": [],
    "photo_url": "http://192.168.85.213:8000/media//media/endpage/images/2623_knKqYhm.jpg",
    "reactions": {
      "feux": 0,
      "larmes": 0,
      "sourires": 0,
      "applaudissements": 0
    },
    "audio_ton_emotion_url": "http://192.168.85.213:8000/media/endpage/audio/default.mp3"
  }
// Composant principal

const DeparturePage = () => {
  const [data, setData] = useState(mockData)
  const [reactions, setReactions] = useState({
    sourires: data.reactions.sourires,
    feux: data.reactions.feux,
    larmes: data.reactions.larmes,
    applaudissements: data.reactions.applaudissements,
  })
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const rainCanvasRef = useRef(null)
  // useEffect(() => {
  //     axios.get(`${api}/endpage/6/details/`)
  //       .then(response => {
  //         setData(response.data);
         
  //         console.log(response.data)
  //       })
  //       .catch(error => {
  //         console.error('Erreur lors de la récupération des publications:', error);
  //       });
  //   }, []);
  // Effet d'apparition au chargement
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, 300)
  }, [])

  // Appliquer les styles personnalisés
  const pageStyle = {
    fontFamily: data.police,
    fontSize: data.taille === "PETIT" ? "16px" : data.taille === "MOYEN" ? "18px" : "20px",
    color: data.couleur,
  }

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') {
      return 'Invalid Date'
    }

    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  }

  // Gérer les réactions
  const handleReaction = (type) => {
    setReactions((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }))

    const reactionElement = document.createElement("div")
    reactionElement.className = "floating-reaction"

    switch (type) {
      case "sourires":
        reactionElement.textContent = "😊"
        break
      case "larmes":
        reactionElement.textContent = "😢"
        break
      case "applaudissements":
        reactionElement.textContent = "👏"
        break
      case "feux":
        reactionElement.textContent = "🔥"
        break
    }

    document.body.appendChild(reactionElement)

    const startX = window.innerWidth / 2 - 20 + (Math.random() * 40 - 20)
    const endY = -100

    reactionElement.style.left = `${startX}px`
    reactionElement.style.bottom = "100px"

    setTimeout(() => {
      reactionElement.style.bottom = `${endY}px`
      reactionElement.style.opacity = "0"
    }, 50)

    setTimeout(() => {
      document.body.removeChild(reactionElement)
    }, 1500)
  }

  // Gérer la lecture audio
  useEffect(() => {
    const audio = new Audio(data.audio_ton_emotion_url)
    setAudioElement(audio)

    return () => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [data.audio_ton_emotion_url])

  const toggleAudio = () => {
    if (audioElement) {
      if (audioPlaying) {
        audioElement.pause()
      } else {
        audioElement.loop = true
        audioElement.play()
      }
      setAudioPlaying(!audioPlaying)
    }
  }

  // Effet de pluie
  useEffect(() => {
    const canvas = rainCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    const raindrops = []
    const raindropCount = Math.floor(window.innerWidth / 5)

    for (let i = 0; i < raindropCount; i++) {
      raindrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 10 + 5,
        thickness: Math.random() * 2 + 1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`,
      })
    }

    const drawRain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      raindrops.forEach((drop) => {
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x, drop.y + drop.length)
        ctx.strokeStyle = drop.color
        ctx.lineWidth = drop.thickness
        ctx.stroke()

        drop.y += drop.speed

        if (drop.y > canvas.height) {
          drop.y = -drop.length
          drop.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(drawRain)
    }

    drawRain()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Déterminer l'icône d'émotion
  const getEmotionIcon = () => {
    switch (data.expression.toLowerCase()) {
      case "triste":
        return "😢"
      case "colere":
        return "😡"
      case "joyeux":
        return "😊"
      default:
        return "🤔"
    }
  }

  // Déterminer la classe de couleur basée sur l'expression
  const getEmotionColorClass = () => {
    switch (data.expression.toLowerCase()) {
      case "triste":
        return "theme-sad"
      case "colere":
        return "theme-angry"
      case "joyeux":
        return "theme-happy"
      default:
        return "theme-reflective"
    }
  }

  return (
    <div className={`departure-page ${getEmotionColorClass()} ${isVisible ? "visible" : ""}`} style={pageStyle}>
      <canvas ref={rainCanvasRef} className="rain-canvas"></canvas>

      <div className="page-content">
        <header className="departure-header">
          <div className="header-content">
            <div className="header-title">
              <h1 className="page-title">{data.titre}</h1>
              <button
                className={`audio-button ${audioPlaying ? "playing" : ""}`}
                onClick={toggleAudio}
              >
                <span className="audio-icon">{audioPlaying ? "⏸️" : "🎵"}</span>
                {audioPlaying && (
                  <div className="audio-waves">
                    <span></span><span></span><span></span><span></span>
                  </div>
                )}
              </button>
            </div>
            <div className="user-info">
              <div className="avatar-container">
                <img
                  src={data.user_profile_url || "/placeholder.svg?height=200&width=200"}
                  alt={data.user.name}
                  className="user-avatar"
                />
                <div className="avatar-glow"></div>
              </div>
              <div className="user-details">
                <h2>{data.user.name}</h2>
                <div className="badge-container">
                  <span className="departure-type">{data.type}</span>
                  <span className="departure-date">Publié le {data.created_at}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="emotion-badge">
            <span className="emotion-icon">{getEmotionIcon()}</span>
            <span className="emotion-label">{data.expression}</span>
            <div className="emotion-pulse"></div>
          </div>
        </header>

        <main className="departure-content">
          <section className="summary-section">
            <h3 className="section-title">Résumé des Faits</h3>
            <div className="summary-content">
              <p>{data.resumer_des_faits}</p>
            </div>
          </section>

          <section className="story-section">
              <h3 className="section-title">Ma Version des Faits</h3>
              <div className="flex flex-row justify-between story-content">
                <div className="w-100 story-text">
                  {data.version_des_faits.split(". ").map((sentence, index) => (
                    <p key={index} className="animated-text">{sentence}.</p>
                  ))}
                </div>
                
                <div className="story-images">
                {data && (
              <ResultatEndpage
              gender={'MASCULIN'}
              mode={'PRO'}
              expression={'TRISTE'}
              />
                )}
              </div>
              </div>
            </section>

          <section className="future-section">
            <h3 className="section-title">Ce que je souhaite pour la suite</h3>
            <div className="future-content">
              <div className="quote-marks left">"</div>
              <p>{data.perpective}</p>
              <div className="quote-marks right">"</div>
            </div>
          </section>

          <section className="farewell-section">
            <h3 className="section-title">Mots d'Adieu</h3>
            <div className="farewell-content">
             <Card quote={data.mots_adieu} fontFamily={data.police} textColor={data.couleur} />
            </div>
          </section>

          {/* {data.videos && data.videos.length > 0 && ( */}
            <section className="media-section">
              <h3 className="section-title">Vidéos</h3>
              <div className="video-gallery">
                <div className="video-container">
                  <video width="640" height="360" controls>
                    <source src="http://192.168.85.213:8000/media/lady.mp4" type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                </div>
                {/* {data.videos.map((video, index) => (
                  <div className="video-container" key={index}>
                    <video controls src={video.emplacement} className="story-video"></video>
                    <div className="video-overlay">
                      <div className="play-button">▶</div>
                      <div className="video-caption">http://192.168.85.213:8000/media/lady.mp4</div>
                    </div>
                  </div>
                ))} */}
              </div>
            </section>
          {/* )} */}

          {data.files && data.files.length > 0 && (
            <section className="files-section">
              <h3 className="section-title">Fichiers</h3>
              <div className="files-gallery">
                {data.files.map((file, index) => (
                  <div className="file-container" key={index}>
                    <a href={file.file_url} download className="file-link">
                      Télécharger {file.fichier.split('/').pop()}
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.scenarios && data.scenarios.length > 0 && (
            <section className="scenarios-section">
              <h3 className="section-title">Scénarios</h3>
              <div className="scenarios-content">
                {data.scenarios.map((scenario, index) => (
                  <div className="scenario-item" key={index}>
                    <h4>Scénario {index + 1}: {scenario.context}</h4>
                    <p>Avatar: {scenario.avatar.pseudo} ({scenario.avatar.sexe}, {scenario.avatar.mode})</p>
                    <ul>
                      {scenario.scenes.map((scene, sceneIndex) => (
                        <li key={sceneIndex}>
                          Scène {sceneIndex + 1}: {scene.texte} (Action: {scene.action})
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        <footer className="departure-footer">
          <div className="audio-control">
            <button
              className={`audio-button ${audioPlaying ? "playing" : ""}`}
              onClick={toggleAudio}
            >
              <span className="audio-icon">{audioPlaying ? "⏸️" : "🎵"}</span>
              <span className="audio-text">{audioPlaying ? "Pause" : "Écouter mon ressenti"}</span>
              {audioPlaying && (
                <div className="audio-waves">
                  <span></span><span></span><span></span><span></span>
                </div>
              )}
            </button>
          </div>

          <div className="reactions-section">
            <h3 className="reactions-title">Réagir à cette histoire</h3>
            <div className="reaction-buttons">
              <button className="reaction-button" onClick={() => handleReaction("sourires")}>
                <div className="reaction-bubble">
                  <span className="reaction-icon">😊</span>
                </div>
                <span className="reaction-count">{reactions.sourires}</span>
              </button>
              <button className="reaction-button" onClick={() => handleReaction("larmes")}>
                <div className="reaction-bubble">
                  <span className="reaction-icon">😢</span>
                </div>
                <span className="reaction-count">{reactions.larmes}</span>
              </button>
              <button className="reaction-button" onClick={() => handleReaction("applaudissements")}>
                <div className="reaction-bubble">
                  <span className="reaction-icon">👏</span>
                </div>
                <span className="reaction-count">{reactions.applaudissements}</span>
              </button>
              <button className="reaction-button" onClick={() => handleReaction("feux")}>
                <div className="reaction-bubble">
                  <span className="reaction-icon">🔥</span>
                </div>
                <span className="reaction-count">{reactions.feux}</span>
              </button>
            </div>
          </div>

          <div className="departure-metadata">
            <p>Ton: <span className="metadata-value">{data.ton}</span></p>
            <p>Identifiant: <span className="metadata-value">{data.identifiant}</span></p>
            <p>Dernière mise à jour: <span className="metadata-value">{formatDate(data.updated_at)}</span></p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default DeparturePage