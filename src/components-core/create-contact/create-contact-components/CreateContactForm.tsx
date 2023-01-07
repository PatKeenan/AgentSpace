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
import { subContactSchema, contactSchema } from "server/schemas";
import { useContacts } from "hooks/useContacts";
import { useWorkspace } from "hooks/useWorkspace";
import { useRouter } from "next/router";

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
    fields: [],
};

const createContactFormSchema = contactSchema().create.extend({
    fields: z.array(subContactSchema().create.omit({ contactId: true })),
});

type CreateContactFormType = z.infer<typeof createContactFormSchema>;

export const CreateContactForm = () => {
    const [subContactFields, setMetaFields] = React.useState<
        CreateContactFormType["fields"]
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
        const { fields, ...rest } = data;
        createContact.mutate(
            {
                ...rest,
                workspaceId: workspace.id as string,
                contactMeta: fields,
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
        const fields = getValues("fields");
        const newFields = [...fields, { ...initialMeta }];
        setValue("fields", newFields);
        setMetaFields((prev) => [...prev, { ...initialMeta }]);
    };

    const removeField = (index: number) => {
        const fields = [...getValues("fields")];
        fields.splice(index, 1);
        setValue("fields", fields);
        if (errors && errors.fields) {
            removeErrors(index);
        }
        setMetaFields(fields);
    };

    const removeErrors = (index: number) => {
        if (errors.fields && errors.fields.length) {
            const oldFields = errors.fields as Partial<
                CreateContactFormType["fields"]
            >;
            oldFields.splice(index, 1);
            setError("fields", oldFields as typeof errors.fields);
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
                    <div className="">
                        <ContactFormInput
                            required
                            label="Full Name"
                            className="max-w-lg"
                            {...register("name")}
                            errorMessage={
                                errors["name"] && errors["name"].message
                            }
                        />

                        <ContactFormInput
                            label="First Name"
                            className="max-w-xs "
                            {...register("firstName")}
                            errorMessage={
                                errors["firstName"] &&
                                errors["firstName"].message
                            }
                        />
                        <ContactFormInput
                            label="Last Name"
                            className="max-w-xs"
                            {...register("firstName")}
                            errorMessage={
                                errors["lastName"] && errors["lastName"].message
                            }
                        />
                        <ContactFormInput
                            label="Email"
                            {...register(`email`, {
                                required: false,
                            })}
                            type="email"
                            className="max-w-lg"
                            errorMessage={
                                errors["email"] && errors["email"].message
                            }
                        />
                        <ContactFormInput
                            label="Phone Number"
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
                            label="Notes"
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
                    <div className="">
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
                            errors.fields && errors?.fields[idx] ? (
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
                        <div className="">
                            <ContactFormInput
                                label="First Name"
                                {...register(`fields.${idx}.firstName`)}
                                className="max-w-xs"
                                required
                                errorMessage={
                                    errors.fields &&
                                    errors.fields[idx]?.firstName &&
                                    errors.fields[idx]?.firstName?.message
                                }
                            />
                            <ContactFormInput
                                label="Last Name"
                                {...register(`fields.${idx}.lastName`)}
                                className="max-w-xs"
                                errorMessage={
                                    errors.fields &&
                                    errors.fields[idx]?.lastName &&
                                    errors.fields[idx]?.lastName?.message
                                }
                            />
                            <ContactFormInput
                                label="Email"
                                {...register(`fields.${idx}.email`, {
                                    required: false,
                                })}
                                type="email"
                                className="max-w-lg"
                                errorMessage={
                                    errors.fields &&
                                    errors.fields[idx]?.email &&
                                    errors.fields[idx]?.email?.message
                                }
                            />
                            <ContactFormInput
                                label="Phone Number"
                                {...register(`fields.${idx}.phoneNumber`)}
                                type="tel"
                                className="max-w-xs"
                                errorMessage={
                                    errors.fields &&
                                    errors.fields[idx]?.phoneNumber &&
                                    errors.fields[idx]?.phoneNumber?.message
                                }
                            />
                            <ContactFormTextArea
                                label="Notes"
                                className="max-w-lg"
                                {...register(`fields.${idx}.note`)}
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
