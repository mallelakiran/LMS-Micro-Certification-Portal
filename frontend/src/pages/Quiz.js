import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../utils/api';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz) {
      handleSubmit();
    }
  }, [timeLeft, quiz]);

  const fetchQuiz = async () => {
    try {
      const response = await quizAPI.getQuiz(id);
      const { quiz, questions } = response.data;
      
      setQuiz(quiz);
      setQuestions(questions);
      setTimeLeft(quiz.time_limit * 60); // Convert minutes to seconds
    } catch (error) {
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    
    try {
      const timeTaken = (quiz.time_limit * 60) - timeLeft;
      const response = await quizAPI.submitQuiz(id, {
        answers,
        timeTaken
      });
      
      navigate(`/result/${response.data.resultId}`);
    } catch (error) {
      setError('Failed to submit quiz');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>{quiz.title}</h2>
          <div style={{ 
            background: timeLeft < 300 ? '#dc3545' : '#667eea', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '8px',
            fontWeight: 'bold'
          }}>
            ⏰ {formatTime(timeLeft)}
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div style={{ margin: '20px 0', color: '#666' }}>
          Question {currentQuestion + 1} of {questions.length}
        </div>

        <div className="card" style={{ margin: '20px 0', background: '#f8f9fa' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>
            {question.question_text}
          </h3>

          <div>
            {['A', 'B', 'C', 'D'].map((option) => (
              <div
                key={option}
                className={`quiz-option ${answers[question.id] === option ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(question.id, option)}
              >
                <strong>{option}.</strong> {question[`option_${option.toLowerCase()}`]}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn btn-secondary"
          >
            ← Previous
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="btn"
                disabled={!answers[question.id]}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn btn-success"
                disabled={!answers[question.id] || submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', background: '#e9ecef', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '10px' }}>Answer Summary:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {questions.map((q, index) => (
              <div
                key={q.id}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: answers[q.id] ? '#28a745' : '#6c757d',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
