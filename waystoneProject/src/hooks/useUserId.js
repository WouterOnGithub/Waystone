import { useAuth } from "../context/AuthContext";

/**
 * Custom hook to get the current user ID
 * Consolidates the common pattern of extracting userId from user auth
 * @returns {string|null} The current user's ID or null if not authenticated
 */
export function useUserId() {
  const { user } = useAuth();
  return user?.uid || null;
}
