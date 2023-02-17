import { Task } from "@prisma/client";
import { devtools } from "zustand/middleware";
import { create } from "zustand";

export type TaskStoreState = {
    TO_DO: Task[];
    IN_PROGRESS: Task[];
    DONE: Task[];
    ARCHIVED: Task[];
};

export type TaskStoreActions = {
    getTasks: (targetColumn: keyof TaskStoreState) => Task[];
    setTasks: (tasks: Partial<Task>[], column: keyof TaskStoreState) => void;
    initializeTasks: (tasks: Task[]) => void;
};

export const useTaskStore = create<TaskStoreState & TaskStoreActions>()(
    devtools((set, get) => ({
        TO_DO: [],
        IN_PROGRESS: [],
        DONE: [],
        ARCHIVED: [],
        getTasks(targetColumn: keyof TaskStoreState) {
            return get()[targetColumn];
        },
        setTasks(tasks, column) {
            set((state) => ({
                ...state,
                [column]: tasks,
            }));
        },
        initializeTasks(tasks) {
            set(() => ({
                TO_DO: tasks.filter((task) => task.status === "TO_DO"),
                IN_PROGRESS: tasks.filter(
                    (task) => task.status === "IN_PROGRESS"
                ),
                DONE: tasks.filter((task) => task.status === "DONE"),
            }));
        },
    }))
);
