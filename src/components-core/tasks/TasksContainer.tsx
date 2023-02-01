import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Button, Card, PageBody, SectionHeading } from "components-common";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

import { NextPageExtended } from "types/index";

const tasks: Task[] = [
    { id: "1", task: "Hi", status: "to-do", order: 1024 },
    { id: "4", task: "Hi 2", status: "to-do", order: 2048 },
    { id: "5", task: "Hi 3", status: "to-do", order: 3072 },
    { id: "2", task: "yo", status: "in-progress", order: 1024 },
    { id: "6", task: "yo 2", status: "in-progress", order: 2048 },
    { id: "3", task: "hi", status: "done", order: 1024 },
];

type InitialState = {
    "to-do": Task[];
    "in-progress": Task[];
    done: Task[];
};
const taskReducer = (state: InitialState, newState: Partial<InitialState>) => ({
    ...state,
    ...newState,
});

type DragState = {
    activeCol?: string;
    activeTask?: Task;
    activeTaskIndex?: number;
    dragOverItem?: {
        id: string;
        idx?: number;
        order: number;
        prevOrder?: number;
    };
};
const initialDragState: DragState = {
    activeCol: undefined,
    activeTaskIndex: undefined,
    activeTask: undefined,
    dragOverItem: undefined,
};
const dragReducer = (state: DragState, newState: Partial<DragState>) => ({
    ...state,
    ...newState,
});

function filterTasks(tasks: Task[]) {
    return {
        "to-do": sortTasks(tasks.filter((t) => t.status === "to-do")),
        "in-progress": sortTasks(
            tasks.filter((t) => t.status === "in-progress")
        ),
        done: sortTasks(tasks.filter((t) => t.status === "done")),
    };
}
function sortTasks(tasks: Task[]) {
    return tasks.sort((a, b) => a.order - b.order);
}

const columns: { title: string; id: keyof InitialState }[] = [
    { title: "To Do", id: "to-do" },
    { title: "In Progress", id: "in-progress" },
    { title: "Done", id: "done" },
];

