"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion"
import {
  DoorClosed,
  Flame,
  Heart,
  Briefcase,
  Users,
  MessageSquareOff,
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  Share2,
  ExternalLink,
  Sparkles,
} from "lucide-react"

// Types de départ et leurs icônes associées
const exitTypes = {
  job: { name: "Démission", icon: <Briefcase className="h-5 w-5" /> },
  project: { name: "Fin de projet", icon: <Flame className="h-5 w-5" /> },
  relationship: { name: "Rupture", icon: <Heart className="h-5 w-5" /> },
  team: { name: "Départ d'équipe", icon: <Users className="h-5 w-5" /> },
  social: { name: "Quitter un réseau", icon: <MessageSquareOff className="h-5 w-5" /> },
}

// Tons de départ
const exitTones = {
  dramatic: "Dramatique",
  ironic: "Ironique",
  cringe: "Ultra cringe",
  classy: "Classe",
  touching: "Touchant",
  absurd: "Absurde",
  passive: "Passif-agressif",
  honest: "Honnête",
}

// Données de témoignages
const testimonials = [
  {
    id: 1,
    name: "Sophie L.",
    avatar: "https://res.cloudinary.com/dysrhzaib/image/upload/v1747526404/Avatar_1_hoxl0f.png",
    exitType: "job",
    exitTone: "dramatic",
    content:
      "Après 5 ans de loyaux services, j'ai enfin pu dire à mon patron ce que je pensais vraiment. TheEnd.page m'a permis de claquer la porte avec style et de partager mon histoire avec tous mes collègues. Libération totale !",
    impact: 4.8,
    views: 12453,
    shares: 342,
    featured: true,
  },
  {
    id: 2,
    name: "Thomas M.",
    avatar: "https://res.cloudinary.com/dysrhzaib/image/upload/v1747526404/Avatar_2_az4afr.png",
    exitType: "relationship",
    exitTone: "ironic",
    content:
      "Quand j'ai découvert que ma copine me trompait, j'ai créé une page sur TheEnd.page pleine d'ironie. Elle l'a partagée elle-même sans comprendre que c'était à propos d'elle... jusqu'à ce que tous ses amis lui expliquent. Chef d'œuvre !",
    impact: 4.9,
    views: 28764,
    shares: 1203,
    featured: true,
  },
  {
    id: 3,
    name: "Julien D.",
    avatar: "https://res.cloudinary.com/dysrhzaib/image/upload/v1747526404/Avatar_2_az4afr.png",
    exitType: "project",
    exitTone: "classy",
    content:
      "Notre startup a échoué après 2 ans de travail acharné. J'ai utilisé TheEnd.page pour créer un post-mortem élégant qui explique ce que nous avons appris. Résultat : trois investisseurs m'ont contacté pour mon prochain projet !",
    impact: 4.7,
    views: 8932,
    shares: 215,
    featured: false,
  },
  {
    id: 4,
    name: "Emma R.",
    avatar: "https://res.cloudinary.com/dysrhzaib/image/upload/v1747526404/Avatar_1_hoxl0f.png",
    exitType: "social",
    exitTone: "absurd",
    content:
      "Quitter Twitter était nécessaire pour ma santé mentale, mais je voulais partir avec un bang. Ma page TheEnd était si absurde qu'elle est devenue virale. Ironiquement, c'est la chose la plus populaire que j'ai jamais postée !",
    impact: 4.6,
    views: 31254,
    shares: 2845,
    featured: true,
  },
  {
    id: 5,
    name: "Alexandre B.",
    avatar: "https://res.cloudinary.com/dysrhzaib/image/upload/v1747526404/Avatar_2_az4afr.png",
    exitType: "team",
    exitTone: "touching",
    content:
      "Après 10 ans dans la même équipe sportive, la blessure m'a forcé à arrêter. TheEnd.page m'a permis de créer un hommage émouvant à mes coéquipiers. Il y avait des larmes dans les vestiaires quand ils l'ont lu ensemble.",
    impact: 5.0,
    views: 7621,
    shares: 189,
    featured: false,
  },
  {
    id: 6,
    name: "Léa K.",
    avatar: "https://res.cloudinary.com/dysrhzaib/image/upload/v1747526404/Avatar_1_hoxl0f.png",
    exitType: "job",
    exitTone: "passive",
    content:
      "Mon manager toxique m'a poussée à bout pendant des années. Ma page de départ passive-agressive a été partagée dans toute l'entreprise et a déclenché une enquête interne. Trois mois plus tard, il a été licencié !",
    impact: 4.9,
    views: 19872,
    shares: 876,
    featured: true,
  },
]

