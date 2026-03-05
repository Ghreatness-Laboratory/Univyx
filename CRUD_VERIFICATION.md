# CRUD Operations Verification Checklist

## ✅ Fixed Issues

### 1. Image URL Handling
- **Problem**: Inconsistent image URL construction across components
- **Solution**: Centralized `getImageUrl()` utility function used everywhere
- **Files Updated**:
  - `StoreManager.tsx` - Store logos now use getImageUrl
  - `EventCard.tsx` - Event images use getImageUrl
  - `NewsCard.tsx` - News images use getImageUrl
  - `ArticleDetail.tsx` - Article images use getImageUrl
  - `useEntertainment.ts` - All data fetching applies getImageUrl

### 2. ID Mapping (MongoDB _id to id)
- **Problem**: Backend returns `_id`, frontend expects `id`
- **Solution**: All fetch operations map `_id` to `id`
- **Files Updated**:
  - `ArticleManager.tsx` ✅
  - `EventManager.tsx` ✅
  - `NewsManager.tsx` ✅
  - `StoreManager.tsx` ✅
  - `useEntertainment.ts` ✅
  - `useStore.ts` ✅

### 3. API Service Methods
- **Added Missing Methods**:
  - `updateComment(commentId, data)` - Update existing comment
  - `deleteComment(commentId)` - Delete comment
  - `getComment(commentId)` - Get single comment

## 📋 CRUD Operations by Module

### ARTICLES (Entertainment)
| Operation | Endpoint | Manager | Hook | Display | Status |
|-----------|----------|---------|------|---------|--------|
| CREATE | POST /entertainment/articles | ✅ | ✅ | N/A | ✅ |
| READ (List) | GET /entertainment/articles | ✅ | ✅ | ArticlesCard | ✅ |
| READ (Single) | GET /entertainment/articles/:id | N/A | ✅ | ArticleDetail | ✅ |
| UPDATE | PUT /entertainment/articles/:id | ✅ | ✅ | N/A | ✅ |
| DELETE | DELETE /entertainment/articles/:id | ✅ | ✅ | N/A | ✅ |
| Like | POST /entertainment/articles/:id/like | N/A | ✅ | ✅ | ✅ |
| Bookmark | POST /entertainment/articles/:id/bookmark | N/A | ✅ | ✅ | ✅ |
| Comments | GET/POST /entertainment/articles/:id/comments | N/A | ✅ | ✅ | ✅ |

### EVENTS (Entertainment)
| Operation | Endpoint | Manager | Hook | Display | Status |
|-----------|----------|---------|------|---------|--------|
| CREATE | POST /entertainment/events | ✅ | ✅ | N/A | ✅ |
| READ (List) | GET /entertainment/events | ✅ | ✅ | EventCard | ✅ |
| READ (Single) | GET /entertainment/events/:id | N/A | ✅ | EventCard | ✅ |
| UPDATE | PUT /entertainment/events/:id | ✅ | ✅ | N/A | ✅ |
| DELETE | DELETE /entertainment/events/:id | ✅ | ✅ | N/A | ✅ |
| Like | POST /entertainment/events/:id/like | N/A | ✅ | N/A | ✅ |
| Bookmark | POST /entertainment/events/:id/bookmark | N/A | ✅ | N/A | ✅ |

**Event Fields**: title, description, date, time, location, image, category

### NEWS (Entertainment)
| Operation | Endpoint | Manager | Hook | Display | Status |
|-----------|----------|---------|------|---------|--------|
| CREATE | POST /entertainment/news | ✅ | ✅ | N/A | ✅ |
| READ (List) | GET /entertainment/news | ✅ | ✅ | NewsCard | ✅ |
| READ (Single) | GET /entertainment/news/:id | N/A | ✅ | NewsCard | ✅ |
| UPDATE | PUT /entertainment/news/:id | ✅ | ✅ | N/A | ✅ |
| DELETE | DELETE /entertainment/news/:id | ✅ | ✅ | N/A | ✅ |
| Like | POST /entertainment/news/:id/like | N/A | ✅ | ✅ | ✅ |
| Bookmark | POST /entertainment/news/:id/bookmark | N/A | ✅ | N/A | ✅ |

**News Categories**: Campus, Academic, Sports, Technology, Career, International, Research, Other

### STORES
| Operation | Endpoint | Manager | Hook | Display | Status |
|-----------|----------|---------|------|---------|--------|
| CREATE | POST /store/stores | ✅ | ✅ | N/A | ✅ |
| READ (List) | GET /store/stores | ✅ | ✅ | StoreCard | ✅ |
| UPDATE | PUT /store/stores/:id | ✅ | ✅ | N/A | ✅ |
| DELETE | DELETE /store/stores/:id | ✅ | ✅ | N/A | ✅ |

**Store Fields**: name, description, logo, whatsapp, instagram, twitter, facebook

### STORE ITEMS
| Operation | Endpoint | Manager | Hook | Display | Status |
|-----------|----------|---------|------|---------|--------|
| CREATE | POST /store | ✅ | ✅ | N/A | ✅ |
| READ (List) | GET /store | ✅ | ✅ | StoreManager | ✅ |
| UPDATE | PUT /store/:id | ✅ | ✅ | N/A | ✅ |
| DELETE | DELETE /store/:id | ✅ | ✅ | N/A | ✅ |

