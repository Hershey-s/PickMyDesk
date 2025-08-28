#  PickMyDesk - Workspace Booking Platform

**Tagline:** *Desk booking, simplified*

A complete workspace booking platform built with React and Node.js, featuring real-time booking management, cancellation, and rescheduling capabilities.

![PickMyDesk](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)

##  Features

###  Core Functionality
- **Complete Booking System** - Create, view, cancel, and reschedule bookings
- **Real-time Availability** - Live workspace availability checking
- **User Authentication** - Secure JWT-based login system
- **Google OAuth Integration** - Quick sign-in with Google
- **Booking Management** - Comprehensive booking dashboard

###  Localization
- **Indian Market Focus** - INR currency and Indian cities
- **International Phone Support** - Country code validation (+91 for India)
- **Professional UI/UX** - Clean, modern interface

###  Technical Features
- **Conflict Prevention** - Automatic double-booking prevention
- **Email Notifications** - Booking confirmation and updates
- **Responsive Design** - Works on all devices
- **Error Handling** - Comprehensive validation and error management

##  Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Hershey-s/PickMyDesk.git
cd PickMyDesk
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Environment Setup**
```bash
# Backend (.env)
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id

# Frontend (.env)
VITE_API_URL=http://localhost:5002
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

5. **Start the Application**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5002

##  Pages & Features

- ** Homepage** - Browse available workspaces
- ** Booking Form** - Create new bookings with validation
- ** My Bookings** - View, cancel, and reschedule bookings
- ** Authentication** - Login/Signup with Google OAuth
- **ℹ About/Contact** - Professional company pages
- ** FAQ & Support** - Help and documentation

##  Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express 4.19.2** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

##  Authentication

- JWT-based authentication system
- Google OAuth integration
- Secure password hashing
- Token-based API protection

## Developer

**Developed by:** [Hershey-s](https://github.com/Hershey-s)

Built with ❤️ for the workspace booking community.

---

⭐ **Star this repository if you found it helpful!**
