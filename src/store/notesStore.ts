import { create } from 'zustand';
import type { Note } from '../types';

interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  
  // Actions
  fetchNotes: () => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'createdBy' | 'createdAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  selectNote: (note: Note | null) => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  selectedNote: null,

  fetchNotes: async () => {
    try {
      const response = await fetch('http://localhost:3001/notes');
      const notes = await response.json();
      set({ notes });
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  },

  addNote: (note) => {
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({ notes: [...state.notes, newNote] }));

    // Sync with backend
    fetch('http://localhost:3001/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote),
    }).catch(console.error);
  },

  updateNote: (id, updates) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...updates } : note
      ),
    }));

    // Sync with backend
    const note = get().notes.find((n) => n.id === id);
    if (note) {
      fetch(`http://localhost:3001/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }).catch(console.error);
    }
  },

  deleteNote: (id) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));

    // Sync with backend
    fetch(`http://localhost:3001/notes/${id}`, {
      method: 'DELETE',
    }).catch(console.error);
  },

  selectNote: (note) => {
    set({ selectedNote: note });
  },
}));

