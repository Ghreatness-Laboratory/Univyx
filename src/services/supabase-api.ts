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
      facebook: data.get('facebook'),
      university: data.get('university') || null,
      is_verified: data.get('is_verified') === 'true',
      achievements: data.get('achievements') ? (data.get('achievements') as string).split(',').map(a => a.trim()).filter(Boolean) : [],
      tags: data.get('tags') ? (data.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean) : []
    };
    if (file) storeData.logo = await supabaseDb.uploadFile('logos', `stores/${Date.now()}_${file.name}`, file);
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
      facebook: data.get('facebook'),
      university: data.get('university') || null,
      is_verified: data.get('is_verified') === 'true',
      achievements: data.get('achievements') ? (data.get('achievements') as string).split(',').map(a => a.trim()).filter(Boolean) : [],
      tags: data.get('tags') ? (data.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean) : []
    };
    if (file) updates.logo = await supabaseDb.uploadFile('logos', `stores/${Date.now()}_${file.name}`, file);
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

  // Store Categories
  async getStoreCategories() {
    const { data } = await supabase.from('store_items').select('category');
    const categories = [...new Set(data?.map(item => item.category) || [])];
    return { data: { data: categories } };
  }

  // Jobs
  async getJobs(filters?: { type?: string; university_id?: number; search?: string }) {
    return supabaseDb.getJobs(filters);
  }

  async getJob(id: string) {
    return supabaseDb.getJob(id);
  }

  async createJob(data: any) {
    if (data instanceof FormData) {
      const file = data.get('image') as File;
      const jobData: any = {
        title: data.get('title'), company: data.get('company'), description: data.get('description'),
        requirements: data.get('requirements'), type: data.get('type'), location: data.get('location'),
        is_remote: data.get('is_remote') === 'true', salary_min: parseFloat(data.get('salary_min') as string) || null,
        salary_max: parseFloat(data.get('salary_max') as string) || null, salary_verified: data.get('salary_verified') === 'true',
        pay_record: data.get('pay_record'), application_url: data.get('application_url'),
        application_email: data.get('application_email'), deadline: data.get('deadline') || null,
        is_verified: data.get('is_verified') === 'true', tags: data.get('tags') ? (data.get('tags') as string).split(',').map(t => t.trim()) : []
      };
      if (file) jobData.image = await supabaseDb.uploadFile('images', `jobs/${Date.now()}_${file.name}`, file);
      return supabaseDb.createJob(jobData);
    }
    return supabaseDb.createJob(data);
  }

  async updateJob(id: string, data: any) {
    if (data instanceof FormData) {
      const file = data.get('image') as File;
      const updates: any = {
        title: data.get('title'), company: data.get('company'), description: data.get('description'),
        requirements: data.get('requirements'), type: data.get('type'), location: data.get('location'),
        is_remote: data.get('is_remote') === 'true', salary_min: parseFloat(data.get('salary_min') as string) || null,
        salary_max: parseFloat(data.get('salary_max') as string) || null, salary_verified: data.get('salary_verified') === 'true',
        pay_record: data.get('pay_record'), application_url: data.get('application_url'),
        application_email: data.get('application_email'), deadline: data.get('deadline') || null,
        is_verified: data.get('is_verified') === 'true'
      };
      if (file) updates.image = await supabaseDb.uploadFile('images', `jobs/${Date.now()}_${file.name}`, file);
      return supabaseDb.updateJob(id, updates);
    }
    return supabaseDb.updateJob(id, data);
  }

  async deleteJob(id: string) {
    return supabaseDb.deleteJob(id);
  }

  async applyToJob(jobId: string, coverLetter?: string) {
    const user = await supabaseAuth.getUser();
    return supabaseDb.applyToJob(jobId, user.id, coverLetter);
  }

  async getUserApplications() {
    const user = await supabaseAuth.getUser();
    return supabaseDb.getUserApplications(user.id);
  }

  // Skills
  async getSkills(filters?: { category?: string; search?: string }) {
    return supabaseDb.getSkills(filters);
  }

  async createSkill(data: any) {
    const user = await supabaseAuth.getUser();
    if (data instanceof FormData) {
      const file = data.get('image') as File;
      const skillData: any = {
        user_id: user.id, title: data.get('title'), description: data.get('description'),
        category: data.get('category'), price: parseFloat(data.get('price') as string) || null,
        is_free: data.get('is_free') === 'true', portfolio_url: data.get('portfolio_url'),
        university: data.get('university'), tags: data.get('tags') ? (data.get('tags') as string).split(',').map(t => t.trim()) : []
      };
      if (file) skillData.image = await supabaseDb.uploadFile('images', `skills/${Date.now()}_${file.name}`, file);
      return supabaseDb.createSkill(skillData);
    }
    return supabaseDb.createSkill({ ...data, user_id: user.id });
  }

  async updateSkill(id: string, data: any) {
    return supabaseDb.updateSkill(id, data);
  }

  async deleteSkill(id: string) {
    return supabaseDb.deleteSkill(id);
  }

  // Slideshow
  async getSlideshow() {
    return supabaseDb.getSlideshow();
  }

  async createSlide(data: any) {
    if (data instanceof FormData) {
      const file = data.get('image') as File;
      const slideData: any = {
        title: data.get('title'), subtitle: data.get('subtitle'),
        cta_text: data.get('cta_text'), cta_link: data.get('cta_link'),
        order: parseInt(data.get('order') as string) || 0, is_active: data.get('is_active') !== 'false'
      };
      if (file) slideData.image = await supabaseDb.uploadFile('images', `slideshow/${Date.now()}_${file.name}`, file);
      return supabaseDb.createSlide(slideData);
    }
    return supabaseDb.createSlide(data);
  }

  async updateSlide(id: string, data: any) {
    if (data instanceof FormData) {
      const file = data.get('image') as File;
      const updates: any = {
        title: data.get('title'), subtitle: data.get('subtitle'),
        cta_text: data.get('cta_text'), cta_link: data.get('cta_link'),
        order: parseInt(data.get('order') as string) || 0, is_active: data.get('is_active') !== 'false'
      };
      if (file) updates.image = await supabaseDb.uploadFile('images', `slideshow/${Date.now()}_${file.name}`, file);
      return supabaseDb.updateSlide(id, updates);
    }
    return supabaseDb.updateSlide(id, data);
  }

  async deleteSlide(id: string) {
    return supabaseDb.deleteSlide(id);
  }

  // Site Settings
  async getSiteSettings() {
    return supabaseDb.getSiteSettings();
  }

  async getAllSiteSettings() {
    return supabaseDb.getAllSiteSettings();
  }

  async updateSiteSetting(key: string, value: string) {
    return supabaseDb.updateSiteSetting(key, value);
  }

  // Popups
  async getPopups() {
    return supabaseDb.getPopups();
  }

  async getAllPopups() {
    return supabaseDb.getAllPopups();
  }

  async createPopup(data: any) {
    if (data instanceof FormData) {
      const file = data.get('image') as File;
      const popupData: any = {
        title: data.get('title'), content: data.get('content'), cta_text: data.get('cta_text'),
        cta_link: data.get('cta_link'), trigger: data.get('trigger') || 'onload',
        delay_seconds: parseInt(data.get('delay_seconds') as string) || 3,
        is_active: data.get('is_active') !== 'false'
      };
      if (file) popupData.image = await supabaseDb.uploadFile('images', `popups/${Date.now()}_${file.name}`, file);
      return supabaseDb.createPopup(popupData);
    }
    return supabaseDb.createPopup(data);
  }

  async updatePopup(id: string, data: any) {
    return supabaseDb.updatePopup(id, data);
  }

  async deletePopup(id: string) {
    return supabaseDb.deletePopup(id);
  }

  // Store Reviews
  async reviewStore(storeId: string, rating: number, comment?: string) {
    const user = await supabaseAuth.getUser();
    return supabaseDb.reviewStore(storeId, user.id, rating, comment);
  }

  async getStoreReviews(storeId: string) {
    return supabaseDb.getStoreReviews(storeId);
  }

  // Hall of Fame
  async getHallOfFamePlayers() {
    const { data } = await supabase.from('hall_of_fame_players').select('*').order('display_order');
    return { data: { data } };
  }

  async createHallOfFamePlayer(data: any) {
    if (data instanceof FormData) {
      const file = data.get('avatar') as File;
      const playerData: any = {
        name: data.get('name'), gamertag: data.get('gamertag'), university: data.get('university'),
        bio: data.get('bio'), favorite_game: data.get('favorite_game'), rank: data.get('rank'),
        total_wins: parseInt(data.get('total_wins') as string) || 0,
        total_tournaments: parseInt(data.get('total_tournaments') as string) || 0,
        is_featured: data.get('is_featured') === 'true',
        display_order: parseInt(data.get('display_order') as string) || 0,
        achievements: data.get('achievements') ? (data.get('achievements') as string).split(',').map(a => a.trim()) : [],
        social_links: data.get('social_links') ? JSON.parse(data.get('social_links') as string) : {},
        stats: data.get('stats') ? JSON.parse(data.get('stats') as string) : {}
      };
      if (file) playerData.avatar = await supabaseDb.uploadFile('images', `hall-of-fame/${Date.now()}_${file.name}`, file);
      const { data: result } = await supabase.from('hall_of_fame_players').insert(playerData).select().single();
      return { data: { data: result } };
    }
    const { data: result } = await supabase.from('hall_of_fame_players').insert(data).select().single();
    return { data: { data: result } };
  }

  async updateHallOfFamePlayer(id: string, data: any) {
    const { data: result } = await supabase.from('hall_of_fame_players').update(data).eq('id', id).select().single();
    return { data: { data: result } };
  }

  async deleteHallOfFamePlayer(id: string) {
    await supabase.from('hall_of_fame_players').delete().eq('id', id);
    return { data: { message: 'Player deleted' } };
  }

  // Gaming Wiki
  async getGamingWiki(filters?: { category?: string; search?: string }) {
    let query = supabase.from('gaming_wiki').select('*').eq('is_published', true);
    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.search) query = query.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`);
    const { data } = await query.order('created_at', { ascending: false });
    return { data: { data } };
  }

  async getWikiEntry(slug: string) {
    const { data } = await supabase.from('gaming_wiki').select('*').eq('slug', slug).single();
    await supabase.from('gaming_wiki').update({ views: (data?.views || 0) + 1 }).eq('id', data?.id);
    return { data: { data } };
  }

  async createWikiEntry(data: any) {
    if (data instanceof FormData) {
      const file = data.get('image') as File;
      const wikiData: any = {
        title: data.get('title'), slug: data.get('slug'), category: data.get('category'),
        content: data.get('content'), summary: data.get('summary'),
        tags: data.get('tags') ? (data.get('tags') as string).split(',').map(t => t.trim()) : [],
        is_published: data.get('is_published') !== 'false'
      };
      if (file) wikiData.image = await supabaseDb.uploadFile('images', `wiki/${Date.now()}_${file.name}`, file);
      const { data: result } = await supabase.from('gaming_wiki').insert(wikiData).select().single();
      return { data: { data: result } };
    }
    const { data: result } = await supabase.from('gaming_wiki').insert(data).select().single();
    return { data: { data: result } };
  }

  async updateWikiEntry(id: string, data: any) {
    const { data: result } = await supabase.from('gaming_wiki').update(data).eq('id', id).select().single();
    return { data: { data: result } };
  }

  async deleteWikiEntry(id: string) {
    await supabase.from('gaming_wiki').delete().eq('id', id);
    return { data: { message: 'Wiki entry deleted' } };
  }

  // Gaming Teams
  async getGamingTeams() {
    const { data } = await supabase.from('gaming_teams').select('*').eq('is_active', true).order('rank');
    return { data: { data } };
  }

  // Gaming Records
  async getGamingRecords() {
    const { data } = await supabase.from('gaming_records').select('*').eq('is_verified', true).order('date_achieved', { ascending: false });
    return { data: { data } };
  }

  // Gaming Highlights
  async getGamingHighlights() {
    const { data } = await supabase.from('gaming_highlights').select('*').order('created_at', { ascending: false });
    return { data: { data } };
  }
}

export default new SupabaseApiService();
