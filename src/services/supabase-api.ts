import supabaseAuth from './supabase-auth';
import supabaseDb from './supabase-db';
import { supabase } from '../lib/supabase';

class SupabaseApiService {
  // Auth
  async googleAuth(data: any) {
    return supabaseAuth.signInWithGoogle();
  }

  async login(data: any) {
    const result = await supabaseAuth.signIn(data.email, data.password);
    return { data: result };
  }

  async register(data: any) {
    const result = await supabaseAuth.signUp(data.email, data.password, data);
    return { data: result };
  }

  async getProfile() {
    const user = await supabaseAuth.getUser();
    return { data: user };
  }

  async updateProfile(data: any) {
    const result = await supabaseAuth.updateUser(data);
    return { data: result };
  }

  async refreshToken(data: any) {
    const session = await supabaseAuth.getSession();
    return { data: { access: session?.access_token } };
  }

  async requestPasswordReset(data: any) {
    await supabaseAuth.resetPassword(data.email);
    return { data: { message: 'Password reset email sent' } };
  }

  // Articles
  async getArticles() {
    return supabaseDb.getArticles();
  }

  async createArticle(data: any) {
    if (data instanceof FormData) {
      const file = data.get('image') as File;
      const title = data.get('title') as string;
      const content = data.get('content') as string;
      const category = data.get('category') as string;
      
      let imageUrl = null;
      if (file) {
        imageUrl = await supabaseDb.uploadFile('images', `articles/${Date.now()}_${file.name}`, file);
      }
      
      return supabaseDb.createArticle({ title, content, category, image: imageUrl });
    }
    return supabaseDb.createArticle(data);
  }

  async getArticle(id: string) {
    const { data } = await supabase.from('articles').select('*').eq('id', id).single();
    return { data };
  }

  async updateArticle(id: string, data: any) {
    if (data instanceof FormData) {
      const file = data.get('image') as File;
      const updates: any = {
        title: data.get('title'),
        content: data.get('content'),
        category: data.get('category')
      };
      
      if (file) {
        updates.image = await supabaseDb.uploadFile('images', `articles/${Date.now()}_${file.name}`, file);
      }
      
      return supabaseDb.updateArticle(id, updates);
    }
    return supabaseDb.updateArticle(id, data);
  }

  async deleteArticle(id: string) {
    return supabaseDb.deleteArticle(id);
  }

  // Events
  async getEvents() {
    return supabaseDb.getEvents();
  }

  async createEvent(data: any) {
    if (data instanceof FormData) {
      const file = data.get('image') as File;
      const eventData: any = {
        title: data.get('title'),
        description: data.get('description'),
        date: data.get('date'),
        location: data.get('location')
      };
      
      if (file) {
        eventData.image = await supabaseDb.uploadFile('images', `events/${Date.now()}_${file.name}`, file);
      }
      
      return supabaseDb.createEvent(eventData);
    }
    return supabaseDb.createEvent(data);
  }

  async getEvent(id: string) {
    const { data } = await supabase.from('events').select('*').eq('id', id).single();
    return { data };
  }

  async updateEventById(id: string, data: any) {
    if (data instanceof FormData) {
      const file = data.get('image') as File;
      const updates: any = {
        title: data.get('title'),
        description: data.get('description'),
        date: data.get('date'),
        location: data.get('location')
      };
      
      if (file) {
        updates.image = await supabaseDb.uploadFile('images', `events/${Date.now()}_${file.name}`, file);
      }
      
      return supabaseDb.updateEvent(id, updates);
    }
    return supabaseDb.updateEvent(id, data);
  }

  async deleteEventById(id: string) {
    return supabaseDb.deleteEvent(id);
  }

  // News
  async getNews() {
    return supabaseDb.getNews();
  }

  async createNews(data: any) {
    if (data instanceof FormData) {
      const file = data.get('image') as File;
      const newsData: any = {
        title: data.get('title'),
        content: data.get('content')
      };
      
      if (file) {
        newsData.image = await supabaseDb.uploadFile('images', `news/${Date.now()}_${file.name}`, file);
      }
      
      return supabaseDb.createNews(newsData);
    }
    return supabaseDb.createNews(data);
  }

  async getNewsItem(id: string) {
    const { data } = await supabase.from('news').select('*').eq('id', id).single();
    return { data };
  }

  async updateNews(id: string, data: any) {
    if (data instanceof FormData) {
      const file = data.get('image') as File;
      const updates: any = {
        title: data.get('title'),
        content: data.get('content')
      };
      
      if (file) {
        updates.image = await supabaseDb.uploadFile('images', `news/${Date.now()}_${file.name}`, file);
      }
      
      return supabaseDb.updateNews(id, updates);
    }
    return supabaseDb.updateNews(id, data);
  }

  async deleteNews(id: string) {
    return supabaseDb.deleteNews(id);
  }

  // Likes & Bookmarks
  async toggleLike(modelName: string, objectId: string) {
    const user = await supabaseAuth.getUser();
    return supabaseDb.toggleLike(modelName, objectId, user.id);
  }

