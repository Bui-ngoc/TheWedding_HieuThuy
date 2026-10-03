import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Gift } from 'lucide-react';
import { BankAccount } from '../../types/wedding';
import './GiftBox.css';

interface GiftBoxProps {
  bankAccounts: BankAccount[];
}

export const GiftBox: React.FC<GiftBoxProps> = ({ bankAccounts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const groomAccount = bankAccounts.find((acc) => acc.side === 'groom') || bankAccounts[0];
  const brideAccount = bankAccounts.find((acc) => acc.side === 'bride') || bankAccounts[1] || bankAccounts[0];

  const handleCopyStk = (accountNumber: string, id: string, name: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedId(id);
    setToastMessage(`Đã sao chép STK ${name}: ${accountNumber}`);

    setTimeout(() => {
      setCopiedId(null);
      setToastMessage(null);
    }, 3000);
  };

  return (
    <section className="giftbox-section" id="gift">
      <div className="giftbox-container">
        <motion.div
          className="giftbox-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Section Title */}
          <h2 className="giftbox-script-title">Hộp quà mừng</h2>

          <p className="giftbox-subtitle">
            Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi!
          </p>

          {/* Watercolor Pink Gift Box Button */}
          <motion.div
            className="giftbox-image-button"
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            title="Click vào đây để gửi quà mừng"
          >
            <div className="giftbox-img-frame">
              <img
                src="/images/giftbox.png"
                alt="Hộp quà mừng cưới"
                className="giftbox-pink-img"
              />
            </div>
            <button className="giftbox-click-btn">
              <Gift size={16} />
              <span>Gửi quà mừng</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal Popup QR Code Window displaying BOTH Groom and Bride QR Codes */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="gift-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="gift-modal-card dual-qr-modal"
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="gift-modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>

              <div className="gift-modal-header">
                <h3 className="gift-modal-script-title">Mừng cưới chú rể & cô dâu</h3>
              </div>

              {/* Grid of Both Groom & Bride QR Cards */}
              <div className="dual-qr-grid">
                {/* Card 1: Groom QR */}
                {groomAccount && (
                  <div className="qr-card-item">
                    <div className="qr-card-title">CHÚ RỂ: TRẦN HIẾU</div>

                    <div className="qr-image-container">
                      <img
                        src="/images/QR_Groom_v2.png"
                        alt="Mã QR Ngân hàng Chú rể Trần Hiếu (Techcombank)"
                        className="qr-code-img"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = groomAccount.qrCodeUrl;
                        }}
                      />
                    </div>

                    <div className="bank-details-box">
                      <div className="bank-detail-row">
                        <span className="bank-detail-label">Ngân hàng:</span>
                        <span className="bank-detail-val">{groomAccount.bankName}</span>
                      </div>
                      <div className="bank-detail-row">
                        <span className="bank-detail-label">Chủ tài khoản:</span>
                        <span className="bank-detail-val">{groomAccount.ownerName}</span>
                      </div>
                      <div className="bank-detail-row">
                        <span className="bank-detail-label">Số tài khoản:</span>
                        <span className="bank-detail-val STK-highlight">
                          {groomAccount.accountNumber}
                        </span>
                      </div>
                    </div>

                    <button
                      className="copy-stk-btn"
                      onClick={() => handleCopyStk(groomAccount.accountNumber, groomAccount.id, 'Chú Rể')}
                    >
                      {copiedId === groomAccount.id ? <Check size={16} /> : <Copy size={16} />}
                      <span>
                        {copiedId === groomAccount.id ? 'ĐÃ SAO CHÉP STK' : 'SAO CHÉP STK CHÚ RỂ'}
                      </span>
                    </button>
                  </div>
                )}

                {/* Card 2: Bride QR */}
                {brideAccount && (
                  <div className="qr-card-item">
                    <div className="qr-card-title">CÔ DÂU: THU THỦY</div>

                    <div className="qr-image-container">
                      <img
                        src="/images/Picture1.png"
                        alt="Mã QR Ngân hàng Cô dâu Thu Thủy"
                        className="qr-code-img"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = brideAccount.qrCodeUrl;
                        }}
                      />
                    </div>

                    <div className="bank-details-box">
                      <div className="bank-detail-row">
                        <span className="bank-detail-label">Ngân hàng:</span>
                        <span className="bank-detail-val">{brideAccount.bankName}</span>
                      </div>
                      <div className="bank-detail-row">
                        <span className="bank-detail-label">Chủ tài khoản:</span>
                        <span className="bank-detail-val">{brideAccount.ownerName}</span>
                      </div>
                      <div className="bank-detail-row">
                        <span className="bank-detail-label">Số tài khoản:</span>
                        <span className="bank-detail-val STK-highlight">
                          {brideAccount.accountNumber}
                        </span>
                      </div>
                    </div>

                    <button
                      className="copy-stk-btn"
                      onClick={() => handleCopyStk(brideAccount.accountNumber, brideAccount.id, 'Cô Dâu')}
                    >
                      {copiedId === brideAccount.id ? <Check size={16} /> : <Copy size={16} />}
                      <span>
                        {copiedId === brideAccount.id ? 'ĐÃ SAO CHÉP STK' : 'SAO CHÉP STK CÔ DÂU'}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <button
                className="gift-modal-dismiss-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ĐÓNG CỬA SỔ
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="toast-notice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
