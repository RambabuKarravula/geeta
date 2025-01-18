import { create } from 'zustand';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'assistant';
}

interface BookState {
  isBookOpen: boolean;
  selectedChapter: number | null;
  showChat: boolean;
  messages: Message[];
  isSoundEnabled: boolean;
  setBookOpen: (open: boolean) => void;
  setSelectedChapter: (chapter: number | null) => void;
  setShowChat: (show: boolean) => void;
  addMessage: (text: string, sender: 'user' | 'assistant') => void;
  toggleSound: () => void;
}

export const useBookStore = create<BookState>((set) => ({
  isBookOpen: false,
  selectedChapter: null,
  showChat: false,
  messages: [],
  isSoundEnabled: true,
  setBookOpen: (open) => set({ isBookOpen: open }),
  setSelectedChapter: (chapter) => set({ selectedChapter: chapter }),
  setShowChat: (show) => set({ showChat: show }),
  addMessage: (text, sender) => set((state) => ({
    messages: [...state.messages, {
      id: crypto.randomUUID(),
      text,
      timestamp: new Date(),
      sender
    }]
  })),
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled }))
}));