import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quizAPI, certificateAPI } from '../utils/api';

const Result = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      const response = await quizAPI.getResult(id);
      setResult(response.data.result);
    } catch (error) {
      setError('Failed to load result');
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async () => {
    if (!result.passed) return;
    
    setDownloadingCertificate(true);
    
    try {
      const response = await certificateAPI.downloadCertificate(id);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${result.quiz_title.replace(/\s+/g, '-')}-${result.user_name.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download certificate');
    } finally {
      setDownloadingCertificate(false);
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

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="result-card card">
        <h1 style={{ marginBottom: '30px', color: '#333' }}>
          Quiz Results
        </h1>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#667eea', marginBottom: '10px' }}>
            {result.quiz_title}
          </h2>
          <p style={{ color: '#666' }}>
            Completed on {new Date(result.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className={`result-score ${result.passed ? 'passed' : 'failed'}`}>
          {result.score}/{result.total_questions}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h3 style={{ 
            color: result.passed ? '#28a745' : '#dc3545',
            marginBottom: '10px'
          }}>
            {result.passed ? '🎉 Congratulations! You Passed!' : '😔 You Did Not Pass'}
          </h3>
          <p style={{ fontSize: '18px', color: '#666' }}>
            Your Score: <strong>{result.percentage}%</strong>
          </p>
          <p style={{ color: '#666' }}>
            Passing Score: {result.quiz_title.includes('React') ? '75' : '70'}% | 
            Time Taken: {formatTime(result.time_taken)}
          </p>
        </div>

        {result.passed && (
          <div className="certificate-section">
            <h3 style={{ marginBottom: '20px', color: '#333' }}>
              🏆 Certificate Available
            </h3>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Congratulations! You've successfully completed the {result.quiz_title} quiz. 
              Download your certificate to showcase your achievement.
            </p>
            <button
              onClick={downloadCertificate}
              disabled={downloadingCertificate}
              className="btn btn-success"
              style={{ fontSize: '18px', padding: '15px 30px' }}
            >
              {downloadingCertificate ? 'Generating Certificate...' : '📄 Download Certificate'}
            </button>
          </div>
        )}

        {!result.passed && (
          <div style={{ 
            background: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#dc3545', marginBottom: '10px' }}>
              Don't Give Up!
            </h4>
            <p style={{ color: '#666', marginBottom: '15px' }}>
              You need {result.quiz_title.includes('React') ? '75' : '70'}% to pass. 
              Review the material and try again when you're ready.
            </p>
            <Link to="/dashboard" className="btn">
              Try Another Quiz
            </Link>
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '15px',
          marginTop: '30px'
        }}>
          <Link to="/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>
          <Link to="/results" className="btn">
            View All Results
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Result;
