import { create } from 'zustand';
import type { Post } from '../types';

interface PostsState {
  posts: Post[];
  selectedPost: Post | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  selectPost: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Helpers
  getPostsByCampaign: (campaignId: string) => Post[];
  getPostsByStatus: (status: Post['status']) => Post[];
  
  // API calls
  fetchPosts: () => Promise<void>;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  savePost: (id: string, updates: Partial<Post>) => Promise<void>;
  removePost: (id: string) => Promise<void>;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  selectedPost: null,
  isLoading: false,
  error: null,
  
  setPosts: (posts) => set({ posts }),
  
  addPost: (post) => set((state) => ({
    posts: [...state.posts, post],
  })),
  
  updatePost: (id, updates) => set((state) => ({
    posts: state.posts.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    ),
    selectedPost: state.selectedPost?.id === id
      ? { ...state.selectedPost, ...updates, updatedAt: new Date().toISOString() }
      : state.selectedPost,
  })),
  
  deletePost: (id) => set((state) => ({
    posts: state.posts.filter((p) => p.id !== id),
    selectedPost: state.selectedPost?.id === id ? null : state.selectedPost,
  })),
  
  selectPost: (id) => set((state) => ({
    selectedPost: id ? state.posts.find((p) => p.id === id) || null : null,
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  // Helpers
  getPostsByCampaign: (campaignId) => {
    return get().posts.filter((p) => p.campaignId === campaignId);
  },
  
  getPostsByStatus: (status) => {
    return get().posts.filter((p) => p.status === status);
  },
  
  // API calls
  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:3001/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const posts = await response.json();
      set({ posts, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  createPost: async (postData) => {
    set({ isLoading: true, error: null });
    try {
      const newPost = {
        ...postData,
        id: `p${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const response = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      
      if (!response.ok) throw new Error('Failed to create post');
      
      const post = await response.json();
      get().addPost(post);
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  savePost: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const post = get().posts.find((p) => p.id === id);
      if (!post) throw new Error('Post not found');
      
      const updatedPost = {
        ...post,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      const response = await fetch(`http://localhost:3001/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost),
      });
      
      if (!response.ok) throw new Error('Failed to update post');
      
      get().updatePost(id, updates);
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  removePost: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3001/posts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete post');
      
      get().deletePost(id);
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));

