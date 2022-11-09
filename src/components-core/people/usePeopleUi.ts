import { devtools } from "zustand/middleware";
import create from "zustand";

type PeopleState = {
    modalOpen: boolean;
    setModalOpen: (val: boolean) => void;
};

export const usePeopleUI = create<PeopleState>()(
    devtools((set) => ({
        modalOpen: false,
        setModalOpen: (val) => set({ modalOpen: val }),
    }))
);
