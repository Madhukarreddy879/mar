# Admissions CRM System

A comprehensive admissions website and CRM system built with Next.js 14, TypeScript, PostgreSQL, and Prisma ORM.

## Features

### Public Website
- Modern, responsive design with Tailwind CSS
- Lead capture form with validation
- Course information sections
- FAQ section
- Contact information

### CRM System
- **Dashboard**: Overview with statistics and recent leads
- **Lead Management**: View, filter, search, and manage leads
- **User Management**: Admin-only user creation and management
- **Authentication**: Secure login system with role-based access
- **Notes System**: Add and view notes on leads

### User Roles
- **Admin**: Full access to all features including user management
- **Staff**: Access to leads and dashboard, no user management

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Credentials provider
- **Icons**: Lucide React
- **Password Hashing**: bcryptjs

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admissions-crm
   ```

2. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   Create a `.env.local` file with:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/admissions_crm"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   JWT_SECRET="your-jwt-secret-here"
   ```

5. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Create an admin user**
   You can create an admin user by making a POST request to `/api/auth/register` with:
   ```json
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "securepassword",
     "role": "admin"
   }
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Access the application**
    - Public website: http://localhost:3000
    - CRM login: http://localhost:3000/login

## Database Schema

### Lead Model
- `id`: Primary key
- `firstName`: String
- `lastName`: String
- `email`: String (unique)
- `phone`: String
- `course`: String
- `status`: Enum (new, contacted, interested, enrolled, rejected)
- `source`: String
- `message`: Text (optional)
- `assignedTo`: Foreign key to User (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### User Model
- `id`: Primary key
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `role`: Enum (admin, staff)
- `createdAt`: DateTime

### Note Model
- `id`: Primary key
- `text`: Text
- `leadId`: Foreign key to Lead
- `userId`: Foreign key to User
- `createdAt`: DateTime

## API Endpoints

### Public Endpoints
- `POST /api/leads` - Submit a new lead
- `GET /api/leads` - Get all leads (protected, requires authentication)
- `GET /api/leads/[id]` - Get specific lead (protected)
- `PUT /api/leads/[id]` - Update lead (protected)
- `POST /api/leads/[id]/notes` - Add note to lead (protected)

### Authentication Endpoints
- `POST /api/auth/register` - Register new user (admin only)
- `GET /api/auth/[...nextauth]` - NextAuth.js endpoints

### User Management Endpoints
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/users/[id]` - Delete user (admin only)

## Usage

### Public Website
1. Visitors can browse course information and submit inquiries
2. Lead form captures contact information and course interest
3. Automatic status assignment to "new" for all leads

### CRM Dashboard
1. **Login**: Access the CRM at `/login`
2. **Dashboard**: View statistics and recent leads
3. **Leads Management**: 
   - View all leads with filtering and search
   - Update lead status and course
   - Add notes to track interactions
4. **User Management** (Admin only):
   - Create new staff/admin accounts
   - Manage user roles and access

## Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Database Setup
- Use a managed PostgreSQL service like Supabase, PlanetScale, or AWS RDS
- Update the `DATABASE_URL` in your environment variables

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Protected API routes
- CSRF protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.