import { devtools } from "zustand/middleware";
import create from "zustand";
import { Appointment, ContactOnAppointment } from "@prisma/client";

export type AppointmentsUiType = {
    modal: {
        state: boolean;

        defaultData?:
            | (ContactOnAppointment & { appointment: Appointment })
            | undefined;
    };
    setModal: (opts: {
        state?: boolean;
        defaultData?:
            | (ContactOnAppointment & { appointment: Appointment })
            | undefined;
    }) => void;
    resetModal: () => void;
};

export const useAppointmentsUI = create<AppointmentsUiType>()(
    devtools((set) => ({
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
