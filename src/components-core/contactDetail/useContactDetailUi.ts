import { ContactMetaSchema, ContactSchema } from "server/schemas";
import { devtools } from "zustand/middleware";
import create from "zustand";

type ContactDetailUi = {
    modal: {
        state?: boolean;
        form?: "contact" | "contactMeta";
        defaultData?: ContactMetaSchema["update"] | ContactSchema["base"];
    };
    setModal: (opts: {
        state?: boolean;
        form?: "contact" | "contactMeta";
        defaultData?: ContactMetaSchema["update"] | ContactSchema["base"];
    }) => void;
};

export const useContactDetailUi = create<ContactDetailUi>()(
    devtools((set) => ({
        modal: { state: false },
        setModal: (opts) =>
            set((state) => ({
                modal: { ...state.modal, ...opts },
            })),
    }))
);
