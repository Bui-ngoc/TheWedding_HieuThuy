import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { bgmManager } from '../../services/audioService';
import { PetalsCanvas } from './PetalsCanvas';
import './Opening.css';

interface OpeningProps {
  brideName: string;
  groomName: string;
  heroPhotoUrl?: string;
  weddingDate?: string;
  lunarDate?: string;
}

export const Opening: React.FC<OpeningProps> = ({
  brideName = 'Thu Thủy',
  groomName = 'Trần Hiếu',
  heroPhotoUrl = '/images/hero_main.jpg'
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    setIsPlayingAudio(bgmManager.getIsPlaying());
    const unsubscribe = bgmManager.subscribe((playing) => {
      setIsPlayingAudio(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleMusic = () => {
    bgmManager.toggle();
  };

  return (
    <section className="hero-opening-section" id="opening">
      {/* Falling Flower Petals Canvas */}
      <PetalsCanvas />



      {/* Floral Decorative Corners */}
      <img
        src="/images/floral_top_left.png"
        alt="Hoa góc trên"
        className="hero-floral-decor floral-top-left"
      />
      <img
        src="/images/floral_bottom_right.png"
        alt="Hoa góc dưới"
        className="hero-floral-decor floral-bottom-right"
      />

      {/* Main Grid Layout (2 Columns on Desktop) */}
      <div className="hero-container">
        {/* Left Column: Typography & Date */}
        <motion.div
          className="hero-left-col"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-subheading">SAVE THE DATE </div>

          <div className="hero-couple-names-stacked">
            <span className="groom-name">{groomName}</span>
            <span className="name-ampersand">&amp;</span>
            <span className="bride-name">{brideName}</span>
          </div>

          <div className="hero-date-large">
            <span>18</span>
            <span className="date-sep">|</span>
            <span>10</span>
            <span className="date-sep">|</span>
            <span>2026</span>
          </div>
        </motion.div>

        {/* Right Column: Overlapping Arch Photo Frames */}
        <motion.div
          className="hero-right-col"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="hero-arch-wrapper">
            {/* Main Tall Arch Photo */}
            <div className="hero-main-arch-contour">
              <div className="hero-main-arch">
                <img
                  src={heroPhotoUrl}
                  alt={`Ảnh cưới ${groomName} & ${brideName}`}
                  className="arch-img"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>

            {/* Overlapping Secondary Arch Photo */}
            <div className="hero-sub-arch-contour">
              <div className="hero-sub-arch">
                <img
                  src="/images/hero_sub.jpg"
                  alt="Khoảnh khắc cô dâu chú rể"
                  className="arch-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
