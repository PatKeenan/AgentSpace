import { devtools } from 'zustand/middleware'
import create from 'zustand'


const settingsTabs = ['General', 'Password', 'Notifications', 'Billing', 'Plan', 'Workspaces'] as const

type SettingsTab = typeof settingsTabs[number]

type SettingsState = {
    activeTab: SettingsTab
    setActiveTab: (tab: SettingsTab) => void
}

export const useSettings = create<SettingsState>()(
    devtools(
        (set) => ({
           activeTab: 'General', 
           setActiveTab: (tab) => set(() => ({activeTab: tab})),
        })
    )
  )