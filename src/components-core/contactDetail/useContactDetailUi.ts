import { devtools } from "zustand/middleware";
import create from "zustand";

type ContactDetailUi = {
    contactDisplayName: string | undefined;
    setContactDisplayName: (e: string | undefined) => void;
};

export const useContactDetailUi = create<ContactDetailUi>()(
    devtools((set) => ({
        contactDisplayName: undefined,
        setContactDisplayName: (e) => set(() => ({ contactDisplayName: e })),
    }))
);
