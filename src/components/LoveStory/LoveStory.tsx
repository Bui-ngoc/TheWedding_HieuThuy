import React from 'react';
import { motion } from 'framer-motion';
import './LoveStory.css';

interface LoveStoryProps {
  groomName?: string;
  brideName?: string;
  photoUrl?: string;
}

export const LoveStory: React.FC<LoveStoryProps> = ({
  photoUrl = '/images/web/THA09781.jpg'
}) => {
  return (
    <section className="love-story-section" id="love-story">
      {/* Side Watermark pinned directly to desktop screen left border */}
      <div className="side-watermark watermark-left">LOVE STORY</div>

      <div className="story-container">
        <motion.div
          className="story-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="story-script-title">Chuyện chúng mình</h2>
          
          <p className="story-description">
            Chúng mình  rất vui mừng được chia sẻ khoảnh khắc quan trọng nhất của cuộc đời mình với gia đình, bạn bè và những người thân yêu. Ngày cưới không chỉ là sự khởi đầu của hành trình mới mà còn là dịp để chúng tôi cùng các bạn tạo nên những kỷ niệm đáng nhớ.
          </p>
        </motion.div>

        {/* Large Arched Centerpiece Photo Frame */}
        <motion.div
          className="story-arch-wrapper"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="story-arch-contour">
            <div className="story-arch-inner">
              <img
                src={photoUrl}
                alt="Chuyện chúng mình"
                className="story-arch-img"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
