// Shared session code management
let sharedSessionCode = null;
let activeMapPages = 0; // Track how many map pages are currently active
let resetTimeout = null; // Timeout for delayed reset
let sessionCleanupCallback = null; // Callback to clean up session in Firestore
let currentCampaignId = null; // Track current campaign for unique codes

// Function to generate unique session code for a specific campaign
export const generateSessionCode = (userId, campaignId) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const timestamp = Date.now().toString(36); // Convert timestamp to base36 for shorter string
  const userHash = userId ? userId.slice(-4) : '0000'; // Use last 4 chars of user ID or fallback
  const campaignHash = campaignId ? campaignId.slice(-4) : '0000'; // Use last 4 chars of campaign ID for uniqueness
  
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  // Combine user hash, campaign hash, timestamp, and random part for guaranteed uniqueness per campaign
  return `${userHash}${campaignHash}-${randomPart}-${timestamp.slice(-4)}`.toUpperCase();
};

// Set callback for session cleanup
export const setSessionCleanupCallback = (callback) => {
  sessionCleanupCallback = callback;
};

// Get or create shared session code (call when map page mounts)
export const getSharedSessionCode = (userId, campaignId, autoGenerate = true) => {
  // Clear any pending reset timeout when a new map page mounts
  if (resetTimeout) {
    clearTimeout(resetTimeout);
    resetTimeout = null;
  }
  
  activeMapPages++; // Increment active map pages
  
  // If campaign changed, reset session code
  if (currentCampaignId !== campaignId) {
    sharedSessionCode = null;
    currentCampaignId = campaignId;
  }
  
  if (!sharedSessionCode && userId && campaignId && autoGenerate) {
    sharedSessionCode = generateSessionCode(userId, campaignId);
  }
  return sharedSessionCode;
};

// Get existing session code without auto-generating (for Map_Main initial state)
export const getExistingSessionCode = (userId, campaignId) => {
  // Clear any pending reset timeout when a new map page mounts
  if (resetTimeout) {
    clearTimeout(resetTimeout);
    resetTimeout = null;
  }
  
  activeMapPages++; // Increment active map pages
  
  // If campaign changed, reset session code
  if (currentCampaignId !== campaignId) {
    sharedSessionCode = null;
    currentCampaignId = campaignId;
  }
  
  // Don't auto-generate, just return existing code (or null)
  return sharedSessionCode;
};

// Start a new session (generates new code)
export const startNewSession = (userId, campaignId) => {
  if (resetTimeout) {
    clearTimeout(resetTimeout);
    resetTimeout = null;
  }
  
  // Clean up existing session if any
  if (sessionCleanupCallback && sharedSessionCode) {
    sessionCleanupCallback(sharedSessionCode);
  }
  
  currentCampaignId = campaignId;
  sharedSessionCode = generateSessionCode(userId, campaignId);
  return sharedSessionCode;
};

// End current session
export const endCurrentSession = () => {
  if (resetTimeout) {
    clearTimeout(resetTimeout);
    resetTimeout = null;
  }
  
  if (sessionCleanupCallback && sharedSessionCode) {
    sessionCleanupCallback(sharedSessionCode);
  }
  
  sharedSessionCode = null;
  currentCampaignId = null;
  activeMapPages = 0;
};

// Check if session is active
export const isSessionActive = () => {
  return sharedSessionCode !== null;
};

// Call when map page unmounts
export const releaseMapPage = () => {
  activeMapPages--; // Decrement active map pages
  
  // Only reset if no map pages are active and there's no pending reset
  if (activeMapPages <= 0 && !resetTimeout) {
    // Set a timeout to reset the session code after a short delay
    // This allows for navigation between map pages without resetting
    resetTimeout = setTimeout(() => {
      if (activeMapPages <= 0) {
        // All map pages have been unmounted for more than 100ms, but don't reset automatically
        // Session will persist until explicitly ended
        console.log("All map pages closed, but session persists until explicitly ended");
      }
      resetTimeout = null;
    }, 100); // 100ms delay
  }
};

// Reset shared session code (for new sessions)
export const resetSharedSessionCode = () => {
  if (resetTimeout) {
    clearTimeout(resetTimeout);
    resetTimeout = null;
  }
  if (sessionCleanupCallback && sharedSessionCode) {
    sessionCleanupCallback(sharedSessionCode);
  }
  sharedSessionCode = null;
  currentCampaignId = null;
  activeMapPages = 0;
};
