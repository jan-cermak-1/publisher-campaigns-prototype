import { create } from 'zustand';

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  
  // Current view
  currentView: 'calendar' | 'campaigns' | 'posts';
  
  // Calendar view
  calendarView: 'month' | 'week' | 'day' | 'agenda';
  
  // Modals
  quickCreateCampaignOpen: boolean;
  campaignDetailOpen: boolean;
  createPostOpen: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: 'calendar' | 'campaigns' | 'posts') => void;
  setCalendarView: (view: 'month' | 'week' | 'day' | 'agenda') => void;
  setQuickCreateCampaignOpen: (open: boolean) => void;
  setCampaignDetailOpen: (open: boolean) => void;
  setCreatePostOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  currentView: 'calendar',
  calendarView: 'week',
  quickCreateCampaignOpen: false,
  campaignDetailOpen: false,
  createPostOpen: false,
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentView: (view) => set({ currentView: view }),
  setCalendarView: (view) => set({ calendarView: view }),
  setQuickCreateCampaignOpen: (open) => set({ quickCreateCampaignOpen: open }),
  setCampaignDetailOpen: (open) => set({ campaignDetailOpen: open }),
  setCreatePostOpen: (open) => set({ createPostOpen: open }),
}));

