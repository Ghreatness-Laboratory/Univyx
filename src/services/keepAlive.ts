// Keep-alive service to prevent backend from sleeping on free tier
const BACKEND_URL = 'https://univyx-backend-1xfv.onrender.com';
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes
const HEALTH_CHECK_INTERVAL = 2 * 60 * 1000; // 2 minutes
const RETRY_DELAY = 30 * 1000; // 30 seconds

let pingInterval: NodeJS.Timeout | null = null;
let healthInterval: NodeJS.Timeout | null = null;
let isBackendAwake = false;

export const startKeepAlive = () => {
  if (pingInterval) return;

  // Initial wake-up sequence
  wakeUpBackend();

  // Ping every 5 minutes
  pingInterval = setInterval(() => {
    pingBackend();
  }, PING_INTERVAL);

  // Health check every 2 minutes
  healthInterval = setInterval(() => {
    checkHealth();
  }, HEALTH_CHECK_INTERVAL);
};

export const stopKeepAlive = () => {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
  if (healthInterval) {
    clearInterval(healthInterval);
    healthInterval = null;
  }
};

const wakeUpBackend = async () => {
  console.log('🚀 Waking up backend...');
  
  // Try multiple endpoints to ensure wake-up
  const endpoints = ['/ping', '/health', '/univyxApi/v1/auth/profile'];
  
  for (const endpoint of endpoints) {
    try {
      await fetch(`${BACKEND_URL}${endpoint}`, { 
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' }
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      // Ignore errors during wake-up
    }
  }
  
  // Verify backend is awake
  setTimeout(() => checkHealth(), 3000);
};

const pingBackend = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/ping`, { 
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (response.ok) {
      isBackendAwake = true;
      console.log('✅ Backend ping successful');
    } else {
      console.warn('⚠️ Backend ping returned non-OK status');
      setTimeout(() => wakeUpBackend(), RETRY_DELAY);
    }
  } catch (error) {
    console.error('❌ Backend ping failed:', error);
    isBackendAwake = false;
    setTimeout(() => wakeUpBackend(), RETRY_DELAY);
  }
};

const checkHealth = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, { 
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (response.ok) {
      isBackendAwake = true;
      console.log('✅ Backend health check passed');
    } else {
      console.warn('⚠️ Backend health check failed');
      isBackendAwake = false;
      wakeUpBackend();
    }
  } catch (error) {
    console.error('❌ Backend health check error:', error);
    isBackendAwake = false;
    wakeUpBackend();
  }
};

export const getBackendStatus = () => isBackendAwake;
