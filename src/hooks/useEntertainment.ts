import { useState, useEffect } from 'react';
import { Article, Event, News, Comment, PaginatedResponse } from '../types/api';
import apiService from '../services/api';

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      console.log('Fetching articles from API...');
      const response = await apiService.getArticles();
      console.log('Articles API Response:', response.data);
      
      // Ensure we always get an array
      let articlesData = [];
      if (Array.isArray(response.data)) {
        articlesData = response.data;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        articlesData = response.data.results;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        articlesData = response.data.data;
      }
      
      // Map _id to id for compatibility
      articlesData = articlesData.map((article: any) => ({
        ...article,
        id: article.id || article._id
      }));
      
      console.log('Final articles data:', articlesData);
      setArticles(articlesData);
      setError(null);
    } catch (err: any) {
      console.error('Articles fetch error:', err);
      setError('Failed to fetch articles');
      setArticles([]); // Ensure articles is always an array
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (articleId: string) => {
    try {
      await apiService.toggleLike('articles', articleId);
      await fetchArticles(); // Refresh data
    } catch (err) {
      setError('Failed to toggle like');
    }
  };

  const toggleBookmark = async (articleId: string) => {
    try {
      await apiService.toggleBookmark('articles', articleId);
      await fetchArticles(); // Refresh data
    } catch (err) {
      setError('Failed to toggle bookmark');
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    error,
    refetch: fetchArticles,
    toggleLike,
    toggleBookmark
  };
};

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching events from API...');
      const response = await apiService.getEvents();
      console.log('Events API Response:', response.data);
      
      // Ensure we always get an array
      let eventsData = [];
      if (Array.isArray(response.data)) {
        eventsData = response.data;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        eventsData = response.data.results;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        eventsData = response.data.data;
      }
      
      // Map _id to id for compatibility
      eventsData = eventsData.map((event: any) => ({
        ...event,
        id: event.id || event._id
      }));
      
      console.log('Final events data:', eventsData);
      setEvents(eventsData);
      setError(null);
    } catch (err: any) {
      console.error('Events fetch error:', err);
      setError('Failed to fetch events');
      setEvents([]); // Ensure events is always an array
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (eventId: string) => {
    try {
      await apiService.toggleLike('events', eventId);
      await fetchEvents(); // Refresh data
    } catch (err) {
      setError('Failed to toggle like');
    }
  };

  const toggleBookmark = async (eventId: string) => {
    try {
      await apiService.toggleBookmark('events', eventId);
      await fetchEvents(); // Refresh data
    } catch (err) {
      setError('Failed to toggle bookmark');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    toggleLike,
    toggleBookmark
  };
};

export const useNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      console.log('Fetching news from API...');
      const response = await apiService.getNews();
      console.log('News API Response:', response.data);
      
      // Ensure we always get an array
      let newsData = [];
      if (Array.isArray(response.data)) {
        newsData = response.data;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        newsData = response.data.results;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        newsData = response.data.data;
      }
      
      // Map _id to id for compatibility
      newsData = newsData.map((news: any) => ({
        ...news,
        id: news.id || news._id
      }));
      
      console.log('Final news data:', newsData);
      setNews(newsData);
      setError(null);
    } catch (err: any) {
      console.error('News fetch error:', err);
      setError('Failed to fetch news');
      setNews([]); // Ensure news is always an array
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (newsId: string) => {
    try {
      await apiService.toggleLike('news', newsId);
      await fetchNews(); // Refresh data
    } catch (err) {
      setError('Failed to toggle like');
    }
  };

  const toggleBookmark = async (newsId: string) => {
    try {
      await apiService.toggleBookmark('news', newsId);
      await fetchNews(); // Refresh data
    } catch (err) {
      setError('Failed to toggle bookmark');
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    error,
    refetch: fetchNews,
    toggleLike,
    toggleBookmark
  };
};

export const useComments = (modelName: string, objectId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getComments(modelName, objectId);
      setComments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    try {
      await apiService.createComment(modelName, objectId, { content });
      await fetchComments(); // Refresh comments
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  useEffect(() => {
    if (modelName && objectId) {
      fetchComments();
    }
  }, [modelName, objectId]);

  return {
    comments,
    loading,
    error,
    refetch: fetchComments,
    addComment
  };
};

export const useArticle = (id: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await apiService.getArticle(id);
      setArticle(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch article');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  return {
    article,
    loading,
    error,
    refetch: fetchArticle
  };
};

export const useNewsItem = (id: string) => {
  const [newsItem, setNewsItem] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsItem = async () => {
    try {
      setLoading(true);
      const response = await apiService.getNewsItem(id);
      setNewsItem(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch news item');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNewsItem();
    }
  }, [id]);

  return {
    newsItem,
    loading,
    error,
    refetch: fetchNewsItem
  };
};

export const useEventItem = (id: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEvent(id);
      setEvent(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch event');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  return {
    event,
    loading,
    error,
    refetch: fetchEvent
  };
};