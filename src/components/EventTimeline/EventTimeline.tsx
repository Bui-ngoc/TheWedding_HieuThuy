import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, Calendar } from 'lucide-react';
import './EventTimeline.css';

export const EventTimeline: React.FC = () => {
  const handleAddToCalendar = (eventTitle: string, dateStr: string) => {
    alert(`Đã thêm sự kiện "${eventTitle}" (${dateStr}) vào lịch của bạn!`);
  };

  return (
    <section className="event-timeline-section" id="timeline">
      {/* Floral Background Accents */}
      <img
        src="images/floral_top_left.png"
        alt="Hoa trang trí"
        className="timeline-floral timeline-floral-top-left"
      />
      <img
        src="images/floral_bottom_right.png"
        alt="Hoa trang trí"
        className="timeline-floral timeline-floral-bottom-right"
      />

      <div className="timeline-container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="timeline-script-title">Sự kiện</h2>
        </motion.div>

        {/* Horizontal Connecting Timeline Grid */}
        <div className="timeline-grid-wrapper">
          <div className="timeline-connecting-line" />

          {/* Event 1: ĂN HỎI / LỄ VU QUY (Nhà Gái) */}
          <motion.div
            className="timeline-item-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="timeline-icon-wrapper">
              <img
                src="images/chibi_an_hoi.jpg"
                alt="Lễ Ăn Hỏi Illustration"
                className="timeline-illustration-img"
              />
            </div>

            <div className="timeline-pill-badge">ĂN HỎI</div>

            <div className="timeline-date-row">
              <span className="timeline-time-val">13:00</span>
              <span className="timeline-dash">—</span>
              <span className="date-digit">17</span>
              <span className="date-pipe">|</span>
              <span className="date-digit">10</span>
              <span className="date-pipe">|</span>
              <span className="date-digit">2026</span>
            </div>

            <div className="timeline-address-text">
              Thôn Chí Cường, Nam Cường, Hưng Yên
            </div>

            <div className="timeline-actions-row">
              <a
                href="https://maps.google.com/?q=Nam+Cường+Hưng+Yên"
                target="_blank"
                rel="noopener noreferrer"
                className="timeline-btn btn-map"
              >
                CHỈ ĐƯỜNG
              </a>
              <button
                className="timeline-btn btn-calendar"
                onClick={() => handleAddToCalendar('Lễ Ăn Hỏi / Vu Quy', '17.10.2026')}
              >
                THÊM VÀO LỊCH
              </button>
            </div>
          </motion.div>

          {/* Event 2: ĐÓN DÂU / LỄ THÀNH HÔN (Nhà Trai) */}
          <motion.div
            className="timeline-item-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="timeline-icon-wrapper">
              <img
                src="images/chibi_don_dau.png"
                alt="Lễ Đón Dâu Illustration"
                className="timeline-illustration-img"
              />
            </div>

            <div className="timeline-pill-badge">ĐÓN DÂU</div>

            <div className="timeline-date-row">
              <span className="timeline-time-val">12:30</span>
              <span className="timeline-dash">—</span>
              <span className="date-digit">18</span>
              <span className="date-pipe">|</span>
              <span className="date-digit">10</span>
              <span className="date-pipe">|</span>
              <span className="date-digit">2026</span>
            </div>

            <div className="timeline-address-text">
              Thôn Lập Ấp, Bình Thanh, Hưng Yên
            </div>

            <div className="timeline-actions-row">
              <a
                href="https://maps.app.goo.gl/z1rQh3Sm76iHjMsF9"
                target="_blank"
                rel="noopener noreferrer"
                className="timeline-btn btn-map"
              >
                CHỈ ĐƯỜNG
              </a>
              <button
                className="timeline-btn btn-calendar"
                onClick={() => handleAddToCalendar('Lễ Đón Dâu / Thành Hôn', '18.10.2026')}
              >
                THÊM VÀO LỊCH
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
