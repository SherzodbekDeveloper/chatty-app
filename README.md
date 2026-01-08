# Chatty - Real-time Chat Application

A modern, real-time chat application built with React, Node.js, Express, Socket.IO, and MongoDB. Features include instant messaging, user authentication, profile management, and image sharing.

## Features

- 🔐 **User Authentication** - Secure login and registration with JWT
- 💬 **Real-time Messaging** - Instant messaging using Socket.IO
- 👥 **User Management** - View and chat with other users
- 🖼️ **Image Sharing** - Upload and share images in conversations
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS and DaisyUI
- 🌙 **Theme Support** - Light and dark mode
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🔒 **Secure** - HTTPS ready with security headers and CORS protection

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Zustand (State Management)
- Socket.IO Client
- Tailwind CSS + DaisyUI
- Axios
- React Hot Toast

### Backend

- Node.js
- Express.js
- Socket.IO
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (Image Upload)
- Bcrypt (Password Hashing)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image uploads)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd chatty-app
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

Backend (create `backend/.env`):

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/chatty-app
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-secret-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Frontend (create `frontend/.env`):

```env
VITE_API_URL=
VITE_APP_ENV=development
VITE_APP_NAME=Chatty
```

5. **Start the development servers**

Backend:

```bash
cd backend
npm run dev
```

Frontend (in a new terminal):

```bash
cd frontend
npm run dev
```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
chatty-app/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── lib/             # Utilities (DB, Socket, Cloudinary)
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   └── index.js         # Server entry point
│   └── package.json
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand stores
│   │   ├── lib/             # Utilities
│   │   └── main.jsx         # App entry point
│   └── package.json
└── README.md
```

## Available Scripts

### Backend

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run start:prod` - Start with production environment

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build with production environment
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deployment options:

- **Vercel/Netlify** - Frontend
- **Heroku/Railway/Render** - Backend
- **MongoDB Atlas** - Database
- **Cloudinary** - Image storage

## Environment Variables

### Backend

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `CLIENT_URL` - Frontend URL for CORS
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Frontend

- `VITE_API_URL` - Backend API URL (optional, uses relative paths if empty)
- `VITE_APP_ENV` - Application environment
- `VITE_APP_NAME` - Application name

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Security headers (X-Frame-Options, CSP, etc.)
- Input validation
- File upload size limits
- HTTPS ready

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check authentication status
- `PUT /api/auth/update-profile` - Update user profile

### Messages

- `GET /api/messages/users` - Get all users
- `GET /api/messages/:id` - Get messages with a user
- `POST /api/messages/send/:id` - Send a message

### Health

- `GET /api/health` - Server health check

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@example.com or open an issue in the repository.

## Acknowledgments

- Built with React, Express, and Socket.IO
- UI components from DaisyUI
- Icons from Lucide React
