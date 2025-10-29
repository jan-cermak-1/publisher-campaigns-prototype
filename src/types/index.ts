// Campaign Types
export type CampaignStatus = 'not-started' | 'in-progress' | 'running' | 'draft' | 'waiting' | 'no-action';
export type CampaignVisibility = 'private' | 'global' | 'shared';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export interface UTMTemplate {
  id: string;
  name: string;
  params: UTMParams;
  isDefault?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  color: string;
  type: string;
  uniqueId?: string;
  startDate: string;
  endDate: string;
  repeat?: RepeatType;
  brief: string;
  utmTemplateId: string;
  utmParams: UTMParams;
  contentLabels: string[];
  status: CampaignStatus;
  visibility: CampaignVisibility;
  sharedWith?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Post Types
export type PostStatus = 'draft' | 'scheduled' | 'sent';
export type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';

export interface Profile {
  id: string;
  name: string;
  username: string;
  platform: Platform;
  avatar?: string;
}

export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video' | 'gif';
  thumbnail?: string;
}

export interface Post {
  id: string;
  campaignId?: string;
  profiles: Profile[];
  content: string;
  media: Media[];
  publishDate: string;
  status: PostStatus;
  linkInBio?: string;
  comments?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Note Types
export interface Note {
  id: string;
  content: string;
  date: string;
  endDate?: string;
  repeat?: RepeatType;
  visibility: CampaignVisibility;
  color?: string;
  createdBy: string;
  createdAt: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Filter Types
export interface FilterState {
  campaignId?: string;
  status?: CampaignStatus[];
  type?: string[];
  searchQuery?: string;
}

// UI State Types
export interface UIState {
  sidebarOpen: boolean;
  currentView: 'calendar' | 'campaigns' | 'posts';
  calendarView: 'month' | 'week' | 'day' | 'agenda';
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  campaignId: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