**Item Categories**: Electronics, Books, Clothing, Food, Stationery, Sports, Furniture, Other
**Item Fields**: name, description, price (₦), category, store (ID), in_stock, image

### COMMENTS
| Operation | Endpoint | Hook | Display | Status |
|-----------|----------|------|---------|--------|
| CREATE | POST /entertainment/:model/:id/comments | ✅ | ✅ | ✅ |
| READ | GET /entertainment/:model/:id/comments | ✅ | ✅ | ✅ |
| UPDATE | PUT /entertainment/comments/:id | ✅ | N/A | ⚠️ |
| DELETE | DELETE /entertainment/comments/:id | ✅ | N/A | ⚠️ |

**Note**: Update/Delete UI not implemented in CommentSection component

## 🔧 Technical Implementation Details

### Image URL Construction
```typescript
// utils/imageUrl.ts
const BACKEND_BASE_URL = 'https://univyx-backend-1xfv.onrender.com';

export const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (imagePath.startsWith('/')) {
    return `${BACKEND_BASE_URL}${imagePath}`;
  }
  return `${BACKEND_BASE_URL}/${imagePath}`;
};
```

### ID Mapping Pattern
```typescript
// Applied in all fetch operations
data = data.map((item: any) => ({
  ...item,
  id: item.id || item._id,
  image: getImageUrl(item.image)
}));
```

### API Response Structure
Most endpoints return:
```json
{
  "success": true,
  "message": "...",
  "data": [...] or {...}
}
```

Extraction pattern:
```typescript
let data = response.data.data || response.data || [];
```

## 🧪 Testing Checklist

### Articles
- [ ] Create new article with image
- [ ] Edit existing article
- [ ] Delete article
- [ ] View article list (images display correctly)
- [ ] View article detail page
- [ ] Like/unlike article
- [ ] Bookmark/unbookmark article
- [ ] Add comment to article
- [ ] View comments on article

### Events
- [ ] Create new event with date, time, location, image
- [ ] Edit existing event
- [ ] Delete event
- [ ] View event list (images display correctly)
- [ ] Time field displays when present

### News
- [ ] Create news with category dropdown
- [ ] Edit existing news
- [ ] Delete news
- [ ] View news list (images display correctly)
- [ ] Filter by category
- [ ] Category badge displays correctly

### Stores
- [ ] Create new store with logo and social media links
- [ ] Edit existing store
- [ ] Delete store
- [ ] View store list (logos display correctly)
- [ ] Social media badges display

### Store Items
- [ ] Create item with category dropdown
- [ ] Select store from dropdown
- [ ] Edit existing item
- [ ] Delete item
- [ ] View item list (images display correctly)
- [ ] Price displays in Naira (₦) with formatting
- [ ] In stock/Out of stock badge displays

## ⚠️ Known Limitations

1. **Comment Update/Delete**: API methods exist but UI not implemented
2. **Pagination**: Store items pagination not fully implemented
3. **Search/Filter**: Store items search not implemented
4. **Image Validation**: No client-side image size/type validation
5. **Error Messages**: Generic error handling, could be more specific

## 🔐 Authentication Requirements

All CREATE, UPDATE, DELETE operations require:
- Valid JWT token in localStorage (`access_token`)
- Token automatically added via axios interceptor
- Token refresh on 401 errors

## 💾 Backend Compatibility

**Backend URL**: `https://univyx-backend-1xfv.onrender.com/univyxApi/v1`
**Development Proxy**: `/api` → backend URL (via Vite config)

### Rate Limiting
- 500 requests per 15 minutes
- Applies to all endpoints

### CORS
- Development origin allowed: `http://localhost:5173`
- Production origin: `https://univyx-main.vercel.app`

## 📝 Data Validation

### Backend Enum Validation
- **News Categories**: Must match exact enum values
- **Store Item Categories**: Must match exact enum values
- **Event Time**: Optional string field
- **Prices**: Stored as numbers, displayed with Naira symbol

### Required Fields
- **Articles**: title, content, image (optional)
- **Events**: title, description, date, time, location, image (optional)
- **News**: title, content, category, image (optional)
- **Stores**: name, description (optional), logo (optional)
- **Items**: name, description, price, category, store, in_stock

## ✨ Recent Fixes Summary

1. ✅ Centralized image URL handling with `getImageUrl()` utility
2. ✅ Consistent ID mapping across all managers and hooks
3. ✅ Added missing comment CRUD API methods
4. ✅ Fixed store logo display in StoreManager
5. ✅ Fixed event image display in EventCard
6. ✅ Fixed news image display in NewsCard
7. ✅ Fixed article image display in ArticleDetail
8. ✅ All data fetching hooks apply image URL transformation
9. ✅ All data fetching hooks map _id to id
10. ✅ Store items properly map IDs in useStore hook

## 🎯 Next Steps for Eve

1. Test all CREATE operations with image uploads
2. Test all UPDATE operations (with and without new images)
3. Test all DELETE operations
4. Verify all images display correctly across the app
5. Test like/bookmark functionality on articles
6. Test comment system on articles
7. Verify category dropdowns work correctly
8. Check Naira currency display on store items
9. Verify social media links display on stores
10. Test event time field display
