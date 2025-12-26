# Univyx Frontend - All Endpoints Consumed

## ✅ Authentication Endpoints (Fully Consumed)
- `POST /auth/register/` - User registration
- `POST /auth/login/` - User login  
- `POST /auth/google/` - Google OAuth
- `GET /auth/profile/` - Get user profile
- `PUT /auth/profile/` - Update user profile
- `POST /auth/token/refresh/` - Refresh JWT token
- `POST /auth/logout/` - User logout

## ✅ Entertainment Endpoints (Fully Consumed)

### Articles
- `GET /entertainment/articles/` - List articles (useArticles)
- `POST /entertainment/articles/` - Create article (apiService.createArticle)
- `GET /entertainment/articles/{id}/` - Get article (useArticle)
- `PUT /entertainment/articles/{id}/` - Update article (apiService.updateArticleById)
- `DELETE /entertainment/articles/{id}/` - Delete article (apiService.deleteArticleById)

### Events  
- `GET /entertainment/events/` - List events (useEvents)
- `POST /entertainment/events/` - Create event (apiService.createEvent)
- `GET /entertainment/events/{id}/` - Get event (useEventItem)
- `PUT /entertainment/events/{id}/` - Update event (apiService.updateEventById)
- `DELETE /entertainment/events/{id}/` - Delete event (apiService.deleteEventById)

### News
- `GET /entertainment/news/` - List news (useNews)
- `POST /entertainment/news/` - Create news (apiService.createNews)
- `GET /entertainment/news/{id}/` - Get news item (useNewsItem)
- `PUT /entertainment/news/{id}/` - Update news (apiService.updateNewsById)
- `DELETE /entertainment/news/{id}/` - Delete news (apiService.deleteNewsById)

### Interactions
- `GET /entertainment/{model}/{id}/like/` - Get likes (apiService.getLikes)
- `POST /entertainment/{model}/{id}/like/` - Toggle like (useArticles.toggleLike, useEvents.toggleLike, useNews.toggleLike)
- `GET /entertainment/{model}/{id}/bookmark/` - Get bookmarks (apiService.getBookmarks)
- `POST /entertainment/{model}/{id}/bookmark/` - Toggle bookmark (useArticles.toggleBookmark, useEvents.toggleBookmark, useNews.toggleBookmark)
- `GET /entertainment/{model}/{id}/comments/` - Get comments (useComments)
- `POST /entertainment/{model}/{id}/comments/` - Create comment (useComments.addComment)

## ✅ Store Endpoints (Fully Consumed)
- `GET /store/` - List store items with pagination/search/category (useStore)
- `POST /store/` - Create store item (useStore.createItem)
- `GET /store/{id}/` - Get store item (useStoreItem)
- `PUT /store/{id}/` - Update store item (useStore.updateItem)
- `DELETE /store/{id}/` - Delete store item (useStore.deleteItem)
- `GET /store/categories/` - Get store categories (useStoreCategories)

## ✅ Academic Endpoints (Fully Consumed)

### Universities
- `GET /academics/universities/` - List universities (useUniversities)
- `POST /academics/universities/` - Create university (apiService.createUniversity)
- `GET /academics/universities/{id}/` - Get university (useUniversity)
- `PUT /academics/universities/{id}/` - Update university (apiService.updateUniversity)
- `DELETE /academics/universities/{id}/` - Delete university (apiService.deleteUniversity)

### Courses
- `GET /academics/courses/` - List courses (apiService.getCourses)
- `POST /academics/courses/` - Create course (apiService.createCourse)
- `GET /academics/courses/{id}/` - Get course (apiService.getCourse)
- `PUT /academics/courses/{id}/` - Update course (apiService.updateCourse)
- `DELETE /academics/courses/{id}/` - Delete course (apiService.deleteCourse)

### Resources
- `GET /academics/resources/` - List resources (apiService.getResources)
- `POST /academics/resources/` - Create resource (apiService.createResource)
- `GET /academics/resources/{id}/` - Get resource (apiService.getResource)
- `PUT /academics/resources/{id}/` - Update resource (apiService.updateResource)
- `DELETE /academics/resources/{id}/` - Delete resource (apiService.deleteResource)
- `GET /academics/universities/{id}/resources/` - Get university resources (useUniversityResources)

## ✅ Gaming Endpoints (Fully Consumed)

### Tournaments
- `GET /gaming/tournaments/` - List tournaments (useTournaments)
- `POST /gaming/tournaments/` - Create tournament (apiService.createTournament)
- `GET /gaming/tournaments/{id}/` - Get tournament (apiService.getTournament)
- `PUT /gaming/tournaments/{id}/` - Update tournament (apiService.updateTournament)
- `DELETE /gaming/tournaments/{id}/` - Delete tournament (apiService.deleteTournament)
- `POST /gaming/tournaments/{id}/join/` - Join tournament (apiService.joinTournament)
- `POST /gaming/tournaments/{id}/leave/` - Leave tournament (apiService.leaveTournament)

### Leaderboards
- `GET /gaming/leaderboards/` - Get leaderboards (useLeaderboard)
- `GET /gaming/leaderboards/{id}/` - Get specific leaderboard (apiService.getLeaderboard)

## ✅ Comment Management (Fully Consumed)
- `GET /comments/{id}/` - Get comment (apiService.getComment)
- `PUT /comments/{id}/` - Update comment (apiService.updateComment)
- `DELETE /comments/{id}/` - Delete comment (apiService.deleteComment)

## 📁 Files Updated/Created

### New Hooks Created:
- `src/hooks/useAcademics.ts` - useUniversities, useUniversity, useUniversityResources
- `src/hooks/useGaming.ts` - useTournaments, useLeaderboard

### Updated Hooks:
- `src/hooks/useEntertainment.ts` - Added useArticle, useNewsItem, useEventItem
- `src/hooks/useStore.ts` - Added CRUD operations, useStoreItem, useStoreCategories

### Updated Pages:
- `src/pages/Academics.tsx` - Now consumes universities API
- `src/pages/Gaming.tsx` - Now consumes tournaments and leaderboard APIs

### Updated Services:
- `src/services/api.ts` - Added all missing API methods for complete endpoint coverage

## 🎯 Result
**ALL AVAILABLE ENDPOINTS ARE NOW CONSUMED** by the frontend application. The frontend can now:
- Perform full CRUD operations on all content types
- Use real API data instead of static data
- Leverage all interactive features (likes, bookmarks, comments)
- Manage tournaments, universities, courses, and resources
- Handle pagination, search, and filtering across all sections