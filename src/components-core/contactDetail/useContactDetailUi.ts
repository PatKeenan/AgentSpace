import {
    ContactMetaSchema,
    ContactSchema,
    ProfileSchema,
} from "server/schemas";
import { devtools } from "zustand/middleware";
import create from "zustand";
import { ContactOnAppointment, Profile } from "@prisma/client";

export type DefaultProfileDataType = Profile & {
    appointments: ContactOnAppointment[];
    _count: {
        appointments: number;
    };
};

export type ContactDetailUiType = {
    modal: {
        state?: boolean;
        form?: "contact" | "contactMeta" | "profile";
        defaultData?:
            | ContactMetaSchema["update"]
            | ContactSchema["base"]
            | DefaultProfileDataType;
    };
    setModal: (opts: {
        state?: boolean;
        form?: "contact" | "contactMeta" | "profile";
        defaultData?:
            | ContactMetaSchema["update"]
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
                    form: undefined,
                },
            })),
    }))
);
