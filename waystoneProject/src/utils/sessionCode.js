// Shared session code management
let sharedSessionCode = null;
let activeMapPages = 0; // Track how many map pages are currently active
let resetTimeout = null; // Timeout for delayed reset

// Function to generate unique session code for a specific user
export const generateSessionCode = (userId) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const timestamp = Date.now().toString(36); // Convert timestamp to base36 for shorter string
  const userHash = userId ? userId.slice(-4) : '0000'; // Use last 4 chars of user ID or fallback
  
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  // Combine user hash, timestamp, and random part for guaranteed uniqueness
  return `${userHash}-${randomPart}-${timestamp.slice(-4)}`.toUpperCase();
};

// Get or create shared session code (call when map page mounts)
export const getSharedSessionCode = (userId) => {
  // Clear any pending reset timeout when a new map page mounts
  if (resetTimeout) {
    clearTimeout(resetTimeout);
    resetTimeout = null;
  }
  
  activeMapPages++; // Increment active map pages
  if (!sharedSessionCode && userId) {
    sharedSessionCode = generateSessionCode(userId);
  }
  return sharedSessionCode;
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
        // All map pages have been unmounted for more than 100ms, reset the session code
        sharedSessionCode = null;
        activeMapPages = 0; // Reset to 0
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
  sharedSessionCode = null;
  activeMapPages = 0;
};
