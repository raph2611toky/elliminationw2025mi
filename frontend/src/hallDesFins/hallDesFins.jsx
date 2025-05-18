"use client"

import React, { useState, useEffect, useRef } from "react"
import "./hallDesFins.css"
import {
  BookOpen,
  PenLine,
  Sparkles,
  Heart,
  MessageCircle,
  Award,
  Bookmark,
  Search,
  ChevronDown,
  Star,
  Moon,
  Sun,
  Eye,
  Settings,
  Palette,
  Type,
  Zap,
  BrainCircuit,
} from "lucide-react"
import ChatBotTheEnd from "../finalBot/finalBoth"
const Ecrire = React.lazy(() => import("../ecrireMaFin/ecrireMaFin"))
const ApresFin = React.lazy(() => import("../apresFin/apresFin"))
const DernierFin = React.lazy(() => import("../DernierFin/DernierFin"))
const mockPages = [
  {
    id: 1,
    title: "La Fin d'un Été",
    author: "Isabelle Moreau",
    emotion: "nostalgie",
    type: "départ",
    preview:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 120,
    date: "2024-01-20",
    excerpt: "Un été s'achève, emportant avec lui des souvenirs précieux et des promesses d'avenir.",
  },
  {
    id: 2,
    title: "Adieu, Mon Amour",
    author: "Pierre Durant",
    emotion: "tristesse",
    type: "rupture",
    preview:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 95,
    date: "2024-02-15",
    excerpt: "Les mots se brisent, les cœurs se séparent, mais le souvenir de notre amour restera gravé à jamais.",
  },
  {
    id: 3,
    title: "La Démission",
    author: "Sophie Martin",
    emotion: "rage",
    type: "démission",
    preview:
      "https://images.unsplash.com/photo-1588776833668-4a9847789e3d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 150,
    date: "2024-03-10",
    excerpt: "Assez de compromis, je claque la porte et pars vers de nouveaux horizons.",
  },
  {
    id: 4,
    title: "Le Départ Inattendu",
    author: "Luc Dubois",
    emotion: "tristesse",
    type: "départ",
    preview:
      "https://images.unsplash.com/photo-1533738369480-491b6584dd94?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 110,
    date: "2024-04-05",
    excerpt: "Un voyage sans retour, une aventure vers l'inconnu, laissant derrière moi un monde de souvenirs.",
  },
  {
    id: 5,
    title: "Fin de Soirée",
    author: "Chloé Leclerc",
    emotion: "humour",
    type: "départ",
    preview:
      "https://images.unsplash.com/photo-1505843516597-5c35cb6f3d44?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 130,
    date: "2024-05-01",
    excerpt: "Quand la fête est finie, il est temps de rentrer et de se préparer pour de nouvelles aventures.",
  },
  {
    id: 6,
    title: "Rupture Difficile",
    author: "Antoine Roy",
    emotion: "rage",
    type: "rupture",
    preview:
      "https://images.unsplash.com/photo-1508780413682-665047931fa4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 105,
    date: "2024-05-25",
    excerpt: "Les adieux sont amers, les regrets persistent, mais il est temps de tourner la page.",
  },
  {
    id: 7,
    title: "La Fin du Voyage",
    author: "Manon Bernard",
    emotion: "nostalgie",
    type: "départ",
    preview:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 140,
    date: "2024-06-20",
    excerpt: "Après des kilomètres parcourus, il est temps de rentrer et de chérir les souvenirs créés.",
  },
  {
    id: 8,
    title: "Démission Acceptée",
    author: "Quentin Garcia",
    emotion: "humour",
    type: "démission",
    preview:
      "https://images.unsplash.com/photo-1607799256727-4aa9e94d744d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 115,
    date: "2024-07-15",
    excerpt: "Quand la liberté sonne à la porte, il est temps de dire adieu au travail et bonjour à l'aventure.",
  },
]

