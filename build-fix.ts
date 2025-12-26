// Temporary build fixes - remove unused exports and fix type errors

// Fix hooks index export conflict
export * from './src/hooks/useArticles';
export * from './src/hooks/useEvents';
export * from './src/hooks/useNews';
export * from './src/hooks/useStore';
export * from './src/hooks/useGaming';
export * from './src/hooks/useAcademics';
export { useComments } from './src/hooks/useComments';

// Fix admin component method names
export const adminFixes = {
  deleteArticle: 'deleteArticle',
  deleteNews: 'deleteNews', 
  updateArticle: 'updateArticle',
  updateNews: 'updateNews'
};