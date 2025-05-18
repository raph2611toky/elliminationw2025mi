"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowRight, Check, ChevronLeft, ChevronRight, PenLine, Sparkles, Star, X } from "lucide-react"
import "./DernierFin.css"

const DernierFin = ({ onComplete, language = "fr" }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [result, setResult] = useState({
    percentage: 0,
    aptitude: "",
    description: "",
    strengths: [],
    weaknesses: [],
    recommendation: "",
  })
  const [animation, setAnimation] = useState("")
  const [showResult, setShowResult] = useState(false)
  const resultCircleRef = useRef(null)

  const translations = {
    fr: {
      title: "Devriez-vous mettre fin à cette situation ?",
      subtitle: "Évaluez si c'est le bon moment pour tourner la page",
      next: "Suivant",
      previous: "Précédent",
      submit: "Voir mon résultat",
      resultTitle: "Votre analyse de fin",
      resultDescription: "Notre évaluation de votre situation",
      strengths: "Points favorables",
      weaknesses: "Points à considérer",
      writeEnd: "Écrire ma fin",
      retakeQuiz: "Refaire le test",
      recommendation: "Recommandation",
      question: "Question",
      of: "sur",
      endRecommended: "Fin recommandée",
      endPossible: "Fin envisageable",
      endNeutral: "Situation nuancée",
      endNotRecommended: "Fin déconseillée",
    },
    mg: {
      title: "Tokony hametraka farany ve ianao?",
      subtitle: "Tombano raha tonga ny fotoana hihodina pejy",
      next: "Manaraka",
      previous: "Taloha",
      submit: "Hijery ny valiny",
      resultTitle: "Ny famakafakana ny farany",
      resultDescription: "Ny tombana momba ny toe-javatra misy anao",
      strengths: "Teboka tsara",
      weaknesses: "Teboka tokony hoheverina",
      writeEnd: "Hanoratra ny fiafarako",
      retakeQuiz: "Avereno ny test",
      recommendation: "Toro-hevitra",
      question: "Fanontaniana",
      of: "amin'ny",
      endRecommended: "Farany tena tsara",
      endPossible: "Farany azo atao",
      endNeutral: "Toe-javatra misy lafiny roa",
      endNotRecommended: "Farany tsy dia tsara",
    },
  }

  const t = translations[language] || translations.fr

  // Nouvelles questions avec 4 options de réponse chacune
  const questions = [
    {
      id: 1,
      text:
        language === "fr"
          ? "Comment vous sentez-vous à l'idée de mettre fin à cette situation ?"
          : "Ahoana ny fahatsapanao momba ny hametraka farany amin'ity toe-javatra ity?",
      options: [
        {
          text: language === "fr" ? "Soulagé(e) et impatient(e) d'avancer" : "Maivana sady maniry hitohy",
          score: 10,
          category: "émotionnel",
        },
        {
          text: language === "fr" ? "Plutôt serein(e), c'est la bonne décision" : "Milamina, safidy tsara io",
          score: 7,
          category: "émotionnel",
        },
        {
          text: language === "fr" ? "Ambivalent(e), j'ai des doutes" : "Misalasala, manana ahiahy aho",
          score: 4,
          category: "émotionnel",
        },
        {
          text: language === "fr" ? "Anxieux(se) et effrayé(e)" : "Matahotra sy miahiahy",
          score: 1,
          category: "émotionnel",
        },
      ],
    },
    {
      id: 2,
      text:
        language === "fr"
          ? "Avez-vous essayé d'autres solutions avant d'envisager cette fin ?"
          : "Efa nanandrana vahaolana hafa ve ianao talohan'ny hieritreretana ity farany ity?",
      options: [
        {
          text:
            language === "fr"
              ? "Oui, j'ai tout essayé et rien n'a fonctionné"
              : "Eny, efa nanandrana ny zavatra rehetra aho fa tsy nisy nahomby",
          score: 10,
          category: "résolution",
        },
        {
          text:
            language === "fr"
              ? "J'ai essayé plusieurs approches sans succès"
              : "Nanandrana fomba maromaro aho fa tsy nahomby",
          score: 7,
          category: "résolution",
        },
        {
          text:
            language === "fr"
              ? "J'ai tenté quelques solutions, avec des résultats mitigés"
              : "Nanandrana vahaolana vitsivitsy aho, nisy vokatra samihafa",
          score: 4,
          category: "résolution",
        },
        {
          text:
            language === "fr"
              ? "Non, je n'ai pas vraiment cherché d'alternatives"
              : "Tsia, tsy nitady vahaolana hafa mihitsy aho",
          score: 1,
          category: "résolution",
        },
      ],
    },
    {
      id: 3,
      text:
        language === "fr"
          ? "Cette situation vous apporte-t-elle encore quelque chose de positif ?"
          : "Mbola mitondra zavatra tsara ho anao ve ity toe-javatra ity?",
      options: [
        {
          text:
            language === "fr"
              ? "Non, elle n'apporte que des aspects négatifs"
              : "Tsia, zavatra ratsy fotsiny no entiny",
          score: 10,
          category: "détachement",
        },
        {
          text:
            language === "fr"
              ? "Très peu, les aspects négatifs dominent largement"
              : "Kely dia kely, ny lafiny ratsy no betsaka",
          score: 7,
          category: "détachement",
        },
        {
          text:
            language === "fr"
              ? "Oui, il y a encore des aspects positifs importants"
              : "Eny, mbola misy zavatra tsara manan-danja",
          score: 4,
          category: "détachement",
        },
        {
          text:
            language === "fr"
              ? "Absolument, les aspects positifs sont essentiels pour moi"
              : "Tena misy, tena ilaina amiko ny lafiny tsara",
          score: 1,
          category: "détachement",
        },
      ],
    },
    {
      id: 4,
      text:
        language === "fr"
          ? "Comment imaginez-vous votre vie après cette fin ?"
          : "Ahoana no hieritreretanao ny fiainanao aorian'ity farany ity?",
      options: [
        {
          text:
            language === "fr"
              ? "Meilleure et plus épanouissante qu'avant"
              : "Tsaratsara kokoa sy mampitombo ny fahafaham-po noho ny teo aloha",
          score: 10,
          category: "créatif",
        },
        {
          text:
            language === "fr"
              ? "Probablement meilleure après une période d'adaptation"
              : "Angamba ho tsaratsara kokoa aorian'ny fotoana fihazoazoana",
          score: 7,
          category: "créatif",
        },
        {
          text:
            language === "fr"
              ? "Incertaine, j'ai du mal à me projeter"
              : "Tsy fantatra, sarotra amiko ny mieritreritra ny ho avy",
          score: 4,
          category: "créatif",
        },
        {
          text: language === "fr" ? "Plus difficile et moins satisfaisante" : "Sarotra kokoa sy tsy mahafa-po loatra",
          score: 1,
          category: "créatif",
        },
      ],
    },
    {
      id: 5,
      text:
        language === "fr"
          ? "Quelles sont les réactions de votre entourage face à cette possible fin ?"
          : "Inona ny fihetsiky ny manodidina anao manoloana ity mety ho farany ity?",
      options: [
        {
          text:
            language === "fr"
              ? "Ils me soutiennent et comprennent ma décision"
              : "Manohana ahy izy ireo ary mahatakatra ny fanapahan-kevitro",
          score: 10,
          category: "expression",
        },
        {
          text:
            language === "fr"
              ? "La plupart me soutiennent, certains ont des réserves"
              : "Ny ankamaroany manohana ahy, ny sasany manana ahiahy",
          score: 7,
          category: "expression",
        },
        {
          text:
            language === "fr"
              ? "Avis partagés, beaucoup ne comprennent pas"
              : "Mizarazara ny hevitra, maro no tsy mahatakatra",
          score: 4,
          category: "expression",
        },
        {
          text:
            language === "fr"
              ? "Ils s'y opposent fortement et me découragent"
              : "Manohitra mafy izy ireo ary mampiraviravy tanana ahy",
          score: 1,
          category: "expression",
        },
      ],
    },
    {
      id: 6,
      text:
        language === "fr"
          ? "Quelles conséquences pratiques cette fin aurait-elle sur votre vie ?"
          : "Inona avy ny voka-dratsy mety hitranga amin'ny fiainanao?",
      options: [
        {
          text: language === "fr" ? "Minimes ou facilement gérables" : "Kely na mora fehezina",
          score: 10,
          category: "résolution",
        },
        {
          text:
            language === "fr"
              ? "Modérées, mais j'ai un plan pour y faire face"
              : "Antonony, fa manana drafitra aho hiatrehana azy",
          score: 7,
          category: "résolution",
        },
        {
          text: language === "fr" ? "Importantes, avec des défis significatifs" : "Lehibe, misy olana goavana",
          score: 4,
          category: "résolution",
        },
        {
          text:
            language === "fr" ? "Très graves, potentiellement dévastatrices" : "Tena lehibe, mety hanimba ny fiainana",
          score: 1,
          category: "résolution",
        },
      ],
    },
    {
      id: 7,
      text:
        language === "fr"
          ? "Depuis combien de temps envisagez-vous cette fin ?"
          : "Hatramin'ny oviana ianao no efa nieritreritra ity farany ity?",
      options: [
        {
          text:
            language === "fr"
              ? "Depuis longtemps, c'est une décision mûrement réfléchie"
              : "Efa ela, fanapahan-kevitra efa nodinihina tsara",
          score: 10,
          category: "détachement",
        },
        {
          text:
            language === "fr"
              ? "Depuis plusieurs semaines/mois, j'y pense régulièrement"
              : "Nandritra ny herinandro/volana maro, mieritreritra matetika aho",
          score: 7,
          category: "détachement",
        },
        {
          text:
            language === "fr"
              ? "C'est assez récent, mais j'y pense sérieusement"
              : "Vao haingana ihany, fa tena eritreretiko tsara",
          score: 4,
          category: "détachement",
        },
        {
          text:
            language === "fr"
              ? "C'est une idée soudaine, sous le coup de l'émotion"
              : "Hevitra tampoka, noho ny fihetseham-po",
          score: 1,
          category: "détachement",
        },
      ],
    },
    {
      id: 8,
      text:
        language === "fr"
          ? "Comment cette fin s'inscrit-elle dans votre parcours personnel ?"
          : "Ahoana no ifandraisan'ity farany ity amin'ny fivoaranao manokana?",
      options: [
        {
          text:
            language === "fr"
              ? "C'est une étape nécessaire pour mon évolution personnelle"
              : "Dingana ilaina amin'ny fivoarako manokana",
          score: 10,
          category: "créatif",
        },
        {
          text: language === "fr" ? "C'est probablement bénéfique pour mon développement" : "Mety hahasoa ny fivoarako",
          score: 7,
          category: "créatif",
        },
        {
          text:
            language === "fr"
              ? "Je ne suis pas sûr(e) de son impact sur mon parcours"
              : "Tsy azoko antoka ny fiantraikany amin'ny fivoarako",
          score: 4,
          category: "créatif",
        },
        {
          text:
            language === "fr"
              ? "Cela pourrait être un recul dans mon parcours"
              : "Mety ho fihemorana amin'ny fivoarako",
          score: 1,
          category: "créatif",
        },
      ],
    },
  ]

  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    // Réinitialiser la réponse sélectionnée lorsqu'on change de question
    setSelectedAnswer(answers[currentQuestion?.id] || null)

    // Animation de transition
    setAnimation("slide-in")
    const timer = setTimeout(() => {
      setAnimation("")
    }, 500)

    return () => clearTimeout(timer)
  }, [currentQuestion, answers])

  useEffect(() => {
    if (showResult && resultCircleRef.current) {
      // Animation du cercle de résultat
      const circle = resultCircleRef.current
      const percentage = result.percentage

      // Définir la circonférence du cercle
      const radius = 70
      const circumference = 2 * Math.PI * radius

      // Calculer la longueur de l'arc basée sur le pourcentage
      const offset = circumference - (percentage / 100) * circumference

      // Appliquer l'animation
      circle.style.strokeDasharray = `${circumference} ${circumference}`
      circle.style.strokeDashoffset = `${circumference}`

      setTimeout(() => {
        circle.style.transition = "stroke-dashoffset 2s ease-in-out"
        circle.style.strokeDashoffset = `${offset}`
      }, 200)
    }
  }, [showResult, result.percentage])

  const handleOptionSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex)
  }

  const handleNext = () => {
    if (selectedAnswer === null) return

    // Enregistrer la réponse
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: selectedAnswer,
    }))

    // Passer à la question suivante ou terminer
    if (currentQuestionIndex < questions.length - 1) {
      setAnimation("slide-out")
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1)
      }, 300)
    } else {
      calculateResult()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setAnimation("slide-out-reverse")
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev - 1)
      }, 300)
    }
  }

  const calculateResult = () => {
    // Calculer le score total
    let totalScore = 0
    const totalPossible = questions.length * 10

    // Calculer le score en fonction des réponses sélectionnées
    Object.entries(answers).forEach(([questionId, optionIndex]) => {
      const question = questions.find((q) => q.id === Number.parseInt(questionId))
      if (question) {
        totalScore += question.options[optionIndex].score
      }
    })

    const percentage = Math.round((totalScore / totalPossible) * 100)

    // Déterminer les forces et faiblesses
    const categoryScores = {}

    // Calculer les scores par catégorie
    Object.entries(answers).forEach(([questionId, optionIndex]) => {
      const question = questions.find((q) => q.id === Number.parseInt(questionId))
      if (question) {
        const option = question.options[optionIndex]
        const category = option.category
        const score = option.score

        if (!categoryScores[category]) {
          categoryScores[category] = { total: 0, count: 0 }
        }
        categoryScores[category].total += score
        categoryScores[category].count += 1
      }
    })

    // Calculer les moyennes par catégorie
    const categoryAverages = {}
    Object.entries(categoryScores).forEach(([category, { total, count }]) => {
      categoryAverages[category] = total / count
    })

    // Identifier les forces (scores > 7) et faiblesses (scores < 5)
    const strengths = []
    const weaknesses = []

    Object.entries(categoryAverages).forEach(([category, score]) => {
      if (score >= 7) {
        strengths.push(getCategoryLabel(category))
      } else if (score <= 5) {
        weaknesses.push(getCategoryLabel(category))
      }
    })

    // Déterminer la recommandation
    let aptitude = ""
    let description = ""
    let recommendation = ""

    if (percentage >= 75) {
      aptitude = t.endRecommended
      description =
        language === "fr"
          ? "D'après vos réponses, mettre fin à cette situation semble être une décision judicieuse. Vous semblez prêt(e) émotionnellement et pratiquement à franchir cette étape."
          : "Araka ny valinteninao, ny fametrahana farany amin'ity toe-javatra ity dia toa fanapahan-kevitra hendry. Toa vonona ara-pihetseham-po sy ara-praktika ianao handray ity dingana ity."
      recommendation =
        language === "fr"
          ? "Nous vous encourageons à aller de l'avant avec cette décision, tout en prenant le temps de bien planifier les prochaines étapes."
          : "Mamporisika anao izahay handroso amin'ity fanapahan-kevitra ity, ary maka fotoana handrindra tsara ny dingana manaraka."
    } else if (percentage >= 50) {
      aptitude = t.endPossible
      description =
        language === "fr"
          ? "Mettre fin à cette situation est une option viable, mais certains aspects méritent encore réflexion. Vous avez fait un bon travail d'analyse."
          : "Ny fametrahana farany amin'ity toe-javatra ity dia safidy azo atao, saingy misy lafiny sasany mbola mila fieritreretana. Nanao asa tsara tamin'ny famakafakana ianao."
      recommendation =
        language === "fr"
          ? "Prenez encore un peu de temps pour réfléchir aux points qui vous préoccupent, mais sachez que cette fin semble être une direction positive."
          : "Makà fotoana kely hieritreretana ny zavatra mampiahiahy anao, fa fantaro fa ity farany ity dia toa lalana tsara."
    } else if (percentage >= 25) {
      aptitude = t.endNeutral
      description =
        language === "fr"
          ? "Votre situation présente à la fois des raisons de mettre fin et de continuer. Il y a une certaine ambivalence dans vos réponses."
          : "Ny toe-javatra misy anao dia maneho antony hamaranana sy hanohy. Misy fisalasalana amin'ny valinteninao."
      recommendation =
        language === "fr"
          ? "Avant de prendre une décision définitive, essayez d'explorer d'autres options ou de résoudre certains des obstacles identifiés."
          : "Alohan'ny handray fanapahan-kevitra farany, andramo ny hitady safidy hafa na hamaha ny sakana sasany hita."
    } else {
      aptitude = t.endNotRecommended
      description =
        language === "fr"
          ? "D'après vos réponses, mettre fin à cette situation ne semble pas être la meilleure option pour le moment. Plusieurs facteurs importants suggèrent de reconsidérer cette décision."
          : "Araka ny valinteninao, ny fametrahana farany amin'ity toe-javatra ity dia toa tsy safidy tsara indrindra amin'izao fotoana izao. Misy antony maro manan-danja manoro hevitra handinika indray ity fanapahan-kevitra ity."
      recommendation =
        language === "fr"
          ? "Nous vous suggérons d'explorer d'autres approches et solutions avant d'envisager une fin définitive."
          : "Manoro hevitra anao izahay hitady fomba sy vahaolana hafa alohan'ny hieritreretana farany raikitra."
    }

    setResult({
      percentage,
      aptitude,
      description,
      strengths,
      weaknesses,
      recommendation,
    })

    setIsCompleted(true)
    setShowResult(true)
  }

  const getCategoryLabel = (category) => {
    const labels = {
      fr: {
        émotionnel: "Préparation émotionnelle",
        créatif: "Vision de l'avenir",
        résolution: "Analyse des alternatives",
        expression: "Soutien social",
        détachement: "Détachement",
      },
      mg: {
        émotionnel: "Fiomanana ara-pihetseham-po",
        créatif: "Fahitana ny ho avy",
        résolution: "Famakafakana ny safidy hafa",
        expression: "Fanohanana ara-tsosialy",
        détachement: "Fahafahana mamela",
      },
    }

    return labels[language]?.[category] || category
  }

  const handleRetake = () => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setIsCompleted(false)
    setShowResult(false)
    setSelectedAnswer(null)
  }

  const handleWriteEnd = () => {
    if (onComplete) {
      onComplete(result)
    }
    // Redirection vers la section d'écriture
    window.location.href = "#write"
  }

  // Obtenir la couleur en fonction du score
  const getScoreColor = (score) => {
    if (score <= 3) return "#e76f51" // rouge-orange pour les scores bas
    if (score <= 6) return "#e9c46a" // jaune pour les scores moyens
    return "#4a6741" // vert pour les scores élevés
  }

  return (
    <div className="dernier-fin-container">
      {!showResult ? (
        <div className="quiz-container">
          <div className="quiz-header">
            <h2>{t.title}</h2>
            <p>{t.subtitle}</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
              ></div>
            </div>
            <p className="progress-text">
              {t.question} {currentQuestionIndex + 1} {t.of} {questions.length}
            </p>
          </div>

          <div className={`question-container ${animation}`}>
            <div className="question-card">
              <h3>{currentQuestion.text}</h3>

              <div className="options-container">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`option-item ${selectedAnswer === index ? "selected" : ""}`}
                    onClick={() => handleOptionSelect(index)}
                    style={{
                      "--option-color": getScoreColor(option.score),
                    }}
                  >
                    <div className="option-content">
                      <div className="option-marker">{String.fromCharCode(65 + index)}</div>
                      <div className="option-text">{option.text}</div>
                    </div>
                    {selectedAnswer === index && (
                      <div className="option-check">
                        <Check size={18} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="question-category">
                <span className="category-badge">{getCategoryLabel(currentQuestion.options[0].category)}</span>
              </div>
            </div>
          </div>

          <div className="quiz-navigation">
            <button className="nav-button previous" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              <ChevronLeft size={20} />
              {t.previous}
            </button>

            <button className="nav-button next" onClick={handleNext} disabled={selectedAnswer === null}>
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  {t.next}
                  <ChevronRight size={20} />
                </>
              ) : (
                <>
                  {t.submit}
                  <Check size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="result-container">
          <div className="result-header">
            <h2>{t.resultTitle}</h2>
            <p>{t.resultDescription}</p>
          </div>

          <div className="result-content">
            <div className="result-circle-container">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e76f51" />
                    <stop offset="50%" stopColor="#e9c46a" />
                    <stop offset="100%" stopColor="#4a6741" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="70" fill="none" stroke="#e0e0e0" strokeWidth="12" />
                <circle
                  ref={resultCircleRef}
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="url(#circleGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
                <text
                  x="100"
                  y="90"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="36"
                  fontWeight="bold"
                  fill="#8b4513"
                >
                  {result.percentage}%
                </text>
                <text x="100" y="120" textAnchor="middle" dominantBaseline="middle" fontSize="16" fill="#8b4513">
                  {result.aptitude}
                </text>
              </svg>
            </div>

            <div className="result-details">
              <p className="result-description">{result.description}</p>

              <div className="result-recommendation">
                <h4>
                  <Star size={18} />
                  {t.recommendation}
                </h4>
                <p>{result.recommendation}</p>
              </div>

              <div className="result-categories">
                <div className="result-category strengths">
                  <h4>
                    <Star size={16} />
                    {t.strengths}
                  </h4>
                  <ul>
                    {result.strengths.length > 0 ? (
                      result.strengths.map((strength, index) => <li key={index}>{strength}</li>)
                    ) : (
                      <li>
                        {language === "fr"
                          ? "Continuez à explorer vos points forts"
                          : "Tohizo ny fikarohana ny tanjaka anananao"}
                      </li>
                    )}
                  </ul>
                </div>

                <div className="result-category weaknesses">
                  <h4>
                    <Sparkles size={16} />
                    {t.weaknesses}
                  </h4>
                  <ul>
                    {result.weaknesses.length > 0 ? (
                      result.weaknesses.map((weakness, index) => <li key={index}>{weakness}</li>)
                    ) : (
                      <li>
                        {language === "fr"
                          ? "Vous avez une bonne maîtrise dans tous les domaines"
                          : "Manana fahaiza-manao tsara amin'ny sehatra rehetra ianao"}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="result-actions">
            <button className="action-button retake" onClick={handleRetake}>
              <X size={16} />
              {t.retakeQuiz}
            </button>
            <button className="action-button write-end" onClick={handleWriteEnd}>
              <PenLine size={16} />
              {t.writeEnd}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DernierFin
