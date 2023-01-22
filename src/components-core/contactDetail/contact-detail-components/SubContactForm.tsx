import { FieldGroup, NewInputGroup } from "components-common";
import { useContactDetailUi } from "../useContactDetailUi";
import { ModalTitle } from "components-common/ModalTitle";
import { ContactSingleton } from "lib/ContactSingleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubContacts } from "hooks/useSubContacts";
import { Button } from "components-common/Button";
import { useWorkspace } from "hooks/useWorkspace";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import * as React from "react";

import type { FormSections } from "types/index";
import type { ContactSingletonType } from "lib/ContactSingleton";

const { contactFormFields, subContactSchema } = ContactSingleton;
const { firstName, lastName, email, phoneNumber } = contactFormFields;

const formSections: FormSections<
    ContactSingletonType["contactSchemas"]["updateWithoutName"]
>[] = [
    [{ field: firstName, required: true }, { field: lastName }],
    [{ field: email }, { field: phoneNumber }],
];
export default function SubContactForm() {
    const router = useRouter();
    const { modal, resetModal } = useContactDetailUi();
    const [defaultFormState] = React.useState<
        | ContactSingletonType["subContactSchema"]["update"]
        | ContactSingletonType["subContactSchema"]["create"]
        | undefined
    >(
        modal.form == "subContact"
            ? (modal.defaultData as
                  | ContactSingletonType["subContactSchema"]["update"]
                  | ContactSingletonType["subContactSchema"]["create"])
            : undefined
    );

    const {
        update: updateSubContact,
        utils,
        create: createSubContact,
    } = useSubContacts();

    const { id } = useWorkspace();

    const { mutate: updateSubContactMutation } = updateSubContact();
    const { mutate: createSubContactMutation } = createSubContact();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<
        | ContactSingletonType["subContactSchema"]["update"]
        | ContactSingletonType["subContactSchema"]["create"]
    >({
        resolver: zodResolver(
            defaultFormState ? subContactSchema.update : subContactSchema.create
        ),
        defaultValues: defaultFormState,
    });

    const onSubmit = handleSubmit(async (data) => {
        if (defaultFormState && "id" in defaultFormState) {
            updateSubContactMutation(
                {
                    ...data,
                    contactId: defaultFormState.contactId,
                    id: defaultFormState.id,
                },
                {
                    onSuccess: (data) => {
                        utils.getAllForContact
                            .invalidate({
                                contactId: data.contactId,
                            })
                            .then(() => resetModal());
                    },
                }
            );
        }

        if (!defaultFormState && router.query.contactId && id) {
            createSubContactMutation(
                { ...data, contactId: router.query.contactId as string },
                {
                    onSuccess: (data) =>
                        utils.getAllForContact
                            .invalidate({
                                contactId: data.contactId,
                            })
                            .then(() => resetModal()),
                }
            );
        }
    });

    return (
        <form onSubmit={onSubmit}>
            <fieldset>
                <ModalTitle>
                    <legend>
                        {modal.defaultData ? "Edit" : "Add"} Contact
                    </legend>
                </ModalTitle>
                <div className="mt-4 space-y-1">
                    {formSections.map((section, idx) => (
                        <FieldGroup key={idx}>
                            {section.map(({ field, required }) => (
                                <NewInputGroup
                                    key={field.name}
                                    isInvalid={
                                        errors && errors[field.name]
                                            ? true
                                            : false
                                    }
                                    isRequired={required}
                                >
                                    <NewInputGroup.Label htmlFor={field.name}>
                                        {field.label}
                                    </NewInputGroup.Label>
                                    <NewInputGroup.Input
                                        placeholder={field.label}
                                        {...register(field.name)}
                                    />
                                    <NewInputGroup.Error>
                                        {errors &&
                                            errors[field.name] &&
                                            errors[field.name]?.message}
                                    </NewInputGroup.Error>
                                </NewInputGroup>
                            ))}
                        </FieldGroup>
                    ))}
                </div>
            </fieldset>
            <div className="mt-8 flex justify-end space-x-3">
                <Button variant="outlined" onClick={resetModal}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </div>
        </form>
    );
}
