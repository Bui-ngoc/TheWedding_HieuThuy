import React from 'react';
import { Heart } from 'lucide-react';
import './Footer.css';

interface FooterProps {
  brideName: string;
  groomName: string;
  weddingDate: string;
}

export const Footer: React.FC<FooterProps> = ({ brideName, groomName, weddingDate }) => {
  return (
    <footer className="wedding-footer">
      <div className="footer-container">
        <div className="footer-logo">
          {groomName} &amp; {brideName}
        </div>

        <div className="footer-thankyou">CẢM ƠN VÌ ĐÃ LÀ MỘT PHẦN TRONG NGÀY TRỌNG ĐẠI!</div>

        <p className="footer-quote">
          "Sự hiện diện và những lời chúc tốt đẹp của Quý Khách là món quà ý nghĩa nhất dành cho chúng tôi."
        </p>

        <div className="gold-divider" style={{ margin: '16px 0' }}>
          <Heart size={16} fill="var(--primary-terracotta)" color="var(--primary-terracotta)" />
        </div>

        <div className="footer-copyright">
          © <span className="footer-date-text">{weddingDate.split('.')[2] || '2026'}</span> {groomName} &amp; {brideName} Wedding Invitation. All rights reserved. By NGOC BUI
        </div>
      </div>
    </footer>
  );
};
