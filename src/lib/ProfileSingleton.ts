import { PROFILE_TYPES } from "@prisma/client";
import { z } from "zod";

export type ProfileSingletonType = {
    profileFormFields: typeof formFields;
    profileTypeOptions: typeof profileTypeOptions;
    profileSchemas: {
        baseSchema: z.infer<typeof baseSchema>;
        createSchema: z.infer<typeof createSchema>;
        updateSchema: z.infer<typeof updateSchema>;
    };
};

const profileTypeOptions: {
    id: string;
    value: PROFILE_TYPES[number];
    display: string;
}[] = Object.keys(PROFILE_TYPES).map((i, idx) => ({
    id: String(idx + 1),
    value: i,
    display: i.toLowerCase(),
}));

function errMsg(
    fieldName: keyof typeof formFields,
    option: "greater" | "less",
    value: number | string
) {
    return `${formFields[fieldName].label} must be ${option} than ${value} characters.`;
}

// Ensures consistent naming across the app
const formFields = {
    name: { name: "name", label: "Unique Name" },
    active: { name: "active", label: "Active" },
    notes: { name: "notes", label: "Notes" },
    type: { name: "type", label: "Type" },
} as const;

const profileObj = {
    id: z.string(),
    deleted: z.boolean().optional(),
    contactId: z.string(),
    name: z
        .string()
        .min(4, errMsg("name", "greater", 4))
        .max(35, errMsg("name", "less", 35)),
    active: z.boolean().optional().default(true),
    notes: z.string().max(500, errMsg("notes", "less", 500)).optional(),
    type: z.nativeEnum(PROFILE_TYPES),
} as const;

const baseSchema = z.object(profileObj);
const createSchema = baseSchema.omit({ id: true, deleted: true });
const updateSchema = baseSchema
    .pick({
        name: true,
        active: true,
        notes: true,
        type: true,
        deleted: true,
    })
    .partial()
    .merge(baseSchema.pick({ id: true }));

export const ProfileSingleton = {
    profileFormFields: formFields,
    profileTypeOptions,
    profileSchemas: {
        baseSchema,
        createSchema,
        updateSchema,
    },
};
Object.freeze(ProfileSingleton);
