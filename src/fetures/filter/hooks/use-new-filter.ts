import { create } from 'zustand';

type NewFilterState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewFilter = create<NewFilterState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
