import { TASK_STATUS, Task } from "@prisma/client";
import { TaskStoreState, useTaskStore } from "./taskStore";
import React from "react";
import { useKanbanStore } from "./kanbanStore";
import { Button } from "components-common/Button";
import clsx from "clsx";
import { DragItem } from "./DragItem";
import { Spacer } from "./Spacer";
import { useTasks } from "hooks/useTasks";
import { useWorkspace } from "hooks/useWorkspace";
import { trpc } from "utils/trpc";

export type KabanColumnType = {
    display: "Todo" | "In Progress" | "Done";
    taskStoreState: keyof TaskStoreState;
    status: TASK_STATUS;
};

function checkIfOrderIsValid(order: number) {
    const numberArr = order.toString().split(".");

    if (numberArr.length == 1) return true;
    if (numberArr.length == 2 && numberArr[1]) {
        // 0.00004
        const isGreaterThanMin = numberArr[1] ? numberArr[1].length <= 4 : true;
        if (isGreaterThanMin) return true;
        if (numberArr[1].length > 5) return false;
        if (numberArr[1].length == 5 && Number(numberArr[1][5]) <= 4)
            return true;
        return false;
    }
}

export const KabanColumn = ({
    tasks,
    column,
}: {
    tasks?: Task[];
    column: KabanColumnType;
}) => {
    const [addEdit, setAddEdit] = React.useState(false);
    const utils = trpc.useContext();
    const { id } = useWorkspace();
    const setTasks = useTaskStore((state) => state.setTasks);
    const getTasks = useTaskStore((state) => state.getTasks);

    const {
        activeDragItem,
        activeDragOverItem,
        activeDragOverColumn,
        dispatch,
    } = useKanbanStore();

    const gap = 1024;
    const {
        delete: deleteTask,
        create,
        updateStatusOrOrder,
        updateManyTasks,
    } = useTasks();

    const { mutate: updateStatusOrOrderMutation } = updateStatusOrOrder({
        onSettled: () =>
            utils.task.getAll.invalidate({ workspaceId: id as string }),
    });

    const findTask = (id: string, tasks?: Task[]) => {
        return tasks?.find((i) => i.id == id);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const task = findTask(e.currentTarget.id, tasks);

        if (task) {
            e.dataTransfer.setData("application/json", JSON.stringify(task));
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.dropEffect = "move";

            dispatch({
                type: "setActiveDragItem",
                payload: {
                    activeDragItem: task.id,
                    activeDragOverColumn: column.taskStoreState,
                },
            });
        }
    };

    const handleDragEnterColumn = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        dispatch({
            type: "setActiveDragOverColumn",
            payload: { activeDragOverColumn: column.taskStoreState },
        });
    };

    const handleDragOverItem = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();

        const task = findTask(e.currentTarget.id, tasks) || undefined;
        if (task?.id === activeDragItem) return;
        if (task) {
            dispatch({
                type: "setActiveDragOverItem",
                payload: {
                    activeDragOverItem: task.id,
                    activeDragOverColumn: column.taskStoreState,
                },
            });
        }
    };
    const { mutate: UpdateManyMutation } = updateManyTasks();
    const { mutate: createTaskMutation } = create({
        onMutate: (newTask) => {
            const previousTasks = utils.task.getAll.getData({
                workspaceId: id as string,
            });
            const taskTempValues = {
                ...newTask,
                archived: false,
                deleted: false,
                createdById: "temp",
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };
            utils.task.getAll.setData(
                { workspaceId: id as string },

                previousTasks
                    ? [...previousTasks, taskTempValues]
                    : [taskTempValues]
            );
            return { previousTasks };
        },
        onError: (err, newTask, context) => {
            return context
                ? utils.task.getAll.setData(
                      { workspaceId: id as string },
                      context.previousTasks
                  )
                : undefined;
        },
        onSettled() {
            return utils.task.getAll.invalidate({ workspaceId: id as string });
        },
    });

    const handleAddTask = (task: string) => {
        const lastItemInCol = tasks?.[tasks.length - 1];
        const order = Math.round(lastItemInCol?.order || 0) + gap;

        const taskObj = {
            task: task,
            id: "temp-id",
            order: order,
            status: column.status,
            workspaceId: id as string,
        };

        setTasks(
            tasks ? [...tasks, taskObj] : [taskObj],
            column.taskStoreState
        );

        createTaskMutation({ ...taskObj });
        setAddEdit(false);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        return dispatch({ type: "resetKanban" });
    };

    const handleDropInSameColumn = (task: Task) => {
        let taskCopy: Task = { ...task };
        const oldTasks = tasks?.filter((i) => i.id != task.id);

        const isOnlyItemInCol = tasks?.length === 1;

        if (isOnlyItemInCol) return;
        if (activeDragOverItem == activeDragItem) return;
        if (
            activeDragItem &&
            !activeDragOverItem &&
            tasks &&
            tasks?.length <= 1
        )
            return; // Do nothing if there is no activeDragOverItem and there are other items in the column.

        if (!activeDragOverItem) {
            // No dragged over item? Then add the task to the end of the column
            const lastTask = tasks?.at(-1);
            taskCopy = {
                ...task,
                order: Math.round(lastTask?.order || gap) + gap,
            };
            const newTasks = tasks ? tasks?.filter((i) => i.id != task.id) : [];
            setTasks([...newTasks, { ...taskCopy }], column.taskStoreState);
            updateStatusOrOrderMutation({
                id: taskCopy.id,
                status: taskCopy.status,
                order: taskCopy.order,
            });
            return dispatch({ type: "resetKanban" });
        }

        const draggedOverTask = findTask(activeDragOverItem, tasks);
        const draggedOverTaskIndex = tasks?.findIndex(
            (i) => i.id == draggedOverTask?.id
        );

        if (draggedOverTaskIndex == 0) {
            // If the dragged over item is the first item in the column, then set the order to the dragged over item order / 2
            const newOrder = (draggedOverTask?.order || gap) / 2;

            const isValidOrder = checkIfOrderIsValid(newOrder);

            taskCopy = {
                ...task,
                order: newOrder,
            };
            const oldTasks = tasks ? tasks?.filter((i) => i.id != task.id) : [];
            oldTasks.unshift(taskCopy);

            if (!isValidOrder) {
                let incrementor = 0;
                const newTasks = oldTasks.map((i) => {
                    const taskCopy = { ...i, order: incrementor + gap };
                    incrementor = incrementor + gap;
                    return taskCopy;
                });
                setTasks(newTasks, column.taskStoreState);
                console.log({ invalid: true, newTasks });
                UpdateManyMutation({
                    tasks: newTasks.map((i) => ({
                        id: i.id,
                        order: i.order,
                        status: i.status,
                    })),
                });
                return dispatch({ type: "resetKanban" });
            }

            setTasks(oldTasks, column.taskStoreState);
            updateStatusOrOrderMutation({
                id: taskCopy.id,
                status: taskCopy.status,
                order: taskCopy.order,
            });
            return dispatch({ type: "resetKanban" });
        }

        // find the index of the dragged over task without the dragged task in the array
        const draggedOverTaskIndexWithoutDraggedTask = oldTasks?.findIndex(
            (i) => i.id == draggedOverTask?.id
        );

        const taskBeforeDraggedOverTask =
            oldTasks && draggedOverTaskIndexWithoutDraggedTask
                ? oldTasks?.[draggedOverTaskIndexWithoutDraggedTask - 1]
                : undefined;

        const newOrder =
            ((taskBeforeDraggedOverTask?.order || gap) +
                (draggedOverTask?.order || gap)) /
            2;

        const isValidOrder = checkIfOrderIsValid(newOrder);

        const newTasks =
            draggedOverTaskIndexWithoutDraggedTask && oldTasks
                ? [
                      ...oldTasks?.slice(
                          0,
                          draggedOverTaskIndexWithoutDraggedTask
                      ),
                      { ...taskCopy, order: newOrder },
                      ...oldTasks.splice(
                          draggedOverTaskIndexWithoutDraggedTask
                      ),
                  ]
                : [{ ...taskCopy, order: newOrder }];
        if (!isValidOrder) {
            let incrementor = 0;
            const newTasksReordered = newTasks.map((i) => {
                const taskCopy = { ...i, order: incrementor + gap };
                incrementor = incrementor + gap;
                return taskCopy;
            });
            setTasks(newTasksReordered, column.taskStoreState);
            UpdateManyMutation({
                tasks: newTasksReordered.map((i) => ({
                    id: i.id,
                    order: i.order,
                    status: i.status,
                })),
            });
            return dispatch({ type: "resetKanban" });
        }
        setTasks(newTasks, column.taskStoreState);
        updateStatusOrOrderMutation({
            id: taskCopy.id,
            status: taskCopy.status,
            order: newOrder,
        });
        return dispatch({ type: "resetKanban" });
    };

    const handleDropInEmptyColumn = (task: Task, oldTasks: Task[]) => {
        // remove from old column and add to new column
        setTasks(
            oldTasks.filter((i) => i.id != task.id),
            task.status
        );
        updateStatusOrOrderMutation({
            id: task.id,
            status: column.status,
            order: gap,
        });
        setTasks(
            [{ ...task, order: gap, status: column.status }],
            column.taskStoreState
        );
        return dispatch({ type: "resetKanban" });
    };
    const handleDropAtEndOfColumn = (task: Task, oldTasks: Task[]) => {
        const lastItemInNewCol = tasks?.[tasks?.length - 1];
        const newOrder = Math.round(lastItemInNewCol?.order || gap) + gap;
        setTasks(
            oldTasks.filter((i) => i.id != task.id),
            task.status
        );
        const newTask = {
            ...task,
            order: newOrder,
            status: column.status,
        };
        updateStatusOrOrderMutation({
            id: task.id,
            status: column.status,
            order: newOrder,
        });
        setTasks(
            tasks ? [...tasks, newTask] : [newTask],
            column.taskStoreState
        );
        return dispatch({ type: "resetKanban" });
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();

        const taskJson = e.dataTransfer.getData("application/json");
        const draggedTask = JSON.parse(taskJson) as Task;

        if (!draggedTask) return;
        if (draggedTask.status === column.status) {
            return handleDropInSameColumn(draggedTask);
        }

        const oldTasks = getTasks(draggedTask.status);
        const noTasksInNewCol = tasks?.length == 0;

        // if there are no tasks in the new column, there won't be an activeDragOverItem
        if (noTasksInNewCol) {
            return handleDropInEmptyColumn(draggedTask, oldTasks);
        }
        if (!activeDragOverItem) {
            return handleDropAtEndOfColumn(draggedTask, oldTasks);
        }

        const draggedOverTask = findTask(activeDragOverItem, tasks);
        const draggedOverTaskIndex = tasks?.findIndex(
            (i) => i.id == draggedOverTask?.id
        );

        if (draggedOverTaskIndex == 0) {
            const newOrder = Math.round(draggedOverTask?.order || gap) / 2;
            setTasks(
                oldTasks.filter((i) => i.id != draggedTask.id),
                draggedTask.status
            );
            const copyOfTasks = tasks && tasks.length > 0 ? [...tasks] : [];
            copyOfTasks.unshift({
                ...draggedTask,
                order: newOrder,
                status: column.status,
            });
            updateStatusOrOrderMutation({
                id: draggedTask.id,
                status: column.status,
                order: newOrder,
            });
            setTasks(copyOfTasks, column.taskStoreState);
            return dispatch({ type: "resetKanban" });
        }

        if (draggedOverTask && draggedOverTaskIndex) {
            const itemBeforeDraggedOverTask = tasks?.[draggedOverTaskIndex - 1];

            if (!itemBeforeDraggedOverTask) {
                const newTask = {
                    ...draggedTask,
                    order: tasks && tasks[0] ? tasks[0].order / 2 : gap,
                    status: column.status,
                };
                setTasks(
                    oldTasks.filter((i) => i.id !== newTask.id),
                    draggedTask.status
                );
                const copyOfTasks = tasks && tasks.length > 0 ? [...tasks] : [];
                copyOfTasks.unshift(newTask);
                updateStatusOrOrderMutation({
                    id: newTask.id,
                    status: newTask.status,
                    order: newTask.order,
                });
                setTasks(copyOfTasks, column.taskStoreState);
                return dispatch({ type: "resetKanban" });
            }

            const newOrder =
                ((itemBeforeDraggedOverTask?.order || 0) +
                    draggedOverTask?.order) /
                2;
            const newTask = {
                ...draggedTask,
                order: newOrder,
                status: column.status,
            };

            setTasks(
                oldTasks.filter((i) => i.id !== newTask.id),
                draggedTask.status
            );

            // Check order

            const isValidOrder = checkIfOrderIsValid(newTask.order);
            if (!isValidOrder) {
                const newTasks = [
                    ...tasks.slice(0, draggedOverTaskIndex),
                    newTask,
                    ...tasks.slice(draggedOverTaskIndex),
                ];
                let orderIncrement = 0;
                const newTasksWithCorrectOrder = newTasks.map((task) => {
                    const newTask = { ...task, order: orderIncrement + gap };
                    orderIncrement = orderIncrement + gap;
                    return newTask;
                });
                const updateArr = newTasksWithCorrectOrder.map((task) => ({
                    id: task.id,
                    order: task.order,
                    status: task.status as TASK_STATUS,
                }));
                if (updateArr.length > 0) {
                }
                UpdateManyMutation({ tasks: updateArr });
                setTasks(newTasksWithCorrectOrder, column.taskStoreState);
                return dispatch({ type: "resetKanban" });
            }

            updateStatusOrOrderMutation({
                id: newTask.id,
                status: newTask.status,
                order: newTask.order,
            });
            setTasks(
                tasks
                    ? [
                          ...tasks.slice(0, draggedOverTaskIndex),
                          newTask,
                          ...tasks.slice(draggedOverTaskIndex),
                      ]
                    : [newTask],
                column.taskStoreState
            );
            return dispatch({ type: "resetKanban" });
        }
    };

    const { mutate: deleteMutation } = deleteTask();

    const handleDelete = (id: string) => {
        if (tasks) {
            const oldTasks = tasks?.filter((i) => i.id != id);
            deleteMutation({ id }); // Todo => delete task from cache and invalidate query
            return setTasks(oldTasks, column.taskStoreState);
        }
    };
    const handleEditTask = (task: Task) => {
        const updatedTaskIndex = tasks?.findIndex((i) => i.id == task.id);
        if (updatedTaskIndex != undefined && tasks) {
            const tasksCopy = [...tasks];
            const newTasks = tasksCopy.splice(updatedTaskIndex, 1, task);
            return setTasks(
                tasks ? [...newTasks] : [task],
                column.taskStoreState
            );
        }
        setAddEdit(false);
    };

    return (
        <div
            className="h-full w-1/3 min-w-[300px] flex-1 flex-grow odd:px-8"
            onDragEnter={handleDragEnterColumn}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            id={column.taskStoreState}
        >
            <div className="flex items-center justify-between pt-1">
                <h5 className="font-medium">{column.display}</h5>
                <Button
                    size="sm"
                    actionIcon="add"
                    iconSize="md"
                    variant="primary"
                    onClick={() => setAddEdit(true)}
                >
                    Add
                </Button>
            </div>

            <ul
                className={clsx(
                    activeDragOverColumn == column.taskStoreState
                        ? "border-gray-200 bg-gray-50"
                        : "border-transparent bg-transparent",
                    "-mx-4 mt-4 h-full space-y-4 overflow-auto rounded-md border p-4"
                )}
            >
                {tasks &&
                    tasks.map((task) => (
                        <DragItem
                            key={task.id}
                            id={task.id}
                            task={task}
                            className={clsx(
                                activeDragItem == task.id
                                    ? "bg-gray-200"
                                    : "bg-gray-100"
                            )}
                            isActiveDragOverItem={activeDragOverItem == task.id}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDragEnter={handleDragOverItem}
                            onDragOver={(e) => e.preventDefault()}
                            onDelete={handleDelete}
                        >
                            {task.task}
                        </DragItem>
                    ))}
                {addEdit && (
                    <DragItem
                        onCancel={() => setAddEdit(false)}
                        handleOnAdd={handleAddTask}
                        handleEdit={handleEditTask}
                        isActiveDragOverItem={false}
                        className="bg-gray-100"
                    />
                )}
                <Spacer
                    isVisible={
                        !activeDragOverItem &&
                        activeDragOverColumn == column.taskStoreState
                    }
                    delay={true}
                />
            </ul>
        </div>
    );
};
