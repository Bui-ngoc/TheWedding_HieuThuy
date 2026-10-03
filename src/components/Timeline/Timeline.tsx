import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Sparkles, HeartHandshake, Users, Wine, Camera } from 'lucide-react';
import { TimelineItem } from '../../types/wedding';
import './Timeline.css';

interface TimelineProps {
  timeline: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ timeline }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles size={20} />;
      case 'HeartHandshake':
        return <HeartHandshake size={20} />;
      case 'Users':
        return <Users size={20} />;
      case 'Wine':
        return <Wine size={20} />;
      case 'Camera':
        return <Camera size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  return (
    <section className="timeline-section" id="timeline">
      <div className="timeline-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-subtitle">LỊCH TRÌNH NGÀY CƯỚI</div>
          <h2 className="section-title">Chương Trình Hôn Lễ</h2>
          <div className="gold-divider">
            <Clock size={16} color="var(--primary-gold)" />
          </div>
        </motion.div>

        <div className="timeline-list">
          {timeline.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={item.id}
                className={`timeline-item ${isEven ? 'left' : 'right'}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="timeline-icon-box">{getIcon(item.iconName)}</div>
                <div className="timeline-card">
                  <div className="timeline-time">{item.time}</div>
                  <h3 className="timeline-event-title">{item.title}</h3>
                  <p className="timeline-desc">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
