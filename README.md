#  DevPrep - Smart Interview Preparation Platform

AI-powered platform that analyzes your resume against job descriptions, identifies skill gaps, and generates personalized interview preparation plans.

##  Features

-  **Resume Analysis** - Upload PDF resume for AI-powered analysis
-  **Job Description Matching** - Compare your resume with any job posting
-  **Match Score** - Get accurate compatibility percentage
-  **Technical Questions** - Role-specific technical interview questions with sample answers
-  **Behavioral Questions** - Common behavioral and situational questions
-  **Skill Gap Analysis** - Identify missing skills and improvement areas
-  **Preparation Plan** - Day-wise structured study plan
-  **Secure Authentication** - Email/Password + Google OAuth 2.0
-  **Rate Limiting** - Protection against brute force attacks
-  **JWT Tokens** - Access + Refresh token based authentication

##  Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Axios
- Google OAuth

### Backend  
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Google Auth Library
- Express Rate Limit

##  API Endpoints

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|-------------|
| POST | `/register` | Register new user | 5 req/10 sec |
| POST | `/login` | Login with username/email | 5 req/10 sec |
| POST | `/google` | Google OAuth login | 3 req/10 sec |
| POST | `/logout` | Logout user | No limit |
| GET | `/refresh-token` | Refresh access token | 10 req/10 sec |

