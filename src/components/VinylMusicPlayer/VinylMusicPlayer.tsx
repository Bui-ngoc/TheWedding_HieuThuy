import React, { useState, useEffect } from 'react';
import { bgmManager } from '../../services/audioService';
import './VinylMusicPlayer.css';

export const VinylMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(bgmManager.getIsPlaying());
    const unsubscribe = bgmManager.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    bgmManager.toggle();
  };

  return (
    <div
      className={`vinyl-player-widget ${isPlaying ? 'is-playing' : ''}`}
      onClick={handleToggle}
      title={isPlaying ? 'Tắt nhạc nền (Váy Cưới)' : 'Bật nhạc nền (Váy Cưới)'}
    >
      {/* Floating Musical Notes Animation */}
      {isPlaying && (
        <div className="vinyl-notes-container">
          <span className="floating-note note-1">♪</span>
          <span className="floating-note note-2">♫</span>
          <span className="floating-note note-3">♬</span>
        </div>
      )}

      {/* Vinyl Disc Body */}
      <div className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}>
        {/* Outer Vinyl Grooves */}
        <div className="vinyl-grooves" />
        {/* Center Label */}
        <div className="vinyl-center-label">
          <div className="vinyl-center-hole" />
          <span className="vinyl-center-icon">{isPlaying ? '♪' : '✕'}</span>
        </div>
      </div>
    </div>
  );
};
