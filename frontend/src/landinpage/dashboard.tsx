import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView, useAnimation } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  Flame,
  Briefcase,
  HeartCrack,
  HeartHandshake,
  Smile,
  Speech,
  Twitch
} from "lucide-react";
import { Link } from "react-router-dom";

// Tab button component
const TabButton = ({
  active,
  onClick,
  label,
  icon,
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`${
      active
        ? "bg-gradient-to-r from-red-600 to-yellow-600 text-white shadow-lg shadow-red-500/20"
        : "bg-white/10 text-white/70 hover:bg-white/20"
    } px-4 py-2 rounded-full text-sm font-medium flex items-center transition-all duration-300`}
  >
    {icon}
    {label}
  </motion.button>
);

// Menu icon button component
const MenuIconButton = ({
  icon,
  label,
  
  color = "bg-white/10",
}) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className={`${color} flex flex-col items-center justify-center p-3 rounded-full transition-all duration-300`}

    title={label}
  >
    {icon}
    <span className="text-xs mt-1 opacity-80">{label}</span>
  </motion.button>
);

const moodColors = {
  angry: "from-red-600 to-orange-600",
  sad: "from-blue-600 to-indigo-600",
  funny: "from-yellow-500 to-amber-500",
  professional: "from-gray-600 to-slate-700",
  dramatic: "from-purple-600 to-pink-600",
};

const moodIcons = {
  angry: <Flame className="w-4 h-4 mr-1.5 text-red-300" />,
  sad: <HeartCrack className="w-4 h-4 mr-1.5 text-blue-300" />,
  funny: <Smile className="w-4 h-4 mr-1.5 text-yellow-300" />,
  professional: <Briefcase className="w-4 h-4 mr-1.5 text-gray-300" />,
  dramatic: <Sparkles className="w-4 h-4 mr-1.5 text-purple-300" />,
};

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Scroll animation variants
const scrollRevealVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.9,
    y: 50,
    rotateX: 15
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8
    }
  },
  exit: {
    opacity: 0,
    scale: 1.1,
    y: -30,
    transition: { duration: 0.3 }
  }
};

const floatingCardsVariants = {
  hidden: { y: 0 },
  visible: {
    y: [-10, 10, -10],
    transition: {
      y: {
        repeat: Infinity,
        duration: 4,
        ease: "easeInOut"
      }
    }
  }
};

const glowPulseVariants = {
  hidden: { opacity: 0.2 },
  visible: {
    opacity: [0.2, 0.8, 0.2],
    transition: {
      opacity: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      }
    }
  }
};

