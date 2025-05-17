import React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Lock, Mail, Eye, EyeOff, Sun, Moon, Globe, Shield, Sparkles, ChevronDown, Check, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function Authentification() {
  // États
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState("fr")
  const [showPassword, setShowPassword] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "male",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)

  // Fonction de traduction
  const Traduction = (francais, anglais, malagasy) => {
    switch (language) {
      case "fr":
        return francais
      case "en":
        return anglais
      case "mg":
        return malagasy
      default:
        return francais
    }
  }

  // Noms des langues
  const languages = [
    { code: "fr", name: "Français" },
    { code: "en", name: "English" },
    { code: "mg", name: "Malagasy" },
  ]

  // Gestion des changements de champs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  // Gestion de la vérification reCAPTCHA
  const handleRecaptchaChange = (value) => {
    setRecaptchaVerified(!!value)
    if (errors.recaptcha) {
      setErrors((prev) => ({
        ...prev,
        recaptcha: undefined,
      }))
    }
  }

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {}

    // Validation du pseudo
    if (!formData.username.trim()) {
      newErrors.username = Traduction("Le pseudo est requis", "Username is required", "Ilaina ny anarana famantarana")
    } else if (formData.username.length < 3) {
      newErrors.username = Traduction(
        "Le pseudo doit contenir au moins 3 caractères",
        "Username must be at least 3 characters",
        "Ny anarana famantarana dia tokony ahitana litera 3 farafahakeliny"
      )
    }

    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = Traduction("L'email est requis", "Email is required", "Ilaina ny mailaka")
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = Traduction(
        "Veuillez entrer une adresse email valide",
        "Please enter a valid email address",
        "Ampidiro adiresy mailaka marina"
      )
    }

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = Traduction("Le mot de passe est requis", "Password is required", "Ilaina ny tenimiafina")
    } else if (formData.password.length < 6) {
      newErrors.password = Traduction(
        "Le mot de passe doit contenir au moins 6 caractères",
        "Password must be at least 6 characters",
        "Ny tenimiafina dia tokony ahitana litera 6 farafahakeliny"
      )
    }

    // Validation reCAPTCHA
    if (!recaptchaVerified) {
      newErrors.recaptcha = Traduction(
        "Veuillez vérifier que vous n'êtes pas un robot",
        "Please verify that you are not a robot",
        "Hamafiso fa tsy robot ianao"
      )
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)

      // Simuler une requête API
      setTimeout(() => {
        setIsSubmitting(false)
        setIsSuccess(true)
        

        // Réinitialiser le succès après 3 secondes
         setTimeout(() => {
          setIsSuccess(false)
          setFormData({
            username: "",
            email: "",
            password: "",
            gender: "male",
          })
          setRecaptchaVerified(false)
        }, 2000)

        alert("redirecton")
      }, 1500)
    }
  }

  // Fermer le menu de langue si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuOpen && !event.target.closest(".lang-menu")) {
        setLangMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [langMenuOpen])

  // Charger le script reCAPTCHA
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js"
    script.async = true
    document.body.appendChild(script)

    window.recaptchaCallback = (value) =>{
      handleRecaptchaChange(value)
    }
    return () => {
      document.body.removeChild(script)
    }
  }, [handleRecaptchaChange])

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        darkMode ? "bg-slate-900 text-amber-100" : "bg-amber-50 text-amber-900"
      }`}
    >
      {/* Effet de texture de parchemin sur tout le fond */}
      <div
        className={`fixed inset-0 opacity-30 pointer-events-none ${
          darkMode
            ? "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-indigo-900/20"
            : "bg-gradient-to-br from-amber-100 via-amber-50 to-amber-100 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-amber-200/20"
        }`}
      ></div>

      {/* Éléments décoratifs flottants */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-[10%]"
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          <Shield size={40} className={`${darkMode ? "text-amber-500/20" : "text-amber-700/20"}`} />
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-[5%]"
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 1 }}
        >
          <Sparkles size={36} className={`${darkMode ? "text-amber-500/20" : "text-amber-700/20"}`} />
        </motion.div>
      </div>

      {/* Particules flottantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full ${darkMode ? "bg-amber-400/40" : "bg-amber-600/40"}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 0.8, 0],
              scale: [0, Math.random() * 0.5 + 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Conteneur principal */}
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Contrôles de thème et langue */}
        <div className="flex justify-end mb-4 space-x-2">
          {/* Bouton de changement de mode */}
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-slate-700 text-amber-200 hover:bg-slate-600"
                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
            } transition-colors duration-200`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          {/* Bouton de changement de langue */}
          <div className="relative lang-menu">
            <motion.button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className={`flex items-center px-3 py-2 rounded-md ${
                darkMode
                  ? "bg-slate-700 text-amber-100 hover:bg-slate-600"
                  : "bg-amber-100 text-amber-800 hover:bg-amber-200"
              } transition-colors duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe size={18} className="mr-1" />
              <span className="uppercase mr-1">{language}</span>
              <ChevronDown size={16} />
            </motion.button>

            <AnimatePresence>
              {langMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg ${
                    darkMode ? "bg-slate-700" : "bg-amber-100"
                  } ring-1 ring-black ring-opacity-5 z-50`}
                >
                  <div className="py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code)
                          setLangMenuOpen(false)
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          language === lang.code
                            ? darkMode
                              ? "bg-slate-600 text-amber-100"
                              : "bg-amber-200 text-amber-900"
                            : darkMode
                              ? "text-amber-100 hover:bg-slate-600"
                              : "text-amber-900 hover:bg-amber-200"
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Carte du formulaire */}
        <motion.div
          className={`relative rounded-xl overflow-hidden ${
            darkMode
              ? "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border border-slate-600"
              : "bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 border border-amber-200"
          } shadow-2xl`}
          style={{
            backgroundImage: `url('data:image/svg+xml;charset=utf-8,%3Csvg viewBox=%220 0 100 100%22 xmlns=%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.15%22 numOctaves=%222%22 stitchTiles=%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url%28%23noise%29%22 opacity=%220.1%22%2F%3E%3C%2Fsvg%3E')`,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Sceau décoratif */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                darkMode ? "bg-amber-500" : "bg-amber-700"
              }`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Shield size={24} className={darkMode ? "text-slate-900" : "text-amber-100"} />
            </motion.div>
          </div>

          {/* Contenu du formulaire */}
          <div className="p-8 pt-10">
            {/* Titre */}
            <div className="text-center mb-8">
              <motion.h2
                className={`text-3xl font-serif mb-2 ${darkMode ? "text-amber-200" : "text-amber-900"}`}
                style={{ fontFamily: "Cormorant", fontWeight: "700", fontStyle: "italic" }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {Traduction("Rejoignez l'Aventure", "Join the Adventure", "Midira amin'ny Fialan-tsasatra")}
              </motion.h2>
              <motion.p
                className={`${darkMode ? "text-amber-300/80" : "text-amber-800/80"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{  steel :0.5, delay: 0.4 }}
              >:
                {Traduction(
                  "Créez votre compte pour commencer votre quête",
                  "Create your account to begin your quest",
                  "Mamorona kaonty hanombohana ny dianao"
                )}
              </motion.p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit}>
              {/* Champ Pseudo */}
              <div className="mb-5">
                <label
                  htmlFor="username"
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-amber-200" : "text-amber-800"}`}
                >
                  {Traduction("Pseudo", "Username", "Anarana famantarana")}
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                      darkMode ? "text-amber-400" : "text-amber-700"
                    }`}
                  >
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-slate-700 border-slate-600 text-amber-100 placeholder:text-amber-400/50"
                        : "bg-white border-amber-200 text-amber-900 placeholder:text-amber-700/50"
                    } border focus:outline-none focus:ring-2 ${
                      darkMode ? "focus:ring-amber-500/50" : "focus:ring-amber-700/50"
                    } ${errors.username ? (darkMode ? "border-red-500" : "border-red-500") : ""}`}
                    placeholder={Traduction("Votre pseudo", "Your username", "Ny anarana famantaranao")}
                  />
                  {errors.username && (
                    <motion.p
                      className="mt-1 text-sm text-red-500 flex items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle size={14} className="mr-1" />
                      {errors.username}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Champ Email */}
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-amber-200" : "text-amber-800"}`}
                >
                  {Traduction("Email", "Email", "Mailaka")}
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                      darkMode ? "text-amber-400" : "text-amber-700"
                    }`}
                  >
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-slate-700 border-slate-600 text-amber-100 placeholder:text-amber-400/50"
                        : "bg-white border-amber-200 text-amber-900 placeholder:text-amber-700/50"
                    } border focus:outline-none focus:ring-2 ${
                      darkMode ? "focus:ring-amber-500/50" : "focus:ring-amber-700/50"
                    } ${errors.email ? (darkMode ? "border-red-500" : "border-red-500") : ""}`}
                    placeholder={Traduction("Votre email", "Your email", "Ny mailakao")}
                  />
                  {errors.email && (
                    <motion.p
                      className="mt-1 text-sm text-red-500 flex items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle size={14} className="mr-1" />
                      {errors.email}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-amber-200" : "text-amber-800"}`}
                >
                  {Traduction("Mot de passe", "Password", "Tenimiafina")}
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                      darkMode ? "text-amber-400" : "text-amber-700"
                    }`}
                  >
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-slate-700 border-slate-600 text-amber-100 placeholder:text-amber-400/50"
                        : "bg-white border-طیفamber-200 text-amber-900 placeholder:text-amber-700/50"
                    } border focus:outline-none focus:ring-2 ${
                      darkMode ? "focus:ring-amber-500/50" : "focus:ring-amber-700/50"
                    } ${errors.password ? (darkMode ? "border-red-500" : "border-red-500") : ""}`}
                    placeholder={Traduction("Votre mot de passe", "Your password", "Ny tenimiafinao")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                      darkMode ? "text-amber-400" : "text-amber-700"
                    }`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.password && (
                    <motion.p
                      className="mt-1 text-sm text-red-500 flex items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle size={14} className="mr-1" />
                      {errors.password}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Champ Sexe */}
              <div className="mb-6">
                <label
                  htmlFor="gender"
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-amber-200" : "text-amber-800"}`}
                >
                  {Traduction("Sexe", "Gender", "Lahy sa vavy")}
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleChange}
                      className={`mr-2 ${
                        darkMode ? "text-amber-500 border-slate-600" : "text-amber-700 border-amber-200"
                      }`}
                    />
                    <span className={darkMode ? "text-amber-200" : "text-amber-800"}>
                      {Traduction("Homme", "Male", "Lahy")}
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleChange}
                      className={`mr-2 ${
                        darkMode ? "text-amber-500 border-slate-600" : "text-amber-700 border-amber-200"
                      }`}
                    />
                    <span className={darkMode ? "text-amber-200" : "text-amber-800"}>
                      {Traduction("Femme", "Female", "Vavy")}
                    </span>
                  </label>
                </div>
              </div>

              {/* reCAPTCHA */}
              <div className="mb-6">
                <div
                  className="g-recaptcha"
                  data-sitekey="6LfV5z0rAAAAAMciyH24vgr4ACjZe251DmipcB4U"
                  data-callback="recaptchaCallback"
                ></div>
                {errors.recaptcha && (
                  <motion.p
                    className="mt-1 text-sm text-red-500 flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle size={14} className="mr-1" />
                    {errors.recaptcha}
                  </motion.p>
                )}
              </div>

              {/* Bouton de soumission */}
              <motion.button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-medium text-lg flex items-center justify-center ${
                  darkMode
                    ? "bg-amber-500 text-slate-900 hover:bg-amber-400"
                    : "bg-amber-700 text-amber-50 hover:bg-amber-600"
                } shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {Traduction("Inscription en cours...", "Signing up...", "Fanoratana anarana...")}
                  </div>
                ) : (
                  Traduction("S'inscrire", "Sign Up", "Hisoratra anarana")
                )}
              </motion.button>

              {/* Message de succès */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    className={`mt-4 p-3 rounded-lg flex items-center ${
                      darkMode ? "bg-green-900/50 text-green-200" : "bg-green-100 text-green-800"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Check size={18} className="mr-2 flex-shrink-0" />
                    <span>
                      {Traduction(
                        "Inscription réussie ! Bienvenue dans l'aventure.",
                        "Registration successful! Welcome to the adventure.",
                        "Vita soa aman-tsara ny fanoratana anarana! Tongasoa amin'ny fialan-tsasatra."
                      )}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Lien de connexion */}
            <div className="mt-6 text-center">
              <p className={darkMode ? "text-amber-300/80" : "text-amber-800/80"}>
                {Traduction("Déjà un compte ?", "Already have an account?", "Efa manana kaonty?")}
                <Link
                  to="/connexion"
                  className={`ml-1 font-medium ${
                    darkMode ? "text-amber-400 hover:text-amber-300" : "text-amber-700 hover:text-amber-600"
                  }`}
                >
                  {Traduction("Se connecter", "Log in", "Hiditra")}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Définir la fonction de callback globale pour reCAPTCHA
window.recaptchaCallback = function(value) {
  document.dispatchEvent(new CustomEvent("recaptchaChange", { detail: value }))
}