import { devtools } from 'zustand/middleware'
import create from 'zustand'

const showingsTabs = ["All Showings", 'Upcoming'] as const

type ShowingTab = typeof showingsTabs[number]

type ShowingsState = {
    activeTab: ShowingTab
    setActiveTab: (tab: ShowingTab) => void
}

export const useShowingsUI = create<ShowingsState>()(
    devtools(
        (set) => ({
           activeTab: 'Upcoming', 
           setActiveTab: (tab) => set(() => ({activeTab: tab})),
        })
    )
  )