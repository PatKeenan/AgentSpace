import { devtools } from 'zustand/middleware'
import create from 'zustand'

type ShowingsDetailState = {
    detailViewActive: boolean,
    setDetailViewActive: (val: boolean) => void
}

export const useShowingDetailUI = create<ShowingsDetailState>()(
    devtools(
        (set) => ({
            detailViewActive: false,
            setDetailViewActive: (val) => set(() => ({detailViewActive: val}) )
        })
    )
  )