const HallDesFins = () => {
  const [language, setLanguage] = useState("fr")
  const [darkMode, setDarkMode] = useState(false)
  const [pages, setPages] = useState(mockPages)
  const [filteredPages, setFilteredPages] = useState(mockPages)
  const [emotionFilter, setEmotionFilter] = useState("tous")
  const [typeFilter, setTypeFilter] = useState("tous")
  const [sortBy, setSortBy] = useState("recent")
  const [hoveredCard, setHoveredCard] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [reactions, setReactions] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [portalOpen, setPortalOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState(null)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [testMenuVisible, setTestMenuVisible] = useState(false)
  const [engravingEffects, setEngravingEffects] = useState([])
  const [testOptions, setTestOptions] = useState({
    emotion: "humour",
    type: "démission",
    style: "standard",
    font: "serif",
  })
  const [activeSection, setActiveSection] = useState("hall")
  const [quizResult, setQuizResult] = useState(null)

  const cardsRef = useRef([])
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const containerRef = useRef(null)
  const starsRef = useRef(null)
  const portalRef = useRef(null)
  const engravingRef = useRef(null)

  // Initial animation sequence
  useEffect(() => {
    // Start with portal closed
    setTimeout(() => {
      setPortalOpen(true)

      // After portal animation completes
      setTimeout(() => {
        setAnimationComplete(true)
      }, 2000)
    }, 500)
  }, [])

  // Custom cursor effect
  useEffect(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    const container = containerRef.current

    if (!cursor || !cursorDot || !container) return

    const onMouseMove = (e) => {
      const { clientX, clientY } = e

      // Position the cursor elements
      cursor.style.left = `${clientX}px`
      cursor.style.top = `${clientY}px`

      // The dot follows with a slight delay for a trailing effect
      setTimeout(() => {
        cursorDot.style.left = `${clientX}px`
        cursorDot.style.top = `${clientY}px`
      }, 50)
    }

    const onMouseEnter = () => {
      cursor.style.opacity = "1"
      cursorDot.style.opacity = "1"
    }

    const onMouseLeave = () => {
      cursor.style.opacity = "0"
      cursorDot.style.opacity = "0"
    }

    // Add hover effect for interactive elements
    const handleLinkHover = () => {
      cursor.classList.add("cursor-hover")
    }

    const handleLinkLeave = () => {
      cursor.classList.remove("cursor-hover")
    }

    // Add event listeners
    container.addEventListener("mousemove", onMouseMove)
    container.addEventListener("mouseenter", onMouseEnter)
    container.addEventListener("mouseleave", onMouseLeave)

    // Add hover effect to all interactive elements
    const interactiveElements = container.querySelectorAll("a, button, .page-card, .card-reaction, select")
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleLinkHover)
      el.addEventListener("mouseleave", handleLinkLeave)
    })

    return () => {
      container.removeEventListener("mousemove", onMouseMove)
      container.removeEventListener("mouseenter", onMouseEnter)
      container.removeEventListener("mouseleave", onMouseLeave)

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleLinkHover)
        el.removeEventListener("mouseleave", handleLinkLeave)
      })
    }
  }, [filteredPages, activeSection])

  // Parallax stars effect
  useEffect(() => {
    const stars = starsRef.current
    if (!stars) return

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 20
      const y = (clientY / window.innerHeight - 0.5) * 20

      stars.style.transform = `translate(${x}px, ${y}px)`
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Card animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      cardsRef.current.forEach((card) => {
        if (!card) return
        const rect = card.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0
        if (isVisible) {
          card.classList.add("visible")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Trigger once on load

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [filteredPages])

  // Dark mode effect
  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode"
  }, [darkMode])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e

      // Mettre à jour les effets de gravure
      if (Math.random() > 0.95 && engravingEffects.length < 5) {
        const newEffect = {
          id: Date.now(),
          x: clientX,
          y: clientY,
          size: Math.random() * 50 + 50,
        }

        setEngravingEffects((prev) => [...prev, newEffect])

        // Supprimer l'effet après un délai
        setTimeout(() => {
          setEngravingEffects((prev) => prev.filter((effect) => effect.id !== newEffect.id))
        }, 2000)
      }
    }

    container.addEventListener("mousemove", handleMouseMove)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [engravingEffects])

  // Écouter les changements d'URL pour la navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash) {
        setActiveSection(hash)
      }
    }

    // Vérifier le hash initial
    handleHashChange()

    window.addEventListener("hashchange", handleHashChange)
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  // Translations
  const translations = {
    fr: {
      pageOfDay: "Page du jour",
      filters: "Filtres",
      emotions: "Émotions",
      types: "Types",
      all: "Tous",
      humor: "Humour",
      sadness: "Tristesse",
      rage: "Colère",
      nostalgia: "Nostalgie",
      resignation: "Démission",
      breakup: "Rupture",
      departure: "Départ",
      sortBy: "Trier par",
      recent: "Récent",
      popular: "Populaire",
      viewPage: "Voir la page",
      menus: {
        hall: "Hall",
        write: "Écrire",
        drama: "Dr Drama",
        myEnds: "Profil",
      },
      footer: "Tous droits réservés",
      galleryTitle: "Le Hall des Fins",
      gallerySubtitle: "Explorer les pages créées",
      galleryDescription: "Galerie immersive de toutes les fins partagées",
      search: "Rechercher...",
      reactions: {
        feel: "Je ressens",
        applaud: "J'applaudis",
        laugh: "J'ai ri",
        support: "Je t'envoie de la force",
      },
      readMore: "Lire",
      writeYourEnd: "Écrire ma fin",
      afterTheEnd: "Après la fin",
      closePortal: "Fermer",
      testTitle: "Êtes-vous prêt à écrire votre fin ?",
      testSubtitle: "Découvrez votre aptitude à la fin",
      testDescription: "Répondez à quelques questions pour évaluer votre capacité à clore un chapitre",
    },
    mg: {
      pageOfDay: "Pejy androany",
      filters: "Sivana",
      emotions: "Fihetseham-po",
      types: "Karazana",
      all: "Rehetra",
      humor: "Vazivazy",
      sadness: "Alahelo",
      rage: "Hatezerana",
      nostalgia: "Hanina",
      resignation: "Fialana",
      breakup: "Fisarahana",
      departure: "Fialantsasatra",
      sortBy: "Alamino",
      recent: "Vaovao",
      popular: "Malaza",
      viewPage: "Hijery",
      menus: {
        hall: "Trano",
        write: "Soratra",
        drama: "Dr Drama",
        myEnds: "Profil",
      },
      footer: "Zo rehetra voatokana",
      galleryTitle: "Ny Tranon'ny Fiafaran",
      gallerySubtitle: "Jereo ny pejy noforonina",
      galleryDescription: "Galeria mampiseho ny fiafaran'ny tantara rehetra",
      search: "Hikaroka...",
      reactions: {
        feel: "Tsapako",
        applaud: "Mitsiky aho",
        laugh: "Nihomehy aho",
        support: "Manome hery anao aho",
      },
      readMore: "Vakio",
      writeYourEnd: "Sorato ny fiafaran'ny tantara",
      afterTheEnd: "Aorian'ny fiafaran'ny tantara",
      closePortal: "Hidio",
      testTitle: "Vonona ny hanoratra ny fiafaranao ve ianao?",
      testSubtitle: "Fantaro ny fahaizanao mamarana",
      testDescription: "Valio ireo fanontaniana vitsivitsy mba hanombantombanana ny fahaizanao mamarana toko iray",
    },
  }

  const t = translations[language]

  // Filter and search effect
  useEffect(() => {
    let result = [...pages]

    // Apply emotion filter
    if (emotionFilter !== "tous") {
      result = result.filter((page) => page.emotion === emotionFilter)
    }

    // Apply type filter
    if (typeFilter !== "tous") {
      result = result.filter((page) => page.type === typeFilter)
    }

    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (page) => page.title.toLowerCase().includes(query) || page.author.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else if (sortBy === "popular") {
      result.sort((a, b) => b.likes - a.likes)
    }

    setFilteredPages(result)
  }, [emotionFilter, typeFilter, sortBy, pages, searchQuery])

  // Get emotion label
  const getEmotionLabel = (emotion) => {
    switch (emotion) {
      case "humour":
        return t.humor
      case "tristesse":
        return t.sadness
      case "rage":
        return t.rage
      case "nostalgie":
        return t.nostalgia
      default:
        return emotion
    }
  }

  // Get type label
  const getTypeLabel = (type) => {
    switch (type) {
      case "démission":
        return t.resignation
      case "rupture":
        return t.breakup
      case "départ":
        return t.departure
      default:
        return type
    }
  }

  // Handle reaction click
  const handleReaction = (pageId, reactionType) => {
    setReactions((prev) => {
      const pageReactions = prev[pageId] || {}
      return {
        ...prev,
        [pageId]: {
          ...pageReactions,
          [reactionType]: !pageReactions[reactionType],
        },
      }
    })
  }

  // Get reaction count (simulated)
  const getReactionCount = (pageId, reactionType) => {
    // Base counts
    const baseCounts = {
      feel: 12,
      applaud: 24,
      laugh: 18,
      support: 15,
    }

    // Add 1 if user reacted
    const userReacted = reactions[pageId]?.[reactionType] ? 1 : 0
    return baseCounts[reactionType] + userReacted
  }

  // Toggle search bar
  const toggleSearch = () => {
    setShowSearch(!showSearch)
    if (!showSearch) {
      setTimeout(() => {
        document.getElementById("search-input")?.focus()
      }, 100)
    }
  }

  // Open page detail in portal
  const openPageDetail = (page) => {
    setSelectedPage(page)
    setPortalOpen(true)

    // Disable scrolling on body
    document.body.style.overflow = "hidden"
  }

  // Close portal
  const closePortal = () => {
    setPortalOpen(false)

    // Re-enable scrolling
    document.body.style.overflow = "auto"
  }

  // Ajouter cette fonction pour gérer les options de test
  const handleTestOptionChange = (option, value) => {
    setTestOptions((prev) => ({
      ...prev,
      [option]: value,
    }))
  }

  // Ajouter cette fonction pour prévisualiser la fin
  const previewTestEnd = () => {
    // Simuler une prévisualisation
    const previewPage = {
      id: 999,
      title: "Prévisualisation de ma fin",
      author: "Vous",
      emotion: testOptions.emotion,
      type: testOptions.type,
      preview: "https://images.unsplash.com/photo-1518655048521-f130df041f66?q=80&w=500&auto=format&fit=crop",
      likes: 0,
      date: new Date().toISOString(),
      excerpt:
        "Ceci est une prévisualisation de votre fin. Vous pouvez modifier les options dans le menu de test pour voir comment elle apparaîtra dans le Hall des Fins.",
    }

    openPageDetail(previewPage)
    setTestMenuVisible(false)
  }

  // Gérer la fin du quiz
  const handleQuizComplete = (result) => {
    setQuizResult(result)
    // Rediriger vers la section d'écriture
    setActiveSection("write")
    window.location.hash = "write"
  }

  // Rendu conditionnel en fonction de la section active
  const renderContent = () => {
    switch (activeSection) {
      case "hall":
        return (
          <>
            <div className="hero-section">
              <div className="hero-decoration">
                <div className="hero-line"></div>
                <Star className="hero-icon" />
                <div className="hero-line"></div>
              </div>
              <h1 className="gallery-title">{t.galleryTitle}</h1>
              <p className="gallery-subtitle">{t.gallerySubtitle}</p>
            </div>

            <section className="filters-section">
              <div className="filters-container">
                <div className="filter-group">
                  <label>{t.emotions}</label>
                  <div className="select-wrapper">
                    <select
                      value={emotionFilter}
                      onChange={(e) => setEmotionFilter(e.target.value)}
                      aria-label="Filter by emotion"
                    >
                      <option value="tous">{t.all}</option>
                      <option value="humour">{t.humor}</option>
                      <option value="tristesse">{t.sadness}</option>
                      <option value="rage">{t.rage}</option>
                      <option value="nostalgie">{t.nostalgia}</option>
                    </select>
                    <ChevronDown className="select-icon" />
                  </div>
                </div>

                <div className="filter-group">
                  <label>{t.types}</label>
                  <div className="select-wrapper">
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      aria-label="Filter by type"
                    >
                      <option value="tous">{t.all}</option>
                      <option value="démission">{t.resignation}</option>
                      <option value="rupture">{t.breakup}</option>
                      <option value="départ">{t.departure}</option>
                    </select>
                    <ChevronDown className="select-icon" />
                  </div>
                </div>

                <div className="filter-group">
                  <label>{t.sortBy}</label>
                  <div className="select-wrapper">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort by">
                      <option value="recent">{t.recent}</option>
                      <option value="popular">{t.popular}</option>
                    </select>
                    <ChevronDown className="select-icon" />
                  </div>
                </div>
              </div>
            </section>

            <section className="gallery-section">
              <div className="pages-grid">
                {filteredPages.length > 0 ? (
                  filteredPages.map((page, index) => (
                    <div
                      key={page.id}
                      className="page-card"
                      ref={(el) => (cardsRef.current[index] = el)}
                      onMouseEnter={() => setHoveredCard(page.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => openPageDetail(page)}
                    >
                      <div className="card-image">
                        <img
                          src={page.preview || "/placeholder.svg"}
                          alt={page.title}
                          className={hoveredCard === page.id ? "zoom-effect" : ""}
                        />
                        <div className="overlay"></div>
                        <div className="card-date">
                          {new Date(page.date).toLocaleDateString(language === "fr" ? "fr-FR" : "mg-MG", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                        <div className="card-bookmark">
                          <Bookmark className="bookmark-icon" />
                        </div>
                      </div>
                      <div className="card-content">
                        <div className="card-meta">
                          <span className={`badge small emotion ${page.emotion}`}>{getEmotionLabel(page.emotion)}</span>
                          <span className="badge small type">{getTypeLabel(page.type)}</span>
                        </div>
                        <h3>{page.title}</h3>
                        <p className="author">Par {page.author}</p>

                        <div className="card-reactions">
                          <div
                            className={`card-reaction ${reactions[page.id]?.feel ? "active" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReaction(page.id, "feel")
                            }}
                          >
                            <MessageCircle className="reaction-icon" />
                            <span className="reaction-count">{getReactionCount(page.id, "feel")}</span>
                          </div>
                          <div
                            className={`card-reaction ${reactions[page.id]?.applaud ? "active" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReaction(page.id, "applaud")
                            }}
                          >
                            <Award className="reaction-icon" />
                            <span className="reaction-count">{getReactionCount(page.id, "applaud")}</span>
                          </div>
                          <div
                            className={`card-reaction ${reactions[page.id]?.laugh ? "active" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReaction(page.id, "laugh")
                            }}
                          >
                            <Sparkles className="reaction-icon" />
                            <span className="reaction-count">{getReactionCount(page.id, "laugh")}</span>
                          </div>
                          <div
                            className={`card-reaction ${reactions[page.id]?.support ? "active" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReaction(page.id, "support")
                            }}
                          >
                            <Heart className="reaction-icon" />
                            <span className="reaction-count">{getReactionCount(page.id, "support")}</span>
                          </div>
                        </div>

                        <div className="card-footer">
                          <div className="likes">
                            <Heart className="heart-icon" /> {page.likes}
                          </div>
                          <button
                            className="read-more-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              openPageDetail(page)
                            }}
                          >
                            {t.readMore}
                          </button>
                        </div>
                      </div>
                      <div className="card-shine"></div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <p>Aucun résultat trouvé</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )
      case "drama":
        return (
          <ApresFin/>
        )
      case "write":
        return (
          <Ecrire/>
        )
      default:
        return null
    }
  }

  return (
    <div className={`hall-container  ${darkMode ? "dark-mode" : "light-mode"}`} ref={containerRef}>
      {/* Custom cursor */}
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-dot" ref={cursorDotRef}></div>

      {/* Animated background */}
      <div className="stars-container">
        <div className="stars" ref={starsRef}></div>
      </div>

      {/* Portal Animation */}
      <div className={`portal-container ${portalOpen ? "open" : ""}`}>
        <div className="portal-ring outer"></div>
        <div className="portal-ring middle"></div>
        <div className="portal-ring inner"></div>
        <div className="portal-light"></div>
      </div>

      {/* Welcome message that fades in and out */}
      {!animationComplete && (
        <div className="welcome-message">
          <h1>Bienvenue dans le Hall des Fins</h1>
        
        </div>
      )}

      {/* Page detail portal */}
      {selectedPage && (
        <div className={`page-portal ${portalOpen ? "open" : ""}`} ref={portalRef}>
          <div className="portal-content">
            <button className="close-portal" onClick={closePortal}>
              ×
            </button>

           

            <div className="portal-body">
              <DernierFin/>
         
             </div>
          </div>
        </div>
      )}

      <header className="header -z-10">
        <div className="header-content">
          <div className="logo">
            <span className="logo-text">TheEnd</span>
            <span className="logo-dot">.</span>
            <span className="logo-page">page</span>
          </div>

          <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
            <ul>
              <li className={activeSection === "hall" ? "active" : ""}>
                <a href="#hall" className="nav-link">
                  <BookOpen className="nav-icon" />
                  <span>{t.menus.hall}</span>
                </a>
              </li>
              <li className={activeSection === "write" ? "active" : ""}>
                <a href="#write" className="nav-link">
                  <PenLine className="nav-icon" />
                  <span>{t.writeYourEnd}</span>
                </a>
              </li>
              <li className={activeSection === "drama" ? "active" : ""}>
                <a href="#drama" className="nav-link">
                  <BrainCircuit className="nav-icon" />
                  <span>{t.afterTheEnd}</span>
                </a>
              </li>
            </ul>
          </nav>

          <div className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </div>

          <div className="controls">
            <button className="search-toggle" onClick={toggleSearch} aria-label="Toggle search">
              <Search className="control-icon" />
            </button>
            <button
              className="language-toggle"
              onClick={() => setLanguage(language === "fr" ? "mg" : "fr")}
              aria-label="Toggle language"
            >
              {language === "fr" ? "MG" : "FR"}
            </button>
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
              {darkMode ? <Sun className="control-icon" /> : <Moon className="control-icon" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className={`search-bar ${showSearch ? "open" : ""}`}>
          <input
            id="search-input"
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-close" onClick={toggleSearch}>
            ✕
          </button>
        </div>
      </header>

      <main>{renderContent()}</main>

      <footer>
        <div className="footer-content">
          <div className="footer-top">
            <div className="logo">
              <span className="logo-text">TheEnd</span>
              <span className="logo-dot">.</span>
              <span className="logo-page">page</span>
            </div>
            <div className="footer-nav">
              <a href="#hall">{t.menus.hall}</a>
              <a href="#write">{t.writeYourEnd}</a>
              <a href="#drama">{t.afterTheEnd}</a>
            </div>
          </div>
          <div className="footer-divider"></div>
          <p>&copy; 2025 TheEnd.page - {t.footer}</p>
        </div>
      </footer>

      <div className={`test-menu ${testMenuVisible ? "visible" : ""}`}>
        <div className="test-menu-header">
          <h3 className="test-menu-title">Tester votre fin</h3>
          <button className="test-menu-close" onClick={() => setTestMenuVisible(false)}>
            ×
          </button>
        </div>

        <div className="test-menu-content">
          <div className="test-option">
            <Palette className="test-option-icon" />
            <span className="test-option-label">Émotion</span>
            <div className="select-wrapper" style={{ marginLeft: "auto" }}>
              <select
                value={testOptions.emotion}
                onChange={(e) => handleTestOptionChange("emotion", e.target.value)}
                aria-label="Émotion"
              >
                <option value="humour">Humour</option>
                <option value="tristesse">Tristesse</option>
                <option value="rage">Colère</option>
                <option value="nostalgie">Nostalgie</option>
              </select>
              <ChevronDown className="select-icon" />
            </div>
          </div>

          <div className="test-option">
            <Type className="test-option-icon" />
            <span className="test-option-label">Type</span>
            <div className="select-wrapper" style={{ marginLeft: "auto" }}>
              <select
                value={testOptions.type}
                onChange={(e) => handleTestOptionChange("type", e.target.value)}
                aria-label="Type"
              >
                <option value="démission">Démission</option>
                <option value="rupture">Rupture</option>
                <option value="départ">Départ</option>
              </select>
              <ChevronDown className="select-icon" />
            </div>
          </div>

          <div className="test-option">
            <Zap className="test-option-icon" />
            <span className="test-option-label">Style</span>
            <div className="select-wrapper" style={{ marginLeft: "auto" }}>
              <select
                value={testOptions.style}
                onChange={(e) => handleTestOptionChange("style", e.target.value)}
                aria-label="Style"
              >
                <option value="standard">Standard</option>
                <option value="poétique">Poétique</option>
                <option value="formel">Formel</option>
                <option value="informel">Informel</option>
              </select>
              <ChevronDown className="select-icon" />
            </div>
          </div>

          <div className="test-option">
            <Settings className="test-option-icon" />
            <span className="test-option-label">Police</span>
            <div className="select-wrapper" style={{ marginLeft: "auto" }}>
              <select
                value={testOptions.font}
                onChange={(e) => handleTestOptionChange("font", e.target.value)}
                aria-label="Police"
              >
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans-serif</option>
                <option value="monospace">Monospace</option>
              </select>
              <ChevronDown className="select-icon" />
            </div>
          </div>
        </div>

        <div className="test-menu-footer">
          <button className="test-preview-btn" onClick={previewTestEnd}>
            <Eye size={16} />
            <span>Prévisualiser</span>
          </button>
        </div>
      </div>

      {/* Ajouter ce bouton flottant juste avant la fermeture de la div hall-container */}
      {activeSection === "hall" && (
        <button
          className="test-preview-btn"
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
          }}
        >
          <Eye size={16} />
          <span>Tester ma fin</span>
        </button>
        
      )}
      <ChatBotTheEnd/>
    </div>
  )
}

export default HallDesFins
