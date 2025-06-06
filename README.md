# Linkly

A secure, modern, and efficient URL shortening service built with Node.js, Express, React, and MongoDB. Users can create and manage their own short links, track analytics, and enjoy a privacy-focused, responsive interface.

## Features

- Shorten long URLs to easily shareable links
- User authentication with JWT (secure login/register)
- Each user sees only their own links (privacy enforced)
- Track click counts and analytics for each URL
- Admin analytics dashboard (users, URLs, clicks, clicks-over-time)
- Python analytics script for advanced charting
- Clean RESTful API design
- Modern, accessible UI (React + Tailwind, dark mode, high contrast)
- Real-time validation and password visibility toggle
- Copy to clipboard functionality
- Mobile-friendly design

## Technology Stack

- **Backend**: Node.js, Express, MongoDB, JWT
- **Frontend**: React, Tailwind CSS
- **Analytics**: Python (matplotlib)
- **Deployment**: Docker support (optional)

## Installation

1. Clone the repository:
```bash
# Backend/monorepo
 git clone https://github.com/yourusername/url-shortener.git
 cd url-shortener
```

2. Install dependencies:
```bash
# Backend
cd backend && npm install
# Frontend
cd ../frontend && npm install
```

3. Create a `.env` file in both `backend/` and `frontend/` directories (see `.env.example` if present):
```
# backend/.env
MONGODB_URI=your_mongodb_connection_string
PORT=8000
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# frontend/.env
REACT_APP_API_URL=http://localhost:8000
```

4. Start the development servers:
```bash
# Terminal 1 - Backend
cd backend && npm run dev
# Terminal 2 - Frontend
cd frontend && npm start
```

5. (Optional) Run analytics chart script:
```bash
cd analytics
python analytics_charts.py
```

## Usage

### Web Interface

1. Access the web interface at `http://localhost:3000` (or your configured frontend port)
2. Register/login to your account
3. Shorten URLs, view/copy your links, and see analytics
4. Admins can view global analytics and charts

### API Endpoints (JWT required for most)

#### Shorten a URL
```
POST /api/shorten
Authorization: Bearer <JWT>
```
Body:
```json
{
  "origUrl": "https://example.com/very/long/url"
}
```

#### Get your URLs
```
GET /api/my
Authorization: Bearer <JWT>
```

#### Admin analytics (admin only)
```
GET /api/admin/analytics
GET /api/admin/clicks-over-time
Authorization: Bearer <JWT>
```

#### Redirect to original URL
```
GET /:code
```

## Project Structure

```
url-shortener/
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
└── ...
```

## Security & Privacy
- All user actions require JWT authentication
- Users can only access their own data
- Admin endpoints are protected
- Secrets are stored in `.env` (never commit to git)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [matplotlib](https://matplotlib.org/)
