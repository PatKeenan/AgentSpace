import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import { ContactFormTextArea } from "./ContactFormTextArea";
import { Accordion } from "components-common/Accordion";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormInput } from "./ContactFormInput";
import { Button, ButtonLink } from "components-common/Button";
import { useForm } from "react-hook-form";
import * as React from "react";
import * as z from "zod";
import { useContacts } from "hooks/useContacts";
import { useWorkspace } from "hooks/useWorkspace";
import { useRouter } from "next/router";
import { ContactSingleton } from "lib/ContactSingleton";

const { contactFormFields, contactSchemas, subContactSchema } =
    ContactSingleton;

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
        handleSubmit: formSubmit,
        formState: { errors },
    } = useForm<CreateContactFormType>({
        defaultValues: initialState,
        resolver: zodResolver(createContactFormSchema),
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
            <div>
                <Accordion
                    defaultOpen={true}
                    label="General Information"
                    description="This information will be
                                                displayed publicly so be careful
                                                what you share."
                    titleContainer={
                        errors["name"] ? (
                            <ExclamationCircleIcon
                                className="h-5 w-5 text-red-500"
                                aria-hidden="true"
                            />
                        ) : null
                    }
                >
                    <div className="space-y-6">
                        <ContactFormInput
                            label={contactFormFields.name.label}
                            required
                            className="max-w-lg"
                            {...register("name")}
                            errorMessage={
                                errors["name"] && errors["name"].message
                            }
                        />
                        <ContactFormInput
                            label={contactFormFields.firstName.label}
                            required
                            className="max-w-xs "
                            {...register("firstName")}
                            errorMessage={
                                errors["firstName"] &&
                                errors["firstName"].message
                            }
                        />
                        <ContactFormInput
                            label={contactFormFields.lastName.label}
                            className="max-w-xs"
                            {...register("lastName")}
                            errorMessage={
                                errors["lastName"] && errors["lastName"].message
                            }
                        />

                        <ContactFormInput
                            label={contactFormFields.email.label}
                            {...register(`email`, {
                                required: false,
                            })}
                            className="max-w-lg"
                            errorMessage={
                                errors["email"] && errors["email"].message
                            }
                        />

                        <ContactFormInput
                            label={contactFormFields.phoneNumber.label}
                            {...register(`phoneNumber`)}
                            type="tel"
                            className="max-w-xs"
                            errorMessage={
                                errors["phoneNumber"] &&
                                errors["phoneNumber"].message
                            }
                        />

                        {/* <ContactFormInput
                            label="Tags"
                            name="tags"
                            className="max-w-xs"
                        /> */}

                        <ContactFormTextArea
                            label={contactFormFields.notes.label}
                            className="max-w-lg"
                            {...register("notes")}
                            rows={3}
                        />
                    </div>
                </Accordion>
            </div>
            <div>
                <Accordion
                    defaultOpen={true}
                    label="Mailing Address"
                    description="Use a permanent address where you can
                                    receive mail."
                    className={"pt-6"}
                >
                    <div className="space-y-6">
                        <ContactFormInput
                            label="Street address"
                            name="streetAddress"
                            className="max-w-sm"
                        />
                        <ContactFormInput
                            label="City"
                            name="city"
                            className="max-w-sm"
                        />
                        <ContactFormInput
                            label="State"
                            name="state"
                            className="max-w-[15rem]"
                        />
                        <ContactFormInput
                            label="Zip / Postal code"
                            name="zip"
                            className="max-w-[10rem]"
                        />
                    </div>
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
                                : `Additional Contact ${idx + 1}`
                        }
                        className="py-6"
                        description={
                            idx == 0
                                ? "This information will be used for communication and scheduling."
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
                        <div className="space-y-6">
                            <ContactFormInput
                                label={contactFormFields.firstName.label}
                                {...register(
                                    `subContactFields.${idx}.firstName`
                                )}
                                className="max-w-xs"
                                required
                                errorMessage={
                                    errors.subContactFields &&
                                    errors.subContactFields[idx]?.firstName &&
                                    errors.subContactFields[idx]?.firstName
                                        ?.message
                                }
                            />
                            <ContactFormInput
                                label={contactFormFields.lastName.label}
                                {...register(
                                    `subContactFields.${idx}.lastName`
                                )}
                                className="max-w-xs"
                                errorMessage={
                                    errors.subContactFields &&
                                    errors.subContactFields[idx]?.lastName &&
                                    errors.subContactFields[idx]?.lastName
                                        ?.message
                                }
                            />
                            <ContactFormInput
                                label={contactFormFields.email.label}
                                {...register(`subContactFields.${idx}.email`, {
                                    required: false,
                                })}
                                className="max-w-lg"
                                errorMessage={
                                    errors.subContactFields &&
                                    errors.subContactFields[idx]?.email &&
                                    errors.subContactFields[idx]?.email?.message
                                }
                            />
                            <ContactFormInput
                                label={contactFormFields.phoneNumber.label}
                                {...register(
                                    `subContactFields.${idx}.phoneNumber`
                                )}
                                type="tel"
                                className="max-w-xs"
                                errorMessage={
                                    errors.subContactFields &&
                                    errors.subContactFields[idx]?.phoneNumber &&
                                    errors.subContactFields[idx]?.phoneNumber
                                        ?.message
                                }
                            />
                            <ContactFormTextArea
                                label={contactFormFields.notes.label}
                                className="max-w-lg"
                                {...register(`subContactFields.${idx}.notes`)}
                                rows={3}
                            />
                        </div>
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
                <div className="flex justify-end space-x-4">
                    <ButtonLink
                        href={`/workspace/${workspace.id}/contacts`}
                        variant="outlined"
                    >
                        Cancel
                    </ButtonLink>
                    <Button variant="primary" type="submit">
                        Save Contact
                    </Button>
                </div>
            </div>
        </form>
    );
};
