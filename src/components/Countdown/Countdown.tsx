import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import './Countdown.css';

interface CountdownProps {
  targetDate?: string;
  location?: string;
  guestName?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate = '2026-10-18T12:30:00',
  location = 'Thôn Lập Ấp, Bình Thanh, Hưng Yên',
  guestName
}) => {
  const displayGuestName = React.useMemo(() => {
    if (guestName && guestName.trim()) return guestName.trim();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlGuest = params.get('to') || params.get('guest') || params.get('name');
      if (urlGuest && urlGuest.trim()) return urlGuest.trim();
    }
    return '';
  }, [guestName]);

  const calculateTimeLeft = (): TimeLeft => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (isNaN(difference) || difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="invitation-countdown-section" id="invitation">
      <div className="invitation-container">
        {/* Section Header */}
        <motion.div
          className="invitation-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="invitation-script-title">Trân trọng kính mời</h2>
          <div className="invitation-sub-header">THAM DỰ LỄ THÀNH HÔN CỦA CHÚNG TÔI </div>
         
        </motion.div>

        {/* Blush Event Info & Countdown Card */}
        <motion.div
          className="invitation-card"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {/* Floral Side Accents */}
          <img
            src="/images/floral_top_left.png"
            alt="Decor"
            className="card-floral card-floral-left"
          />
          <img
            src="/images/floral_bottom_right.png"
            alt="Decor"
            className="card-floral card-floral-right"
          />

          <div className="card-content">
            <div className="event-time-text">12:30, Chủ nhật</div>

            <div className="event-date-large">
              <span>18</span>
              <span className="date-pipe">|</span>
              <span>10</span>
              <span className="date-pipe">|</span>
              <span>2026</span>
            </div>

            <div className="event-location-text">{location}</div>

            {/* Live Countdown Grid */}
            {!timeLeft.isExpired && (
              <div className="countdown-tiles">
                <div className="count-tile">
                  <span className="tile-number">{String(timeLeft.days).padStart(2, '0')}</span>
                  <span className="tile-label">Ngày</span>
                </div>
                <span className="tile-colon">:</span>

                <div className="count-tile">
                  <span className="tile-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="tile-label">Giờ</span>
                </div>
                <span className="tile-colon">:</span>

                <div className="count-tile">
                  <span className="tile-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="tile-label">Phút</span>
                </div>
                <span className="tile-colon">:</span>

                <div className="count-tile">
                  <span className="tile-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="tile-label">Giây</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

       
      </div>
    </section>
  );
};
