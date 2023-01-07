import { SubContactSchema, ContactSchema } from "server/schemas";
import { devtools } from "zustand/middleware";
import create from "zustand";
import { ContactOnAppointment, Profile } from "@prisma/client";

export type ContactDetailTabs = "Overview" | "Appointments" | "Profiles";

export type DefaultProfileDataType = Profile & {
    appointments: ContactOnAppointment[];
    _count: {
        appointments: number;
    };
};

export type ContactDetailUiType = {
    activeTab: ContactDetailTabs;
    setActiveTab: (tab: ContactDetailTabs) => void;
    modal: {
        title?: string;
        state?: boolean;
        form?: "contact" | "subContact" | "profile";
        defaultData?:
            | SubContactSchema["update"]
            | ContactSchema["base"]
            | DefaultProfileDataType;
    };
    setModal: (opts: {
        title?: string;
        state?: boolean;
        form?: "contact" | "subContact" | "profile";
        defaultData?:
            | SubContactSchema["update"]
            | ContactSchema["base"]
            | (Profile & {
                  appointments: ContactOnAppointment[];
                  _count: {
                      appointments: number;
                  };
              });
    }) => void;
    resetModal: () => void;
};

export const useContactDetailUi = create<ContactDetailUiType>()(
    devtools((set) => ({
        activeTab: "Overview",
        setActiveTab: (tab) => set(() => ({ activeTab: tab })),
        modal: { state: false },
        setModal: (opts) =>
            set((state) => ({
                modal: { ...state.modal, ...opts },
            })),
        resetModal: () =>
            set(() => ({
                modal: {
                    title: undefined,
                    state: false,
                    defaultData: undefined,
                    form: undefined,
                },
            })),
    }))
);
