# ⚡ QuickNote Pro

**QuickNote Pro** is a premium, high-performance note-taking application built with the **MERN** stack. It combines a stunning **Glassmorphism** interface with advanced productivity features like voice-to-text, real-time reminders, and secure multi-factor authentication.

![QuickNote Pro Banner](https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1200)

## ✨ Core Features

### 📝 Advanced Note Management
- **Rich Text Editing**: Full-featured editor powered by ReactQuill for styled notes.
- **Organization**: Pin important notes, mark favorites, and categorize with dynamic tags.
- **Soft Delete (Trash)**: A safety-net system for deleted notes with permanent deletion options.
- **Reminders**: Integrated scheduling system with real-time browser notifications.

### 🎤 Intelligence & Accessibility
- **Voice Capture (Speech-to-Text)**: Dictate your notes on the go using the built-in microphone feature (powered by Web Speech API).
- **Search & Filter**: Blazing fast search and sorting (By Date, Title, or Tag).

### 🛡️ Enterprise-Grade Security
- **JWT & Refresh Tokens**: Secure session management with automated token refreshing.
- **Email Verification**: Multi-step signup process with OTP verification.
- **Password Recovery**: Secure password reset flow with premium HTML email templates.
- **HTTP-Only Cookies**: Protection against XSS and sensitive data leakage.

### 🎨 Stunning UI/UX
- **Glassmorphism Design**: A modern, frosted-glass aesthetic with deep indigo/purple hues.
- **Framer Motion**: Smooth page transitions and micro-animations for a premium feel.
- **Skeleton Loading**: High-visibility shimmer effects for a seamless data-fetching experience.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Framer Motion, React-Toastify, React-Quill.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB (Local/Atlas).
- **Authentication**: JSON Web Tokens (JWT), BcryptJS.
- **Mailing**: Nodemailer (Gmail SMTP).

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- Node.js installed
- MongoDB running locally or a MongoDB Atlas URI

### 2. Clone the Repository
```bash
git clone https://github.com/yourusername/quicknote.git
cd quicknote
```

### 3. Backend Configuration
Navigate to the `backend` folder and create a `.env` file:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_app_password
```

### 4. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
npm install
```

### 5. Running the Application
Use the concurrent runner to start both servers at once:
```bash
npm run both
```
The app will be available at `http://localhost:3000`.

---

## 📬 API Routes (Summary)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/createuser` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user & issue tokens |
| `GET` | `/api/notes/fetchallnotes` | Retrieve all user notes |
| `POST` | `/api/notes/addnote` | Create a new note |
| `PUT` | `/api/notes/updatenote/:id` | Update an existing note |
| `PUT` | `/api/notes/trash/:id` | Move note to trash |

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ by [Ishan Mahida](https://ishan-mahida.vercel.app/)*