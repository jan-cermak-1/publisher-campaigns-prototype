import { create } from 'zustand';
import type { Campaign, FilterState } from '../types';

interface CampaignsState {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  filters: FilterState;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  selectCampaign: (id: string | null) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API calls
  fetchCampaigns: () => Promise<void>;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  saveCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>;
  removeCampaign: (id: string) => Promise<void>;
}

export const useCampaignsStore = create<CampaignsState>((set, get) => ({
  campaigns: [],
  selectedCampaign: null,
  filters: {},
  isLoading: false,
  error: null,
  
  setCampaigns: (campaigns) => set({ campaigns }),
  
  addCampaign: (campaign) => set((state) => ({
    campaigns: [...state.campaigns, campaign],
  })),
  
  updateCampaign: (id, updates) => set((state) => ({
    campaigns: state.campaigns.map((c) =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    ),
    selectedCampaign: state.selectedCampaign?.id === id
      ? { ...state.selectedCampaign, ...updates, updatedAt: new Date().toISOString() }
      : state.selectedCampaign,
  })),
  
  deleteCampaign: (id) => set((state) => ({
    campaigns: state.campaigns.filter((c) => c.id !== id),
    selectedCampaign: state.selectedCampaign?.id === id ? null : state.selectedCampaign,
  })),
  
  selectCampaign: (id) => set((state) => ({
    selectedCampaign: id ? state.campaigns.find((c) => c.id === id) || null : null,
  })),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  // API calls
  fetchCampaigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:3001/campaigns');
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      const campaigns = await response.json();
      set({ campaigns, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  createCampaign: async (campaignData) => {
    set({ isLoading: true, error: null });
    try {
      const newCampaign = {
        ...campaignData,
        id: `c${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const response = await fetch('http://localhost:3001/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCampaign),
      });
      
      if (!response.ok) throw new Error('Failed to create campaign');
      
      const campaign = await response.json();
      get().addCampaign(campaign);
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  saveCampaign: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const campaign = get().campaigns.find((c) => c.id === id);
      if (!campaign) throw new Error('Campaign not found');
      
      const updatedCampaign = {
        ...campaign,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      const response = await fetch(`http://localhost:3001/campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCampaign),
      });
      
      if (!response.ok) throw new Error('Failed to update campaign');
      
      get().updateCampaign(id, updates);
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  removeCampaign: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3001/campaigns/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete campaign');
      
      get().deleteCampaign(id);
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));

