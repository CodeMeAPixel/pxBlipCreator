import create from 'zustand';
import type { StoreState } from '.';

interface ClipboardStore {
  clipboard: StoreState | false;
  setClipboard: (value: StoreState) => void;
}

export const useClipboard = create<ClipboardStore>((set) => ({
  clipboard: false,
  setClipboard: (value: StoreState) => set({ clipboard: value }),
}));
