# LMS Micro-Certification Portal

A comprehensive micro-certification platform where students can take interactive quizzes, view instant results, and download professional certificates. Built with React, Node.js, Express, and MySQL.

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **Interactive Quizzes**: Question-by-question navigation with timed challenges
- **Instant Results**: Real-time score calculation with pass/fail status
- **PDF Certificates**: Auto-generated professional certificates for passed quizzes
- **Results Dashboard**: Track all quiz attempts and download certificates
- **Responsive Design**: Modern UI that works on all devices

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- Modern CSS with responsive design

### Backend
- Node.js
- Express.js
- MySQL with mysql2
- JWT Authentication
- bcryptjs for password hashing
- PDFKit for certificate generation

### Database
- MySQL with structured schema
- Users, Quizzes, Questions, and Results tables

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd "LMS Micro-Certification Portal"
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
cd ..
```

### 3. Database Setup

1. **Start MySQL Server** and create the database:
```sql
CREATE DATABASE lms_certification;
```

2. **Import the schema**:
```bash
mysql -u root -p lms_certification < backend/database/schema.sql
```

3. **Configure Database Connection**:
   - Update `backend/.env` with your MySQL credentials:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=lms_certification
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 4. Start the Application

#### Development Mode (Both Frontend & Backend)
```bash
npm run dev
```

#### Or Start Individually

**Backend Server:**
```bash
cd backend
npm run dev
```

**Frontend Development Server:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Usage

### 1. User Registration/Login
- Visit http://localhost:3000
- Register a new account or login with existing credentials
- Navigate to the dashboard after successful authentication

### 2. Taking Quizzes
- Browse available quizzes on the dashboard
- Click "Start Quiz" to begin
- Answer questions one by one with the navigation controls
- Submit the quiz when completed or when time runs out

### 3. Viewing Results
- Get instant results after quiz submission
- View detailed score breakdown and pass/fail status
- Download PDF certificate for passed quizzes (70%+ for JavaScript, 75%+ for React)

### 4. Managing Results
- Access "My Results" to view all quiz attempts
- Download certificates for passed quizzes
- Track your progress over time

## 🗄️ Database Schema

### Users Table
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `created_at`, `updated_at`: Timestamps

### Quizzes Table
- `id`: Primary key
- `title`: Quiz title
- `description`: Quiz description
- `passing_score`: Minimum percentage to pass
- `total_questions`: Number of questions
- `time_limit`: Time limit in minutes

### Questions Table
- `id`: Primary key
- `quiz_id`: Foreign key to quizzes
- `question_text`: The question
- `option_a`, `option_b`, `option_c`, `option_d`: Multiple choice options
- `correct_answer`: Correct option (A, B, C, or D)

### Results Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `quiz_id`: Foreign key to quizzes
- `score`: Number of correct answers
- `total_questions`: Total questions in quiz
- `percentage`: Score percentage
- `passed`: Boolean pass/fail status
- `time_taken`: Time taken in seconds
- `answers`: JSON object storing user answers

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quiz/:id` - Get quiz with questions
- `POST /api/quiz/:id/submit` - Submit quiz answers

### Results
- `GET /api/results` - Get user's results
- `GET /api/result/:id` - Get specific result

### Certificates
- `GET /api/certificate/:resultId` - Download certificate PDF

## 🚀 Deployment

### Vercel Deployment

1. **Prepare for deployment**:
```bash
cd frontend
npm run build
```

2. **Deploy Frontend to Vercel**:
   - Connect your GitHub repository to Vercel
   - Set build command: `cd frontend && npm run build`
   - Set output directory: `frontend/build`

3. **Deploy Backend to Vercel**:
   - Create `vercel.json` in backend directory
   - Configure environment variables in Vercel dashboard
   - Set up MySQL database (consider PlanetScale or Railway)

4. **Environment Variables for Production**:
   - Update API URLs in frontend
   - Configure production database
   - Set secure JWT secrets

## 🧪 Sample Data

The application comes with pre-loaded sample quizzes:

1. **JavaScript Fundamentals** (5 questions, 15 minutes, 70% to pass)
2. **React Basics** (5 questions, 20 minutes, 75% to pass)

## 🎨 Features Showcase

### Quiz Interface
- Clean, modern design with progress tracking
- Timer with visual warnings
- Question navigation with answer summary
- Responsive layout for all devices

### Certificate Generation
- Professional PDF certificates with user details
- Unique certificate IDs for verification
- Branded design with completion date and score

### Results Dashboard
- Comprehensive results history
- Filter and sort capabilities
- Direct certificate download links
- Performance analytics

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- Input validation and sanitization
- CORS configuration

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify MySQL server is running
   - Check database credentials in `.env`
   - Ensure database exists and schema is imported

2. **Port Already in Use**:
   - Change ports in `.env` and `package.json`
   - Kill existing processes: `npx kill-port 3000 5000`

3. **Certificate Download Issues**:
   - Ensure user has passed the quiz
   - Check browser popup blockers
   - Verify PDF generation dependencies

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For support and questions, please open an issue in the GitHub repository.

---

**Built with ❤️ for the AGH LMS Integration Project**
