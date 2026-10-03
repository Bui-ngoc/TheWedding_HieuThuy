import { WeddingData, GuestMessage } from '../types/wedding';

// Mock & Initial Wedding Data based on user invitation card
export const DEFAULT_WEDDING_DATA: WeddingData = {
  slug: 'thuthuy-tranhieu',
  title: 'Thiệp Cưới Thu Thủy & Trần Hiếu',
  couple: {
    brideName: 'Thu Thủy',
    brideFullName: 'Bùi Thu Thủy',
    brideParents: {
      fatherName: 'Bùi Văn Nhất',
      motherName: 'Nguyễn Thị Dung',
      address: 'Thôn Chí Cường - Nam Cường - Hưng Yên'
    },
    groomName: 'Trần Hiếu',
    groomFullName: 'Trần Hiếu',
    groomParents: {
      fatherName: 'Trần Văn Hùng',
      motherName: 'Lê Thị Hiền',
      address: 'Thôn Lập Ấp - X. Bình Thanh - Hưng Yên'
    }
  },
  heroPhotoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  weddingDate: '2026-10-18T12:30:00',
  lunarDateString: 'Ngày 08 tháng 09 năm Bính Ngọ',
  invitationMessage: 'Tới dự bữa cơm thân mật chung vui cùng gia đình chúng tôi. Sự hiện diện của Quý Khách là niềm vinh hạnh cho gia đình chúng tôi!',
  events: [
    {
      id: 'vu-quy',
      title: 'Tiệc Nhà Gái',
      subtitle: 'Trân trọng kính mời tới dự bữa cơm thân mật chung vui cùng Gia đình Nhà Gái',
      parents: {
        fatherName: 'Bùi Văn Nhất',
        motherName: 'Nguyễn Thị Dung',
        address: 'Thôn Chí Cường - Nam Cường - Hưng Yên'
      },
      time: '09:00 - Chủ nhật ',
      solarDate: '18.10.2026',
      solarDayOfWeek: 'Chủ nhật',
      lunarDate: 'Tức ngày 09/09 năm Bính Ngọ',
      locationName: 'GIA ĐÌNH NHÀ GÁI',
      address: 'Thôn Chí Cường - Nam Cường - Hưng Yên',
      mapUrl: 'https://maps.google.com/?q=Nam+Cường+Hưng+Yên'
    },
    {
      id: 'thanh-hon',
      title: 'Tiệc Nhà Trai ',
      subtitle: 'Trân trọng kính mời tới dự bữa cơm thân mật chung vui cùng Gia đình Nhà Trai',
      parents: {
        fatherName: 'Trần Văn Hùng',
        motherName: 'Lê Thị Hiền',
        address: 'Thôn Lập Ấp - X. Bình Thanh - Hưng Yên'
      },
      time: '09:00 - Chủ nhật  ',
      solarDate: '18.10.2026',
      solarDayOfWeek: 'Chủ Nhật',
      lunarDate: 'Tức ngày 09/09 năm Bính Ngọ',
      locationName: 'GIA ĐÌNH NHÀ TRAI',
      address: 'Thôn Lập Ấp - X. Bình Thanh - Hưng Yên',
      mapUrl: 'https://maps.google.com/?q=Bình+Thanh+Hưng+Yên'
    }
  ],
  timeline: [
    {
      id: '1',
      time: '13:00',
      title: 'Lễ Ăn Hỏi',
      description: 'Lễ Ăn Hỏi tại Nhà Gái (Thôn Chí Cường, Nam Cường, Hưng Yên)',
      iconName: 'HeartHandshake'
    },
    {
      id: '2',
      time: '12:30',
      title: 'Lễ Đón Dâu',
      description: 'Lễ Đón Dâu tại Nhà Trai (Thôn Lập Ấp, Bình Thanh, Hưng Yên)',
      iconName: 'Sparkles'
    }
  ],
  photos: [
    { id: 'p2', url: 'images/anh_moi1.jpg', category: 'Album Cưới' },
    { id: 'p3', url: 'images/NTL07022.jpg', category: 'Album Cưới' },
    { id: 'p4', url: 'images/NTL07198.jpg', category: 'Album Cưới' },
    { id: 'p5', url: 'images/NTL07211.jpg', category: 'Album Cưới' },
    { id: 'p7', url: 'images/NTL07608.jpg', category: 'Album Cưới' },
    { id: 'p8', url: 'images/NTL07748.jpg', category: 'Album Cưới' },
    { id: 'p10', url: 'images/NTL07835.jpg', category: 'Album Cưới' },
    { id: 'p13', url: 'images/THA08556.jpg', category: 'Album Cưới' },
    { id: 'p14', url: 'images/THA08794.jpg', category: 'Album Cưới' },
    { id: 'p15', url: 'images/THA09035.jpg', category: 'Album Cưới' },
    { id: 'p16', url: 'images/THA09085.jpg', category: 'Album Cưới' },
    { id: 'p17', url: 'images/THA09558.jpg', category: 'Album Cưới' },
    { id: 'p19', url: 'images/THA09735.jpg', category: 'Album Cưới' },
    { id: 'p20', url: 'images/THA09775.jpg', category: 'Album Cưới' },
    { id: 'p22', url: 'images/7899.jpg', category: 'Album Cưới' }
  ],
  bankAccounts: [
    {
      id: 'bank-groom',
      side: 'groom',
      ownerName: 'TRAN HIEU',
      bankName: 'Techcombank (Ngân hàng Kỹ Thương)',
      bankCode: 'TCB',
      accountNumber: '19034991354010',
      branch: 'Chi nhánh Hưng Yên',
      qrCodeUrl: 'https://api.vietqr.io/image/TCB-19034991354010-compact2.jpg?accountName=TRAN%20HIEU&amount=0'
    },
    {
      id: 'bank-bride',
      side: 'bride',
      ownerName: 'BUI THU THUY',
      bankName: 'MB Bank (Ngân hàng Quân Đội)',
      bankCode: 'MB',
      accountNumber: '08070688',
      branch: 'Chi nhánh Hưng Yên',
      qrCodeUrl: 'https://api.vietqr.io/image/MB-08070688-compact2.jpg?accountName=BUI%20THU%20THUY&amount=0'
    }
  ]
};

