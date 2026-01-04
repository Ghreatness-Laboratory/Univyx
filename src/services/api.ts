import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  GoogleAuth,
  Signup,
  Email,
  EmailResent,
  TokenObtainPair,
  TokenRefresh,
  VerifyEmailSuccess,
  Article,
  Event,
  News,
  Comment,
  Like,
  Bookmark,
  StoreItem,
  University,
  User,
} from '../types/api';

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://univyx-backend-1xfv.onrender.com/univyxApi/v1'
  : 'http://localhost:5000/univyxApi/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }



  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh and missing endpoints
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Log error for debugging
        console.error('API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data
        });
        
        // Log detailed error information for 400 errors
        if (error.response?.status === 400) {
          console.error('Detailed 400 Error:', {
            fullResponse: error.response,
            errorData: error.response?.data,
            errors: error.response?.data?.errors,
            message: error.response?.data?.message
          });
        }
        

        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.refreshToken({ refresh: refreshToken });
              localStorage.setItem('access_token', response.data.access!);
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async googleAuth(data: GoogleAuth): Promise<AxiosResponse<any>> {
    return this.api.post('/auth/google', data);
  }

  async login(data: any): Promise<AxiosResponse<any>> {
    return this.api.post('/auth/login', data);
  }

  async register(data: Signup): Promise<AxiosResponse<any>> {
    return this.api.post('/auth/register', data);
  }

  async getProfile(): Promise<AxiosResponse<User>> {
    return this.api.get('/auth/profile');
  }

  async updateProfile(data: Partial<User>): Promise<AxiosResponse<User>> {
    return this.api.patch('/auth/profile', data);
  }

  async resendVerification(data: Email): Promise<AxiosResponse<EmailResent>> {
    return this.api.post('/auth/resend-verification', data);
  }

  async verifyEmail(token: string): Promise<AxiosResponse<VerifyEmailSuccess>> {
    return this.api.get(`/auth/verify-email/${token}`);
  }

  async requestPasswordReset(data: Email): Promise<AxiosResponse<any>> {
    return this.api.post('/auth/request-reset', data);
  }

  async resetPassword(token: string, data: any): Promise<AxiosResponse<any>> {
    return this.api.post(`/auth/reset-password/${token}`, data);
  }

  async changePassword(data: any): Promise<AxiosResponse<any>> {
    return this.api.post('/auth/change-password', data);
  }

  async changeConfirm(uidb64: string, token: string): Promise<AxiosResponse<any>> {
    return this.api.post(`/auth/change-confirm/${uidb64}/${token}`);
  }

  async changeRequest(data: any): Promise<AxiosResponse<any>> {
    return this.api.post('/auth/change-request', data);
  }

  async getToken(data: TokenObtainPair): Promise<AxiosResponse<TokenObtainPair>> {
    return this.api.post('/auth/token', data);
  }

  async verifyToken(data: { token: string }): Promise<AxiosResponse<any>> {
    return this.api.post('/auth/token/verify', data);
  }

  async refreshToken(data: TokenRefresh): Promise<AxiosResponse<TokenRefresh>> {
    return this.api.post('/auth/token/refresh', data);
  }

  // Entertainment endpoints
  async getArticles(): Promise<AxiosResponse<Article[]>> {
    return this.api.get('/entertainment/articles');
  }

  async createArticle(data: Partial<Article>): Promise<AxiosResponse<Article>> {
    return this.api.post('/entertainment/articles', data);
  }

  async updateArticles(data: Partial<Article>): Promise<AxiosResponse<Article>> {
    return this.api.put('/entertainment/articles', data);
  }

  async deleteArticles(): Promise<AxiosResponse<void>> {
    return this.api.delete('/entertainment/articles');
  }

  async getArticle(id: string): Promise<AxiosResponse<Article>> {
    return this.api.get(`/entertainment/articles/${id}`);
  }

  async createArticleById(id: string, data: Partial<Article>): Promise<AxiosResponse<Article>> {
    return this.api.post(`/entertainment/articles/${id}`, data);
  }

  async updateArticle(id: string, data: Partial<Article>): Promise<AxiosResponse<Article>> {
    return this.api.put(`/entertainment/articles/${id}`, data);
  }

  async deleteArticle(id: string): Promise<AxiosResponse<void>> {
    return this.api.delete(`/entertainment/articles/${id}`);
  }

  async getEvents(): Promise<AxiosResponse<Event[]>> {
    return this.api.get('/entertainment/events');
  }

  async createEvent(data: Partial<Event>): Promise<AxiosResponse<Event>> {
    return this.api.post('/entertainment/events', data);
  }

  async updateEvents(data: Partial<Event>): Promise<AxiosResponse<Event>> {
    return this.api.put('/entertainment/events', data);
  }

  async deleteEvents(): Promise<AxiosResponse<void>> {
    return this.api.delete('/entertainment/events');
  }

  async getEvent(id: string): Promise<AxiosResponse<Event>> {
    return this.api.get(`/entertainment/events/${id}`);
  }

  async createEventById(id: string, data: Partial<Event>): Promise<AxiosResponse<Event>> {
    return this.api.post(`/entertainment/events/${id}`, data);
  }

  async updateEventById(id: string, data: Partial<Event>): Promise<AxiosResponse<Event>> {
    return this.api.put(`/entertainment/events/${id}`, data);
  }

  async deleteEventById(id: string): Promise<AxiosResponse<void>> {
    return this.api.delete(`/entertainment/events/${id}`);
  }



  async getNews(): Promise<AxiosResponse<News[]>> {
    return this.api.get('/entertainment/news');
  }

  async createNews(data: Partial<News>): Promise<AxiosResponse<News>> {
    return this.api.post('/entertainment/news', data);
  }

  async updateNewsCollection(data: Partial<News>): Promise<AxiosResponse<News>> {
    return this.api.put('/entertainment/news', data);
  }

  async deleteNewsCollection(): Promise<AxiosResponse<void>> {
    return this.api.delete('/entertainment/news');
  }

  async getNewsItem(id: string): Promise<AxiosResponse<News>> {
    return this.api.get(`/entertainment/news/${id}`);
  }

  async createNewsById(id: string, data: Partial<News>): Promise<AxiosResponse<News>> {
    return this.api.post(`/entertainment/news/${id}`, data);
  }

  async updateNews(id: string, data: Partial<News>): Promise<AxiosResponse<News>> {
    return this.api.put(`/entertainment/news/${id}`, data);
  }

  async deleteNews(id: string): Promise<AxiosResponse<void>> {
    return this.api.delete(`/entertainment/news/${id}`);
  }

  // Like endpoints
  async getLikes(modelName: string, objectId: string): Promise<AxiosResponse<Like[]>> {
    return this.api.get(`/entertainment/${modelName}/${objectId}/like`);
  }

  async toggleLike(modelName: string, objectId: string): Promise<AxiosResponse<Like>> {
    return this.api.post(`/entertainment/${modelName}/${objectId}/like`);
  }

  // Bookmark endpoints
  async getBookmarks(modelName: string, publicId: string): Promise<AxiosResponse<Bookmark[]>> {
    return this.api.get(`/entertainment/${modelName}/${publicId}/bookmark`);
  }

  async toggleBookmark(modelName: string, publicId: string): Promise<AxiosResponse<Bookmark>> {
    return this.api.post(`/entertainment/${modelName}/${publicId}/bookmark`);
  }

  // Comment endpoints
  async getComments(modelName: string, publicId: string): Promise<AxiosResponse<Comment[]>> {
    return this.api.get(`/entertainment/${modelName}/${publicId}/comments`);
  }

  async createComment(modelName: string, publicId: string, data: { content: string }): Promise<AxiosResponse<Comment>> {
    return this.api.post(`/entertainment/${modelName}/${publicId}/comments`, data);
  }

  // Store endpoints
  async getStoreItems(): Promise<AxiosResponse<StoreItem[]>> {
    return this.api.get('/store');
  }

  async createStoreItem(data: Partial<StoreItem>): Promise<AxiosResponse<StoreItem>> {
    return this.api.post('/store', data);
  }

  // Academics endpoints
  async getUniversities(): Promise<AxiosResponse<University[]>> {
    return this.api.get('/academics/universities');
  }

  async createUniversity(data: Partial<University>): Promise<AxiosResponse<University>> {
    return this.api.post('/academics/universities', data);
  }

  async getCourses(): Promise<AxiosResponse<any[]>> {
    return this.api.get('/academics/courses');
  }

  async getResources(): Promise<AxiosResponse<any[]>> {
    return this.api.get('/academics/resources');
  }

  // Gaming endpoints
  async getTournaments(): Promise<AxiosResponse<any[]>> {
    return this.api.get('/gaming/tournaments');
  }

  async getLeaderboards(): Promise<AxiosResponse<any[]>> {
    return this.api.get('/gaming/leaderboards');
  }

  async getLeaderboard(id: string): Promise<AxiosResponse<any>> {
    return this.api.get(`/gaming/leaderboards/${id}`);
  }
}

export default new ApiService();