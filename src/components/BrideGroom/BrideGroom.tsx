import React from 'react';
import { motion } from 'framer-motion';
import './BrideGroom.css';

interface BrideGroomProps {
  groomName?: string;
  brideName?: string;
}

export const BrideGroom: React.FC<BrideGroomProps> = ({
  groomName = 'Trần Hiếu',
  brideName = 'Thu Thủy'
}) => {
  return (
    <section className="bride-groom-section" id="couple">
      {/* Background Vertical Watermarks Pinned to Screen Edges */}
      <div className="side-watermark watermark-left">GROOM</div>
      <div className="side-watermark watermark-right">BRIDE</div>

      <div className="bride-groom-container">
        <div className="couple-arch-grid">
          {/* Groom Arch Card */}
          <motion.div
            className="couple-arch-card"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="arch-contour-wrapper">
              <div className="arch-inner-frame">
                <img
                  src="/images/Groom.jpg"
                  alt={`Chú rể ${groomName}`}
                  className="couple-arch-img"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/groom.jpg';
                  }}
                />
              </div>
              {/* Floral Corner Accent on Groom Arch Bottom Left */}
              <img
                src="/images/floral_groom_corner.png"
                alt="Hoa trang trí chú rể"
                className="arch-floral-decor floral-groom-corner"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="couple-role-subtitle">Chú rể</div>
            <h3 className="couple-script-name">{groomName}</h3>
          </motion.div>

          {/* Bride Arch Card */}
          <motion.div
            className="couple-arch-card"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="arch-contour-wrapper">
              <div className="arch-inner-frame">
                <img
                  src="/images/Bride.jpg"
                  alt={`Cô dâu ${brideName}`}
                  className="couple-arch-img"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/bride.jpg';
                  }}
                />
              </div>
              {/* Floral Corner Accent on Bride Arch Bottom Right */}
              <img
                src="/images/floral_bride_corner.png"
                alt="Hoa trang trí cô dâu"
                className="arch-floral-decor floral-bride-corner"
              />
            </div>

            <div className="couple-role-subtitle">Cô dâu</div>
            <h3 className="couple-script-name">{brideName}</h3>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
