import { SubContactSchema, ContactSchema } from "server/schemas";
import { devtools } from "zustand/middleware";
import { create } from "zustand";
import { ContactOnAppointment, Profile } from "@prisma/client";

export type ContactDetailTabs = "Overview" | "Appointments" | "Profiles";

export type DefaultProfileDataType = Profile & {
    appointments: ContactOnAppointment[];
    _count: {
        appointments: number;
    };
};

type FormOptions = "contact" | "subContact" | "profile" | "generalInfo";

export type DefaultDataType =
    | Pick<ContactSchema["base"], "name">
    | SubContactSchema["update"]
    | Omit<ContactSchema["base"], "name">
    | (Profile & {
          appointments: ContactOnAppointment[];
          _count: {
              appointments: number;
          };
      });

export type ContactDetailUiType = {
    modal: {
        title?: string;
        state?: boolean;
        form?: FormOptions;
        defaultData?: DefaultDataType;
    };
    setModal: (opts: {
        title?: string;
        state?: boolean;
        form?: FormOptions;
        defaultData?: DefaultDataType;
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
                    title: undefined,
                    state: false,
                    defaultData: undefined,
                    form: undefined,
                },
            })),
    }))
);
