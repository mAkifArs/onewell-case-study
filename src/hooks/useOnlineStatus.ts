// ═══════════════════════════════════════════════════════════════════════════════
// USE ONLINE STATUS HOOK
// Detects and tracks internet connection status
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";

interface OnlineStatusState {
  /** Whether the browser is currently online */
  isOnline: boolean;
  /** Whether the user was previously online and just went offline */
  wasOnline: boolean;
  /** Whether to show the offline modal */
  showModal: boolean;
  /** Dismiss the offline modal */
  dismissModal: () => void;
  /** Reopen the offline modal */
  openModal: () => void;
}

/**
 * Hook to detect and track online/offline status.
 * Automatically shows modal when going offline and handles recovery.
 */
export function useOnlineStatus(): OnlineStatusState {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOnline, setWasOnline] = useState(navigator.onLine);
  const [showModal, setShowModal] = useState(false);

  const dismissModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowModal(false);
      // Auto-refresh when connection is restored
      window.location.reload();
    };

    const handleOffline = () => {
      setWasOnline(isOnline);
      setIsOnline(false);
      setShowModal(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  return {
    isOnline,
    wasOnline,
    showModal,
    dismissModal,
    openModal,
  };
}

