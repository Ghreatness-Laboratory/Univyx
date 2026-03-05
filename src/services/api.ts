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

const BASE_URL = import.meta.env.DEV ? '/api' : 'https://univyx-backend-1xfv.onrender.com/univyxApi/v1';

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

  async refreshToken(data: TokenRefresh): Promise<AxiosResponse<TokenRefresh>> {
    return this.api.post('/auth/token/refresh', data);
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

  async getToken(data: TokenObtainPair): Promise<AxiosResponse<TokenObtainPair>> {
    return this.api.post('/auth/token', data);
  }

  async verifyToken(data: { token: string }): Promise<AxiosResponse<any>> {
    return this.api.post('/auth/token/verify', data);
  }

  // Entertainment endpoints
  async getArticles(): Promise<AxiosResponse<Article[]>> {
    return this.api.get('/entertainment/articles');
  }

  async createArticle(data: Partial<Article> | FormData): Promise<AxiosResponse<Article>> {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return this.api.post('/entertainment/articles', data, config);
  }

  async getArticle(id: string): Promise<AxiosResponse<Article>> {
    return this.api.get(`/entertainment/articles/${id}`);
  }

  async updateArticle(id: string, data: Partial<Article> | FormData): Promise<AxiosResponse<Article>> {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return this.api.put(`/entertainment/articles/${id}`, data, config);
  }

  async deleteArticle(id: string): Promise<AxiosResponse<void>> {
    return this.api.delete(`/entertainment/articles/${id}`);
  }

  async getEvents(): Promise<AxiosResponse<Event[]>> {
    return this.api.get('/entertainment/events');
  }

  async createEvent(data: Partial<Event> | FormData): Promise<AxiosResponse<Event>> {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return this.api.post('/entertainment/events', data, config);
  }

  async getEvent(id: string): Promise<AxiosResponse<Event>> {
    return this.api.get(`/entertainment/events/${id}`);
  }

  async updateEventById(id: string, data: Partial<Event> | FormData): Promise<AxiosResponse<Event>> {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return this.api.put(`/entertainment/events/${id}`, data, config);
  }

  async deleteEventById(id: string): Promise<AxiosResponse<void>> {
    return this.api.delete(`/entertainment/events/${id}`);
  }

  async getNews(): Promise<AxiosResponse<News[]>> {
    return this.api.get('/entertainment/news');
  }

  async createNews(data: Partial<News> | FormData): Promise<AxiosResponse<News>> {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return this.api.post('/entertainment/news', data, config);
  }

  async getNewsItem(id: string): Promise<AxiosResponse<News>> {
    return this.api.get(`/entertainment/news/${id}`);
  }

  async updateNews(id: string, data: Partial<News> | FormData): Promise<AxiosResponse<News>> {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return this.api.put(`/entertainment/news/${id}`, data, config);
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

  async updateComment(commentId: string, data: { content: string }): Promise<AxiosResponse<Comment>> {
    return this.api.put(`/entertainment/comments/${commentId}`, data);
  }

  async deleteComment(commentId: string): Promise<AxiosResponse<void>> {
    return this.api.delete(`/entertainment/comments/${commentId}`);
  }

  async getComment(commentId: string): Promise<AxiosResponse<Comment>> {
    return this.api.get(`/entertainment/comments/${commentId}`);
  }

  // User stats endpoints
  async getUserStats(): Promise<AxiosResponse<any>> {
    return this.api.get('/auth/stats');
  }

  async getUserBookmarks(): Promise<AxiosResponse<any[]>> {
    return this.api.get('/auth/bookmarks');
  }

  async getUserComments(): Promise<AxiosResponse<Comment[]>> {
    return this.api.get('/auth/comments');
  }

  async getUserLikes(): Promise<AxiosResponse<Like[]>> {
    return this.api.get('/auth/likes');
  }

  // Store endpoints
  async getStores(): Promise<AxiosResponse<any[]>> {
    return this.api.get('/store/stores');
  }

  async createStore(data: FormData): Promise<AxiosResponse<any>> {
    return this.api.post('/store/stores', data, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  async updateStore(id: string, data: FormData): Promise<AxiosResponse<any>> {
    return this.api.put(`/store/stores/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  async deleteStore(id: string): Promise<AxiosResponse<void>> {
    return this.api.delete(`/store/stores/${id}`);
  }

  async getStoreItems(): Promise<AxiosResponse<StoreItem[]>> {
    return this.api.get('/store');
  }

  async createStoreItem(data: Partial<StoreItem> | FormData): Promise<AxiosResponse<StoreItem>> {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return this.api.post('/store', data, config);
  }

  async updateStoreItem(id: string, data: Partial<StoreItem> | FormData): Promise<AxiosResponse<StoreItem>> {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return this.api.put(`/store/${id}`, data, config);
  }

  async deleteStoreItem(id: string): Promise<AxiosResponse<void>> {
    return this.api.delete(`/store/${id}`);
  }

  // Academics endpoints
  async getUniversities(): Promise<AxiosResponse<University[]>> {
    return this.api.get('/academics/universities');
  }

  async createUniversity(data: Partial<University> | FormData): Promise<AxiosResponse<University>> {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return this.api.post('/academics/universities', data, config);
  }

  async getUniversity(id: number): Promise<AxiosResponse<University>> {
    return this.api.get(`/academics/universities/${id}`);
  }

  async updateUniversity(id: number, data: Partial<University> | FormData): Promise<AxiosResponse<University>> {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return this.api.put(`/academics/universities/${id}`, data, config);
  }

  async deleteUniversity(id: number): Promise<AxiosResponse<void>> {
    return this.api.delete(`/academics/universities/${id}`);
  }

  async getUniversityResources(universityId: number): Promise<AxiosResponse<any[]>> {
    return this.api.get(`/academics/universities/${universityId}/resources`);
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

  async createTournament(data: FormData): Promise<AxiosResponse<any>> {
    return this.api.post('/gaming/tournaments', data, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  async updateTournament(id: string, data: FormData): Promise<AxiosResponse<any>> {
    return this.api.put(`/gaming/tournaments/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  async deleteTournament(id: string): Promise<AxiosResponse<void>> {
    return this.api.delete(`/gaming/tournaments/${id}`);
  }

  async getLeaderboards(): Promise<AxiosResponse<any[]>> {
    return this.api.get('/gaming/leaderboards');
  }

  async createLeaderboard(data: any): Promise<AxiosResponse<any>> {
    return this.api.post('/gaming/leaderboards', data);
  }

  async updateLeaderboard(id: string, data: any): Promise<AxiosResponse<any>> {
    return this.api.put(`/gaming/leaderboards/${id}`, data);
  }

  async deleteLeaderboard(id: string): Promise<AxiosResponse<void>> {
    return this.api.delete(`/gaming/leaderboards/${id}`);
  }

  async getLeaderboard(id: string): Promise<AxiosResponse<any>> {
    return this.api.get(`/gaming/leaderboards/${id}`);
  }

  async getGallery(): Promise<AxiosResponse<any[]>> {
    return this.api.get('/gaming/gallery');
  }

  async createGalleryItem(data: FormData): Promise<AxiosResponse<any>> {
    return this.api.post('/gaming/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  async deleteGalleryItem(id: string): Promise<AxiosResponse<void>> {
    return this.api.delete(`/gaming/gallery/${id}`);
  }

  // Homepage endpoints
  async getTeamMembers(): Promise<AxiosResponse<any[]>> {
    return this.api.get('/homepage/team-members');
  }

  async createTeamMember(data: FormData): Promise<AxiosResponse<any>> {
    return this.api.post('/homepage/team-members', data, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  async updateTeamMember(id: string, data: FormData): Promise<AxiosResponse<any>> {
    return this.api.put(`/homepage/team-members/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  async deleteTeamMember(id: string): Promise<AxiosResponse<void>> {
    return this.api.delete(`/homepage/team-members/${id}`);
  }

  async getPartners(): Promise<AxiosResponse<any[]>> {
    return this.api.get('/homepage/partners');
  }

  async createPartner(data: FormData): Promise<AxiosResponse<any>> {
    return this.api.post('/homepage/partners', data, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  async deletePartner(id: string): Promise<AxiosResponse<void>> {
    return this.api.delete(`/homepage/partners/${id}`);
  }

  async getHomepageStats(): Promise<AxiosResponse<any>> {
    return this.api.get('/homepage/stats');
  }

  async updateHomepageStats(data: any): Promise<AxiosResponse<any>> {
    return this.api.put('/homepage/stats', data);
  }

  async getFAQs(): Promise<AxiosResponse<any[]>> {
    return this.api.get('/homepage/faqs');
  }

  async createFAQ(data: any): Promise<AxiosResponse<any>> {
    return this.api.post('/homepage/faqs', data);
  }

  async updateFAQ(id: string, data: any): Promise<AxiosResponse<any>> {
    return this.api.put(`/homepage/faqs/${id}`, data);
  }

  async deleteFAQ(id: string): Promise<AxiosResponse<void>> {
    return this.api.delete(`/homepage/faqs/${id}`);
  }

  // Store categories
  async getStoreCategories(): Promise<AxiosResponse<any[]>> {
    return this.api.get('/store/categories');
  }

  async createStoreCategory(data: any): Promise<AxiosResponse<any>> {
    return this.api.post('/store/categories', data);
  }

  async deleteStoreCategory(id: string): Promise<AxiosResponse<void>> {
    return this.api.delete(`/store/categories/${id}`);
  }
}

export default new ApiService();