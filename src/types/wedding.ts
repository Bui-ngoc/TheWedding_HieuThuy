export interface FamilyMember {
  fatherName: string;
  motherName: string;
  address: string;
}

export interface BrideGroomInfo {
  brideName: string;
  brideFullName: string;
  brideParents: FamilyMember;
  groomName: string;
  groomFullName: string;
  groomParents: FamilyMember;
}

export interface EventInfo {
  id: string;
  title: string;
  subtitle: string;
  parents?: FamilyMember;
  time: string;
  lunarDate: string;
  solarDate: string;
  solarDayOfWeek: string;
  locationName: string;
  address: string;
  mapUrl: string;
}

export interface PhotoItem {
  id: string;
  url: string;
  title?: string;
  category?: string;
}

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  iconName: string;
}

export interface GuestMessage {
  id: string;
  name: string;
  relationship: string;
  message: string;
  createdAt: string;
}

export interface BankAccount {
  id: string;
  side: 'bride' | 'groom';
  ownerName: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  branch?: string;
  qrCodeUrl: string;
}

export interface WeddingData {
  slug: string;
  title: string;
  couple: BrideGroomInfo;
  heroPhotoUrl?: string;
  weddingDate: string; // ISO string e.g. "2026-10-18T18:00:00"
  lunarDateString: string;
  invitationMessage: string;
  events: EventInfo[];
  timeline: TimelineItem[];
  photos: PhotoItem[];
  bankAccounts: BankAccount[];
}
