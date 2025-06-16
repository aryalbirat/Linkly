# Linkly – Privacy-First URL Shortener with Built-in Analytics🔗

[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v5+-green.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3+-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A secure, modern, and efficient URL shortening service built with Node.js, Express, React, and MongoDB. Users can create and manage their own short links, track analytics, and enjoy a privacy-focused, responsive interface.



## ✨ Features

- **Link Management**
  - Shorten long URLs to easily shareable links
  - Copy to clipboard functionality
  - Custom URL slugs (optional)

- **Security & Privacy**
  - User authentication with JWT (secure login/register)
  - Each user sees only their own links (privacy enforced)
  - Password visibility toggle and validation

- **Analytics & Insights**
  - Track click counts and analytics for each URL
  - Admin analytics dashboard (users, URLs, clicks, clicks-over-time)
  - Python analytics script for advanced charting

- **User Experience**
  - Modern, accessible UI (React + Tailwind)
  - Dark mode with high contrast
  - Mobile-friendly responsive design
  - Real-time validation

## 🛠️ Technology Stack

- **Backend**: Node.js, Express, MongoDB, JWT
- **Frontend**: React, Tailwind CSS
- **Analytics**: Python (matplotlib)
- **Deployment**: Docker support (optional)

## 🚀 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB instance
- Python (optional, for analytics)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/linkly.git
   cd linkly
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

3. **Configure environment:**
   
   Create a `.env` file in both `backend/` and `frontend/` directories:

   ```ini
   # backend/.env
   MONGODB_URI=your_mongodb_connection_string
   PORT=8000
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development

   # frontend/.env
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Start development servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

5. **Run analytics (optional):**
   ```bash
   cd analytics
   python analytics_charts.py
   ```

## 📋 Usage

### Web Interface

1. Access the web interface at `http://localhost:3000`
2. Register/login to your account
3. Shorten URLs, view/copy your links, and see analytics
4. Admins can access global analytics and charts

### API Endpoints

> 🔒 Most endpoints require JWT authentication

#### Create Short URL
```http
POST /api/shorten
Authorization: Bearer <JWT>

{
  "origUrl": "https://example.com/very/long/url"
}
```

#### Get Your URLs
```http
GET /api/my
Authorization: Bearer <JWT>
```

#### Admin Analytics
```http
GET /api/admin/analytics
GET /api/admin/clicks-over-time
Authorization: Bearer <JWT>
```

#### Redirect to Original URL
```http
GET /:code
```

## 📂 Project Structure

```
linkly/
├── backend/                # Node/Express backend
│   ├── controllers/        # Controllers
│   ├── middleware/         # JWT/auth middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── public/             # Static files
│   └── ...
├── frontend/               # React frontend
│   ├── src/                # Components, contexts, styles
│   └── ...
├── analytics/              # Python analytics scripts
│   └── analytics_charts.py # Charting for admin
├── .gitignore              # Optimized for Node, React, Python
└── README.md               # This file
```

## 🔐 Security & Privacy

- All user actions require JWT authentication
- Users can only access their own data
- Admin endpoints are protected
- Secrets are stored in `.env` (never commit to git)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Express.js](https://expressjs.com/) - Fast, unopinionated, minimalist web framework
- [MongoDB](https://www.mongodb.com/) - Document database
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [matplotlib](https://matplotlib.org/) - Python plotting library
