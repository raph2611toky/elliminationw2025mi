"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./DernierFin.css";
import { api } from "../hooks/api"
const DernierFin = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reponses, setReponses] = useState({});
  const [quizzId, setQuizzId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = api;

  // Fetch all quizzes
  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/quizzes/?detail=true`);
      console.log("Réponse API :", response.data);
      setQuizzes(response.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des quizzes :", error);
      setError("Impossible de charger les catégories. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // Select a quiz and load its questions
  const selectQuiz = useCallback((quiz) => {
    setSelectedQuiz(quiz);
    setQuizzId(quiz.id);
    setQuestions(quiz.questions || []);
    setCurrentQuestion(1);
    setReponses({});
    setSubmitted(false);
    setError(null);
  }, []);

  // Handle response selection
  const handleSelect = useCallback((questionId, reponseId) => {
    setReponses((prev) => ({
      ...prev,
      [questionId]: [reponseId],
    }));
  }, []);

  // Submit quiz responses
  const handleSubmit = useCallback(async () => {
    if (!quizzId || !Object.keys(reponses).length) {
      setError("Veuillez répondre à au moins une question.");
      return;
    }

    const payload = {
      quizz_id: quizzId,
      reponses_par_questions: Object.entries(reponses).map(([question_id, reponse_ids]) => ({
        question_id,
        reponse_ids,
      })),
    };

    try {
  setLoading(true);
  setError(null);
""; 
  const token = localStorage.getItem("token")
  if (token){
  await axios.post(
    `${API_URL}/quizzes/soummettre/`, {quizz_id : quizzId,
    reponses_par_questions: payload.reponses_par_questions},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );}

  setSubmitted(true);
  console.log(payload)
  }catch (error) {
      console.error("Erreur lors de la soumission :", error);
      setError("Erreur lors de la soumission. Veuillez réessayer.");
      console.log(payload)
    } finally {
      setLoading(false);
    }
  }, [quizzId, reponses, API_URL]);

  // Navigate to next question
  const nextQuestion = useCallback(() => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
    }
  }, [currentQuestion, questions.length]);

  // Navigate to previous question
  const prevQuestion = useCallback(() => {
    if (currentQuestion > 1) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }, [currentQuestion]);

  // Extract unique categories
  const categories = [...new Set(quizzes.map((quiz) => quiz.categorie))];

  // Filter quizzes by selected category
  const filteredQuizzes = selectedCategory
    ? quizzes.filter((quiz) => quiz.categorie === selectedCategory)
    : [];

  // Render loading state
  if (loading) return <div className="quiz-container">Chargement en cours...</div>;

  // Render error state
  if (error) return <div className="quiz-container error">{error}</div>;

  // Render category selection
  if (!selectedCategory) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">Choisissez une catégorie</h1>
        <div className="options-container">
          {categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category}
                className="option-button"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))
          ) : (
            <p>Aucune catégorie disponible.</p>
          )}
        </div>
      </div>
    );
  }

  // Render quiz selection
  if (!selectedQuiz && selectedCategory) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">Choisissez un quiz</h1>
        <button
          className="nav-button"
          onClick={() => setSelectedCategory(null)}
        >
          Retour aux catégories
        </button>
        <div className="options-container">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => (
              <button
                key={quiz.id}
                className="option-button"
                onClick={() => selectQuiz(quiz)}
              >
                {quiz.nom}
              </button>
            ))
          ) : (
            <p>Aucun quiz disponible dans cette catégorie.</p>
          )}
        </div>
      </div>
    );
  }

  // Render submitted state
  if (submitted) return <div className="quiz-container">Merci pour vos réponses !</div>;

  // Render no questions state
  if (!questions.length) return <div className="quiz-container">Aucune question disponible.</div>;

  // Render quiz
  const currentQuestionData = questions[currentQuestion - 1];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1 className="quiz-title">{currentQuestionData?.contenu || "Question sans titre"}</h1>
        <button
          className="nav-button"
          onClick={() => setSelectedQuiz(null)}
        >
          Retour aux menus
        </button>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
        />
      </div>

      <div className="question-counter">
        Question {currentQuestion} sur {questions.length}
      </div>

      <div className="options-container">
        {currentQuestionData?.reponses?.map((option) => (
          <button
            key={option.id}
            className={`option-button ${
              reponses[currentQuestionData.id]?.includes(option.id) ? "selected" : ""
            }`}
            onClick={() => handleSelect(currentQuestionData.id, option.id)}
            disabled={submitted}
          >
            {option.contenu || "Réponse sans texte"}
          </button>
        )) || <p>Aucune réponse disponible.</p>}
      </div>

      <div className="navigation-buttons">
        <button
          className="nav-button prev-button"
          onClick={prevQuestion}
          disabled={currentQuestion === 1}
        >
          Précédent
        </button>
        {currentQuestion === questions.length ? (
          <button
            className="nav-button submit-button"
            onClick={handleSubmit}
            disabled={loading || submitted}
          >
            Soumettre
          </button>
        ) : (
          <button
            className="nav-button next-button"
            onClick={nextQuestion}
            disabled={currentQuestion === questions.length}
          >
            Suivant
          </button>
        )}
      </div>
    </div>
  );
};

export default DernierFin;