  async toggleBookmark(modelName: string, objectId: string) {
    const user = await supabaseAuth.getUser();
    return supabaseDb.toggleBookmark(modelName, objectId, user.id);
  }

  // Comments
  async getComments(modelName: string, objectId: string) {
    return supabaseDb.getComments(modelName, objectId);
  }

  async createComment(modelName: string, objectId: string, data: { content: string }) {
    const user = await supabaseAuth.getUser();
    return supabaseDb.createComment({ ...data, model_name: modelName, object_id: objectId, user_id: user.id });
  }

  async getComment(commentId: string) {
    const { data } = await supabase.from('comments').select('*').eq('id', commentId).single();
    return { data };
  }

  async updateComment(id: string, data: { content: string }) {
    return supabaseDb.updateComment(id, data.content);
  }

  async deleteComment(id: string) {
    return supabaseDb.deleteComment(id);
  }

  // User Stats
  async getUserBookmarks() {
    const user = await supabaseAuth.getUser();
    return supabaseDb.getUserBookmarks(user.id);
  }

  async getUserLikes() {
    const user = await supabaseAuth.getUser();
    return supabaseDb.getUserLikes(user.id);
  }

  async getUserComments() {
    const user = await supabaseAuth.getUser();
    return supabaseDb.getUserComments(user.id);
  }

  // Stores
  async getStores() {
    return supabaseDb.getStores();
  }

  async createStore(data: FormData) {
    const file = data.get('logo') as File;
    const storeData: any = {
      name: data.get('name'),
      description: data.get('description'),
      whatsapp: data.get('whatsapp'),
      instagram: data.get('instagram'),
      twitter: data.get('twitter'),
      facebook: data.get('facebook')
    };
    
    if (file) {
      storeData.logo = await supabaseDb.uploadFile('logos', `stores/${Date.now()}_${file.name}`, file);
    }
    
    return supabaseDb.createStore(storeData);
  }

  async updateStore(id: string, data: FormData) {
    const file = data.get('logo') as File;
    const updates: any = {
      name: data.get('name'),
      description: data.get('description'),
      whatsapp: data.get('whatsapp'),
      instagram: data.get('instagram'),
      twitter: data.get('twitter'),
      facebook: data.get('facebook')
    };
    
    if (file) {
      updates.logo = await supabaseDb.uploadFile('logos', `stores/${Date.now()}_${file.name}`, file);
    }
    
    return supabaseDb.updateStore(id, updates);
  }

  async deleteStore(id: string) {
    return supabaseDb.deleteStore(id);
  }

  // Store Items
  async getStoreItems() {
    return supabaseDb.getStoreItems();
  }

  async createStoreItem(data: any) {
    if (data instanceof FormData) {
      const file = data.get('image') as File;
      const itemData: any = {
        name: data.get('name'),
        description: data.get('description'),
        price: parseFloat(data.get('price') as string),
        category: data.get('category'),
        store: data.get('store'),
        in_stock: data.get('in_stock') === 'true'
      };
      
      if (file) {
        itemData.image = await supabaseDb.uploadFile('images', `store-items/${Date.now()}_${file.name}`, file);
      }
      
      return supabaseDb.createStoreItem(itemData);
    }
    return supabaseDb.createStoreItem(data);
  }

  async updateStoreItem(id: string, data: any) {
    if (data instanceof FormData) {
      const file = data.get('image') as File;
      const updates: any = {
        name: data.get('name'),
        description: data.get('description'),
        price: parseFloat(data.get('price') as string),
        category: data.get('category'),
        store: data.get('store'),
        in_stock: data.get('in_stock') === 'true'
      };
      
      if (file) {
        updates.image = await supabaseDb.uploadFile('images', `store-items/${Date.now()}_${file.name}`, file);
      }
      
      return supabaseDb.updateStoreItem(id, updates);
    }
    return supabaseDb.updateStoreItem(id, data);
  }

  async deleteStoreItem(id: string) {
    return supabaseDb.deleteStoreItem(id);
  }

  // Universities
  async getUniversities() {
    return supabaseDb.getUniversities();
  }

  async createUniversity(data: any) {
    if (data instanceof FormData) {
      const file = data.get('logo') as File;
      const uniData: any = {
        name: data.get('name'),
        abbreviation: data.get('abbreviation'),
        website: data.get('website'),
        location: data.get('location'),
        description: data.get('description'),
        established_year: parseInt(data.get('established_year') as string)
      };
      
      if (file) {
        uniData.logo = await supabaseDb.uploadFile('logos', `universities/${Date.now()}_${file.name}`, file);
      }
      
      return supabaseDb.createUniversity(uniData);
    }
    return supabaseDb.createUniversity(data);
  }

  async updateUniversity(id: number, data: any) {
    if (data instanceof FormData) {
      const file = data.get('logo') as File;
      const updates: any = {
        name: data.get('name'),
        abbreviation: data.get('abbreviation'),
        website: data.get('website'),
        location: data.get('location'),
        description: data.get('description'),
        established_year: parseInt(data.get('established_year') as string)
      };
      
      if (file) {
        updates.logo = await supabaseDb.uploadFile('logos', `universities/${Date.now()}_${file.name}`, file);
      }
      
      return supabaseDb.updateUniversity(id, updates);
    }
    return supabaseDb.updateUniversity(id, data);
  }

