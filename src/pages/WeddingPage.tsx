import React, { useState } from 'react';
import { Envelope } from '../components/Envelope/Envelope';
import { Opening } from '../components/Opening/Opening';
import { Countdown } from '../components/Countdown/Countdown';
import { BrideGroom } from '../components/BrideGroom/BrideGroom';
import { Gallery } from '../components/Gallery/Gallery';
import { LoveStory } from '../components/LoveStory/LoveStory';
import { WeddingInfo } from '../components/WeddingInfo/WeddingInfo';
import { EventTimeline } from '../components/EventTimeline/EventTimeline';
import { Guestbook } from '../components/Guestbook/Guestbook';
import { GiftBox } from '../components/GiftBox/GiftBox';
import { Footer } from '../components/Footer/Footer';
import { FloatingHearts } from '../components/FloatingHearts/FloatingHearts';
import { VinylMusicPlayer } from '../components/VinylMusicPlayer/VinylMusicPlayer';
import { DEFAULT_WEDDING_DATA } from '../services/api';

export const WeddingPage: React.FC = () => {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const data = DEFAULT_WEDDING_DATA;

  return (
    <div className="wedding-invitation-app">
      {/* Global Interactive Floating Hearts Effect */}
      <FloatingHearts />

      {/* 3D Envelope Screen */}
      {!isEnvelopeOpen && (
        <Envelope
          brideName={data.couple.brideName}
          groomName={data.couple.groomName}
          weddingDate="18.10.2026"
          onOpen={() => setIsEnvelopeOpen(true)}
        />
      )}

      {/* Main Content Flow */}
      {isEnvelopeOpen && (
        <>
          {/* Floating Spinning Vinyl Music Player */}
          <VinylMusicPlayer />

          <main className="main-content-flow">
            {/* Section 1: Hero Banner */}
            <Opening
              brideName={data.couple.brideName}
              groomName={data.couple.groomName}
              heroPhotoUrl="/images/hero_main.jpg"
              weddingDate="18 . 10 . 2026"
              lunarDate={data.lunarDateString}
            />

            {/* Section 2: Invitation & Live Countdown */}
            <Countdown targetDate={data.weddingDate} />

            {/* Section 3: CTA Buttons + Groom & Bride Arched Cards */}
            <BrideGroom
              groomName={data.couple.groomName}
              brideName={data.couple.brideName}
            />

            {/* Section 4: Wedding Photo Album */}
            <Gallery photos={data.photos} />

            {/* Section 5: Love Story - Chuyện chúng mình */}
            <LoveStory
              groomName={data.couple.groomName}
              brideName={data.couple.brideName}
              photoUrl="/images/web/THA09781.jpg"
            />

            {/* Section 6: Wide Ceremony Info */}
            <WeddingInfo events={data.events} />

            {/* Section 7: Event Timeline */}
            <EventTimeline />

            {/* Section 8: Guestbook Wishes */}
            <Guestbook />

            {/* Section 9: VietQR Gift Box */}
            <GiftBox bankAccounts={data.bankAccounts} />

            {/* Section 10: Footer */}
            <Footer
              brideName={data.couple.brideName}
              groomName={data.couple.groomName}
              weddingDate="18.10.2026"
            />
          </main>
        </>
      )}
    </div>
  );
};
