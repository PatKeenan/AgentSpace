import { devtools } from "zustand/middleware";
import { create } from "zustand";

type AppointmentsDetailState = {
    editSliderOpen: boolean;
    setEditSliderOpen: (val: boolean) => void;
};

export const useAppointmentDetailUI = create<AppointmentsDetailState>()(
    devtools((set) => ({
        editSliderOpen: false,
        setEditSliderOpen: (val) => set(() => ({ editSliderOpen: val })),
    }))
);
