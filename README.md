# URL Shortener

A simple and efficient URL shortening service built with Node.js, Express js, React js and MongoDB. This application allows users to create shortened URLs, track click statistics, and manage their links through a clean, responsive interface.

## Features

- Shorten long URLs to easily shareable links
- Track click counts for each shortened URL
- View all created short URLs
- Clean RESTful API design
- Modern, responsive UI built with React
- Real-time validation
- Copy to clipboard functionality
- Mobile-friendly design

## Technology Stack

- **Backend**: Node.js, Express
- **Frontend**: React, Tailwind CSS
- **Database**: MongoDB
- **Deployment**: Docker support (optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
PORT=8000
NODE_ENV=development
```

4. Install and build the application:
```bash
# On Windows
build.bat

# On Unix/Linux/MacOS
npm install
cd client && npm install && npm run build && cd ..
```

5. Start the development servers:
```bash
# On Windows
dev.bat

# On Unix/Linux/MacOS
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client && npm start
```

## Usage

### Web Interface

1. Access the web interface at `http://localhost:5000` (or your configured BASE_URL)
2. Enter a long URL in the input field
3. Click "Shorten" to generate a short URL
4. Copy the shortened URL to share

### API Endpoints

#### Shorten a URL

```
POST /api/shorten
```

Request body:
```json
{
  "longUrl": "https://example.com/very/long/url/that/needs/shortening"
}
```

Response:
```json
{
  "shortUrl": "http://localhost:5000/abc123",
  "longUrl": "https://example.com/very/long/url/that/needs/shortening",
  "urlCode": "abc123",
  "date": "2023-04-01T12:00:00.000Z",
  "clicks": 0
}
```

#### Get all URLs

```
GET /api/urls
```

Response:
```json
[
  {
    "shortUrl": "http://localhost:5000/abc123",
    "longUrl": "https://example.com/very/long/url/that/needs/shortening",
    "urlCode": "abc123",
    "date": "2023-04-01T12:00:00.000Z",
    "clicks": 5
  }
]
```

#### Redirect to original URL

```
GET /:code
```

Redirects to the original URL associated with the provided code.

## Project Structure

```
url-shortener/
├── client/              # React frontend
│   ├── public/          # Static files
│   └── src/             # React source code
├── config/              # Configuration files
├── models/              # Database models
├── routes/              # API routes
├── .env                 # Environment variables
├── server.js            # Express server
└── package.json         # Project dependencies
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2023 Your Name or Organization

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
