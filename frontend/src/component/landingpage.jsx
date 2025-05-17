import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import {  Moon, Sun, Globe  } from "lucide-react"
import { Link } from 'react-router-dom'; 
function Landingpage() {
    const [darkMode, setDarkMode] = useState(true)
    const [language, setLanguage] = useState("fr")
    const [scrolled, setScrolled] = useState(false)
    const [langMenuOpen, setLangMenuOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
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

// Effet pour détecter le défilement
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Éléments de menu pour la navbar avec traductions
  const menuItems = [
    {
      name: Traduction("Accueil", "Home", "Fandraisana"),
      href: "#Acceuil",
    },
     {
      name: Traduction("Ventes", "Sales", "Fivarotana"),
      href: "#Ventes",
    },
    {
      name: Traduction("Fonctionalité", "Functionality", "Zava-misy"),
      href: "#Fonctionnalité",
    },
    {
      name: Traduction("Contact", "Contact", "Fifandraisana"),
      href: "#Contact",
    },
  ]

  // Noms des langues
  const languages = [
    { code: "fr", name: "Français" },
    { code: "en", name: "English" },
    { code: "mg", name: "Malagasy" },
  ]
  return (
    <div  className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-slate-900 text-amber-100" : "bg-amber-50 text-amber-900"
      }`}>

        <header>
          <motion.nav
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Fond de la navbar avec effet parchemin */}
        <div className="relative">
          <div className="relative z-10">
            <div className="flex justify-between  items-center py-3 px-20">
              {/* Logo */}
              <motion.h1
                href="#"
                className={`text-2xl md:text-3xl  ${darkMode ? "text-amber-200" : "text-amber-900"}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{fontFamily:"Cormorant",fontWeight:"700",fontStyle:"italic"}}
              >
                {Traduction("Aventoria", "Aventoria", "Aventoria")}
              </motion.h1>

              {/* Desktop Menu */}
              <div className='flex flex-row justify-between'>
                <div className="hidden md:flex items-center space-x-10">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    className={`px-4 py-2 ${
                      darkMode ? "text-amber-200 hover:text-amber-100" : "text-amber-800 hover:text-amber-600"
                    } font-medium relative`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300,duration: 0.3, delay: index * 0.1  }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {item.name}
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                        darkMode ? "bg-amber-400" : "bg-amber-700"
                      } origin-left`}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}

                {/* Bouton de changement de langue */}
                <div className="relative">
                  <button
                    onClick={() => setLangMenuOpen(!langMenuOpen)}
                    className={`flex items-center px-3 py-2 rounded-md ${
                      darkMode
                        ? "bg-slate-700 text-amber-100 hover:bg-slate-600"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    } transition-colors duration-200`}
                  >
                    <Globe size={18} className="mr-1" />
                    <span className="uppercase">{language}</span>
                  </button>

                  {langMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
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
                </div>
                {/* Bouton de changement de mode */}

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`ml-2 p-2 rounded-full ${
                    darkMode
                      ? "bg-slate-700 text-amber-100 hover:bg-slate-600"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                  } transition-colors duration-200`}
                  aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button  className={`flex items-center px-3 py-2 rounded-md ${
                      darkMode
                        ? "bg-slate-600 text-amber-100"
                        : "bg-amber-200 text-amber-800"
                    } transition-colors duration-200`}>
                  {Traduction("Commencer","Start Now","Andao ary e")}
              </button>
              </div>
              
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                {/* Bouton de changement de langue (mobile) */}
                <div className="relative lang-menu mr-2">
                  <button
                    onClick={() => setLangMenuOpen(!langMenuOpen)}
                    className={`flex items-center p-2 rounded-md ${
                      darkMode ? "bg-slate-700 text-amber-100" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    <Globe size={18} />
                  </button>

                  {langMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
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
                </div>

                {/* Bouton de changement de mode (mobile) */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`mr-2 p-2 rounded-full ${
                    darkMode ? "bg-slate-700 text-amber-100" : "bg-amber-100 text-amber-800"
                  }`}
                  aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Bouton menu hamburger */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`p-2 rounded-md ${darkMode ? "text-amber-100" : "text-amber-800"} focus:outline-none`}
                >
                  {isOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden ${
            darkMode ? "bg-gradient-to-b from-slate-800 to-slate-700" : "bg-gradient-to-b from-amber-50 to-amber-100"
          } shadow-lg ${isOpen ? "block" : "hidden"}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container space-y-5 mx-auto px-4 py-4">
            <div className="flex flex-col space-y-3">
              {menuItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className={`px-4 py-2 ${
                    darkMode
                      ? "text-amber-100 hover:text-amber-200 border-b border-slate-600/50"
                      : "text-amber-800 hover:text-amber-600 border-b border-amber-200/50"
                  } font-medium`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>            
            <div className='flex justify-center items-center'>
              <button  className={`flex flex-1 text-center items-center px-3 py-2 rounded-md ${
                      darkMode
                        ? "bg-slate-600 text-amber-100"
                        : "bg-amber-200 text-amber-800"
                    } transition-colors duration-200`}>
                 <Link to="#"> 
                  {Traduction("Commencer","Start Now","Andao ary e")}
                 </Link>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.nav>
        </header>
      </div>
  )
}

export default Landingpage