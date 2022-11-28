import { devtools } from "zustand/middleware";
import create from "zustand";
import { ContactMeta } from "@prisma/client";

type ContactDetailUi = {
    contactDisplayName: string | undefined;
    setContactDisplayName: (e: string | undefined) => void;
    modalOpen: boolean;
    setModalOpen: (val: boolean) => void;
    defaultModalData: Partial<ContactMeta> | undefined;
    setDefaultModalData: (
        data:
            | (Partial<ContactMeta> & { id: string; contactId: string })
            | undefined
    ) => void;
};

export const useContactDetailUi = create<ContactDetailUi>()(
    devtools((set) => ({
        contactDisplayName: undefined,
        setContactDisplayName: (e) => set(() => ({ contactDisplayName: e })),
        modalOpen: false,
        setModalOpen: (val) => set(() => ({ modalOpen: val })),
        defaultModalData: undefined,
        setDefaultModalData: (data) => set({ defaultModalData: data }),
    }))
);
