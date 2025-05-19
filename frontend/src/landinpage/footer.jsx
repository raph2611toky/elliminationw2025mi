"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion"
import {
  DoorClosed,
  Flame,
  Heart,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  MessageSquareOff,
  Briefcase,
  Users,
  ChevronUp,
} from "lucide-react"

const Footer = () => {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [hoverEffect, setHoverEffect] = useState(null)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [notification, setNotification] = useState("");

  // Références pour l'animation au scroll
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: true, amount: 0.15 }) // Déclenche quand 15% du footer est visible

  // Contrôles d'animation pour différentes sections
  const mainControls = useAnimation()
  const flameControls = useAnimation()
  const columnControls = useAnimation()
  const separatorControls = useAnimation()
  const particleControls = useAnimation()

  // Détecter le défilement pour afficher le bouton de retour en haut
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Déclencher les animations lorsque le footer est visible
  useEffect(() => {
    if (isInView && !hasAnimated) {
      // Séquence d'animation
      const runAnimations = async () => {
        // Animation de la ligne de flamme supérieure
        await flameControls.start({
          scaleX: [0, 1],
          opacity: [0, 1],
          transition: { duration: 0.8, ease: "easeOut" },
        })

        // Animation du contenu principal
        await mainControls.start({
          y: [100, 0],
          opacity: [0, 1],
          transition: { duration: 0.5, ease: "easeOut" },
        })

        // Animation des colonnes en séquence
        await columnControls.start((i) => ({
          opacity: [0, 1],
          y: [50, 0],
          transition: {
            duration: 0.4,
            delay: i * 0.15,
            ease: "easeOut",
          },
        }))

        // Animation du séparateur
        await separatorControls.start({
          scaleX: [0, 1],
          opacity: [0, 1],
          transition: { duration: 0.5 },
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
  }, [isInView, hasAnimated, mainControls, flameControls, columnControls, separatorControls, particleControls])

  // Gérer la soumission du formulaire d'abonnement
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setEmailError("L'email est requis")
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email invalide")
      return
    }

    // Simuler l'envoi
    setEmailError("")
    setIsSubscribed(true)
    setTimeout(() => setIsSubscribed(false), 3000)
    setEmail("")
  }

  // Gérer le clic sur le logo pour l'easter egg
  const handleLogoClick = () => {
    setClickCount((prev) => prev + 1)
    if (clickCount >= 4) {
      setShowEasterEgg(true)
      setTimeout(() => {
        setShowEasterEgg(false)
        setClickCount(0)
      }, 5000)
    }
  }

  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Générer des particules aléatoires pour l'effet de flamme
  const renderParticles = () => {
    return Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        custom={i}
        animate={particleControls}
        initial={{ opacity: 0, scale: 0 }}
        className="absolute w-1 h-1 rounded-full bg-red-500"
        style={{
          left: `${Math.random() * 100}%`,
          bottom: 0,
        }}
        variants={{
          animate: (i) => ({
            y: [-10, -100 - Math.random() * 100],
            x: [0, Math.random() * 60 - 30],
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

  // Effet de flamme intense
  const renderIntenseFlames = () => {
    return Array.from({ length: 30 }).map((_, i) => (
      <motion.div
        key={`flame-${i}`}
        custom={i}
        animate={particleControls}
        className={`absolute bottom-0 rounded-full ${
          i % 3 === 0 ? "bg-red-500" : i % 3 === 1 ? "bg-orange-500" : "bg-yellow-500"
        }`}
        style={{
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 8 + 2}px`,
          height: `${Math.random() * 8 + 2}px`,
        }}
        variants={{
          animate: (i) => ({
            y: [0, -50 - Math.random() * 100],
            x: [0, Math.random() * 40 - 20],
            opacity: [0.8, 0],
            scale: [Math.random() * 1 + 0.5, 0],
            transition: {
              duration: 1 + Math.random() * 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              delay: Math.random() * 2,
            },
          }),
        }}
      />
    ))
  }

  return (
    <footer ref={footerRef} className="relative bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Effet de texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url('data:image/svg+xml;charset=utf-8,%3Csvg viewBox=%220 0 100 100%22 xmlns=%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.15%22 numOctaves=%222%22 stitchTiles=%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url%28%23noise%29%22 opacity=%220.4%22%2F%3E%3C%2Fsvg%3E')`,
        }}
      />

      {/* Ligne de séparation animée au top */}
      <motion.div
        className="relative h-1 w-full overflow-hidden"
        animate={flameControls}
        initial={{ scaleX: 0, opacity: 0 }}
        style={{ transformOrigin: "left" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-orange-500 to-red-700 animate-pulse" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
          animate={{
            x: ["100%", "-100%"],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 3,
            ease: "linear",
          }}
        />
      </motion.div>

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
              <DoorClosed size={80} className="text-red-500" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contenu principal du footer */}
      <motion.div
        className="container mx-auto px-4 py-12 relative z-10"
        animate={mainControls}
        initial={{ y: 100, opacity: 0 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Première colonne - À propos */}
          <motion.div className="space-y-6" custom={0} animate={columnControls} initial={{ opacity: 0, y: 50 }}>
            <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
              <motion.div className="relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <DoorClosed className="h-8 w-8 text-red-500 mr-2" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">{renderParticles()}</div>
              </motion.div>
              <motion.span
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                TheEnd.page
              </motion.span>
            </div>

            <p className="text-gray-400">Parce que si c'est la fin, autant la rendre inoubliable... et cliquable.</p>

            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Deuxième colonne - Liens rapides */}
          <motion.div custom={1} animate={columnControls} initial={{ opacity: 0, y: 50 }}>
            <h3 className="text-lg font-semibold mb-4 text-red-400">Liens rapides</h3>
            <ul className="space-y-3">
              {[
                { name: "Accueil", href: "#" },
                { name: "Comment ça marche", href: "#" },
                { name: "Exemples", href: "#" },
                { name: "Tarifs", href: "#" },
                { name: "FAQ", href: "#" },
              ].map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <motion.a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                    whileHover={{ x: 5 }}
                    onHoverStart={() => setHoverEffect(link.name)}
                    onHoverEnd={() => setHoverEffect(null)}
                  >
                    <span>{link.name}</span>
                    <motion.span
                      animate={{
                        x: hoverEffect === link.name ? [0, 5, 0] : 0,
                        opacity: hoverEffect === link.name ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="ml-2"
                    >
                      <ArrowRight size={14} className="text-red-500" />
                    </motion.span>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Troisième colonne - Types de départ */}
          <motion.div custom={2} animate={columnControls} initial={{ opacity: 0, y: 50 }}>
            <h3 className="text-lg font-semibold mb-4 text-red-400">Types de départ</h3>
            <ul className="space-y-3">
              {[
                { name: "Démission", icon: <Briefcase size={16} /> },
                { name: "Fin de projet", icon: <Flame size={16} /> },
                { name: "Rupture amoureuse", icon: <Heart size={16} /> },
                { name: "Quitter une équipe", icon: <Users size={16} /> },
                { name: "Quitter un réseau", icon: <MessageSquareOff size={16} /> },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <motion.span
                      className="mr-2 text-red-500"
                      whileHover={{
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.2, 1.2, 1.2, 1],
                        transition: { duration: 0.5 },
                      }}
                    >
                      {item.icon}
                    </motion.span>
                    <span>{item.name}</span>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Quatrième colonne - Newsletter */}
          <motion.div custom={3} animate={columnControls} initial={{ opacity: 0, y: 50 }}>
            <h3 className="text-lg font-semibold mb-4 text-red-400">Restez informé</h3>
            <p className="text-gray-400 mb-4">
              Recevez nos dernières mises à jour et nos meilleurs exemples de départs mémorables.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) setEmailError("")
                  }}
                  placeholder="Votre email"
                  className="w-full pl-10 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-500"
                />
              </div>

              {emailError && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertTriangle size={14} className="mr-1" />
                  {emailError}
                </p>
              )}

              <motion.button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center overflow-hidden relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                    e.preventDefault();
                    setNotification("Actuellement, nous n'avons pas de mises à jour disponibles. Désolé !");
                    setTimeout(() => setNotification(""), 5000);
                    }}
              >
                <motion.span
                  initial={{ y: 0 }}
                  whileHover={{ y: -30 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center absolute"
                >
                  S'abonner
                  <ArrowRight size={26} className="ml-2" />
                </motion.span>
              </motion.button>
             
                {notification && (
                <div className="mt-2 text-yellow-500 text-sm flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    {notification}
                </div>
                )}

              <AnimatePresence>
                {isSubscribed && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-green-500 text-sm flex items-center"
                  >
                    <Sparkles size={14} className="mr-1" />
                    Merci pour votre inscription !
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>

        {/* Séparateur animé */}
        <motion.div
          className="my-8 h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent relative overflow-hidden"
          animate={separatorControls}
          initial={{ scaleX: 0, opacity: 0 }}
          style={{ transformOrigin: "center" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 5,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* Bas de page */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} TheEnd.page. Tous droits réservés.</div>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="hover:text-red-400 transition-colors">
              Mentions légales
            </a>
            <a href="#" className="hover:text-red-400 transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="hover:text-red-400 transition-colors">
              CGU
            </a>
            <a href="#" className="hover:text-red-400 transition-colors">
              Contact
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Bouton de retour en haut */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-red-600 text-white rounded-full shadow-lg z-50 hover:bg-red-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Easter egg */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-black/80 p-8 rounded-lg max-w-md text-center">
              <Flame size={60} className="mx-auto mb-4 text-red-500" />
              <h3 className="text-2xl font-bold text-red-400 mb-2">Mode Rage Activé!</h3>
              <p className="text-gray-300">
                Vous avez découvert le mode secret. Votre page de départ sera 10x plus dramatique!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Effet de flamme intense au bas du footer */}
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
        {renderIntenseFlames()}
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
    </footer>
  )
}

export default Footer
