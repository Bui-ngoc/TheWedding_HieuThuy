import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation } from 'lucide-react';
import { EventInfo } from '../../types/wedding';
import './WeddingInfo.css';

interface WeddingInfoProps {
  events: EventInfo[];
}

export const WeddingInfo: React.FC<WeddingInfoProps> = ({ events }) => {
  return (
    <section className="wedding-info-section" id="ceremony-info">
      <div className="wedding-info-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="wedding-info-subtitle">THÔNG TIN HÔN LỄ</div>
          <h2 className="wedding-info-script-title">Trân Trọng Đón Tiếp</h2>
        </motion.div>

        <div className="events-wide-grid">
          {events.map((event) => (
            <motion.div
              key={event.id}
              className="event-card-wide"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="event-title-wrapper">
                <h3 className="event-card-title">{event.title}</h3>
              </div>

              <div className="event-date-display">
                <div className="solar-date-large">{event.solarDate}</div>
                <div className="event-day-time">
                  <Clock size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                  {event.time}
                </div>
                <div className="event-lunar">{event.lunarDate}</div>
              </div>

              <div className="event-location-box">
                <div className="location-name">{event.locationName}</div>

                {event.parents && (
                  <div className="location-parents">
                    <div className="parent-line">Bố: <strong>{event.parents.fatherName}</strong></div>
                    <div className="parent-line">Mẹ: <strong>{event.parents.motherName}</strong></div>
                  </div>
                )}

                <div className="location-address">
                  <MapPin size={18} color="var(--primary-terracotta)" />
                  <span>{event.address}</span>
                </div>

                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-action-btn"
                >
                  <Navigation size={16} />
                  <span>XEM BẢN ĐỒ CHI TIẾT</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
