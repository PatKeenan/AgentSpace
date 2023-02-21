import { TASK_STATUS } from "@prisma/client";
import { z } from "zod";

export type TaskSingletonType = {
    taskFormFields: typeof formFields;
    taskSchemas: {
        baseSchema: z.infer<typeof baseSchema>;
        createSchema: z.infer<typeof createSchema>;
        updateSchema: z.infer<typeof updateSchema>;
    };
};

function errMsg(
    fieldName: keyof typeof formFields,
    option: "greater" | "less",
    value: number | string
) {
    return `${formFields[fieldName].label} must be ${option} than ${value} characters.`;
}

const formFields = {
    task: { name: "task", label: "Task" },
    date: { name: "date", label: "Due Date" },
};

const taskObj = {
    deleted: z.boolean().optional(),
    task: z
        .string()
        .min(4, errMsg("task", "greater", 4))
        .max(300, errMsg("task", "less", 300)),
    date: z.string().optional(),
    order: z.number().min(0.00004).max(2147483647, "Too many cards in list"),
    archived: z.boolean().optional(),
    status: z.nativeEnum(TASK_STATUS),
};

const baseSchema = z.object(taskObj);

const createSchema = baseSchema.omit({ deleted: true });
const updateSchema = baseSchema.partial().merge(
    z.object({
        id: z.string(),
        workspaceId: z.string(),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional(),
        deletedAt: z.date().optional(),
        createdById: z.string().optional(),
    })
);

export const TaskSingleton = {
    taskFormFields: formFields,
    taskSchemas: {
        baseSchema,
        createSchema,
        updateSchema,
    },
};
Object.freeze(TaskSingleton);
