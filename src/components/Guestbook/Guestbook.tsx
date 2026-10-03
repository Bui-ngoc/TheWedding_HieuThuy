import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';
import { GuestMessage } from '../../types/wedding';
import { getGuestbookMessages, postGuestbookMessage } from '../../services/api';
import './Guestbook.css';

export const Guestbook: React.FC = () => {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [name, setName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  useEffect(() => {
    getGuestbookMessages().then(setMessages);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !messageText.trim()) return;

    setIsSubmitting(true);
    try {
      const newMsg = await postGuestbookMessage(name, 'Khách quý', messageText);
      setMessages((prev) => [newMsg, ...prev]);
      setName('');
      setMessageText('');
      setSuccessNotice(true);

      setTimeout(() => {
        setSuccessNotice(false);
      }, 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="guestbook-section" id="guestbook">
      <div className="guestbook-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="guestbook-script-title">Gửi lời chúc mừng</h2>
        </motion.div>

        {/* Form Send Wish */}
        <motion.div
          className="guestbook-form-box"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Tên của bạn *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nhập tên của bạn..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lời chúc gửi tới Thu Thủy &amp; Trần Hiếu *</label>
              <textarea
                className="form-textarea"
                placeholder="Chúc hai bạn trăm năm hạnh phúc, mãi mãi yêu thương nhau..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="guestbook-submit-btn"
              disabled={isSubmitting}
            >
              <Send size={18} />
              <span>{isSubmitting ? 'ĐANG GỬI...' : 'GỬI LỜI CHÚC'}</span>
            </button>

            {successNotice && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="guestbook-success-notice"
              >
                🎉 Lời chúc của bạn đã được gửi thành công! Cảm ơn bạn rất nhiều! ❤️
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Wishes List Feed */}
        <div className="guestbook-messages-list">
          {messages.length === 0 ? (
            <div className="guestbook-empty-notice">
              Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc tới đôi bạn trẻ! ❤️
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className="message-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <div className="message-header">
                    <span className="message-author">{msg.name}</span>
                    <span className="message-time">{msg.createdAt}</span>
                  </div>
                  <p className="message-body">"{msg.message}"</p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
};