export default function Dashboard({ language, darkMode }) {
  const controls = useAnimation();
  const mainRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("histoire");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const [scrollTriggered, setScrollTriggered] = useState(false);
  
  // Handle mouse movement for the 3D effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate rotation based on mouse position relative to card center
    const rotateY = ((e.clientX - centerX) / 20) * 0.5;
    const rotateX = (-(e.clientY - centerY) / 20) * 0.5;
    
    setRotation({ x: rotateX, y: rotateY });
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  // Set up scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.85) {
          setScrollTriggered(true);
          controls.start("visible");
        }
      },
      { threshold: 0.85 }
    );

    if (scrollTriggerRef.current) {
      observer.observe(scrollTriggerRef.current);
    }

    return () => {
      if (scrollTriggerRef.current) {
        observer.unobserve(scrollTriggerRef.current);
      }
    };
  }, [controls]);

  const Traduction = (francais :string, anglais:string, malagasy:string) => {
    switch (language) {
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
  

 
  // Filter stories based on active tab
  const getFilteredStories = () => {
    switch (activeTab) {
      case "histoire":
        return (<div
        ref={cardRef}
        className={`relative w-full rounded-xl overflow-hidden transition-all duration-300 ease-out 
                   ${isHovered ? 'shadow-lg shadow-purple-500/20' : 'shadow-md shadow-purple-500/10'}`}
        style={{
          transform: isHovered 
            ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(10px)` 
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0"></div>
        {/* Subtle particle effect */}
        <div className="absolute inset-0 opacity-20 z-10">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white" 
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3
              }}
            />
          ))}
        </div>
        {/* Glowing border effect on hover */}
        <div 
          className={`absolute inset-0 rounded-xl transition-opacity duration-300 ease-in-out z-10
                     ${isHovered ? 'opacity-30' : 'opacity-0'}`}
          style={{
            boxShadow: 'inset 0 0 30px rgba(168, 85, 247, 0.4)',
          }}
        ></div>
        {/* Card content */}
        <div className="relative flex flex-col justify-between h-full p-6 z-20">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{Traduction("Raconter son histoire","Tell your story","Lazao ny tantaranao")}</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4"></div>
            <p className="text-gray-300 mt-4">
            {
              Traduction("Créez une page de départ unique, débordante de style, d’émotion ou de rage, pour transformer votre rupture, démission ou adieu en un moment inoubliable et partageable.",
                          "Create a unique departure page, brimming with style, emotion or rage, to turn your breakup, resignation or goodbye into an unforgettable and shareable moment.",
                          "Mamorona pejy fiaingana tsy manam-paharoa, feno fomba, fihetseham-po na hatezerana, mba hanovana ny fisarahanao, ny fialanao na ny veloma ho fotoana tsy hay hadinoina sy azo zaraina."

              )
            }
            </p>
          </div>
        </div>
      </div>);
      case "conseil":
       return (<div
        ref={cardRef}
        className={`relative w-full rounded-xl overflow-hidden transition-all duration-300 ease-out 
                   ${isHovered ? 'shadow-lg shadow-purple-500/20' : 'shadow-md shadow-purple-500/10'}`}
        style={{
          transform: isHovered 
            ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(10px)` 
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0"></div>
        {/* Subtle particle effect */}
        <div className="absolute inset-0 opacity-20 z-10">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white" 
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3
              }}
            />
          ))}
        </div>
        {/* Glowing border effect on hover */}
        <div 
          className={`absolute inset-0 rounded-xl transition-opacity duration-300 ease-in-out z-10
                     ${isHovered ? 'opacity-30' : 'opacity-0'}`}
          style={{
            boxShadow: 'inset 0 0 30px rgba(168, 85, 247, 0.4)',
          }}
        ></div>
        {/* Card content */}
        <div className="relative flex flex-col justify-between h-full p-6 z-20">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{Traduction("Demander conseil","Ask for advice","Mangataha torohevitra")}</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4"></div>
            <p className="text-gray-300 mt-4">
            {Traduction("Obtenez des suggestions personnalisées pour orchestrer un départ mémorable grâce à notre chat Conseil, votre complice pour une sortie qui marque les esprits.",
                        "Get personalized suggestions for orchestrating a memorable departure thanks to our Advice chat, your partner for an outing that will leave a lasting impression.",
                        "Mahazoa soso-kevitra manokana amin'ny fandaminana fiaingana tsy hay hadinoina noho ny resakay Advice, namanao amin'ny fitsangatsanganana izay hamela fahatsapana maharitra."
            )}
            </p>
          </div>
        </div>
      </div>);
      case "psychatre":
       return (<div
        ref={cardRef}
        className={`relative w-full rounded-xl overflow-hidden transition-all duration-300 ease-out 
                   ${isHovered ? 'shadow-lg shadow-purple-500/20' : 'shadow-md shadow-purple-500/10'}`}
        style={{
          transform: isHovered 
            ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(10px)` 
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0"></div>
        {/* Subtle particle effect */}
        <div className="absolute inset-0 opacity-20 z-10">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white" 
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3
              }}
            />
          ))}
        </div>
        {/* Glowing border effect on hover */}
        <div 
          className={`absolute inset-0 rounded-xl transition-opacity duration-300 ease-in-out z-10
                     ${isHovered ? 'opacity-30' : 'opacity-0'}`}
          style={{
            boxShadow: 'inset 0 0 30px rgba(168, 85, 247, 0.4)',
          }}
        ></div>
        {/* Card content */}
        <div className="relative flex flex-col justify-between h-full p-6 z-20">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{
            Traduction("Discuter avec le psychiatre virtuel",
                      "Chat with the virtual psychiatrist",
                                  "Miresaha amin'ny mpitsabo aretin-tsaina virtoaly")}</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4"></div>
            <p className="text-gray-300 mt-4">
              { Traduction("Trouvez un soutien bienveillant via notre bot psychiatre, conçu pour accompagner les personnes en proie à la dépression ou au mal-être après une fin difficile.",
                            "Find compassionate support through our psychiatrist bot, designed to help people struggling with depression or feeling unwell after a difficult life.",
                            "Mitadiava fanohanana feno fangorahana amin'ny alàlan'ny bots psychiatrist, natao hanampiana ny olona miady amin'ny fahaketrahana na tsy salama aorian'ny fiainana sarotra."
              )}
            </p>
          </div>
        </div>
      </div>);
      default:
        return null;
    }
  };

  const filteredStories = getFilteredStories();
  console.log(filteredStories)

  return (
    <div className="w-full max-w-7xl mx-auto my-12 xs:px-5">
      <div ref={mainRef} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black opacity-70"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/0 via-zinc-900/0 to-black/60"></div>
        </div>

        <div className="relative z-10 p-8 md:p-12">
          {/* Top section with title and menu icons */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                {Traduction("Foncti", "Functi", "Zava-")}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                  {Traduction("onnalité", "onality", "misy")}
                </span>
              </h1>
              <p className="text-zinc-400 max-w-xl">
                {Traduction(
                  "Découvrez comment d'autres ont quitté leur emploi, leurs relations et leurs projets de manière spectaculaire, avec style, rage et parfois, des confettis.",
                  "Discover how others dramatically left their jobs, relationships, and projects with style, rage, and sometimes, confetti",
                  "Fantaro ny fomba nandaozan'ny hafa ny asany, ny fifandraisany, ary ny tetikasany tamin'ny fomba, ny hatezerana ary ny hatezerana indraindray, confetti."
                )}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex space-x-3 mt-6 md:mt-0"
            >
              <MenuIconButton
                icon="😭"
                label="Triste "
                color="bg-blue-500/10 hover:bg-blue-500/20"
              />
              <MenuIconButton
                icon="🤢"
                label="Dégoût"
                color="bg-green-500/10 hover:bg-green-500/20"
              />
              <MenuIconButton
                icon="😡"
                label="Colère "
                color="bg-red-500/10 hover:bg-red-500/20"
              />
              <MenuIconButton
                icon="😁"
                label="Joie"
                color="bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30"
              />
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          ></motion.div>

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12" ref={scrollTriggerRef}>
            {/* Left side - Featured story */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-1"
            >
              <div className="sticky top-24">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center">
                    <Flame className="w-5 h-5 mr-2 text-orange-500" />
                    {Traduction("Départ unique", "Featured Exit", "Fivoahana miavaka")}
                  </h2>
                </div>

                {/* Scroll animation highlight box */}
                <motion.div
                  variants={scrollRevealVariants}
                  initial="hidden"
                  animate={scrollTriggered ? "visible" : "hidden"}
                  exit="exit"
                  className="relative mt-8 p-5 rounded-xl bg-gradient-to-br from-red-500/20 via-orange-500/10 to-yellow-500/20 backdrop-blur-lg border border-white/10 overflow-hidden"
                >
                  {/* Animated particles */}
                  <motion.div 
                    className="absolute inset-0 pointer-events-none"  
                    animate={{ 
                      background: [
                        "radial-gradient(circle at 20% 30%, rgba(255, 59, 0, 0.2) 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 70%, rgba(255, 59, 0, 0.2) 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 30%, rgba(255, 59, 0, 0.2) 0%, transparent 50%)"
                      ]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  {/* Moving light dots */}
                  {scrollTriggered && [...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-white/80"
                      initial={{ 
                        width: Math.random() * 4 + 1,
                        height: Math.random() * 4 + 1,
                        x: Math.random() * 300 - 150,
                        y: Math.random() * 300 - 150,
                        opacity: 0
                      }}
                      animate={{ 
                        x: Math.random() * 300 - 150,
                        y: Math.random() * 300 - 150,
                        opacity: [0, 0.8, 0]
                      }}
                      transition={{
                        duration: Math.random() * 6 + 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                  
                  <motion.h3 
                    className="text-lg font-medium mb-3 relative z-10"
                    animate={{ color: ["#ffffff", "#ffcc00", "#ffffff"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {Traduction("Créez votre page de sortie", "Create Your Exit Page", "Mamorona ny Pejy farany ho anao")}
                  </motion.h3>
                  <motion.p 
                    className="text-sm text-zinc-200 mb-4 relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    {Traduction(
                      "Ton histoire touche à sa fin ? Fais-en un chef-d'œuvre.",
                      "Is your story coming to an end? Make it a masterpiece.",
                      "Hifarana ve ny tantaranao? Ataovy sangan'asa ary."
                    )}
                  </motion.p>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(255, 59, 0, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-red-700 to-yellow-700 rounded-lg font-medium text-white shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 transition-all duration-300 group relative overflow-hidden z-10"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-600 opacity-0" 
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <Link to="/inscription" className="flex items-center justify-center relative z-10">
                      {Traduction("C'est parti pour la fin", "Here we go for the end", "Indro ary ny farany")}
                      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {/* Right side - Exit story cards */}
            <div className="md:col-span-2 space-y-6">
              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                <TabButton
                  active={activeTab === "histoire"}
                  onClick={() => setActiveTab("histoire")}
                  label="Raconter son histoire"
                  icon={<Speech className="w-4 h-4 mr-1.5" />}
                />
                <TabButton
                  active={activeTab === "conseil"}
                  onClick={() => setActiveTab("conseil")}
                  label="Demander conseil"
                  icon={<Twitch className="w-4 h-4 mr-1.5" />}
                />
                <TabButton
                  active={activeTab === "psychatre"}
                  onClick={() => setActiveTab("psychatre")}
                  label="Discuter avec le psychiatre"
                  icon={<HeartHandshake className="w-4 h-4 mr-1.5" />}
                />
              </motion.div>
                    {filteredStories}
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}