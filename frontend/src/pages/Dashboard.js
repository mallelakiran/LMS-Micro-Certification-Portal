import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await quizAPI.getQuizzes();
      setQuizzes(response.data.quizzes);
    } catch (error) {
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginBottom: '10px', color: '#333' }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Choose a quiz below to start your certification journey
        </p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <div className="quiz-grid" style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card" style={{ margin: 0 }}>
              <h3 style={{ color: '#667eea', marginBottom: '15px' }}>
                {quiz.title}
              </h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                {quiz.description}
              </p>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span><strong>Questions:</strong> {quiz.total_questions}</span>
                  <span><strong>Time Limit:</strong> {quiz.time_limit} min</span>
                </div>
                <div>
                  <span><strong>Passing Score:</strong> {quiz.passing_score}%</span>
                </div>
              </div>

              <Link 
                to={`/quiz/${quiz.id}`} 
                className="btn"
                style={{ width: '100%', textDecoration: 'none' }}
              >
                Start Quiz
              </Link>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <h3>No quizzes available at the moment</h3>
            <p>Please check back later for new certification opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
