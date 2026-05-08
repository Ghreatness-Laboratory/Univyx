import { supabase } from '../lib/supabase';

export class SupabaseService {
  // Articles
  async getArticles() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Fetch likes count for each article
    const articlesWithLikes = await Promise.all(
      (data || []).map(async (article) => {
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('model_name', 'article')
          .eq('object_id', article.id);
        
        return {
          ...article,
          likes: count || 0
        };
      })
    );
    
    return { data: { data: articlesWithLikes } };
  }

  async createArticle(article: any) {
    const { data, error } = await supabase.from('articles').insert(article).select().single();
    if (error) throw error;
    return { data };
  }

  async updateArticle(id: string, article: any) {
    const { data, error } = await supabase.from('articles').update(article).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteArticle(id: string) {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // Events
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    // Fetch likes count for each event
    const eventsWithLikes = await Promise.all(
      (data || []).map(async (event) => {
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('model_name', 'event')
          .eq('object_id', event.id);
        
        return {
          ...event,
          likes: count || 0
        };
      })
    );
    
    return { data: { data: eventsWithLikes } };
  }

  async createEvent(event: any) {
    const { data, error } = await supabase.from('events').insert(event).select().single();
    if (error) throw error;
    return { data };
  }

  async updateEvent(id: string, event: any) {
    const { data, error } = await supabase.from('events').update(event).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteEvent(id: string) {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // News
  async getNews() {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Fetch likes count for each news
    const newsWithLikes = await Promise.all(
      (data || []).map(async (news) => {
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('model_name', 'news')
          .eq('object_id', news.id);
        
        return {
          ...news,
          likes: count || 0
        };
      })
    );
    
    return { data: { data: newsWithLikes } };
  }

  async createNews(news: any) {
    const { data, error } = await supabase.from('news').insert(news).select().single();
    if (error) throw error;
    return { data };
  }

  async updateNews(id: string, news: any) {
    const { data, error } = await supabase.from('news').update(news).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteNews(id: string) {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // Tournaments
  async getTournaments() {
    const { data, error } = await supabase.from('tournaments').select('*').order('start_date', { ascending: false });
    if (error) throw error;
    return { data: { data } };
  }

  async createTournament(tournament: any) {
    const { data, error } = await supabase.from('tournaments').insert(tournament).select().single();
    if (error) throw error;
    return { data };
  }

  async updateTournament(id: string, tournament: any) {
    const { data, error } = await supabase.from('tournaments').update(tournament).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteTournament(id: string) {
    const { error } = await supabase.from('tournaments').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // Leaderboards
  async getLeaderboards() {
    const { data, error } = await supabase.from('leaderboards').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return { data: { data } };
  }

  async createLeaderboard(leaderboard: any) {
    const { data, error } = await supabase.from('leaderboards').insert(leaderboard).select().single();
    if (error) throw error;
    return { data };
  }

  async updateLeaderboard(id: string, leaderboard: any) {
    const { data, error } = await supabase.from('leaderboards').update(leaderboard).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteLeaderboard(id: string) {
    const { error } = await supabase.from('leaderboards').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // Universities
  async getUniversities() {
    const { data, error } = await supabase.from('universities').select('*').order('name', { ascending: true });
    if (error) throw error;
    return { data: { data } };
  }

  async createUniversity(university: any) {
    const { data, error } = await supabase.from('universities').insert(university).select().single();
    if (error) throw error;
    return { data };
  }

  async updateUniversity(id: number, university: any) {
    const { data, error } = await supabase.from('universities').update(university).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteUniversity(id: number) {
    const { error } = await supabase.from('universities').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // Stores
  async getStores() {
    const { data, error } = await supabase.from('stores').select('*').order('name', { ascending: true });
    if (error) throw error;
    return { data: { data } };
  }

  async createStore(store: any) {
    const { data, error } = await supabase.from('stores').insert(store).select().single();
    if (error) throw error;
    return { data };
  }

  async updateStore(id: string, store: any) {
    const { data, error } = await supabase.from('stores').update(store).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteStore(id: string) {
    const { error } = await supabase.from('stores').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // Store Items
  async getStoreItems() {
    const { data, error } = await supabase.from('store_items').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return { data: { data } };
  }

  async createStoreItem(item: any) {
    const { data, error } = await supabase.from('store_items').insert(item).select().single();
    if (error) throw error;
    return { data };
  }

  async updateStoreItem(id: string, item: any) {
    const { data, error } = await supabase.from('store_items').update(item).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteStoreItem(id: string) {
    const { error } = await supabase.from('store_items').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // Team Members
  async getTeamMembers() {
    const { data, error } = await supabase.from('team_members').select('*').order('order', { ascending: true });
    if (error) throw error;
    return { data: { data } };
  }

  async createTeamMember(member: any) {
    const { data, error } = await supabase.from('team_members').insert(member).select().single();
    if (error) throw error;
    return { data };
  }

  async updateTeamMember(id: string, member: any) {
    const { data, error } = await supabase.from('team_members').update(member).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteTeamMember(id: string) {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // Partners
  async getPartners() {
    const { data, error } = await supabase.from('partners').select('*').order('order', { ascending: true });
    if (error) throw error;
    return { data: { data } };
  }

  async createPartner(partner: any) {
    const { data, error } = await supabase.from('partners').insert(partner).select().single();
    if (error) throw error;
    return { data };
  }

  async deletePartner(id: string) {
    const { error } = await supabase.from('partners').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // Gallery
  async getGallery() {
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return { data: { data } };
  }

  async createGalleryItem(item: any) {
    const { data, error } = await supabase.from('gallery').insert(item).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteGalleryItem(id: string) {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // FAQs
  async getFAQs() {
    const { data, error } = await supabase.from('faqs').select('*').order('order', { ascending: true });
    if (error) throw error;
    return { data: { data } };
  }

  async createFAQ(faq: any) {
    const { data, error } = await supabase.from('faqs').insert(faq).select().single();
    if (error) throw error;
    return { data };
  }

  async updateFAQ(id: string, faq: any) {
    const { data, error } = await supabase.from('faqs').update(faq).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteFAQ(id: string) {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // Stats
  async getHomepageStats() {
    const { data, error } = await supabase.from('homepage_stats').select('*').single();
    if (error) {
      // If no stats exist, return defaults
      if (error.code === 'PGRST116') {
        return { data: { data: { students: 0, universities: 0, events: 0, tournaments: 0 } } };
      }
      throw error;
    }
    return { data: { data } };
  }

  async updateHomepageStats(stats: any) {
    const { data, error } = await supabase.from('homepage_stats').upsert(stats).select().single();
    if (error) throw error;
    return { data };
  }

  // Comments
  async getComments(modelName: string, objectId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:user_id (
          id,
          email,
          raw_user_meta_data
        )
      `)
      .eq('model_name', modelName)
      .eq('object_id', objectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform author data to match expected format
    const transformedData = data?.map(comment => ({
      ...comment,
      author: comment.author ? {
        id: comment.author.id,
        email: comment.author.email,
        first_name: comment.author.raw_user_meta_data?.first_name || '',
        last_name: comment.author.raw_user_meta_data?.last_name || '',
        full_name: `${comment.author.raw_user_meta_data?.first_name || ''} ${comment.author.raw_user_meta_data?.last_name || ''}`.trim()
      } : null
    })) || [];
    
    return { data: { data: transformedData } };
  }

  async createComment(comment: any) {
    const { data, error } = await supabase.from('comments').insert(comment).select().single();
    if (error) throw error;
    return { data };
  }

  async updateComment(id: string, content: string) {
    const { data, error } = await supabase.from('comments').update({ content }).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteComment(id: string) {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // Likes
  async toggleLike(modelName: string, objectId: string, userId: string) {
    const { data: existing } = await supabase.from('likes').select('*').eq('model_name', modelName).eq('object_id', objectId).eq('user_id', userId).single();
    
    if (existing) {
      const { error } = await supabase.from('likes').delete().eq('id', existing.id);
      if (error) throw error;
      return { data: { liked: false } };
    } else {
      const { data, error } = await supabase.from('likes').insert({ model_name: modelName, object_id: objectId, user_id: userId }).select().single();
      if (error) throw error;
      return { data: { liked: true, ...data } };
    }
  }

  // Bookmarks
  async toggleBookmark(modelName: string, objectId: string, userId: string) {
    const { data: existing } = await supabase.from('bookmarks').select('*').eq('model_name', modelName).eq('object_id', objectId).eq('user_id', userId).single();
    
    if (existing) {
      const { error } = await supabase.from('bookmarks').delete().eq('id', existing.id);
      if (error) throw error;
      return { data: { bookmarked: false } };
    } else {
      const { data, error } = await supabase.from('bookmarks').insert({ model_name: modelName, object_id: objectId, user_id: userId }).select().single();
      if (error) throw error;
      return { data: { bookmarked: true, ...data } };
    }
  }

  // User Stats
  async getUserBookmarks(userId: string) {
    const { data, error } = await supabase.from('bookmarks').select('*').eq('user_id', userId);
    if (error) throw error;
    return { data: { data } };
  }

  async getUserLikes(userId: string) {
    const { data, error } = await supabase.from('likes').select('*').eq('user_id', userId);
    if (error) throw error;
    return { data: { data } };
  }

  async getUserComments(userId: string) {
    const { data, error } = await supabase.from('comments').select('*').eq('user_id', userId);
    if (error) throw error;
    return { data: { data } };
  }

  // File Upload
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrl;
  }

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  }

  // Jobs
  async getJobs(filters?: { type?: string; university_id?: number; search?: string }) {
    let query = supabase.from('jobs').select('*, universities(name, abbreviation)').eq('is_active', true).order('created_at', { ascending: false });
    if (filters?.type) query = query.eq('type', filters.type);
    if (filters?.university_id) query = query.eq('university_id', filters.university_id);
    if (filters?.search) query = query.ilike('title', `%${filters.search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return { data: { data } };
  }

  async getJob(id: string) {
    const { data, error } = await supabase.from('jobs').select('*, universities(name, abbreviation)').eq('id', id).single();
    if (error) throw error;
    return { data };
  }

  async createJob(job: any) {
    const { data, error } = await supabase.from('jobs').insert(job).select().single();
    if (error) throw error;
    return { data };
  }

  async updateJob(id: string, job: any) {
    const { data, error } = await supabase.from('jobs').update(job).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteJob(id: string) {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  async applyToJob(jobId: string, userId: string, coverLetter?: string) {
    const { data, error } = await supabase.from('job_applications').insert({ job_id: jobId, user_id: userId, cover_letter: coverLetter }).select().single();
    if (error) throw error;
    return { data };
  }

  async getUserApplications(userId: string) {
    const { data, error } = await supabase.from('job_applications').select('*, jobs(title, company, type)').eq('user_id', userId);
    if (error) throw error;
    return { data: { data } };
  }

  // Skills
  async getSkills(filters?: { category?: string; search?: string }) {
    let query = supabase.from('skills').select('*').eq('is_active', true).order('created_at', { ascending: false });
    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.search) query = query.ilike('title', `%${filters.search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return { data: { data } };
  }

  async createSkill(skill: any) {
    const { data, error } = await supabase.from('skills').insert(skill).select().single();
    if (error) throw error;
    return { data };
  }

  async updateSkill(id: string, skill: any) {
    const { data, error } = await supabase.from('skills').update(skill).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteSkill(id: string) {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // Slideshow
  async getSlideshow() {
    const { data, error } = await supabase.from('slideshow').select('*').eq('is_active', true).order('order', { ascending: true });
    if (error) throw error;
    return { data: { data } };
  }

  async createSlide(slide: any) {
    const { data, error } = await supabase.from('slideshow').insert(slide).select().single();
    if (error) throw error;
    return { data };
  }

  async updateSlide(id: string, slide: any) {
    const { data, error } = await supabase.from('slideshow').update(slide).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteSlide(id: string) {
    const { error } = await supabase.from('slideshow').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // Site Settings
  async getSiteSettings() {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) throw error;
    const settings: Record<string, string> = {};
    data?.forEach(s => { settings[s.key] = s.value; });
    return { data: { data: settings } };
  }

  async updateSiteSetting(key: string, value: string) {
    const { data, error } = await supabase.from('site_settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key).select().single();
    if (error) throw error;
    return { data };
  }

  async getAllSiteSettings() {
    const { data, error } = await supabase.from('site_settings').select('*').order('section');
    if (error) throw error;
    return { data: { data } };
  }

  // Popups
  async getPopups() {
    const { data, error } = await supabase.from('popups').select('*').eq('is_active', true);
    if (error) throw error;
    return { data: { data } };
  }

  async getAllPopups() {
    const { data, error } = await supabase.from('popups').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return { data: { data } };
  }

  async createPopup(popup: any) {
    const { data, error } = await supabase.from('popups').insert(popup).select().single();
    if (error) throw error;
    return { data };
  }

  async updatePopup(id: string, popup: any) {
    const { data, error } = await supabase.from('popups').update(popup).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deletePopup(id: string) {
    const { error } = await supabase.from('popups').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }

  // Store Reviews
  async reviewStore(storeId: string, reviewerId: string, rating: number, comment?: string) {
    const { data, error } = await supabase.from('store_reviews').upsert({ store_id: storeId, reviewer_id: reviewerId, rating, comment }).select().single();
    if (error) throw error;
    const { count } = await supabase.from('store_reviews').select('*', { count: 'exact', head: true }).eq('store_id', storeId);
    const { data: avg } = await supabase.from('store_reviews').select('rating').eq('store_id', storeId);
    const avgRating = avg ? avg.reduce((sum: number, r: any) => sum + r.rating, 0) / avg.length : 0;
    await supabase.from('stores').update({ rating: avgRating, reviews_count: count }).eq('id', storeId);
    return { data };
  }

  async getStoreReviews(storeId: string) {
    const { data, error } = await supabase.from('store_reviews').select('*').eq('store_id', storeId).order('created_at', { ascending: false });
    if (error) throw error;
    return { data: { data } };
  }

  // Gaming Events (separate from entertainment events)
  async getGamingEvents() {
    const { data, error } = await supabase.from('gaming_events').select('*').order('date', { ascending: false });
    if (error) throw error;
    return { data: { data } };
  }

  async createGamingEvent(event: any) {
    const { data, error } = await supabase.from('gaming_events').insert(event).select().single();
    if (error) throw error;
    return { data };
  }

  async updateGamingEvent(id: string, event: any) {
    const { data, error } = await supabase.from('gaming_events').update(event).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  }

  async deleteGamingEvent(id: string) {
    const { error } = await supabase.from('gaming_events').delete().eq('id', id);
    if (error) throw error;
    return { data: null };
  }
}

export default new SupabaseService();
