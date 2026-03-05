// Keep-alive service to prevent backend from sleeping on free tier
const BACKEND_URL = 'https://univyx-backend-1xfv.onrender.com';
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes

let pingInterval: NodeJS.Timeout | null = null;

export const startKeepAlive = () => {
  if (pingInterval) return;

  console.log('🔄 Keep-alive started');
  pingBackend();

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
    await fetch(`${BACKEND_URL}/ping`);
    console.log('✅ Backend ping');
  } catch (error) {
    console.error('❌ Ping failed');
  }
};

export const getBackendStatus = () => true;
