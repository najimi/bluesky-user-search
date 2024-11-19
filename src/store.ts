import { create } from "zustand";

export interface FormOptions {
  displayName: boolean;
  handle: boolean;
  description: boolean;
}

export interface Store {
  formOptions: FormOptions;
  updateFormOptions: (option: Partial<FormOptions>) => void;
}

export const useStore = create<Store>((set) => ({
  formOptions: {
    displayName: true,
    handle: true,
    description: true,
  },
  updateFormOptions: (option: Partial<FormOptions>) =>
    set((state: Store) => ({
      formOptions: { ...state.formOptions, ...option },
    })),
}));
