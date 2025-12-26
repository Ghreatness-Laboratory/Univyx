// Auth Types
export interface GoogleAuth {
  token: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Signup {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface UserSignupSuccess {
  message?: string;
}

export interface VerifyEmailSuccess {
  detail?: string;
  refresh: string;
  access: string;
}

export interface User {
  id?: number;
  email: string;
  full_name?: string;
  date_joined?: string;
  last_login?: string;
}

export interface Tokens {
  refresh: string;
  access: string;
}

export interface GoogleUserData {
  user: User;
  tokens: Tokens;
}

export interface GoogleAuthSuccess {
  message?: string;
  data: GoogleUserData;
}

export interface UserLoginSuccess {
  message?: string;
  data: GoogleUserData;
}

export interface UserProfileSuccess {
  user: User;
}

export interface UserRegistrationSuccess {
  message?: string;
  user: Signup;
}

export interface Email {
  email: string;
}

export interface EmailResent {
  detail?: string;
}

export interface BadRequest {
  detail: string;
}

export interface NotFound {
  detail?: string;
}

export interface TokenObtainPair {
  username: string;
  password: string;
  access?: string;
  refresh?: string;
}

export interface TokenRefresh {
  refresh: string;
  access?: string;
}

// Entertainment Types
export interface Article {
  id?: string;
  title?: string;
  content?: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
  image?: string;
  likes_count?: number;
  comments_count?: number;
  bookmarked?: boolean;
  liked?: boolean;
}

export interface Event {
  id?: string;
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  image?: string;
  likes_count?: number;
  comments_count?: number;
  bookmarked?: boolean;
  liked?: boolean;
}

export interface News {
  id?: string;
  title?: string;
  content?: string;
  author?: string;
  published_at?: string;
  image?: string;
  likes_count?: number;
  comments_count?: number;
  bookmarked?: boolean;
  liked?: boolean;
}

// Academics Types
export interface Course {
  id?: number;
  duration_years?: number;
}

export interface College {
  id?: number;
  name: string;
  courses?: Course[];
}

export interface StudentAmbassador {
  id?: number;
  name: string;
  position: string;
  email: string;
  phone?: string;
  bio?: string;
  photo?: string;
}

export interface University {
  id?: number;
  name: string;
  abbreviation?: string;
  website?: string;
  location?: string;
  description?: string;
  established_year?: number;
  logo?: string;
  logo_url?: string;
  ambassadors?: StudentAmbassador[];
  colleges?: College[];
}

export interface StudentAmbassador {
  id?: number;
  name: string;
  position: string;
  email: string;
  phone?: string;
  bio?: string;
  photo?: string;
}

export interface Comment {
  id?: string;
  content: string;
  author?: User;
  created_at?: string;
  replies?: Comment[];
}

export interface Like {
  id?: string;
  user?: User;
  created_at?: string;
}

export interface Bookmark {
  id?: string;
  user?: User;
  created_at?: string;
}

// Store Types
export interface StoreItem {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  in_stock?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}