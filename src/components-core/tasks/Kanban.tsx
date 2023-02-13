import React from "react";
import { KabanColumn } from "./KanbanColumn";
import { useTaskStore } from "./taskStore";
import { Task } from "@prisma/client";

export const Kanban = ({ tasks }: { tasks?: Task[] | [] }) => {
    const {
        initializeTasks,
        TO_DO: todos,
        IN_PROGRESS: inProgress,
        DONE: done,
    } = useTaskStore();

    React.useEffect(() => {
        if (tasks) {
            initializeTasks(tasks);
        }
    }, [initializeTasks, tasks]);

    return (
        <div className="h-full w-full">
            <div className="flex h-full">
                <KabanColumn
                    tasks={todos}
                    column={{
                        display: "To Do",
                        status: "TO_DO",
                        taskStoreState: "TO_DO",
                    }}
                />
                <KabanColumn
                    tasks={inProgress}
                    column={{
                        display: "In Progress",
                        status: "IN_PROGRESS",
                        taskStoreState: "IN_PROGRESS",
                    }}
                />
                <KabanColumn
                    tasks={done}
                    column={{
                        display: "Done",
                        status: "DONE",
                        taskStoreState: "DONE",
                    }}
                />
            </div>
        </div>
    );
};
