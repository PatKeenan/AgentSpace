import React from "react";
import { InputContextType } from "./types";

export const InputContext = React.createContext<InputContextType | null>(null);

export const useInputGroup = () => {
    const context = React.useContext(InputContext);
    if (!context) {
        throw new Error("Component is being used outside of Input Group.");
    }
    return context;
};
