import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../utils/api';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await quizAPI.getResults();
      setResults(response.data.results);
    } catch (error) {
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
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
        <h1 style={{ marginBottom: '30px', color: '#333' }}>
          My Quiz Results
        </h1>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {results.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <h3>No quiz results yet</h3>
            <p>Take your first quiz to see your results here.</p>
            <Link to="/dashboard" className="btn">
              Browse Quizzes
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {results.map((result) => (
              <div key={result.id} className="card" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ color: '#667eea', marginBottom: '5px' }}>
                      {result.quiz_title}
                    </h3>
                    <p style={{ color: '#666', margin: 0 }}>
                      Completed on {new Date(result.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div style={{ 
                    background: result.passed ? '#28a745' : '#dc3545',
                    color: 'white',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {result.passed ? 'PASSED' : 'FAILED'}
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <strong>Score:</strong> {result.score}/{result.total_questions}
                  </div>
                  <div>
                    <strong>Percentage:</strong> {result.percentage}%
                  </div>
                  <div>
                    <strong>Time Taken:</strong> {formatTime(result.time_taken)}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link 
                    to={`/result/${result.id}`}
                    className="btn btn-secondary"
                  >
                    View Details
                  </Link>
                  {result.passed && (
                    <Link 
                      to={`/result/${result.id}`}
                      className="btn btn-success"
                    >
                      Download Certificate
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
