import { devtools } from "zustand/middleware";

import create from "zustand";

export const useAppointmentFormStore = create<{
    callback?: () => void;
    setCallback: (fn?: () => void) => void;
}>()(
    devtools((set) => ({
        callback: undefined,
        setCallback: (fn) => set(() => ({ callback: fn })),
    }))
);
