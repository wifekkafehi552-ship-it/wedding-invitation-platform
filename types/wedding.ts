export type WeddingStatus = "draft" | "published";
export type PageType =
  | "cover" | "family" | "couple" | "details" | "countdown"
  | "story" | "gallery" | "rsvp" | "location" | "final";
export type RsvpAttendance = "attending" | "declined" | "pending";

export interface Wedding {
  id: string;
  user_id: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string | null;
  wedding_time: string | null;
  venue_name: string | null;
  venue_address: string | null;
  google_maps_url: string | null;
  dress_code: string | null;
  additional_info: string | null;
  cover_image_url: string | null;
  status: WeddingStatus;
  template_id: string | null;
  language: "ar" | "fr" | "en";
  music_url: string | null;
  music_enabled: boolean;
  music_volume: number;
  created_at: string;
  updated_at: string;
}

export interface WeddingPage {
  id: string;
  wedding_id: string;
  page_type: PageType;
  enabled: boolean;
  sort_order: number;
  settings: Record<string, unknown>;
}

export interface WeddingSettings {
  wedding_id: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  accent_color: string;
  button_style: "rounded" | "square" | "pill";
  border_radius: number;
  animation_style: "fade" | "slide" | "scale" | "parallax";
}

export interface TypographySettings {
  wedding_id: string;
  heading_font: string;
  body_font: string;
  names_font: string;
  family_font: string;
  button_font: string;
  heading_color: string;
  body_color: string;
  names_color: string;
  family_color: string;
  button_color: string;
}

export interface FamilySettings {
  wedding_id: string;
  groom_father_name: string | null;
  bride_father_name: string | null;
  enabled: boolean;
  custom_text: string | null;
  style: "style1" | "style2" | "style3" | "custom";
  /** Religious/blessing text shown right above the family names (optional). */
  opening_text: string | null;
}

export interface Guest {
  id: string;
  wedding_id: string;
  name: string;
  personal_slug: string;
  max_guests: number;
  created_at: string;
}

export interface Rsvp {
  id: string;
  wedding_id: string;
  guest_id: string | null;
  guest_name: string | null;
  attendance: RsvpAttendance;
  number_of_guests: number;
  notes: string | null;
  submitted_at: string;
}

export interface GalleryImage {
  id: string;
  wedding_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface StoryItem {
  id: string;
  wedding_id: string;
  item_date: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

/** Everything a template needs — assembled server-side and passed as one prop. */
export interface WeddingBundle {
  wedding: Wedding;
  pages: WeddingPage[];
  settings: WeddingSettings;
  typography: TypographySettings;
  family: FamilySettings;
  gallery: GalleryImage[];
  story: StoryItem[];
  guest?: Guest; // present only on a personal invitation link
}
