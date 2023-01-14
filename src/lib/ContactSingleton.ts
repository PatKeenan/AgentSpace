import { z } from "zod";

export type ContactSingletonType = {
    contactFormFields: typeof formFields;
    contactSchemas: {
        base: z.infer<typeof baseContactSchema>;
        create: z.infer<typeof createContactSchema>;
        update: z.infer<typeof updateContactSchema>;
        updateWithoutName: z.infer<typeof updateContactWithoutNameSchema>;
    };
    subContactSchema: {
        base: z.infer<typeof subContactSchema>;
        create: z.infer<typeof createSubContactSchema>;
        update: z.infer<typeof updateSubContactSchema>;
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
    name: { name: "name", label: "Full Name" },
    firstName: { name: "firstName", label: "First Name" },
    lastName: { name: "lastName", label: "Last Name" },
    email: { name: "email", label: "Email" },
    phoneNumber: { name: "phoneNumber", label: "Phone Number" },
    notes: { name: "notes", label: "Notes" },
} as const;

// Schemas
const contactObj = {
    name: z
        .string()
        .trim()
        .min(2, errMsg("name", "greater", 2))
        .max(70, errMsg("name", "less", 70)),
    firstName: z
        .string()
        .trim()
        .min(2, errMsg("firstName", "greater", 2))
        .max(35, errMsg("firstName", "less", 35)),
    lastName: z.string().trim().max(35, errMsg("lastName", "less", 35)),
    phoneNumber: z.string().trim().max(15, errMsg("phoneNumber", "less", 15)),
    email: z
        .string()
        .trim()
        .max(60, errMsg("email", "less", 60))
        .email()
        .optional()
        .or(z.literal("")),
    notes: z.string().trim().max(2000, errMsg("notes", "less", 2000)),
} as const;

const baseContactSchema = z.object(contactObj);

const createContactSchema = baseContactSchema.partial({
    lastName: true,
    phoneNumber: true,
    email: true,
    notes: true,
});

const updateContactSchema = baseContactSchema.partial();
const updateContactWithoutNameSchema = z
    .object(contactObj)
    .partial()
    .omit({ name: true });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const subContactObj = (({ name, firstName, ...rest }) => rest)(contactObj); //Quickly clones the contactObj and leaves out the name

const subContactSchema = z
    .object(subContactObj)
    .partial()
    .merge(
        z.object({
            id: z.string(),
            firstName: z
                .string()
                .trim()
                .min(2, errMsg("firstName", "greater", 2))
                .max(35, errMsg("firstName", "less", 35)),
            contactId: z.string(),
        })
    );

const createSubContactSchema = subContactSchema.omit({
    contactId: true,
    id: true,
});
const updateSubContactSchema = subContactSchema
    .omit({ contactId: true, id: true, firstName: true })
    .partial()
    .merge(
        subContactSchema.pick({ contactId: true, id: true, firstName: true })
    );

export const ContactSingleton = {
    contactFormFields: formFields,
    contactSchemas: {
        base: baseContactSchema,
        create: createContactSchema,
        update: updateContactSchema,
        updateWithoutName: updateContactWithoutNameSchema,
    },
    subContactSchema: {
        base: subContactSchema,
        create: createSubContactSchema,
        update: updateSubContactSchema,
    },
};

Object.freeze(ContactSingleton);
