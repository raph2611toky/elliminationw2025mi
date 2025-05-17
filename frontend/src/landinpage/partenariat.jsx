import React, { useRef } from 'react'
import { motion } from 'framer-motion'
function Partenariat(language,darkMode) {
     const sectionRef = useRef(null)
     // Sample items for the slider
  const itemsSlider2 = [
    { id: 1, Image : "https://res.cloudinary.com/dysrhzaib/image/upload/v1747496102/hodi_host_logo-removebg-preview_ivhtaf.png",text: "HODI" },
    { id: 2, Image : "https://res.cloudinary.com/dysrhzaib/image/upload/v1747496103/VVG-actu-removebg-preview_zdeusx.png", text: "VIVETIC" },
    { id: 3, Image : "https://res.cloudinary.com/dysrhzaib/image/upload/v1747496102/1476876812-63-etech-removebg-preview_fwfbj2.png",text: "ETECH" },
    { id: 4, Image : "https://res.cloudinary.com/dysrhzaib/image/upload/v1747496102/images-removebg-preview_2_nlmnay.png",text: "YAS" },
    { id: 5, Image : "https://res.cloudinary.com/dysrhzaib/image/upload/v1747496102/1631341700038-removebg-preview_xgxt1m.png",text: "FULLDIGITS" },
   { id: 6, Image : "https://res.cloudinary.com/dysrhzaib/image/upload/v1747496284/images_1_q6c515.jpg",text: "BOCASAY" },
    { id: 7, Image : "https://res.cloudinary.com/dysrhzaib/image/upload/v1747496102/images__2_-removebg-preview_yxgics.png",text: "NOVITY" },
    { id: 7, Image : "https://res.cloudinary.com/dysrhzaib/image/upload/v1747496103/images-removebg-preview_3_y8sbrb.png",text: "INGENOSYA" },
  ]

     // Animation variants for the slider
  const containerVariants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  }

  const itemVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        scale: {
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          duration: 2,
          ease: "easeInOut",
        },
      },
    },
  }

     const Traduction = (francais , anglais , malagasy ) => {
    switch (language.language) {
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
  return (
            <motion.div
                    ref={sectionRef}
                    className={`relative flex items-center justify-center overflow-hidden `}
                    // style={{ opacity, scale, y }}
                    >
                    {/* Main content */}
                    <div className="space-y-14 w-full relative z-10 container ">
                        {/* Header section */}
                        <div className="flex flex-col gap-10 items-center px-4 md:px-10" style={{ fontFamily: "Roboto" }}>
                        <div className="flex flex-col text-center gap-5 max-w-5xl mx-auto">
                            {/* Title with glowing effect */}
                            <motion.h1
                            className="text-4xl md:text-5xl font-bold  text-transparent bg-clip-text  bg-gradient-to-r from-red-500 to-yellow-500"
                            style={{fontFamily :"Monsterrat" }}
                            whileInView={{
                                textShadow: [
                                "0px 0px 0px rgba(251,165,24,0)",
                                "0px 0px 10px rgba(251,165,24,0.5)",
                                "0px 0px 0px rgba(251,165,24,0)",
                                ],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
                            >
                           {
                             Traduction("Partenariat", "Partnership", "Mpiara-miasa")
                           }
                            </motion.h1>

                            {/* Main heading with animated gradient text */}
                            <div className="relative">
                            <motion.p
                                className={`${language.darkMode ? "text-noir" : "text-blanc"} text-4xl md:text-5xl lg:text-8xl font-bold leading-tight bg-clip-text`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                {Traduction(
                                "Grâce à vous, même les adieux ont du style.",
                                "Thanks to you, even goodbyes have style.",
                                "Misaotra anao, na ny veloma aza dia mba niavaka kely.",
                                )}
                            </motion.p>

                            {/* Animated underline */}
                            <motion.div
                                className="h-1 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full mx-auto mt-4"
                                initial={{ width: 0 }}
                                whileInView={{ width: "150px" }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                            </div>
                        </div>

                       
                        </div>

                        {/* Enhanced slider section */}
                        <div className="relative mt-20 w-full">
                     
                        {/* First slider row */}
                        <motion.div className="flex flex-row items-center mb-8" variants={containerVariants} animate="animate">
                            <div className="flex flex-row items-center gap-10 whitespace-nowrap">
                            {[...itemsSlider2, ...itemsSlider2].map((item, index) => (
                                <motion.div
                                key={`${item.id}-${index}`}
                                className="flex flex-row items-center gap-4 min-w-[250px] bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/50"
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                                    borderColor: "#FBA518",
                                }}
                                >
                                <motion.div
                                    className="relative w-16 h-16 rounded-full bg-gradient-to-br from-white to-white flex items-center justify-center"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <img src={item.Image} alt={item.text} className="w-10 h-10 object-contain" />

                                    {/* Animated ring */}
                                    <motion.div
                                    className="absolute inset-0 rounded-full border-2 border-yellow-400/50"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [1, 0.5, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "easeInOut",
                                    }}
                                    />
                                </motion.div>

                                <div className="flex flex-col">
                                    <span className="text-white text-xl font-semibold">{item.text}</span>
                                    <span className="text-gray-400 text-sm">Partenaire {item.id}</span>
                                </div>
                                </motion.div>
                            ))}
                            </div>
                        </motion.div>

                        {/* Second slider row (reversed direction) */}
                        <motion.div
                            className="flex flex-row items-center"
                            animate={{
                            x: [-1000, 0],
                            transition: {
                                x: {
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "loop",
                                duration: 20,
                                ease: "linear",
                                },
                            },
                            }}
                        >
                            <div className="flex flex-row items-center gap-10 whitespace-nowrap">
                            {[...itemsSlider2.reverse(), ...itemsSlider2].map((item, index) => (
                                <motion.div
                                key={`rev-${item.id}-${index}`}
                                className="flex flex-row items-center gap-4 min-w-[250px] bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/50"
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                                    borderColor: "#FBA518",
                                }}
                                >
                                <motion.div
                                    className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <img src={item.Image} alt={item.text} className="w-10 h-10 object-contain" />

                                    {/* Animated ring */}
                                    <motion.div
                                    className="absolute inset-0 rounded-full border-2 border-blue-400/50"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [1, 0.5, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "easeInOut",
                                    }}
                                    />
                                </motion.div>

                                <div className="flex flex-col">
                                    <span className="text-white text-xl font-semibold">{item.text}</span>
                                    <span className="text-gray-400 text-sm">Feature {item.id}</span>
                                </div>
                                </motion.div>
                            ))}
                            </div>
                        </motion.div>
                        </div>

                        {/* Feature highlights */}
                        
                    </div>
            </motion.div>
  )
}

export default Partenariat