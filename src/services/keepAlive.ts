// Keep-alive service to prevent backend from sleeping on free tier
const BACKEND_URL = 'https://univyx-backend-1xfv.onrender.com';
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

let pingInterval: NodeJS.Timeout | null = null;

export const startKeepAlive = () => {
  if (pingInterval) return;

  // Ping immediately
  pingBackend();

  // Then ping every 10 minutes
  pingInterval = setInterval(() => {
    pingBackend();
  }, PING_INTERVAL);
};

export const stopKeepAlive = () => {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
};

const pingBackend = async () => {
  try {
    await fetch(`${BACKEND_URL}/ping`, { method: 'GET' });
    console.log('Backend keep-alive ping sent');
  } catch (error) {
    console.error('Keep-alive ping failed:', error);
  }
};
