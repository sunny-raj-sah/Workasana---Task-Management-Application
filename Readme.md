 # Workasana - Task Management Application

Workasana is a full-stack task management application that helps users manage projects, tasks, teams, and work progress from a centralized dashboard.

The application is built using React, Node.js, Express.js, and MongoDB, with JWT-based authentication and Context API for frontend state management.

## Live Demo

* **Live Application:** [Add your Vercel frontend URL]
* **Backend API:** [Add your Vercel backend URL]

## Features

### Authentication

* User signup and login
* JWT-based authentication
* Protected routes
* Logout functionality
* Profile management
* Password update

### Dashboard

* Task and project overview
* Quick task filters
* Task status statistics
* Progress visualization

### Project Management

* Create, view, update, and delete projects
* Associate tasks with projects

### Task Management

* Create, update, and delete tasks
* Assign projects and teams
* Assign task owners
* Add tags
* Set task status
* Set estimated completion time
* Filter and search tasks

### Team Management

* Create and manage teams
* Add and manage team members
* Associate teams with tasks

### Settings

* Update profile information
* Change password

### Reports

* Task and project statistics
* Bar and pie charts using Chart.js

## Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Context API
* React Hooks
* Axios
* Bootstrap
* Bootstrap Icons
* React Hot Toast
* Chart.js
* React Chart.js 2

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* CORS
* dotenv

### Tools and Deployment

* Git
* GitHub
* Postman
* VS Code
* Vercel
* MongoDB Atlas

## Project Structure

```text
workasana/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vercel.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── data.js
│   │   └── server.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── vercel.json
│
└── README.md
```

## Data Models

### User

* Name
* Email
* Password
* Team association

### Project

* Project name
* Description
* Related tasks

### Task

* Task name
* Project
* Team
* Owners
* Tags
* Time to complete
* Status

### Team

* Team name
* Description
* Team members

## Application Architecture

```text
React Frontend
      |
      | Axios / REST API
      v
Express Backend
      |
      | JWT Authentication
      v
Mongoose
      |
      v
MongoDB Atlas
```

The frontend uses Context API to manage global application state for authentication, tasks, projects, and teams.

## Authentication Flow

Workasana uses JWT-based authentication for securing user accounts and protected APIs.

```text
Login
  |
  v
JWT Token
  |
  v
localStorage
  |
  v
Axios Authorization Header
  |
  v
Protected API
  |
  v
JWT Middleware
```

Passwords are hashed using bcryptjs, and protected backend routes are validated using JWT middleware.

## Environment Variables

### Client

```env
VITE_API_URL=http://localhost:5000/api
```

### Server

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Environment files are excluded from Git using `.gitignore`.

## Local Setup

### Clone the Repository

```bash
git clone <repository-url>
cd workasana
```

### Start the Backend

```bash
cd server
npm install
npm run dev
```

### Start the Frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and communicates with the backend running on `http://localhost:5000`.

## Deployment

The frontend and backend are deployed separately.

```text
Frontend  → Vercel
Backend   → Vercel
Database  → MongoDB Atlas
```

The production frontend connects to the deployed backend through the `VITE_API_URL` environment variable.

## Key Concepts Implemented

* React Functional Components
* React Hooks
* React Router
* Context API
* useReducer
* REST APIs
* CRUD Operations
* JWT Authentication
* Protected Routes
* Axios Interceptors
* Mongoose Models and Relationships
* Form Validation
* Responsive UI
* Data Visualization
* Environment Configuration
* Frontend and Backend Deployment

## Author

**Sunny Raj**

Full-Stack Developer

**Technologies:** React, Node.js, Express.js, MongoDB, JavaScript, JWT, REST API
