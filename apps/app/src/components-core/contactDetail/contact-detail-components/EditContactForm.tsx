import { ContactSingleton } from "lib/ContactSingleton";
import { useContactDetailUi } from "../useContactDetailUi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContacts } from "hooks/useContacts";
import { contactSchema } from "server/schemas";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
    Button,
    FieldGroup,
    ModalTitle,
    NewInputGroup,
} from "components-common";

import type { FormSections } from "types/index";
import type { ContactSingletonType } from "lib/ContactSingleton";

type FormType = ContactSingletonType["contactSchemas"]["updateWithoutName"];

const { contactFormFields } = ContactSingleton;
const { firstName, lastName, email, phoneNumber, notes } = contactFormFields;

const formSections: FormSections<FormType>[] = [
    [{ field: firstName, required: true }, { field: lastName }],
    [{ field: email }, { field: phoneNumber }],
    [{ field: notes }],
];

export default function EditContactForm() {
    const { modal, resetModal } = useContactDetailUi();
    const router = useRouter();
    const id = router.query.contactId;
    const { update, utils } = useContacts();
    const { mutate: updateContact } = update();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormType>({
        resolver: zodResolver(contactSchema().base.partial()),
        defaultValues:
            modal.form == "contact"
                ? (modal.defaultData as FormType)
                : undefined,
    });

    const onSubmit = handleSubmit(async (data) => {
        if (id) {
            updateContact(
                { ...data, id: id as string },
                {
                    onSuccess: (data) => {
                        utils.getOne.invalidate({ id: data.id });
                        resetModal();
                    },
                }
            );
        }
    });

    return (
        <form onSubmit={onSubmit}>
            <ModalTitle>Edit Primary Info</ModalTitle>
            <div className="mt-4 space-y-1">
                {formSections.map((section, idx) => (
                    <FieldGroup key={idx}>
                        {section.map(({ field, required = false }) => (
                            <NewInputGroup
                                key={field.name}
                                isInvalid={
                                    errors && errors[field.name] ? true : false
                                }
                                isRequired={required}
                            >
                                <NewInputGroup.Label htmlFor={field.name}>
                                    {field.label}
                                </NewInputGroup.Label>
                                {field.name == "notes" ? (
                                    <NewInputGroup.TextArea
                                        rows={5}
                                        placeholder={field.label}
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
            </div>
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