  async deleteUniversity(id: number) {
    return supabaseDb.deleteUniversity(id);
  }

  // Tournaments
  async getTournaments() {
    return supabaseDb.getTournaments();
  }

  async createTournament(data: FormData) {
    const file = data.get('image') as File;
    const tournamentData: any = {
      name: data.get('name'),
      game: data.get('game'),
      start_date: data.get('start_date'),
      end_date: data.get('end_date'),
      prize_pool: parseFloat(data.get('prize_pool') as string),
      max_participants: parseInt(data.get('max_participants') as string),
      status: data.get('status')
    };
    
    if (file) {
      tournamentData.image = await supabaseDb.uploadFile('images', `tournaments/${Date.now()}_${file.name}`, file);
    }
    
    return supabaseDb.createTournament(tournamentData);
  }

  async updateTournament(id: string, data: FormData) {
    const file = data.get('image') as File;
    const updates: any = {
      name: data.get('name'),
      game: data.get('game'),
      start_date: data.get('start_date'),
      end_date: data.get('end_date'),
      prize_pool: parseFloat(data.get('prize_pool') as string),
      max_participants: parseInt(data.get('max_participants') as string),
      status: data.get('status')
    };
    
    if (file) {
      updates.image = await supabaseDb.uploadFile('images', `tournaments/${Date.now()}_${file.name}`, file);
    }
    
    return supabaseDb.updateTournament(id, updates);
  }

  async deleteTournament(id: string) {
    return supabaseDb.deleteTournament(id);
  }

  // Leaderboards
  async getLeaderboards() {
    return supabaseDb.getLeaderboards();
  }

  async createLeaderboard(data: any) {
    return supabaseDb.createLeaderboard(data);
  }

  async updateLeaderboard(id: string, data: any) {
    return supabaseDb.updateLeaderboard(id, data);
  }

  async deleteLeaderboard(id: string) {
    return supabaseDb.deleteLeaderboard(id);
  }

  // Gallery
  async getGallery() {
    return supabaseDb.getGallery();
  }

  async createGalleryItem(data: FormData) {
    const file = data.get('image') as File;
    const galleryData: any = {
      title: data.get('title'),
      description: data.get('description')
    };
    
    if (file) {
      galleryData.image = await supabaseDb.uploadFile('images', `gallery/${Date.now()}_${file.name}`, file);
    }
    
    return supabaseDb.createGalleryItem(galleryData);
  }

  async deleteGalleryItem(id: string) {
    return supabaseDb.deleteGalleryItem(id);
  }

  // Team Members
  async getTeamMembers() {
    return supabaseDb.getTeamMembers();
  }

  async createTeamMember(data: FormData) {
    const file = data.get('image') as File;
    const memberData: any = {
      name: data.get('name'),
      role: data.get('role'),
      bio: data.get('bio'),
      order: parseInt(data.get('order') as string),
      social: JSON.parse(data.get('social') as string)
    };
    
    if (file) {
      memberData.image = await supabaseDb.uploadFile('images', `team/${Date.now()}_${file.name}`, file);
    }
    
    return supabaseDb.createTeamMember(memberData);
  }

  async updateTeamMember(id: string, data: FormData) {
    const file = data.get('image') as File;
    const updates: any = {
      name: data.get('name'),
      role: data.get('role'),
      bio: data.get('bio'),
      order: parseInt(data.get('order') as string),
      social: JSON.parse(data.get('social') as string)
    };
    
    if (file) {
      updates.image = await supabaseDb.uploadFile('images', `team/${Date.now()}_${file.name}`, file);
    }
    
    return supabaseDb.updateTeamMember(id, updates);
  }

  async deleteTeamMember(id: string) {
    return supabaseDb.deleteTeamMember(id);
  }

  // Partners
  async getPartners() {
    return supabaseDb.getPartners();
  }

  async createPartner(data: FormData) {
    const file = data.get('logo') as File;
    const partnerData: any = {
      name: data.get('name'),
      website: data.get('website'),
      order: parseInt(data.get('order') as string)
    };
    
    if (file) {
      partnerData.logo = await supabaseDb.uploadFile('logos', `partners/${Date.now()}_${file.name}`, file);
    }
    
    return supabaseDb.createPartner(partnerData);
  }

  async deletePartner(id: string) {
    return supabaseDb.deletePartner(id);
  }

  // FAQs
  async getFAQs() {
    return supabaseDb.getFAQs();
  }

  async createFAQ(data: any) {
    return supabaseDb.createFAQ(data);
  }

  async updateFAQ(id: string, data: any) {
    return supabaseDb.updateFAQ(id, data);
  }

  async deleteFAQ(id: string) {
    return supabaseDb.deleteFAQ(id);
  }

  // Homepage Stats
  async getHomepageStats() {
    return supabaseDb.getHomepageStats();
  }

  async updateHomepageStats(data: any) {
    return supabaseDb.updateHomepageStats(data);
  }
}

export default new SupabaseApiService();
