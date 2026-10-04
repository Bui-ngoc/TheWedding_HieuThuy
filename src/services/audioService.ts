/**
 * Audio Service for Online Wedding Invitation
 * Handles Envelope Open Sound Effect ("ting") & Background Music ("Lễ Đường")
 */

// Synthesize a soft bell/chime sound effect ("ting") using Web Audio API
export const playEnvelopeOpenChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    // High sparkling chime tone 1 (E6 - ~1318 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1318.51, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.25, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 1.2);

    // Harmonic chime tone 2 (B6 - ~1975 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1975.53, now + 0.08);
    gain2.gain.setValueAtTime(0, now + 0.08);
    gain2.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 1.6);
  } catch (e) {
    console.warn('AudioContext not supported or blocked:', e);
  }
};

const getMusicUrl = (): string => {
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}audio/vay-cuoi.mp3`;
};

// Background Music Controller ("Váy Cưới")
class BGMManager {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private listeners: ((playing: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
    }
  }

  private initAudio() {
    if (this.audio) return;
    const musicUrl = getMusicUrl();
    this.audio = new Audio(musicUrl);
    this.audio.loop = true;
    this.audio.volume = 0.7;
    this.audio.preload = 'auto';

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.notifyListeners();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notifyListeners();
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.notifyListeners();
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio element error, re-trying with clean URL:', e, this.audio?.error);
      this.isPlaying = false;
      this.notifyListeners();
    });
  }

  public setCustomTrack(url: string) {
    this.initAudio();
    if (this.audio) {
      const currentPlaying = this.isPlaying;
      this.audio.pause();
      this.audio.src = url;
      this.audio.load();
      if (currentPlaying) {
        this.play();
      }
    }
  }

  public play() {
    this.initAudio();
    if (!this.audio) return;

    if (this.audio.error) {
      this.audio.src = getMusicUrl();
      this.audio.load();
    }

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.notifyListeners();
        })
        .catch(err => {
          console.warn('Autoplay blocked or waiting user interaction:', err);
          this.isPlaying = false;
          this.notifyListeners();
        });
    }
  }

  public pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    this.notifyListeners();
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public subscribe(listener: (playing: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l(this.isPlaying));
  }
}

export const bgmManager = new BGMManager();

