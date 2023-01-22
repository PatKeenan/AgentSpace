import { ContactSingleton, ContactSingletonType } from "lib/ContactSingleton";
import { useContactDetailUi } from "../useContactDetailUi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContacts } from "hooks/useContacts";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
    NewInputGroup,
    FieldGroup,
    Button,
    ModalTitle,
} from "components-common";

import type { FormSections } from "types/index";

type FormType = Pick<ContactSingletonType["contactSchemas"]["base"], "name">;

const { contactFormFields } = ContactSingleton;
const { name, firstName } = contactFormFields;

const formSections: FormSections<FormType>[] = [
    [{ field: name, required: true }],
];

export default function EditGeneralInfoForm() {
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
        resolver: zodResolver(
            ContactSingleton.contactSchemas.update.pick({ name: true })
        ),
        defaultValues:
            modal.form == "generalInfo"
                ? (modal.defaultData as FormType)
                : undefined,
    });

    const onSubmit = handleSubmit(async (data) => {
        if (id) {
            updateContact(
                { ...data, id: id as string },
                {
                    onSuccess: (data) => {
                        utils.getName.invalidate({ id: data.id });
                        resetModal();
                    },
                }
            );
        }
    });

    return (
        <form onSubmit={onSubmit}>
            <fieldset>
                <ModalTitle>
                    <legend>Edit General Info</legend>
                </ModalTitle>

                <div className="mt-4 space-y-1">
                    {formSections.map((section, idx) => (
                        <FieldGroup key={idx}>
                            {section.map(({ field, required = false }) => (
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
                <div className="mt-8 flex justify-end space-x-3">
                    <Button variant="outlined" onClick={resetModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                </div>
            </fieldset>
        </form>
    );
}
