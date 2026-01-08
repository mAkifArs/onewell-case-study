// ═══════════════════════════════════════════════════════════════════════════════
// NETWORK STATUS
// Displays offline warning modal and persistent indicator
// ═══════════════════════════════════════════════════════════════════════════════

import type { ReactNode } from "react";
import { WifiOff } from "lucide-react";
import { Modal } from "@/components/Modal";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import styles from "./NetworkStatus.module.scss";

export function NetworkStatus(): ReactNode {
  const { isOnline, showModal, dismissModal, openModal } = useOnlineStatus();

  return (
    <>
      {/* Offline Modal */}
      <Modal
        isOpen={showModal}
        onClose={dismissModal}
        title="No Internet Connection"
      >
        <div className={styles.modalContent}>
          <div className={styles.iconWrapper}>
            <WifiOff size={48} strokeWidth={1.5} />
          </div>
          <p className={styles.description}>
            You appear to be offline. We'll show you the last available data
            until your connection is restored.
          </p>
          <button
            type="button"
            onClick={dismissModal}
            className={styles.dismissButton}
          >
            Continue
          </button>
        </div>
      </Modal>

      {/* Persistent Offline Indicator (shown when offline and modal is dismissed) */}
      {!isOnline && !showModal && (
        <button
          type="button"
          className={styles.indicator}
          onClick={openModal}
          aria-label="Show offline status"
          title="You are offline"
        >
          <WifiOff size={18} />
        </button>
      )}
    </>
  );
}

