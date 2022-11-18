import { devtools } from "zustand/middleware";
import create from "zustand";

const appointmentsTabs = ["All Appointments", "Upcoming"] as const;

type AppointmentTab = typeof appointmentsTabs[number];

type AppointmentsState = {
    activeTab: AppointmentTab;
    setActiveTab: (tab: AppointmentTab) => void;
    modalOpen: boolean;
    setModalOpen: (val: boolean) => void;
};

export const useAppointmentsUI = create<AppointmentsState>()(
    devtools((set) => ({
        activeTab: "Upcoming",
        setActiveTab: (tab) => set(() => ({ activeTab: tab })),
        modalOpen: false,
        setModalOpen: (val) => set({ modalOpen: val }),
    }))
);
