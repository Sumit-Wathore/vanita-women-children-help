# VW Foundation Full-Stack Website

A professional website project for **VW Foundation / Vanita's Women Consultancy & Help**. The project includes a complete responsive frontend and a Node.js + Express.js backend for contact form submissions.

## Main Features

- Professional responsive website design
- Home, About, Services, Impact, Programs, Gallery, and Contact sections
- Local image gallery using provided field work photos
- Backend contact form API
- Submissions stored in `data/submissions.json`
- Admin protected submissions API
- Basic validation, security headers, CORS, and rate limiting

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express.js
- Data Storage: JSON file storage
- Security: Helmet, rate limiting, request validation

## How to Run

1. Open the project folder in VS Code.
2. Install packages:

```bash
npm install
```

3. Start the backend server:

```bash
npm start
```

4. Open the website:

```text
http://localhost:3000
```

## Backend API

### Health Check

```text
GET /api/health
```

### Submit Contact Form

```text
POST /api/contact
```

Body example:

```json
{
  "name": "Test User",
  "phone": "9999999999",
  "email": "test@example.com",
  "service": "Women Safety & Counselling",
  "message": "Need guidance."
}
```

### View Submissions

```text
GET /api/submissions
```

Header required:

```text
x-admin-key: vw-foundation-admin
```

For deployment, change `ADMIN_KEY` in environment variables.
