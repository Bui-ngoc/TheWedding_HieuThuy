import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { PhotoItem } from '../../types/wedding';
import './Gallery.css';

interface GalleryProps {
  photos?: PhotoItem[];
}

const DEFAULT_ALBUM_PHOTOS: PhotoItem[] = [
  { id: 'a1', url: '/images/album_1.png', title: 'Khoảnh khắc tay trong tay' },
  { id: 'a2', url: '/images/album_2.png', title: 'Nụ cười hạnh phúc' },
  { id: 'a3', url: '/images/album_3.png', title: 'Ánh mắt trao nhau' },
  { id: 'a4', url: '/images/hero_main.png', title: 'Ảnh cổng Lễ Đường' },
  { id: 'a5', url: '/images/groom_arch.png', title: 'Chú rể Trần Hiếu' },
  { id: 'a6', url: '/images/bride_arch.png', title: 'Cô dâu Thu Thủy' }
];

export const Gallery: React.FC<GalleryProps> = ({ photos = DEFAULT_ALBUM_PHOTOS }) => {
  const displayPhotos = photos.length > 0 ? photos : DEFAULT_ALBUM_PHOTOS;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  // Display 6 photos initially (3x2 grid), expand to all when showAll is true
  const visiblePhotos = showAll ? displayPhotos : displayPhotos.slice(0, 6);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + displayPhotos.length) % displayPhotos.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % displayPhotos.length);
  };

  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="gallery-script-title">Album ảnh cưới</h2>
        </motion.div>

        {/* 3 Column Photo Grid */}
        <div className="gallery-grid">
          {visiblePhotos.map((photo, idx) => (
            <motion.div
              key={photo.id || idx}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => openLightbox(idx)}
            >
              <div className="gallery-img-wrapper">
                <img
                  src={photo.url}
                  alt={photo.title || 'Ảnh cưới'}
                  className="gallery-img"
                  loading="lazy"
                  decoding="async"
                />
                <div className="gallery-overlay">
                  <Maximize2 size={24} color="#FFF" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Button: XEM THÊM ẢNH */}
        <motion.div
          className="gallery-btn-wrapper"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <button
            className="gallery-action-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'THU GỌN ALBUM' : 'XEM THÊM ẢNH'}
          </button>
        </motion.div>
      </div>

      {/* Lightbox Popup Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="lightbox-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <div className="lightbox-content-box" onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close-btn" onClick={closeLightbox}>
                <X size={28} />
              </button>

              <img
                src={displayPhotos[selectedIndex].url}
                alt={displayPhotos[selectedIndex].title || 'Ảnh cưới'}
                className="lightbox-img"
              />

              <button className="lightbox-nav-btn prev" onClick={handlePrev} title="Ảnh trước">
                <ChevronLeft size={24} />
              </button>
              <button className="lightbox-nav-btn next" onClick={handleNext} title="Ảnh tiếp theo">
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
