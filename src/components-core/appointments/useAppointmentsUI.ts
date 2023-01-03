import { devtools } from "zustand/middleware";
import create from "zustand";
import { AppointmentFormType } from "./appointments-components";

export type AppointmentsUiType = {
    activeTab: typeof appointmentTabOptions[number];
    setActiveTab: (newTab: typeof appointmentTabOptions[number]) => void;
    modal: {
        selectedDate?: Date;
        state: boolean;

        defaultData?:
            | (AppointmentFormType & { id: string })
            | undefined
            | undefined;
    };
    setModal: (opts: {
        state?: boolean;
        selectedDate?: Date | undefined;
        defaultData?: (AppointmentFormType & { id: string }) | undefined;
    }) => void;
    resetModal: () => void;
};

const appointmentTabOptions = ["View By Day", "View All"] as const;

export const useAppointmentsUI = create<AppointmentsUiType>()(
    devtools((set) => ({
        activeTab: "View By Day",
        setActiveTab: (newTab) => set({ activeTab: newTab }),
        modal: { state: false },
        setModal: (opts) =>
            set((state) => ({
                modal: { ...state.modal, ...opts },
            })),
        resetModal: () =>
            set(() => ({
                modal: {
                    state: false,
                    defaultData: undefined,
                },
            })),
    }))
);
