-- LMS Micro-Certification Portal Database Schema
CREATE DATABASE IF NOT EXISTS lms_certification;
USE lms_certification;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Quizzes table
CREATE TABLE quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    passing_score INT DEFAULT 70,
    total_questions INT NOT NULL,
    time_limit INT DEFAULT 30, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Results table
CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    passed BOOLEAN NOT NULL,
    time_taken INT, -- in seconds
    answers JSON, -- store user answers
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Sample quiz data
INSERT INTO quizzes (title, description, passing_score, total_questions, time_limit) VALUES
('JavaScript Fundamentals', 'Test your knowledge of JavaScript basics', 70, 5, 15),
('React Basics', 'Understanding React components and state management', 75, 5, 20);

-- Sample questions for JavaScript Fundamentals (quiz_id = 1)
INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES
(1, 'What is the correct way to declare a variable in JavaScript?', 'var myVar;', 'variable myVar;', 'v myVar;', 'declare myVar;', 'A'),
(1, 'Which method is used to add an element to the end of an array?', 'push()', 'add()', 'append()', 'insert()', 'A'),
(1, 'What does "=== " operator do in JavaScript?', 'Assignment', 'Equality with type conversion', 'Strict equality without type conversion', 'Not equal', 'C'),
(1, 'How do you create a function in JavaScript?', 'function myFunction() {}', 'create myFunction() {}', 'def myFunction() {}', 'func myFunction() {}', 'A'),
(1, 'What is the result of "2" + 2 in JavaScript?', '4', '22', 'Error', 'undefined', 'B');

-- Sample questions for React Basics (quiz_id = 2)
INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES
(2, 'What is JSX?', 'A JavaScript library', 'A syntax extension for JavaScript', 'A database', 'A CSS framework', 'B'),
(2, 'How do you create a React component?', 'function Component() {}', 'class Component extends React.Component {}', 'Both A and B', 'component Component() {}', 'C'),
(2, 'What hook is used to manage state in functional components?', 'useEffect', 'useState', 'useContext', 'useReducer', 'B'),
(2, 'How do you pass data to a child component?', 'Through props', 'Through state', 'Through context', 'Through refs', 'A'),
(2, 'What is the virtual DOM?', 'A real DOM element', 'A JavaScript representation of the real DOM', 'A CSS framework', 'A database', 'B');
