import { devtools, persist } from "zustand/middleware";
import { create } from "zustand";

const settingsTabs = [
    "General",
    "Password",
    "Notifications",
    "Billing",
    "Plan",
    "Workspaces",
] as const;

type SettingsTab = (typeof settingsTabs)[number];

type SettingsUIState = {
    activeTab: SettingsTab;
    setActiveTab: (tab: SettingsTab) => void;
};

export const useSettingsUI = create<SettingsUIState>()(
    persist(
        devtools((set) => ({
            activeTab: "Workspaces",
            setActiveTab: (tab) => set(() => ({ activeTab: tab })),
        })),
        {
            name: "settings-ui",
        }
    )
);
