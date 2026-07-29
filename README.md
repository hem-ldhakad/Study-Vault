# StudyVault 📚

StudyVault is a full-stack notes sharing platform designed for students and educators to upload, discover, and download academic notes.

## 🚀 Tech Stack

### Frontend (`/client`)
- **Framework:** React + Vite
- **Styling:** Tailwind CSS (v4)
- **HTTP Client:** Axios
- **Routing:** React Router DOM
- **Icons:** Lucide React

### Backend (`/server`)
- **Runtime:** Node.js + Express
- **Database:** MongoDB Atlas (Mongoose ORM)
- **Authentication:** JWT (JSON Web Tokens) & BcryptJS
- **File Uploads:** Multer

---

## 📁 Directory Structure

```
studyvault2.0/
├── client/                     # Frontend React Application
│   ├── src/
│   │   ├── assets/             # Images & static assets
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Buttons, Inputs, Cards
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   └── notes/          # Note specific components
│   │   ├── context/            # React Context (Auth, Notes)
│   │   ├── hooks/              # Custom Hooks (useAuth, useNotes)
│   │   ├── pages/              # Views & Route pages
│   │   ├── services/           # Axios API configuration
│   │   └── utils/              # Helper functions & constants
│   ├── .env.example            # Environment variables template
│   └── package.json
│
├── server/                     # Backend Node.js Express Server
│   ├── src/
│   │   ├── config/             # DB & App Configuration
│   │   ├── controllers/        # Express Request Controllers
│   │   ├── middleware/         # Auth, Upload, Error Handlers
│   │   ├── models/             # Mongoose Data Schemas
│   │   ├── routes/             # API Route Handlers
│   │   ├── utils/              # Token generators & helpers
│   │   └── server.js           # Server Entry Point
│   ├── uploads/                # Local attachment storage
│   ├── .env.example            # Backend Environment Variables
│   └── package.json
│
├── package.json                # Workspace runner
└── README.md
```

---

## 🛠️ Setup & Local Development

### 1. Environment Variables Configuration

Copy `.env.example` to `.env` in both `client/` and `server/` directories:

#### Backend Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/studyvault?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

#### Frontend Client (`client/.env`)
```env
VITE_APP_NAME=StudyVault
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Running the Application

From the root directory:

```bash
# Run both Frontend & Backend concurrently
npm run dev

# Or run separately:
npm run server  # Start Express server on port 5000
npm run client  # Start Vite dev server on port 3000
```
