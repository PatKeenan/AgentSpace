import { devtools } from "zustand/middleware";
import create from "zustand";

type ContactsState = {
    modalOpen: boolean;
    setModalOpen: (val: boolean) => void;
};

export const useContactsUI = create<ContactsState>()(
    devtools((set) => ({
        modalOpen: false,
        setModalOpen: (val) => set({ modalOpen: val }),
    }))
);
