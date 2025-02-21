import { create } from 'zustand';

type FillterState = {
  checked: boolean;
  onChange: () => void;
};

export const useFilterStore = create<FillterState>((set) => ({
  checked: false,
  onChange: () => set((state) => ({ checked: !state.checked })),
}));
