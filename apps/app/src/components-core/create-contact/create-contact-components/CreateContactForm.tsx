import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import { Accordion } from "components-common/Accordion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonLink } from "components-common/Button";
import { useForm } from "react-hook-form";
import * as React from "react";
import * as z from "zod";
import { useContacts } from "hooks/useContacts";
import { useWorkspace } from "hooks/useWorkspace";
import { useRouter } from "next/router";
import { ContactSingleton } from "lib/ContactSingleton";
import { FormSections } from "types/index";
import { FieldGroup } from "components-common/FieldGroup";
import { NewInputGroup } from "components-common/NewInputGroup";
import { toast } from "react-toastify";

const { contactFormFields, contactSchemas, subContactSchema } =
    ContactSingleton;

const { email, firstName, lastName, phoneNumber, notes, name } =
    contactFormFields;

const initialMeta = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    note: "",
};

const initialState = {
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    notes: "",
    subContactFields: [],
};

const createContactFormSchema = contactSchemas.create.extend({
    subContactFields: z.array(subContactSchema.create),
});

type CreateContactFormType = z.infer<typeof createContactFormSchema>;

const generalInfoFromSections: FormSections<CreateContactFormType>[] = [
    [{ field: name, required: true }],
];
const formSections: FormSections<CreateContactFormType>[] = [
    [{ field: firstName, required: true }, { field: lastName }],
    [{ field: email }, { field: phoneNumber }],
    [{ field: notes }],
];

const subFormSections: FormSections<
    Pick<
        CreateContactFormType,
        "firstName" | "lastName" | "email" | "notes" | "phoneNumber"
    >
>[] = [
    [{ field: firstName, required: true }, { field: lastName }],
    [{ field: email }, { field: phoneNumber }],
    /*     [{ field: notes }], */
];

