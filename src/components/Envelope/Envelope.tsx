import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, Sparkles, Eye, ShieldCheck } from 'lucide-react';
import { playEnvelopeOpenChime, bgmManager } from '../../services/audioService';
import {
  parseGuestFromUrl,
  parseGuestFromUrlSynchronous,
  recordVisitorSession,
  getTrackingData,
  generateGuestLinks,
  addInvitedGuest
} from '../../services/trackingService';
import { GuestTrackingTable } from './GuestTrackingTable';
import './Envelope.css';

interface EnvelopeProps {
  onOpen: () => void;
  brideName: string;
  groomName: string;
  weddingDate: string;
  guestName?: string;
}

export const Envelope: React.FC<EnvelopeProps> = ({
  onOpen,
  brideName,
  groomName,
  weddingDate,
  guestName
}) => {
  const [isFlying, setIsFlying] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showPreviewEnvelope, setShowPreviewEnvelope] = useState(false);

  // Synchronous URL parsing on initial render ensures NO FLASH or 2s delay on guest links!
  const [guestState, setGuestState] = useState<{
    displayGuestName: string;
    isPersonalizedLink: boolean;
    matchedGuestId?: string;
  }>(() => {
    const initialSync = parseGuestFromUrlSynchronous(guestName);
    return {
      displayGuestName: initialSync.guestName || guestName || '',
      isPersonalizedLink: initialSync.isPersonalizedLink,
      matchedGuestId: undefined
    };
  });

  useEffect(() => {
    let mounted = true;
    const initTracking = async () => {
      // 1. Get initial merged tracking data
      const currentData = await getTrackingData();

      // 2. Match guest in currentData list for formatted display name
      const parsed = parseGuestFromUrl(currentData.guests);

      const isPersonalized = parsed.isPersonalizedLink || guestState.isPersonalizedLink;
      const displayName = parsed.guestName || guestState.displayGuestName;

      if (mounted) {
        setGuestState({
          displayGuestName: displayName,
          isPersonalizedLink: isPersonalized,
          matchedGuestId: parsed.matchedGuestId
        });
      }

      // 3. Record visitor session (mark guest as opened or increment general view count)
      await recordVisitorSession(
        currentData.guests,
        isPersonalized,
        parsed.matchedGuestId,
        displayName
      );
    };

    initTracking();

    return () => {
      mounted = false;
    };
  }, [guestName]);

  const handleOpenClick = () => {
    if (isFlying) return;

    bgmManager.play();
    playEnvelopeOpenChime();
    setIsFlying(true);

    setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onOpen();
      }, 300);
    }, 700);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // If visitor opened a GUEST invitation link OR toggled preview envelope: render personalized envelope!
  const isViewingEnvelope = guestState.isPersonalizedLink || showPreviewEnvelope;

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          className={`envelope-screen ${!isViewingEnvelope ? 'admin-dashboard-view' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          {/* GENERAL LINK = TRANG QUẢN TRỊ (ADMIN DASHBOARD FOR BRIDE & GROOM) */}
          {!isViewingEnvelope ? (
            <div className="admin-page-wrapper">
              <div className="admin-banner-card">
                <div className="admin-banner-header">
                  <span className="admin-role-badge">
                    <ShieldCheck size={16} /> BẢNG QUẢN TRỊ DÂU &amp; RỂ
                  </span>
                  <h1 className="admin-main-title">Trang Quản Lý Thiệp Cưới &amp; Thống Kê Lượt Xem</h1>
                  <p className="admin-sub-desc">
                    Trang này chỉ hiển thị khi mở bằng <strong>Link Chung</strong>. Tạo link cá nhân hóa cho từng khách mời và theo dõi số lượt xem thiệp thời gian thực tại đây.
                  </p>
                </div>
                
                <button
                  type="button"
                  className="preview-envelope-btn"
                  onClick={() => setShowPreviewEnvelope(true)}
                >
                  <Eye size={18} />
                  <span>Xem thử Giao diện Thiệp Mẫu</span>
                </button>
              </div>

              {/* Main 100% Synced Tracking Table */}
              <GuestTrackingTable onCopySuccess={showToast} />
            </div>
          ) : (
            /* GUEST INVITATION ENVELOPE CARD */
            <>
              {!guestState.isPersonalizedLink && showPreviewEnvelope && (
                <button
                  className="back-to-admin-btn"
                  onClick={() => setShowPreviewEnvelope(false)}
                >
                  ← Quay lại Trang Quản Trị
                </button>
              )}

              <motion.div
                className="invitation-frame-card"
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={
                  isFlying
                    ? {
                        y: -700,
                        scale: 0.85,
                        opacity: 0,
                        transition: { duration: 0.75, ease: [0.45, 0, 0.15, 1] }
                      }
                    : { scale: 1, y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                }
                onClick={handleOpenClick}
              >
                <div style={{ color: 'var(--primary-terracotta)', marginBottom: '6px' }}>
                  <Sparkles size={26} />
                </div>

                <div className="invitation-tag">SAVE THE DATE</div>

                <div className="invite-block-wrapper">
                  <div className="invite-header-text">TRÂN TRỌNG KÍNH MỜI</div>

                  <div className="invite-dotted-name-container">
                    <div className="dotted-underline-full" />
                    {guestState.displayGuestName && (
                      <span className="guest-name-black-script">{guestState.displayGuestName}</span>
                    )}
                  </div>

                  <div className="invite-footer-text">DÀNH THỜI GIAN QUÝ GIÁ THAM DỰ LỄ CƯỚI</div>
                </div>

                <div className="invitation-couple-names">
                  {brideName} &amp; {groomName}
                </div>

                <div className="gold-divider" style={{ margin: '6px 0 14px 0' }}>
                  <Heart size={16} fill="var(--primary-terracotta)" color="var(--primary-terracotta)" />
                </div>

                <div className="invitation-card-date">{weddingDate}</div>

                <button className="btn-primary invitation-card-btn" onClick={handleOpenClick}>
                  <Mail size={18} />
                  <span>MỞ THIỆP CƯỚI</span>
                </button>
              </motion.div>
            </>
          )}

          {/* Toast Notice */}
          {toastMsg && (
            <div className="gen-toast-notice">
              {toastMsg}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
