import { devtools, persist } from "zustand/middleware";
import create from "zustand";
import { AppointmentFormType } from "./appointments-components";

export type AppointmentsUiType = {
    modal: {
        state: boolean;

        defaultData?:
            | (AppointmentFormType & { id: string })
            | undefined
            | undefined;
    };
    setModal: (opts: {
        state?: boolean;
        defaultData?: (AppointmentFormType & { id: string }) | undefined;
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
