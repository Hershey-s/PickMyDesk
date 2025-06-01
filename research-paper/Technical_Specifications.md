# PickMyDesk: Technical Specifications and Implementation Details

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React.js)    │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│   Port: 5173    │    │   Port: 5000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │   API Routes    │    │   Collections   │
│   - WorkspaceCard│    │   - /workspaces │    │   - users       │
│   - Calendar    │    │   - /bookings   │    │   - workspaces  │
│   - Maps        │    │   - /auth       │    │   - bookings    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 1.2 Technology Stack Details

**Frontend Technologies:**
- React.js 18.2.0 - Component-based UI framework
- Tailwind CSS 3.x - Utility-first CSS framework
- Leaflet 1.9.x - Interactive mapping library
- React-Leaflet 4.x - React bindings for Leaflet
- Axios 1.x - HTTP client for API calls
- React Router 6.x - Client-side routing
- Lucide React - Icon library

**Backend Technologies:**
- Node.js 18.x - JavaScript runtime
- Express.js 4.x - Web application framework
- MongoDB 6.x - NoSQL database
- Mongoose 7.x - MongoDB object modeling
- JWT - JSON Web Tokens for authentication
- Bcrypt - Password hashing
- Multer - File upload handling
- Cloudinary - Image storage and optimization

**External Services:**
- OpenStreetMap - Mapping tiles and geocoding
- Nominatim API - Address geocoding
- Cloudinary - Image CDN and processing
- Email Service - Notification system

## 2. Database Schema Design

