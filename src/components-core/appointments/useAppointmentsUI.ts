import { devtools } from "zustand/middleware";
import create from "zustand";

import { AppointmentQueryParamSchema } from "server/schemas";
import { AppointmentFormType } from "./appointments-components/AppointmentForm";

const initialQueryParamsState: AppointmentQueryParamSchema = {
    searchBy: "address",
    searchQuery: undefined,
    statusFilters: {
        CONFIRMED: true,
        CANCELED: true,
        NO_STATUS: true,
        PENDING: true,
        DENIED: true,
    },
    sortBy: "createdAt",
    sortOrder: "desc",
};

export type AppointmentsUiType = {
    activeTab: typeof appointmentTabOptions[number];
    setActiveTab: (newTab: typeof appointmentTabOptions[number]) => void;
    modal: {
        selectedDate?: string;
        state: boolean;
        defaultData?:
            | (AppointmentFormType & { id: string })
            | undefined
            | undefined;
    };
    setModal: (opts: {
        state?: boolean;
        selectedDate?: string | undefined;
        defaultData?: (AppointmentFormType & { id: string }) | undefined;
    }) => void;
    resetModal: () => void;
    queryParams: AppointmentQueryParamSchema;
    setQueryParams: (data: Partial<AppointmentQueryParamSchema>) => void;
};

const appointmentTabOptions = ["View All", "View By Day"] as const;

export const useAppointmentsUI = create<AppointmentsUiType>()(
    devtools((set) => ({
        activeTab: "View All",
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
        queryParams: initialQueryParamsState,
        setQueryParams: (data) =>
            set((state) => ({
                queryParams: { ...state.queryParams, ...data },
            })),
    }))
);