export const CreateContactForm = () => {
    const [subContactFields, setMetaFields] = React.useState<
        CreateContactFormType["subContactFields"]
    >([]);
    const workspace = useWorkspace();
    const contacts = useContacts();
    const router = useRouter();

    const createContact = contacts.createContact();

    const {
        register,
        getValues,
        setValue,
        setError,
        reset,
        handleSubmit: formSubmit,
        formState: { errors },
    } = useForm<CreateContactFormType>({
        defaultValues: initialState,
        resolver: zodResolver(createContactFormSchema),
    });

    const handleAddAnother = formSubmit(async (data) => {
        const { subContactFields, ...rest } = data;
        createContact.mutate(
            {
                ...rest,
                workspaceId: workspace.id as string,
                subContacts: subContactFields,
            },
            {
                onSuccess: (data) => {
                    toast("Successfully added contact", { type: "success" });
                    reset();
                },
            }
        );
    });

    const handleSubmit = formSubmit(async (data) => {
        const { subContactFields, ...rest } = data;
        createContact.mutate(
            {
                ...rest,
                workspaceId: workspace.id as string,
                subContacts: subContactFields,
            },
            {
                onSuccess: (data) =>
                    router.push(
                        `/workspace/${data.workspaceId}/contacts/${data.id}`
                    ),
            }
        );
    });

    const addFields = () => {
        const subContactFields = getValues("subContactFields");
        const newFields = [...subContactFields, { ...initialMeta }];
        setValue("subContactFields", newFields);
        setMetaFields((prev) => [...prev, { ...initialMeta }]);
    };

    const removeField = (index: number) => {
        const subContactFields = [...getValues("subContactFields")];
        subContactFields.splice(index, 1);
        setValue("subContactFields", subContactFields);
        if (errors && errors.subContactFields) {
            removeErrors(index);
        }
        setMetaFields(subContactFields);
    };

    const removeErrors = (index: number) => {
        if (errors.subContactFields && errors.subContactFields.length) {
            const oldFields = errors.subContactFields as Partial<
                CreateContactFormType["subContactFields"]
            >;
            oldFields.splice(index, 1);
            setError(
                "subContactFields",
                oldFields as typeof errors.subContactFields
            );
        }
    };

    return (
        <form
            className="mt-8 space-y-8 divide-y divide-gray-200"
            onSubmit={handleSubmit}
        >
            <div className="divide-y">
                <Accordion
                    defaultOpen={true}
                    label="General Information"
                    description="Information for your primary and secondary contact(s)."
                    titleContainer={
                        errors["name"] ? (
                            <ExclamationCircleIcon
                                className="h-5 w-5 text-red-500"
                                aria-hidden="true"
                            />
                        ) : null
                    }
                    className="pb-6"
                >
                    {generalInfoFromSections.map((section, idx) => (
                        <FieldGroup key={idx} className="lg:max-w-3xl">
                            {section.map(({ field, required }) => (
                                <NewInputGroup
                                    key={field.name}
                                    hasHelpText
                                    isRequired={required}
                                    isInvalid={
                                        errors && errors[field.name]
                                            ? true
                                            : false
                                    }
                                >
                                    <NewInputGroup.Label htmlFor={field.name}>
                                        {field.label}
                                    </NewInputGroup.Label>

                                    {field.name == "notes" ? (
                                        <NewInputGroup.TextArea
                                            placeholder={field.label}
                                            rows={5}
                                            {...register(field.name)}
                                        />
                                    ) : (
                                        <NewInputGroup.Input
                                            placeholder={field.label}
                                            {...register(field.name)}
                                        />
                                    )}
                                    <NewInputGroup.HelpText>
                                        How this contact will be identified
                                        within your workspace.
                                    </NewInputGroup.HelpText>

                                    <NewInputGroup.Error>
                                        {errors &&
                                            errors[field.name] &&
                                            errors[field.name]?.message}
                                    </NewInputGroup.Error>
                                </NewInputGroup>
                            ))}
                        </FieldGroup>
                    ))}
                </Accordion>
                <Accordion
                    defaultOpen={true}
                    label="Primary Contact Information"
                    description="Include full name, email address, phone number, and any other relevant information."
                    titleContainer={
                        errors["name"] ? (
                            <ExclamationCircleIcon
                                className="h-5 w-5 text-red-500"
                                aria-hidden="true"
                            />
                        ) : null
                    }
                    className={"pt-6"}
                >
                    {formSections.map((section, idx) => (
                        <FieldGroup key={idx} className="lg:max-w-3xl">
                            {section.map(({ field, required }) => (
                                <NewInputGroup
                                    key={field.name}
                                    isRequired={required}
                                    isInvalid={
                                        errors && errors[field.name]
                                            ? true
                                            : false
                                    }
                                >
                                    <NewInputGroup.Label htmlFor={field.name}>
                                        {field.label}
                                    </NewInputGroup.Label>

                                    {field.name == "notes" ? (
                                        <NewInputGroup.TextArea
                                            placeholder={field.label}
                                            rows={5}
                                            {...register(field.name)}
                                        />
                                    ) : (
                                        <NewInputGroup.Input
                                            placeholder={field.label}
                                            {...register(field.name)}
                                        />
                                    )}

                                    <NewInputGroup.Error>
                                        {errors &&
                                            errors[field.name] &&
                                            errors[field.name]?.message}
                                    </NewInputGroup.Error>
                                </NewInputGroup>
                            ))}
                        </FieldGroup>
                    ))}
                </Accordion>
            </div>

            <div className="divide-y divide-gray-200">
                {subContactFields?.map((_, idx) => (
                    <Accordion
                        defaultOpen={true}
                        key={idx}
                        label={
                            idx == 0
                                ? "Secondary Contact"
                                : `Additional Contact #${idx}`
                        }
                        className="py-6"
                        description={
                            idx == 0
                                ? "Include full name, email address, phone number, and any other relevant information."
                                : ""
                        }
                        titleContainer={
                            errors.subContactFields &&
                            errors?.subContactFields[idx] ? (
                                <ExclamationCircleIcon
                                    className="h-5 w-5 text-red-500"
                                    aria-hidden="true"
                                />
                            ) : null
                        }
                        toggleContainer={
                            <button
                                type="button"
                                className="group inline-flex items-center rounded-full border border-transparent text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => removeField(idx)}
                            >
                                <span className="sr-only">Remove Contact</span>
                                <MinusCircleIcon
                                    className="h-5 w-5 rounded-full bg-white text-gray-500 group-hover:bg-gray-600 group-hover:text-white"
                                    aria-hidden="true"
                                />
                            </button>
                        }
                    >
                        {subFormSections.map((section, subContactidx) => (
                            <FieldGroup
                                key={subContactidx}
                                className="lg:max-w-3xl"
                            >
                                {section.map(({ field, required }) => (
                                    <NewInputGroup
                                        key={field.name}
                                        isRequired={required}
                                        isInvalid={
                                            errors.subContactFields &&
                                            errors.subContactFields[idx]?.[
                                                `${field.name}`
                                            ]
                                                ? true
                                                : false
                                        }
                                    >
                                        <NewInputGroup.Label
                                            htmlFor={field.name}
                                        >
                                            {field.label}
                                        </NewInputGroup.Label>

                                        {field.name == "notes" ? (
                                            <NewInputGroup.TextArea
                                                placeholder={field.label}
                                                rows={5}
                                                {...register(
                                                    `subContactFields.${idx}.${field.name}`
                                                )}
                                            />
                                        ) : (
                                            <NewInputGroup.Input
                                                placeholder={field.label}
                                                {...register(
                                                    `subContactFields.${idx}.${field.name}`
                                                )}
                                            />
                                        )}
                                        <NewInputGroup.Error>
                                            {errors.subContactFields &&
                                                errors.subContactFields[idx]?.[
                                                    `${field.name}`
                                                ] &&
                                                errors.subContactFields[idx]?.[
                                                    `${field.name}`
                                                ]?.message}
                                        </NewInputGroup.Error>
                                    </NewInputGroup>
                                ))}
                            </FieldGroup>
                        ))}
                    </Accordion>
                ))}

                <div className="mb-2 pt-4">
                    <Button
                        variant="outlined"
                        className="my-2 w-full justify-center"
                        onClick={addFields}
                    >
                        Add{" "}
                        {subContactFields.length == 0
                            ? "Secondary"
                            : "Additional"}{" "}
                        Contact
                    </Button>
                </div>
            </div>

            <div className="pt-5">
                <div className="flex justify-between">
                    <ButtonLink
                        href={`/workspace/${workspace.id}/contacts`}
                        variant="outlined"
                    >
                        Cancel
                    </ButtonLink>
                    <div className="flex space-x-4">
                        <Button
                            variant="outlined"
                            type="button"
                            onClick={handleAddAnother}
                        >
                            Save and Add Another
                        </Button>
                        <Button variant="primary" type="submit">
                            Save and Continue
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};
