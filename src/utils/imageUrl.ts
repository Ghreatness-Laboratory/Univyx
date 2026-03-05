const BACKEND_BASE_URL = 'https://univyx-backend-1xfv.onrender.com';

export const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return '';
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend URL
  if (imagePath.startsWith('/')) {
    return `${BACKEND_BASE_URL}${imagePath}`;
  }
  
  // If it doesn't start with /, add it
  return `${BACKEND_BASE_URL}/${imagePath}`;
};
