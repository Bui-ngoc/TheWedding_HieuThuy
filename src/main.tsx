import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Dynamically set absolute Open Graph image & URL for social sharing preview (Zalo, Facebook, Messenger, iMessage)
if (typeof window !== 'undefined') {
  const origin = window.location.origin;
  const fullImgUrl = `${origin}/images/og_preview.png`;

  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) ogImg.setAttribute('content', fullImgUrl);

  const ogImgSecure = document.querySelector('meta[property="og:image:secure_url"]');
  if (ogImgSecure) ogImgSecure.setAttribute('content', fullImgUrl);

  const twImg = document.querySelector('meta[name="twitter:image"]');
  if (twImg) twImg.setAttribute('content', fullImgUrl);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
