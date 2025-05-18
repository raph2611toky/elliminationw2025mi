"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  X,
  DoorClosed,
  Flame,
  Heart,
  Smile,
  Frown,
  Briefcase,
  Users,
  MessageSquareOff,
  ChevronRight,
  Maximize,
  Minimize,
} from "lucide-react"
import Viewer from "./bot"
import axios from "axios"
import { api } from "../hooks/api"
export default function ChatBotTheEnd() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Bienvenue sur TheEnd.page! Je suis là pour vous aider à créer votre page de départ personnalisée. Que souhaitez-vous accomplir aujourd'hui?",
    },
  ])

  const [inputValue, setInputValue] = useState("")
  const [titre,setTitre] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [buttonHovered, setButtonHovered] = useState(false)
  const [activeEmoji, setActiveEmoji] = useState(null)
  const messagesEndRef = useRef(null)
  const [showSuggestions, setShowSuggestions] = useState(true)

  // Suggestions de questions rapides
  const suggestions = [
    "Comment personnaliser ma page?",
    "Quels types de départ sont disponibles?",
    "Comment ajouter des GIFs à ma page?",
    "Puis-je utiliser des sons?",
  ]

  // Simulating bot typing and response
  const handleSendMessage = (content = inputValue.trim()) => {
    if (content === "") return

    // Add user message
    const newUserMessage = { id: messages.length + 1, type: "user", content: content }
    setMessages([...messages, newUserMessage])
    setInputValue("")
    setShowSuggestions(false)


    // Simulate bot typing
    setIsTyping(true) 

    // Generate bot response after a delay
    // setTimeout(() => {
    //   setIsTyping(false)

    //   let botResponse
    //   const lowerContent = content.toLowerCase()
    //   if (lowerContent.includes("page") || lowerContent.includes("personnalis")) {
    //     botResponse =
    //       "Pour créer votre page de départ personnalisée, vous pouvez choisir parmi nos modèles ou créer la vôtre depuis zéro. Nous proposons des thèmes dramatiques, ironiques, ultra cringe, classe, touchants, absurdes, passifs-agressifs ou simplement honnêtes. Quel style vous intéresse?"
    //   } else if (
    //     lowerContent.includes("modèle") ||
    //     lowerContent.includes("template") ||
    //     lowerContent.includes("thème")
    //   ) {
    //     botResponse =
    //       "Nos thèmes sont conçus pour maximiser l'impact de votre départ. Le thème 'Dramatique' utilise des flammes et des effets visuels intenses, 'Ironique' joue sur le contraste et l'humour, 'Ultra cringe' est... eh bien, ultra cringe! Lequel vous attire le plus?"
    //   } else if (lowerContent.includes("gif") || lowerContent.includes("image")) {
    //     botResponse =
    //       "Vous pouvez ajouter des GIFs et images à votre page de départ! Nous avons une bibliothèque intégrée ou vous pouvez importer les vôtres. Les GIFs peuvent être placés en arrière-plan ou comme éléments interactifs. Voulez-vous voir quelques exemples?"
    //   } else if (lowerContent.includes("son") || lowerContent.includes("audio") || lowerContent.includes("musique")) {
    //     botResponse =
    //       "Les effets sonores et la musique peuvent rendre votre départ encore plus mémorable! Vous pouvez ajouter un son de porte qui claque, une musique dramatique, ou même enregistrer votre propre message vocal. Que préférez-vous?"
    //   } else if (lowerContent.includes("merci") || lowerContent.includes("super")) {
    //     botResponse =
    //       "C'est un plaisir de vous aider! N'hésitez pas si vous avez d'autres questions. Votre page de départ sera inoubliable, je vous le garantis!"
    //   } else if (
    //     lowerContent.includes("démission") ||
    //     lowerContent.includes("quitter") ||
    //     lowerContent.includes("job") ||
    //     lowerContent.includes("travail")
    //   ) {
    //     botResponse =
    //       "Pour une démission mémorable, notre thème 'Passif-agressif' est très populaire! Vous pouvez y ajouter une liste de griefs, des statistiques sur votre temps perdu, et même un compteur montrant combien vous avez économisé en santé mentale depuis votre départ. Souhaitez-vous explorer ce thème?"
    //   } else if (
    //     lowerContent.includes("rupture") ||
    //     lowerContent.includes("couple") ||
    //     lowerContent.includes("relation")
    //   ) {
    //     botResponse =
    //       "Les ruptures sont difficiles, mais votre page peut être cathartique. Notre thème 'Honnête' permet d'exprimer vos sentiments avec élégance, tandis que 'Dramatique' offre plus d'impact visuel. Vous pouvez même ajouter une playlist de chansons de rupture. Quelle approche préférez-vous?"
    //   } else {
    //     botResponse =
    //       "Je comprends. Pour aller plus loin, je vous propose d'explorer les différentes sections de personnalisation: arrière-plans animés, widgets interactifs, effets sonores et paramètres de confidentialité. Par où souhaitez-vous commencer?"
    //   }

    //   const newBotMessage = { id: messages.length + 2, type: "bot", content: botResponse }
    //   setMessages((prevMessages) => [...prevMessages, newBotMessage])

    //   // Réafficher les suggestions après la réponse du bot
    //   setTimeout(() => {
    //     setShowSuggestions(true)
    //   }, 1000)
    // }, 1500)


    axios.post(`${api}/conversations/create/`,{message: inputValue, titre:titre})
    .then(res=>{
      console.log(res.data)
    })
    .catch(err=>{console.log(err)})
  }

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Handle key press for sending message
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const closeWelcome = () => {
    setShowWelcome(false)
  }

  // Fonction pour obtenir l'icône du type de départ
  const getExitTypeIcon = (type) => {
    switch (type) {
      case "job":
        return <Briefcase className="h-5 w-5" />
      case "relationship":
        return <Heart className="h-5 w-5" />
      case "project":
        return <Flame className="h-5 w-5" />
      case "team":
        return <Users className="h-5 w-5" />
      case "social":
        return <MessageSquareOff className="h-5 w-5" />
      default:
        return <DoorClosed className="h-5 w-5" />
    }
  }

  // Animation pour l'icône du chatbot
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } },
    tap: { scale: 0.9 },
    pulse: {
      scale: [1, 1.1, 1],
      boxShadow: ["0 0 0 0 rgba(220, 38, 38, 0)", "0 0 0 10px rgba(220, 38, 38, 0.3)", "0 0 0 0 rgba(220, 38, 38, 0)"],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
      },
    },
  }

  // Animation pour les particules autour du bouton
  const renderParticles = () => {
    if (!buttonHovered) return null

    return Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={i}
        className={`absolute w-1.5 h-1.5 rounded-full ${
          i % 3 === 0 ? "bg-red-500" : i % 3 === 1 ? "bg-orange-500" : "bg-yellow-500"
        }`}
        initial={{ opacity: 0, x: 0, y: 0 }}
        animate={{
          opacity: [0, 1, 0],
          x: [0, (Math.random() - 0.5) * 50],
          y: [0, (Math.random() - 0.5) * 50],
        }}
        transition={{
          duration: 1 + Math.random() * 0.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          delay: i * 0.1,
        }}
        style={{
          left: "50%",
          top: "50%",
        }}
      />
    ))
  }

  // Effet de flamme pour le bouton
  const renderButtonFlame = () => {
    if (!buttonHovered) return null

    return (
      <div className="absolute -bottom-2 left-0 right-0 h-6 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={`flame-${i}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [-5, -20], opacity: [0.8, 0] }}
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

  return (
    <div
      className={`font-sans ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } min-h-screen flex flex-col items-center justify-center p-4`}
    >
      {/* Main Content */}
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chat Bot Interface */}
          <div className="relative h-full">
            <div className={`fixed bottom-6 right-6 z-50 ${expanded ? "w-full max-w-md" : ""}`}>
              <AnimatePresence mode="wait">
                {!isOpen ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="relative"
                  >
                    <motion.button
                      onClick={() => setIsOpen(true)}
                      variants={buttonVariants}
                      initial="initial"
                      animate={buttonHovered ? "hover" : "pulse"}
                      whileHover="hover"
                      whileTap="tap"
                      onHoverStart={() => setButtonHovered(true)}
                      onHoverEnd={() => setButtonHovered(false)}
                      className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center  bg-gradient-to-r from-red-500 hover:from-red-500 hover:to-red-400 ext-white transition-all duration-300 shadow-red-500/20`}
                    >
                      <DoorClosed size={28} />
                    </motion.button>
                    {renderParticles()}
                    {renderButtonFlame()}

                    {/* Bulle de notification */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1, type: "spring", damping: 20 }}
                      className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full px-2 py-1 text-xs font-bold shadow-md border border-red-200"
                    >
                      Nouveau
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25 }}
                    className={`rounded-2xl shadow-xl overflow-hidden flex flex-col ${
                      darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                    } ${expanded ? "h-[80vh]" : "h-[500px]"} w-full max-w-md`}
                    style={{
                      boxShadow: darkMode
                        ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                        : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    {/* Chat Header */}
                    <div
                      className={`p-4 flex justify-between items-center ${
                        darkMode
                          ? "bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-700"
                          : "bg-gradient-to-r from-red-600 to-red-500 text-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <DoorClosed className={`mr-2 ${darkMode ? "text-red-500" : "text-white"}`} size={20} />
                        <h3 className="font-medium">Assistant TheEnd.page</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setExpanded(!expanded)}
                          className={`p-1 rounded-full ${
                            darkMode ? "hover:bg-gray-700" : "hover:bg-red-400"
                          } transition-colors`}
                        >
                          {expanded ? <Minimize size={18} /> : <Maximize size={18} />}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setIsOpen(false)}
                          className={`p-1 rounded-full ${
                            darkMode ? "hover:bg-gray-700" : "hover:bg-red-400"
                          } transition-colors`}
                        >
                          <X size={18} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs rounded-2xl px-4 py-2 ${
                              message.type === "user"
                                ? darkMode
                                  ? "bg-gradient-to-r from-red-600 to-red-500 text-white"
                                  : "bg-gradient-to-r from-red-600 to-red-500 text-white"
                                : darkMode
                                  ? "bg-gray-700"
                                  : "bg-gray-100"
                            } shadow-sm`}
                          >
                            {message.content}
                          </div>
                        </motion.div>
                      ))}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div
                            className={`rounded-2xl px-4 py-3 ${darkMode ? "bg-gray-700" : "bg-gray-100"} shadow-sm`}
                          >
                            <div className="flex space-x-2">
                              <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                                className={`w-2 h-2 rounded-full ${darkMode ? "bg-red-500" : "bg-red-500"}`}
                              ></motion.div>
                              <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatType: "loop",
                                  delay: 0.15,
                                }}
                                className={`w-2 h-2 rounded-full ${darkMode ? "bg-orange-500" : "bg-orange-500"}`}
                              ></motion.div>
                              <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatType: "loop",
                                  delay: 0.3,
                                }}
                                className={`w-2 h-2 rounded-full ${darkMode ? "bg-yellow-500" : "bg-yellow-500"}`}
                              ></motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions de questions rapides */}
                    <AnimatePresence>
                      {showSuggestions && messages.length > 0 && messages[messages.length - 1].type === "bot" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`px-4 py-2 ${darkMode ? "bg-gray-700" : "bg-gray-50"} border-t ${
                            darkMode ? "border-gray-600" : "border-gray-200"
                          }`}
                        >
                          <p className="text-xs mb-2 opacity-70">Type de question</p>
                          <div className="flex flex-wrap gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={()=>{setTitre("CONSEIL")}}
                              className={`text-xs px-3 py-1.5 rounded-full ${
                              darkMode
                                        ? "bg-gray-600 hover:bg-gray-500 text-white"
                                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                    } transition-colors flex items-center`}
                                  >
                                    <span>CONSEIL</span>
                                    <ChevronRight size={14} className="ml-1 opacity-70" />
                              </motion.button>
                               <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={()=>{setTitre("REHABILITATION")}}
                              className={`text-xs px-3 py-1.5 rounded-full ${
                              darkMode
                                        ? "bg-gray-600 hover:bg-gray-500 text-white"
                                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                    } transition-colors flex items-center`}
                                  >
                                    <span>REHABILITATION</span>
                                    <ChevronRight size={14} className="ml-1 opacity-70" />
                              </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Réactions émoji */}
                    <div
                      className={`px-4 py-2 flex justify-center space-x-3 ${
                        darkMode ? "bg-gray-700 border-t border-gray-600" : "bg-gray-50 border-t border-gray-200"
                      }`}
                    >
                      {[
                        { emoji: <Flame size={18} />, id: "fire", color: "text-red-500" },
                        { emoji: <Heart size={18} />, id: "heart", color: "text-pink-500" },
                        { emoji: <Smile size={18} />, id: "smile", color: "text-yellow-500" },
                        { emoji: <Frown size={18} />, id: "frown", color: "text-blue-500" },
                      ].map((item) => (
                        <motion.button
                          key={item.id}
                          whileHover={{ scale: 1.2, y: -5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setActiveEmoji(activeEmoji === item.id ? null : item.id)}
                          className={`p-2 rounded-full ${
                            activeEmoji === item.id
                              ? darkMode
                                ? "bg-gray-600"
                                : "bg-gray-200"
                              : "hover:bg-gray-600/20"
                          } transition-colors ${item.color}`}
                        >
                          {item.emoji}
                        </motion.button>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div
                      className={`p-4 ${
                        darkMode
                          ? "bg-gradient-to-r from-gray-800 to-gray-700 border-t border-gray-700"
                          : "bg-white border-t border-gray-200"
                      }`}
                    >
                      <form  className="flex items-center gap-3">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Posez votre question..."
                          className={`flex-grow px-4 py-3 rounded-lg ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
                          } focus:outline-none border-y border-l transition-colors`}
                        />
                        <motion.button
                        type="submit"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSendMessage}
                          className={`px-4 py-3 rounded-xl bg-gradient-to-r from-red-700 to-yellow-700 text-white transition-all`}
                        >
                          <Send size={18} />
                        </motion.button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
