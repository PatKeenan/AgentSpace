import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TaskStoreState } from "./taskStore";

export type KanbanStore = {
    activeDragItem?: string;
    activeDragOverItem?: string;
    activeDragOverColumn?: keyof TaskStoreState;
};

export type KanbanActions =
    | {
          type: "setActiveDragItem";
          payload: Pick<KanbanStore, "activeDragItem" | "activeDragOverColumn">;
      }
    | {
          type: "setActiveDragOverItem";
          payload: KanbanStore;
      }
    | {
          type: "setActiveDragOverColumn";
          payload: Pick<KanbanStore, "activeDragOverColumn">;
      }
    | { type: "resetKanban" };

const initialState: KanbanStore = {
    activeDragItem: undefined,
    activeDragOverItem: undefined,
    activeDragOverColumn: undefined,
};

export const kanbanReducer = (
    state: KanbanStore,
    action: KanbanActions
): KanbanStore => {
    switch (action.type) {
        case "setActiveDragItem":
            return {
                activeDragItem: action.payload.activeDragItem,
            };
        case "setActiveDragOverItem":
            return {
                activeDragOverItem: action.payload.activeDragOverItem,
                activeDragOverColumn: action.payload.activeDragOverColumn,
            };
        case "setActiveDragOverColumn":
            return {
                activeDragOverItem: undefined,
                activeDragOverColumn: action.payload.activeDragOverColumn,
            };
        case "resetKanban":
            return initialState;
        default:
            return initialState;
    }
};

export type KanbanStoreActions = {
    dispatch: (args: KanbanActions) => void;
};

export const useKanbanStore = create<KanbanStore & KanbanStoreActions>()(
    devtools((set) => ({
        activeDragItem: undefined,
        activeDragOverItem: undefined,
        activeDragOverColumn: undefined,
        dispatch: (args) => set((state) => kanbanReducer(state, args)),
    }))
);
