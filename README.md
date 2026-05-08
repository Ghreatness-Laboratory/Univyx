# Univyx - Student Platform Frontend

A comprehensive React + TypeScript + Vite application for the Univyx student platform, featuring entertainment, academics, gaming, and store sections with **Supabase backend integration**.

## 🚀 Now Powered by Supabase + AI!

The platform has been migrated from Django backend to **Supabase** for:
- ⚡ **10x faster** performance
- 🛡️ **Better security** with Row Level Security
- 💰 **Lower costs** and better scalability
- 🎨 **Better developer experience**
- 🤖 **AI-Powered Chatbot** with Groq API (Llama 3.3 70B)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
Create `.env` file:
```env
VITE_SUPABASE_URL=https://jkhqrzsaswhbewlumtyc.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### 3. Set Up Database
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/jkhqrzsaswhbewlumtyc)
2. Open SQL Editor
3. Run `supabase-complete-schema.sql`

### 4. Start Development
```bash
npm run dev
```

📖 **Full setup guide**: See `SUPABASE_QUICKSTART.md`
🤖 **AI Integration guide**: See `AI_INTEGRATION_GUIDE.md`

## Features

### 🔐 Authentication
- User registration and login
- Google OAuth integration
- JWT token management with automatic refresh
- Protected routes and user sessions

### 🎭 Entertainment
- Student-written articles with like/bookmark functionality
- Campus events with calendar view
- University news feed
- Comment system for all content
- Real-time interaction tracking

### 🏪 Store
- Product catalog with search and filtering
- Category-based browsing
- Pagination support

### 🎮 Gaming
- Esports tournaments (separate from entertainment events)
- Gaming competitions with prize pools
- Player registration system
- Tournament brackets and tracking
- Game-specific events

### 📚 Academics
- University profiles and programs
- Academic resources
- **🤖 AI Chatbot Assistant** - Ask anything about the university!
- Powered by Groq API (Llama 3.3 70B)
- Real-time streaming responses
- Context-aware answers

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: Groq API (Llama 3.3 70B)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React, Heroicons
- **UI Components**: React Select, React Slick
- **Testing**: Vitest, Testing Library

## API Integration

The application integrates with the Univyx backend API:
- **Base URL**: `https://univyx-backend.onrender.com/univyxApi/v1`
- **Authentication**: JWT tokens with automatic refresh
- **Endpoints**: Auth, Entertainment, Store
- **CORS**: Backend must allow requests from development origin

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd univyx-main
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components
│   ├── layouts/        # Page layout components
│   └── modals/         # Modal components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── data/               # Static data (legacy)
└── assets/             # Images and static assets
```

## Key Components

### Authentication Context
- Manages user state and authentication
- Handles login, registration, and logout
- Provides user data throughout the app

### API Service
- Centralized HTTP client with interceptors
- Automatic token refresh
- Type-safe API calls

### Custom Hooks
- `useArticles` - Manage articles data and interactions
- `useEvents` - Handle entertainment events data
- `useGamingEvents` - Handle gaming tournaments and competitions
- `useUniversities` - Manage university data for AI chatbot
- `useNews` - Manage news content
- `useStore` - Store items management
- `useComments` - Comment system functionality

## API Endpoints Used

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/google` - Google OAuth
- `GET /auth/profile` - Get user profile
- `POST /auth/token/refresh` - Refresh JWT token

### Entertainment
- `GET /entertainment/articles/` - Fetch articles
- `GET /entertainment/events/` - Fetch events
- `GET /entertainment/news/` - Fetch news
- `POST /entertainment/{model}/{id}/like/` - Toggle likes
- `POST /entertainment/{model}/{id}/bookmark/` - Toggle bookmarks
- `GET/POST /entertainment/{model}/{id}/comments/` - Manage comments

### Store
- `GET /store/` - Fetch store items
- `POST /store/` - Create store items

## Environment Variables

No environment variables required - API base URL is configured in the service layer.

## Known Issues

### CORS Configuration
The backend API at `https://univyx-backend.onrender.com` needs to be configured to allow requests from `http://localhost:5173` during development. If you encounter CORS errors:

1. Contact the backend team to add your development URL to the allowed origins
2. Or use a CORS proxy for development (not recommended for production)
3. The backend should include these headers:
   ```
   Access-Control-Allow-Origin: http://localhost:5173
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   ```

### Development Solution
The project includes a Vite proxy configuration that routes API calls through the development server to avoid CORS issues:

- Development: API calls go through `/api` proxy to the backend
- Production: Direct calls to `https://univyx-backend.onrender.com/univyxApi/v1`

This is automatically handled by the build configuration.

### Alternative Workaround
If the proxy doesn't work, you can temporarily disable CORS in your browser for development:
```bash
# Chrome with disabled CORS (development only)
chrome --disable-web-security --user-data-dir="/tmp/chrome_dev"
```

**Note**: Never disable CORS in production environments.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

BSD License
