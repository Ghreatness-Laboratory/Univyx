import { useState } from 'react';
import apiService from '../services/api';

// Hook to test and consume all API endpoints
export const useAllEndpoints = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const testAllEndpoints = async () => {
    setLoading(true);
    const testResults = [];

    // Test all endpoints systematically
    const endpoints = [
      // Auth endpoints
      { name: 'Login', fn: () => apiService.login({ email: 'test@example.com', password: 'test123' }) },
      { name: 'Register', fn: () => apiService.register({ first_name: 'Test', last_name: 'User', email: 'test@example.com', password: 'test123' }) },
      { name: 'Google Auth', fn: () => apiService.googleAuth({ token: 'dummy_token' }) },
      { name: 'Get Profile', fn: () => apiService.getProfile() },
      { name: 'Update Profile', fn: () => apiService.updateProfile({ full_name: 'Updated Name' }) },
      { name: 'Refresh Token', fn: () => apiService.refreshToken({ refresh: 'dummy_refresh' }) },
      { name: 'Logout', fn: () => apiService.logout() },
      { name: 'Resend Verification', fn: () => apiService.resendVerification({ email: 'test@example.com' }) },
      { name: 'Change Password', fn: () => apiService.changePassword({ current_password: 'old', new_password: 'new', confirm_password: 'new' }) },

      // Entertainment endpoints
      { name: 'Get Articles', fn: () => apiService.getArticles() },
      { name: 'Create Article', fn: () => apiService.createArticle({ title: 'Test Article', content: 'Test content' }) },
      { name: 'Get Article', fn: () => apiService.getArticle('1') },
      { name: 'Update Article', fn: () => apiService.updateArticleById('1', { title: 'Updated Article' }) },
      { name: 'Delete Article', fn: () => apiService.deleteArticleById('1') },
      
      { name: 'Get Events', fn: () => apiService.getEvents() },
      { name: 'Create Event', fn: () => apiService.createEvent({ title: 'Test Event', description: 'Test description' }) },
      { name: 'Get Event', fn: () => apiService.getEvent('1') },
      { name: 'Update Event', fn: () => apiService.updateEventById('1', { title: 'Updated Event' }) },
      { name: 'Delete Event', fn: () => apiService.deleteEventById('1') },
      
      { name: 'Get News', fn: () => apiService.getNews() },
      { name: 'Create News', fn: () => apiService.createNews({ title: 'Test News', content: 'Test content' }) },
      { name: 'Get News Item', fn: () => apiService.getNewsItem('1') },
      { name: 'Update News', fn: () => apiService.updateNewsById('1', { title: 'Updated News' }) },
      { name: 'Delete News', fn: () => apiService.deleteNewsById('1') },

      // Interaction endpoints
      { name: 'Toggle Like', fn: () => apiService.toggleLike('articles', '1') },
      { name: 'Toggle Bookmark', fn: () => apiService.toggleBookmark('articles', '1') },
      { name: 'Get Comments', fn: () => apiService.getComments('articles', '1') },
      { name: 'Create Comment', fn: () => apiService.createComment('articles', '1', { content: 'Test comment' }) },
      { name: 'Get Comment', fn: () => apiService.getComment('1') },
      { name: 'Update Comment', fn: () => apiService.updateComment('1', { content: 'Updated comment' }) },
      { name: 'Delete Comment', fn: () => apiService.deleteComment('1') },

      // Store endpoints
      { name: 'Get Store Items', fn: () => apiService.getStoreItems() },
      { name: 'Create Store Item', fn: () => apiService.createStoreItem({ name: 'Test Product', description: 'Test description', price: '99.99' }) },
      { name: 'Get Store Item', fn: () => apiService.getStoreItem('1') },
      { name: 'Update Store Item', fn: () => apiService.updateStoreItem('1', { name: 'Updated Product' }) },
      { name: 'Delete Store Item', fn: () => apiService.deleteStoreItem('1') },
      { name: 'Get Store Categories', fn: () => apiService.getStoreCategories() },

      // Academics endpoints
      { name: 'Get Universities', fn: () => apiService.getUniversities() },
      { name: 'Create University', fn: () => apiService.createUniversity({ name: 'Test University', location: 'Test City' }) },
      { name: 'Get University', fn: () => apiService.getUniversity(1) },
      { name: 'Get University Resources', fn: () => apiService.getUniversityResources(1) },
      
      { name: 'Get Courses', fn: () => apiService.getCourses() },
      { name: 'Create Course', fn: () => apiService.createCourse({ name: 'Test Course', code: 'CS101' }) },
      { name: 'Get Course', fn: () => apiService.getCourse('1') },
      { name: 'Update Course', fn: () => apiService.updateCourse('1', { name: 'Updated Course' }) },
      { name: 'Delete Course', fn: () => apiService.deleteCourse('1') },
      
      { name: 'Get Resources', fn: () => apiService.getResources() },
      { name: 'Create Resource', fn: () => apiService.createResource({ title: 'Test Resource', description: 'Test description' }) },
      { name: 'Get Resource', fn: () => apiService.getResource('1') },
      { name: 'Update Resource', fn: () => apiService.updateResource('1', { title: 'Updated Resource' }) },
      { name: 'Delete Resource', fn: () => apiService.deleteResource('1') },

      // Gaming endpoints
      { name: 'Get Tournaments', fn: () => apiService.getTournaments() },
      { name: 'Create Tournament', fn: () => apiService.createTournament({ name: 'Test Tournament', game: 'Test Game' }) },
      { name: 'Get Tournament', fn: () => apiService.getTournament('1') },
      { name: 'Update Tournament', fn: () => apiService.updateTournament('1', { name: 'Updated Tournament' }) },
      { name: 'Delete Tournament', fn: () => apiService.deleteTournament('1') },
      { name: 'Join Tournament', fn: () => apiService.joinTournament('1') },
      { name: 'Leave Tournament', fn: () => apiService.leaveTournament('1') },
      { name: 'Get Leaderboard', fn: () => apiService.getLeaderboard() },
      { name: 'Get Leaderboard By ID', fn: () => apiService.getLeaderboardById('1') },
    ];

    for (const endpoint of endpoints) {
      try {
        const result = await endpoint.fn();
        testResults.push({
          name: endpoint.name,
          status: 'success',
          data: result.data
        });
      } catch (error: any) {
        testResults.push({
          name: endpoint.name,
          status: 'error',
          error: error.response?.status || error.message
        });
      }
    }

    setResults(testResults);
    setLoading(false);
    return testResults;
  };

  return {
    loading,
    results,
    testAllEndpoints
  };
};