### 2.1 User Collection
```javascript
{
  _id: ObjectId,
  name: String (required, 3-50 chars),
  email: String (required, unique, valid email),
  password: String (required, hashed),
  role: String (enum: ['user', 'owner', 'admin'], default: 'user'),
  phone: String (optional),
  profileImage: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### 2.2 Workspace Collection
```javascript
{
  _id: ObjectId,
  owner: ObjectId (ref: 'User', required),
  title: String (required, 3-40 chars),
  description: String (required, 10-250 chars),
  listingImage: String (required, URL),
  location: String (required, 3-100 chars),
  country: String (required, 3-50 chars),
  coordinates: {
    latitude: Number (-90 to 90),
    longitude: Number (-180 to 180)
  },
  fullAddress: String (max 200 chars),
  city: String (max 50 chars),
  state: String (max 50 chars),
  zipCode: String (max 20 chars),
  price: Number (required, min: 1, max: 200000),
  priceUnit: String (enum: ['hour', 'day', 'week', 'month'], default: 'hour'),
  currency: String (enum: ['USD', 'INR', 'EUR', 'GBP'], default: 'INR'),
  tags: [String] (max 5 items),
  maxCapacity: Number (default: 1, min: 1),
  amenities: [String],
  availability: {
    monday: { start: String, end: String, available: Boolean },
    tuesday: { start: String, end: String, available: Boolean },
    wednesday: { start: String, end: String, available: Boolean },
    thursday: { start: String, end: String, available: Boolean },
    friday: { start: String, end: String, available: Boolean },
    saturday: { start: String, end: String, available: Boolean },
    sunday: { start: String, end: String, available: Boolean }
  },
  isPopular: Boolean (default: false),
  avgRating: Number (0-5, default: 0),
  instantBooking: Boolean (default: true),
  cancellationPolicy: String (enum: ['flexible', 'moderate', 'strict']),
  minimumBookingDuration: Number (default: 1),
  createdAt: Date,
  updatedAt: Date
}
```

### 2.3 Booking Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  workspace: ObjectId (ref: 'Workspace', required),
  startDate: Date (required),
  endDate: Date (required),
  startTime: String (HH:MM format),
  endTime: String (HH:MM format),
  guestCount: Number (default: 1, min: 1),
  totalPrice: Number (required, min: 0),
  currency: String (default: 'INR'),
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),
  paymentStatus: String (enum: ['pending', 'paid', 'failed', 'refunded']),
  specialRequests: String (max 500 chars),
  contactInfo: {
    phone: String,
    phoneCountry: String,
    email: String
  },
  cancellationReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 3. API Endpoints Documentation

### 3.1 Authentication Routes
```
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/profile
PUT  /auth/profile
```

### 3.2 Workspace Routes
```
GET    /workspaces              - Get all workspaces
GET    /workspaces/:id          - Get workspace by ID
POST   /workspaces              - Create new workspace (owner only)
PUT    /workspaces/:id          - Update workspace (owner only)
DELETE /workspaces/:id          - Delete workspace (owner only)
GET    /workspaces/:id/availability - Check availability
```

### 3.3 Booking Routes
```
GET    /bookings               - Get user's bookings
GET    /bookings/:id           - Get booking by ID
POST   /bookings               - Create new booking
PUT    /bookings/:id           - Update booking
DELETE /bookings/:id           - Cancel booking
GET    /bookings/workspace/:id - Get workspace bookings (owner only)
```

## 4. Component Architecture

### 4.1 Frontend Component Hierarchy
```
App
├── Router
│   ├── Home
│   │   ├── WorkspaceCard (clickable titles/images)
│   │   ├── LocationSearch
│   │   └── FilterControls
│   ├── ShowWorkspace
│   │   ├── AvailabilityCalendar (real-time)
│   │   ├── LocationMap (interactive)
│   │   └── BookingButton
│   ├── WorkspaceBooking
│   │   ├── BookingForm (pre-filled from calendar)
│   │   └── PaymentIntegration
│   └── UserDashboard
│       ├── BookingHistory
│       └── ProfileManagement
```

### 4.2 Key Component Features

**WorkspaceCard Component:**
- Clickable workspace titles and images
- Hover effects and visual feedback
- Rating display and popularity badges
- Distance calculation from user location

**AvailabilityCalendar Component:**
- Real-time availability checking
- Dynamic month navigation
- Time slot generation based on workspace hours
- Visual indicators for available/booked slots
- Integration with booking system

**LocationMap Component:**
- Interactive Leaflet map integration
- Marker with workspace information
- Zoom and pan controls
- Fallback to static map if needed
- External map links (Google Maps, OpenStreetMap)

## 5. Performance Optimizations

### 5.1 Frontend Optimizations
- Component lazy loading
- Image optimization with Cloudinary
- Responsive design for all devices
- Efficient state management
- Debounced search inputs

### 5.2 Backend Optimizations
- Database indexing on frequently queried fields
- Connection pooling for MongoDB
- Caching for static data
- Optimized aggregation pipelines
- Rate limiting for API endpoints

### 5.3 Database Optimizations
```javascript
// Indexes for performance
db.workspaces.createIndex({ "coordinates.latitude": 1, "coordinates.longitude": 1 })
db.workspaces.createIndex({ "location": "text", "title": "text" })
db.bookings.createIndex({ "workspace": 1, "startDate": 1, "endDate": 1 })
db.bookings.createIndex({ "user": 1, "status": 1 })
```

## 6. Security Measures

### 6.1 Authentication & Authorization
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Session management

### 6.2 Data Validation
- Input sanitization
- Schema validation with Mongoose
- File upload restrictions
- Rate limiting

### 6.3 API Security
- CORS configuration
- Helmet.js for security headers
- Environment variable protection
- SQL injection prevention (NoSQL)

## 7. Deployment Configuration

### 7.1 Environment Variables
```
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/pickmydesk
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_SERVICE_API_KEY=your_email_key
PORT=5000

# Frontend (.env)
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 7.2 Production Deployment
- Frontend: Build with `npm run build`
- Backend: PM2 process manager
- Database: MongoDB Atlas or self-hosted
- CDN: Cloudinary for images
- SSL: Let's Encrypt certificates

## 8. Testing Strategy

### 8.1 Unit Testing
- Component testing with Jest and React Testing Library
- API endpoint testing with Supertest
- Database model testing

### 8.2 Integration Testing
- End-to-end user flows
- API integration testing
- Database integration testing

### 8.3 Performance Testing
- Load testing with Artillery
- Database performance monitoring
- Frontend performance audits

## 9. Monitoring and Analytics

### 9.1 Application Monitoring
- Error tracking and logging
- Performance metrics
- User analytics
- API response time monitoring

### 9.2 Business Metrics
- Booking conversion rates
- User engagement metrics
- Revenue tracking
- Popular workspace analysis

This technical specification provides a comprehensive overview of the PickMyDesk platform's implementation details, serving as both documentation and reference for the research paper.
