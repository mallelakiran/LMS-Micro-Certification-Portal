const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all available quizzes
router.get('/quizzes', authenticateToken, async (req, res) => {
  try {
    const [quizzes] = await pool.execute(
      'SELECT id, title, description, passing_score, total_questions, time_limit FROM quizzes ORDER BY created_at DESC'
    );

    res.json({ quizzes });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all available quizzes (public endpoint for testing)
router.get('/quizzes/public', async (req, res) => {
  try {
    console.log('Public quizzes endpoint called');
    const [quizzes] = await pool.execute(
      'SELECT id, title, description, passing_score, total_questions, time_limit FROM quizzes ORDER BY created_at DESC'
    );
    console.log('Quizzes fetched:', quizzes.length);
    res.json({ quizzes });
  } catch (error) {
    console.error('Get public quizzes error:', error);
    res.status(500).json({ 
      error: 'Database connection failed', 
      details: error.message,
      code: error.code 
    });
  }
});

// Get quiz details with questions
router.get('/quiz/:id', authenticateToken, async (req, res) => {
  try {
    const quizId = req.params.id;

    // Get quiz details
    const [quizzes] = await pool.execute(
      'SELECT id, title, description, passing_score, total_questions, time_limit FROM quizzes WHERE id = ?',
      [quizId]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Get questions (without correct answers for security)
    const [questions] = await pool.execute(
      'SELECT id, question_text, option_a, option_b, option_c, option_d FROM questions WHERE quiz_id = ? ORDER BY id',
      [quizId]
    );

    res.json({
      quiz: quizzes[0],
      questions
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit quiz answers and get results
router.post('/quiz/:id/submit', authenticateToken, async (req, res) => {
  try {
    const quizId = req.params.id;
    const { answers, timeTaken } = req.body;
    const userId = req.user.id;

    // Get quiz details
    const [quizzes] = await pool.execute(
      'SELECT id, title, passing_score, total_questions FROM quizzes WHERE id = ?',
      [quizId]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quiz = quizzes[0];

    // Get correct answers
    const [questions] = await pool.execute(
      'SELECT id, correct_answer FROM questions WHERE quiz_id = ? ORDER BY id',
      [quizId]
    );

    // Calculate score
    let correctAnswers = 0;
    const detailedResults = [];

    questions.forEach((question, index) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correct_answer;
      
      if (isCorrect) {
        correctAnswers++;
      }

      detailedResults.push({
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correct_answer,
        isCorrect
      });
    });

    const percentage = Math.round((correctAnswers / quiz.total_questions) * 100);
    const passed = percentage >= quiz.passing_score;

    // Save result to database
    const [result] = await pool.execute(
      'INSERT INTO results (user_id, quiz_id, score, total_questions, percentage, passed, time_taken, answers) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, quizId, correctAnswers, quiz.total_questions, percentage, passed, timeTaken, JSON.stringify(answers)]
    );

    res.json({
      resultId: result.insertId,
      score: correctAnswers,
      totalQuestions: quiz.total_questions,
      percentage,
      passed,
      passingScore: quiz.passing_score,
      timeTaken,
      quizTitle: quiz.title,
      detailedResults
    });

  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's quiz results
router.get('/results', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [results] = await pool.execute(
      `SELECT r.id, r.score, r.total_questions, r.percentage, r.passed, r.time_taken, r.created_at,
              q.title as quiz_title
       FROM results r
       JOIN quizzes q ON r.quiz_id = q.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );

    res.json({ results });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific result details
router.get('/result/:id', authenticateToken, async (req, res) => {
  try {
    const resultId = req.params.id;
    const userId = req.user.id;

    const [results] = await pool.execute(
      `SELECT r.*, q.title as quiz_title, u.name as user_name
       FROM results r
       JOIN quizzes q ON r.quiz_id = q.id
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ? AND r.user_id = ?`,
      [resultId, userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json({ result: results[0] });
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
