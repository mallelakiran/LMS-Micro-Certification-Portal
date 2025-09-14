import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
        <h1 style={{ 
          fontSize: '48px', 
          marginBottom: '20px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🎓 LMS Micro-Certification Portal
        </h1>
        
        <p style={{ 
          fontSize: '20px', 
          color: '#666', 
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          Take interactive quizzes, test your knowledge, and earn professional certificates 
          to showcase your skills and advance your career.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '30px',
          margin: '40px 0'
        }}>
          <div style={{ padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📝</div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Interactive Quizzes</h3>
            <p style={{ color: '#666' }}>
              Take engaging multiple-choice quizzes with instant feedback and detailed results.
            </p>
          </div>
          
          <div style={{ padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>⏱️</div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Timed Challenges</h3>
            <p style={{ color: '#666' }}>
              Test your knowledge under time pressure with our timed quiz format.
            </p>
          </div>
          
          <div style={{ padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏆</div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Digital Certificates</h3>
            <p style={{ color: '#666' }}>
              Earn beautiful PDF certificates for successful quiz completions.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '40px' }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn" style={{ 
              fontSize: '18px', 
              padding: '15px 30px',
              textDecoration: 'none'
            }}>
              Go to Dashboard
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <Link to="/register" className="btn" style={{ 
                fontSize: '18px', 
                padding: '15px 30px',
                textDecoration: 'none'
              }}>
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ 
                fontSize: '18px', 
                padding: '15px 30px',
                textDecoration: 'none'
              }}>
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          Available Certifications
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px'
        }}>
          <div className="card" style={{ margin: 0, background: '#f8f9fa' }}>
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>
              JavaScript Fundamentals
            </h3>
            <p style={{ color: '#666', marginBottom: '15px' }}>
              Test your knowledge of JavaScript basics including variables, functions, and operators.
            </p>
            <div style={{ fontSize: '14px', color: '#888' }}>
              ⏱️ 15 minutes • 📝 5 questions • 🎯 70% to pass
            </div>
          </div>
          
          <div className="card" style={{ margin: 0, background: '#f8f9fa' }}>
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>
              React Basics
            </h3>
            <p style={{ color: '#666', marginBottom: '15px' }}>
              Understanding React components, JSX, hooks, and state management fundamentals.
            </p>
            <div style={{ fontSize: '14px', color: '#888' }}>
              ⏱️ 20 minutes • 📝 5 questions • 🎯 75% to pass
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
