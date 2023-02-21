import * as React from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { Button, ToggleMenu, NewInputGroup } from "components-common";
import { TrashIcon } from "@heroicons/react/20/solid";
import { Spacer } from "./Spacer";

import { AnimatePresence, motion } from "framer-motion";
import { TASK_STATUS, Task } from "@prisma/client";

type DragProps = {
    task?: Task;
    isActiveDragOverItem: boolean;
    newTaskOrder?: number;
    newTaskStatus?: TASK_STATUS;
    onCancel?: () => void;
    animate?: boolean;
    handleOnAdd?: (text: string, date?: string) => void;
    onDelete?: (taskId: string) => void;
    handleEdit?: (task: Task) => void;
} & React.ComponentProps<"div">;

import { TaskSingleton, type TaskSingletonType } from "lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "utils/trpc";
import { useWorkspace } from "hooks/useWorkspace";
import { useTasks } from "hooks/useTasks";
import { format, parseISO } from "date-fns";

const { taskSchemas } = TaskSingleton;

export const DragItem = React.forwardRef<HTMLDivElement, DragProps>(
    (props, forwardedRed) => {
        const {
            isActiveDragOverItem,
            className,
            task,
            newTaskOrder,
            newTaskStatus,
            onCancel,
            handleOnAdd,
            onDelete,
            animate = true,
            handleEdit,
            ...rest
        } = props;
        const [editMode, setEditMode] = React.useState(!task ? true : false);
        const utils = trpc.useContext();
        const { id } = useWorkspace();
        const { update } = useTasks();

        const { mutateAsync: updateTask } = update({
            onSettled: () => {
                utils.task.getAll.invalidate({
                    workspaceId: id as string,
                });
            },
        });

        const {
            register,
            handleSubmit,
            formState: { errors },
        } = useForm<TaskSingletonType["taskSchemas"]["createSchema"]>({
            resolver: zodResolver(taskSchemas.createSchema),
            defaultValues: task
                ? {
                      order: task.order,
                      date: task?.date || undefined,
                      task: task.task,
                      status: task.status,
                  }
                : {
                      order: newTaskOrder || 1024,
                      date: "",
                      task: "",
                      status: newTaskStatus || "TO_DO",
                  },
        });

        const onSubmit = handleSubmit(async (data) => {
            if (editMode && task) {
                const newTask = {
                    ...task,
                    task: data.task,
                    date: data?.date || undefined,
                    deleted: task?.deleted || false,
                    archived: task?.archived || false,
                    deletedAt: task?.deletedAt || undefined,
                    updatedAt: task?.updatedAt || undefined,
                };
                updateTask(newTask);

                setEditMode(false);
                return handleEdit?.(newTask as Task);
            } else {
                return handleOnAdd?.(data.task, data?.date);
            }
        });

        const handleOnCancel = () => {
            setEditMode(false);
            onCancel?.();
        };

        return (
            <div
                ref={forwardedRed}
                {...rest}
                draggable={editMode ? false : true}
                className="flex-shrink-0 hover:cursor-move"
            >
                <Spacer isVisible={isActiveDragOverItem} />
                <AnimatePresence>
                    <motion.div
                        transition={{
                            duration: animate ? 0.175 : 0,
                            type: "tween",
                        }}
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={clsx(
                            className,
                            editMode ? "px-2" : "px-4",
                            "relative flex flex-1 rounded-md py-2 shadow"
                        )}
                    >
                        {!editMode && (
                            <div className="order-2 ml-auto flex w-12 shrink-0 justify-end">
                                <ToggleMenu
                                    items={[
                                        {
                                            text: "Edit",
                                            onClick: () => setEditMode(true),
                                        },
                                        {
                                            text: (
                                                <div className="flex items-center text-red-400">
                                                    <TrashIcon className="h-4 w-4" />
                                                    <span className="ml-2">
                                                        Delete
                                                    </span>
                                                </div>
                                            ),
                                            onClick: () =>
                                                task
                                                    ? onDelete?.(task.id)
                                                    : undefined,
                                        },
                                    ]}
                                />
                            </div>
                        )}
                        {editMode ? (
                            <form
                                onSubmit={onSubmit}
                                className="flex flex-grow flex-col overflow-auto p-1"
                            >
                                <NewInputGroup>
                                    <NewInputGroup.Label htmlFor="date">
                                        {
                                            TaskSingleton.taskFormFields.date
                                                .label
                                        }
                                    </NewInputGroup.Label>
                                    <NewInputGroup.Input
                                        type="datetime-local"
                                        defaultValue={task?.date || ""}
                                        {...register("date")}
                                    />
                                </NewInputGroup>
                                <div className="mt-2">
                                    <NewInputGroup
                                        isInvalid={Boolean(
                                            errors && errors.task
                                        )}
                                        isRequired
                                    >
                                        <NewInputGroup.Label htmlFor="">
                                            {task ? "Task" : "New Task"}
                                        </NewInputGroup.Label>
                                        <NewInputGroup.TextArea
                                            autoFocus
                                            defaultValue={task?.task || ""}
                                            rows={3}
                                            {...register("task")}
                                        />
                                        <NewInputGroup.Error>
                                            {errors &&
                                                errors?.task &&
                                                errors.task.message}
                                        </NewInputGroup.Error>
                                    </NewInputGroup>
                                </div>
                                <div className="flex w-full justify-between">
                                    <Button
                                        variant="outlined"
                                        onClick={handleOnCancel}
                                        type="button"
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Save
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="w-full overflow-auto">
                                {task?.date ? (
                                    <p className="mb-1 border-b border-b-gray-300 text-sm text-gray-600">
                                        {format(new Date(task.date), "PPp")}
                                    </p>
                                ) : null}
                                <div>{task ? task.task : null}</div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }
);
DragItem.displayName = "DragItem";
