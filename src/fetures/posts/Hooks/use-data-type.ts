import { create } from 'zustand';

type DataState = {
  data: "CSV" | "JSON";
  onChange: () => void;
};

export const useDataTypeStore = create<DataState>((set) => ({
  data: "CSV",
  onChange: () => set((state) => ({ data: state.data === "CSV" ? "JSON" : "CSV" })),
}));
