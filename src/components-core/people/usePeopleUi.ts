import { devtools, persist } from "zustand/middleware";
import create from "zustand";

type PeopleUIState = {
   empty: ''
};

export const usePeopleUI = create<PeopleUIState>()(
    persist(
        devtools((set) => ({
            empty: ''
        })),
        {
            name: "people-ui",
        }
    )
);