const PRIMARY_GUESTBOOK_FUNCTION = '/.netlify/functions/guestbook';
const CLOUD_DB_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a0f857466a5a31';
const LOCAL_STORAGE_KEY_MESSAGES = 'wedding_guestbook_messages_hieuthuy_v4';

const getLocalMessages = (): GuestMessage[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_MESSAGES);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    /* ignore */
  }
  return [];
};

const mergeMessages = (local: GuestMessage[], cloud: GuestMessage[]): GuestMessage[] => {
  const map = new Map<string, GuestMessage>();
  [...cloud, ...local].forEach(msg => {
    if (msg && msg.id && !map.has(msg.id)) {
      map.set(msg.id, msg);
    }
  });
  return Array.from(map.values());
};

export const getGuestbookMessages = async (): Promise<GuestMessage[]> => {
  const localMsgs = getLocalMessages();
  let fetchedCloudMsgs: GuestMessage[] = [];

  // 1. Try Netlify Function
  try {
    const res = await fetch(PRIMARY_GUESTBOOK_FUNCTION);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        fetchedCloudMsgs = data;
      }
    }
  } catch (e) {
    /* fallback */
  }

  // 2. Try Backup Cloud DB
  if (fetchedCloudMsgs.length === 0) {
    try {
      const res = await fetch(CLOUD_DB_URL);
      if (res.ok) {
        const data = await res.json();
        if (data?.data?.messages && Array.isArray(data.data.messages)) {
          fetchedCloudMsgs = data.data.messages;
        }
      }
    } catch (e) {
      /* fallback */
    }
  }

  // 3. Merge local + cloud messages so no messages are lost
  const merged = mergeMessages(localMsgs, fetchedCloudMsgs);

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_MESSAGES, JSON.stringify(merged));
  } catch (e) {
    /* ignore */
  }

  return merged;
};

export const postGuestbookMessage = async (name: string, relationship: string, message: string): Promise<GuestMessage> => {
  const newMessage: GuestMessage = {
    id: 'user-msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: name.trim(),
    relationship: relationship.trim() || 'Khách quý',
    message: message.trim(),
    createdAt: new Date().toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  const currentLocal = getLocalMessages();
  const updatedLocal = [newMessage, ...currentLocal];

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_MESSAGES, JSON.stringify(updatedLocal));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }

  // Post to Netlify Function
  try {
    await fetch(PRIMARY_GUESTBOOK_FUNCTION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage)
    });
  } catch (e) {
    /* fallback */
  }

  // Post to Backup Cloud DB
  try {
    await fetch(CLOUD_DB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'wedding_hieuthuy_guestbook',
        data: { messages: updatedLocal }
      })
    });
  } catch (e) {
    /* fallback */
  }

  return newMessage;
};
