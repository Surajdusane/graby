import { create } from 'zustand';

type FilterState = {
  filtername: string | undefined;
  onChange: (filtername: string) => void;
  reset: () => void;
};

export const useFilterState = create<FilterState>((set) => ({
  filtername: undefined,
  onChange: (filtername: string) => set({ filtername }),
  reset: () => set({ filtername: undefined }),
}));