export const TasksContainer: NextPageExtended = () => {
    const [state, setState] = React.useReducer(taskReducer, filterTasks(tasks));
    const [dragState, setDragState] = React.useReducer(
        dragReducer,
        initialDragState
    );

    const handleDragStart = (
        e: React.DragEvent,
        task: Task,
        taskIdx: number
    ) => {
        e.stopPropagation();

        e.dataTransfer.setData("application/json", JSON.stringify(task));
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.dropEffect = "move";
        return setDragState({
            activeTask: task,
            activeTaskIndex: taskIdx,
            activeCol: task.status,
            dragOverItem: undefined,
        });
    };

    const handleDragEventReset = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.dataTransfer.clearData();
        setDragState(initialDragState);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const targetList = e.currentTarget.id as keyof InitialState;
        if (!targetList || !dragState.activeCol) return handleDragEventReset(e);

        //Get the task that is being dropped
        const targetItem = e.dataTransfer.getData("application/json");
        const targetItemParsed = JSON.parse(targetItem) as Task;

        if (targetItemParsed.id == targetList && state[targetList].length == 1)
            return handleDragEventReset(e);

        if (targetItemParsed.status === targetList && dragState.activeTask) {
            const oldIndex = dragState.activeTaskIndex as number;
            const dragOverItem = dragState.dragOverItem;
            let newOrder = 1024;

            if (!dragOverItem) {
                const lengthOfTargetList = state[targetList].length;
                newOrder =
                    (state[targetList][lengthOfTargetList - 1]?.order || 1024) +
                    1024;
            }

            if (dragOverItem) {
                newOrder =
                    dragOverItem.order && dragOverItem.prevOrder
                        ? (dragOverItem.order + dragOverItem.prevOrder) / 2
                        : dragOverItem.order && !dragOverItem?.prevOrder
                        ? dragOverItem.order / 2
                        : 1024;
            }

            const items = state[targetList];

            items[oldIndex] = { ...targetItemParsed, order: newOrder };
            console.log(items);
            return setState({
                ...state,
                [targetList]: sortTasks(items),
            });
        }

        //Make a a copy of the old column the task is being dropped from
        const oldTasksInCol =
            state[targetItemParsed.status as keyof InitialState];
        // Create a new array with the task removed
        const newTasksInOldCol = oldTasksInCol.filter(
            (i) => i.id !== targetItemParsed.id
        );

        const newTask = {
            ...targetItemParsed,
            status: targetList,
            order: 1024,
        };
        // Determine the order of the task being dropped by first seeing if it is being dropped above another task
        const collisionTask = dragState.dragOverItem;

        if (
            !collisionTask &&
            state[targetList] &&
            state[targetList].length > 0
        ) {
            const lengthOfTargetList = state[targetList].length;

            newTask["order"] =
                (state[targetList][lengthOfTargetList - 1]?.order || 1024) +
                1024;
        }

        if (collisionTask) {
            newTask["order"] = dragState.dragOverItem?.prevOrder
                ? (collisionTask.order + dragState.dragOverItem.prevOrder) / 2
                : collisionTask.order / 2;
        }

        //Update the task with the new status
        // If the item is being dropped above another item in the column, update the order

        //Make a copy of the new column the task is being dropped into
        const oldTasksInTargetCol = state[targetList];
        handleDragEventReset(e);
        setState({
            [targetItemParsed.status]: sortTasks(newTasksInOldCol),
            [targetList]: sortTasks([...oldTasksInTargetCol, newTask]),
        });
    };

    const handleDragEnterColumn = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragState({
            ...dragState,
            activeCol: e.currentTarget.id,
            dragOverItem: undefined,
        });
    };

    const handleDragExitColumn = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setDragState({
            ...dragState,
            activeCol: undefined,
            dragOverItem: undefined,
        });
    };

    const handleDragEnter = (
        e: React.DragEvent<HTMLDivElement>,
        task: Task,
        taskIdx: number,
        prevOrder?: number
    ) => {
        e.stopPropagation();
        e.preventDefault();
        if (task.id == dragState.activeTask?.id) return;
        setDragState({
            ...dragState,
            dragOverItem: {
                idx: taskIdx,
                id: task.id,
                order: task.order,
                prevOrder: prevOrder,
            },
        });
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <>
            <PageBody fullHeight noMaxWidth>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>Tasks</SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>

                {/* Main Container */}
                <div className="mx-auto mt-4 grid h-full w-full grid-cols-3 ">
                    {columns.map((column) => (
                        <div
                            id={column.id}
                            key={column.title}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={handleDragEnterColumn}
                            onDragExit={handleDragExitColumn}
                            className="flex flex-1 flex-grow flex-col"
                            data-draggable={
                                dragState.activeCol === column.id
                                    ? "target"
                                    : "column"
                            }
                        >
                            <h4 className="pl-2">{column.title}</h4>
                            <div
                                className={clsx(
                                    dragState.activeCol === column.id
                                        ? " border-gray-300 border-opacity-50 shadow"
                                        : "border-transparent",
                                    "flex flex-grow flex-col space-y-2 rounded-md border p-2 transition"
                                )}
                            >
                                {state[column.id].map((task, taskIdx) => (
                                    <React.Fragment key={task.id}>
                                        <DragItem
                                            isActiveDragOverItem={
                                                dragState.dragOverItem?.id ===
                                                task.id
                                            }
                                            aria-grabbed={
                                                dragState.activeTask?.id ===
                                                task.id
                                            }
                                            aria-dropeffect={
                                                dragState.activeTask?.id ===
                                                task.id
                                                    ? "move"
                                                    : "none"
                                            }
                                            data-draggable="item"
                                            id={task.id}
                                            draggable={true}
                                            onDragStart={(e) =>
                                                handleDragStart(
                                                    e,
                                                    task,
                                                    taskIdx
                                                )
                                            }
                                            onDragEnter={(e) =>
                                                handleDragEnter(
                                                    e,
                                                    task,
                                                    taskIdx,
                                                    taskIdx == 0
                                                        ? undefined
                                                        : state[column.id][
                                                              taskIdx - 1
                                                          ]?.order
                                                )
                                            }
                                            onDragLeave={handleDragLeave}
                                            onDragEnd={handleDragEventReset}
                                            className={clsx(
                                                dragState.activeTask?.id ==
                                                    task.id
                                                    ? "bg-gray-200"
                                                    : "bg-gray-100"
                                            )}
                                        >
                                            <span>{task.task}</span>
                                        </DragItem>
                                    </React.Fragment>
                                ))}

                                <Spacer
                                    isVisible={
                                        dragState.activeCol == column.id &&
                                        !dragState.dragOverItem
                                    }
                                    delay={true}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </PageBody>
        </>
    );
};

TasksContainer.layout = "dashboard";

type Task = {
    id: string;
    order: number;
    status: string;
    task: string;
};

const Spacer = (props: { isVisible: boolean; delay?: boolean }) => {
    const { isVisible, delay } = props;
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ scaleY: 0, originY: 0 }}
                    animate={{ scaleY: 1, originY: 0 }}
                    transition={{
                        duration: 0.175,
                        delay: delay ? 0.1 : 0,
                        type: "tween",
                    }}
                    exit={{ scaleY: 0 }}
                    className="mb-3 mt-1 h-[2.5rem] rounded-md bg-gray-300 shadow-md"
                />
            )}
        </AnimatePresence>
    );
};

const DragItem = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & { isActiveDragOverItem: boolean }
>(({ children, isActiveDragOverItem, className, ...rest }, forwardedRed) => {
    return (
        <div ref={forwardedRed} {...rest}>
            <Spacer isVisible={isActiveDragOverItem} />
            <div className={clsx(className, "rounded-md px-4 py-2 shadow")}>
                {children}
            </div>
        </div>
    );
});
DragItem.displayName = "DragItem";
