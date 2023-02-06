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
    handleOnAdd?: (text: string) => void;
    onDelete?: (taskId: string) => void;
    handleEdit?: (task: Task) => void;
} & React.ComponentProps<"div">;

import { TaskSingleton, type TaskSingletonType } from "lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "utils/trpc";
import { useWorkspace } from "hooks/useWorkspace";
import { useTasks } from "hooks/useTasks";

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
                      task: task.task,
                      status: task.status,
                  }
                : {
                      order: newTaskOrder || 1024,
                      task: "",
                      status: newTaskStatus || "TO_DO",
                  },
        });

        const onSubmit = handleSubmit(async (data) => {
            if (editMode && task) {
                const newTask = {
                    ...task,
                    task: data.task,
                    deleted: task?.deleted || false,
                    archived: task?.archived || false,
                    deletedAt: task?.deletedAt || undefined,
                    updatedAt: task?.updatedAt || undefined,
                };
                updateTask(newTask);

                setEditMode(false);
                return handleEdit?.(newTask as Task);
            } else {
                return handleOnAdd?.(data.task);
            }
        });

        return (
            <div
                ref={forwardedRed}
                {...rest}
                draggable={editMode ? false : true}
                className="hover:cursor-move"
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
                            "relative rounded-md px-4 py-2 shadow"
                        )}
                    >
                        <div className="absolute right-2">
                            {!editMode && (
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
                            )}
                        </div>
                        {editMode ? (
                            <form onSubmit={onSubmit}>
                                <NewInputGroup isInvalid={false} isRequired>
                                    <NewInputGroup.Label htmlFor="">
                                        {task ? "Task" : "New Task"}
                                    </NewInputGroup.Label>
                                    <NewInputGroup.TextArea
                                        autoFocus
                                        defaultValue={task?.task || ""}
                                        {...register("task")}
                                    />
                                    <NewInputGroup.Error>
                                        {errors &&
                                            errors?.task &&
                                            errors.task.message}
                                    </NewInputGroup.Error>
                                </NewInputGroup>
                                <div className="flex w-full justify-between">
                                    <Button
                                        variant="outlined"
                                        onClick={onCancel}
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
                            <div>{task ? task.task : null}</div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }
);
DragItem.displayName = "DragItem";
