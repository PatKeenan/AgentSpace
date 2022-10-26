import { devtools } from 'zustand/middleware'
import create from 'zustand'

type ShowingsDetailState = {
    editSliderOpen: boolean,
    setEditSliderOpen: (val: boolean) => void
}

export const useShowingDetailUI = create<ShowingsDetailState>()(
    devtools(
        (set) => ({
            editSliderOpen: false,
            setEditSliderOpen: (val) => set(() => ({editSliderOpen: val}) )
        })
    )
  )