const TestimonialsSection = (language,darkMode) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [autoplay, setAutoplay] = useState(true)
  const [hasAnimated, setHasAnimated] = useState(false)
  
  // Références pour l'animation au scroll
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 }) // Déclenche quand 15% de la section est visible

  // Contrôles d'animation
  const titleControls = useAnimation()
  const subtitleControls = useAnimation()
  const carouselControls = useAnimation()
  const featuredControls = useAnimation()
  const particleControls = useAnimation()

  // Filtrer les témoignages mis en avant
  const featuredTestimonials = testimonials.filter((t) => t.featured)
  const regularTestimonials = testimonials.filter((t) => !t.featured)

  // Gérer l'autoplay du carrousel
  useEffect(() => {
    let interval
    if (autoplay) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % regularTestimonials.length)
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [autoplay, regularTestimonials.length])

  // Déclencher les animations lorsque la section est visible
  useEffect(() => {
    if (isInView && !hasAnimated) {
      const runAnimations = async () => {
        // Animation du titre
        await titleControls.start({
          y: [50, 0],
          opacity: [0, 1],
          transition: { duration: 0.8, ease: "easeOut" },
        })

        // Animation du sous-titre
        await subtitleControls.start({
          y: [30, 0],
          opacity: [0, 1],
          transition: { duration: 0.6, ease: "easeOut" },
        })

        // Animation des témoignages mis en avant
        await featuredControls.start((i) => ({
          scale: [0.8, 1],
          opacity: [0, 1],
          transition: {
            duration: 0.5,
            delay: i * 0.2,
            ease: "easeOut",
          },
        }))

        // Animation du carrousel
        await carouselControls.start({
          x: [100, 0],
          opacity: [0, 1],
          transition: { duration: 0.7, ease: "easeOut" },
        })

        // Animation des particules
        particleControls.start({
          scale: [0, 1],
          opacity: [0, 0.8],
          transition: {
            duration: 0.3,
            staggerChildren: 0.05,
          },
        })
      }

      runAnimations()
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated, titleControls, subtitleControls, carouselControls, featuredControls, particleControls])

 

  // Générer des particules pour l'effet de flamme
  const renderParticles = (count = 15, originX = "50%", originY = "100%") => {
    return Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={`particle-${i}`}
        custom={i}
        animate={particleControls}
        initial={{ opacity: 0, scale: 0 }}
        className={`absolute w-1 h-1 rounded-full ${
          i % 3 === 0 ? "bg-red-500" : i % 3 === 1 ? "bg-orange-500" : "bg-yellow-500"
        }`}
        style={{
          left: originX,
          bottom: originY,
        }}
        variants={{
          animate: (i) => ({
            y: [-10, -50 - Math.random() * 100],
            x: [0, Math.random() * 100 - 50],
            opacity: [0.7, 0],
            scale: [Math.random() * 0.5 + 0.5, 0],
            transition: {
              duration: 1 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              delay: Math.random() * 2,
            },
          }),
        }}
      />
    ))
  }

  // Rendu de l'icône du type de départ
  const renderExitTypeIcon = (type) => {
    return exitTypes[type]?.icon || <DoorClosed className="h-5 w-5" />
  }

  // Effet de flamme pour les cartes
  const renderCardFlames = (id) => {
    if (hoveredCard !== id) return null

    return (
      <div className="absolute -bottom-2 left-0 right-0 h-10 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`flame-${id}-${i}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [-5, -30], opacity: [0.8, 0] }}
            transition={{
              duration: 0.8 + Math.random() * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              delay: Math.random() * 0.5,
            }}
            className={`absolute bottom-0 rounded-full ${
              i % 3 === 0 ? "bg-red-500" : i % 3 === 1 ? "bg-orange-500" : "bg-yellow-500"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 15 + 5}px`,
            }}
          />
        ))}
      </div>
    )
  }
  const Traduction = (francais , anglais, malagasy) => {
    switch (language.language) {
      case "fr":
        return francais;
      case "en":
        return anglais;
      case "mg":
        return malagasy;
      default:
        return francais;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20  text-white overflow-hidden"
    >
      {/* Effet de texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url('data:image/svg+xml;charset=utf-8,%3Csvg viewBox=%220 0 100 100%22 xmlns=%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.15%22 numOctaves=%222%22 stitchTiles=%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url%28%23noise%29%22 opacity=%220.4%22%2F%3E%3C%2Fsvg%3E')`,
        }}
      />

      {/* Effet de porte qui s'ouvre */}
      <AnimatePresence>
        {isInView && !hasAnimated && (
          <>
            <motion.div
              className="absolute inset-0 bg-black z-20"
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ transformOrigin: "bottom" }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-30"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Quote size={80} className="text-red-500" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 relative z-10">
        {/* Titre et sous-titre */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400"
            animate={titleControls}
            initial={{ y: 50, opacity: 0 }}
          >
           {
            Traduction("Ils ont claqué la porte avec style","They slammed the door in style","Nokapohin'izy ireo tamin'ny fomba feno ny varavarana")
           }
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            animate={subtitleControls}
            initial={{ y: 30, opacity: 0 }}
          >
            Découvrez comment nos utilisateurs ont transformé leurs fins en nouveaux départs mémorables.
          </motion.p>
        </div>

        {/* Témoignages mis en avant */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              custom={index}
              animate={featuredControls}
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              onHoverStart={() => setHoveredCard(testimonial.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className={`relative  ${language.darkMode ? 'bg-gradient-to-br from-gray-100 to-gray-200 ':'bg-gradient-to-br from-gray-800 to-gray-900'} border-0 rounded-xl overflow-hidden shadow-xl border border-gray-700 p-6 flex flex-col h-full transform transition-all duration-300`}
            >
              {/* Badge de type de départ */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-900/50 text-red-300`}
                >
                  <span className="mr-1">{renderExitTypeIcon(testimonial.exitType)}</span>
                  {exitTypes[testimonial.exitType]?.name}
                </span>
              </div>

              {/* Avatar et nom */}
              <div className="flex items-center mb-4">
                <div className="relative mr-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-700">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <motion.div
                    className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Flame className="h-3 w-3 text-white" />
                  </motion.div>
                </div>
                <div>
                  <h3 className={`${language.darkMode? 'text-gray-900':'text-gray-300'}  relative `}>{testimonial.name}</h3>
                  <p className="text-sm text-gray-400">Ton: {exitTones[testimonial.exitTone]}</p>
                </div>
              </div>

              {/* Contenu du témoignage */}
              <div className="relative mb-4 flex-grow">
                <Quote className="absolute top-0 left-0 h-6 w-6 text-red-500/20 -translate-x-2 -translate-y-2" />
                <p className={`${language.darkMode? 'text-gray-900':'text-gray-300'} italic relative z-10`}>{testimonial.content}</p>
              </div>

              {/* Statistiques */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(testimonial.impact)
                          ? "text-yellow-500"
                          : i < testimonial.impact
                            ? "text-yellow-500/50"
                            : "text-gray-600"
                      }`}
                      fill={i < Math.floor(testimonial.impact) ? "currentColor" : "none"}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-400">{testimonial.impact.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <span className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {testimonial.views.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <Share2 className="h-3 w-3 mr-1" />
                    {testimonial.shares.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Bouton voir */}
              <motion.button
                className="mt-6 w-full py-2 bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-500 hover:to-red-400 text-white rounded-lg flex items-center justify-center group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Voir cette page</span>
                <ExternalLink className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Effet de flamme au survol */}
              {renderCardFlames(testimonial.id)}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Effet de particules flottantes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {renderParticles(30, "30%", "30%")}
        {renderParticles(30, "70%", "60%")}
      </div>

      {/* Effet de flamme au bas de la section */}
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-700 via-orange-500 to-red-700"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>
    </section>
  )
}

export default TestimonialsSection
