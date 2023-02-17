import { paginationSchema } from "server/schemas/pagination";
import { z } from "zod";

export type ContactSingletonType = {
    contactFormFields: typeof formFields;
    contactSchemas: {
        base: z.infer<typeof baseContactSchema>;
        create: z.infer<typeof createContactSchema>;
        update: z.infer<typeof updateContactSchema>;
        updateWithoutName: z.infer<typeof updateContactWithoutNameSchema>;
        search: z.infer<typeof contactSearchSchema>;
        sort: z.infer<typeof contactSortSchema>;
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

// Sort and filter options

const contactSortFields = z
    .enum(["name", "createdAt", "updatedAt", "appointmentsMeta", "profiles"])
    .optional();

const contactSortOrder = z.enum(["asc", "desc"]).optional();

const contactSortSchema = z.object({
    field: contactSortFields,
    order: contactSortOrder,
});

const contactSearchSchema = z
    .object({
        searchBy: z.enum([
            "name",
            "email",
            "phoneNumber",
            "subContacts",
            "firstName",
            "lastName",
        ]),
        searchQuery: z.string().optional(),
        profileFilters: z.object({
            AGENT: z.boolean(),
            BUYER: z.boolean(),
            SELLER: z.boolean(),
            RENTER: z.boolean(),
            RENTEE: z.boolean(),
            VENDOR: z.boolean(),
            OTHER: z.boolean(),
        }),
        sortBy: contactSortFields,
        sortOrder: contactSortOrder,
    })
    .merge(paginationSchema);

const formFields = {
    name: { name: "name", label: "Display Name" },
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
    notes: z
        .string()
        .trim()
        .max(2000, errMsg("notes", "less", 2000))
        .optional(),
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
        sort: contactSortSchema,
        search: contactSearchSchema,
    },
    subContactSchema: {
        base: subContactSchema,
        create: createSubContactSchema,
        update: updateSubContactSchema,
    },
};

Object.freeze(ContactSingleton);
