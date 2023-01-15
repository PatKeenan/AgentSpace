import { ContactSingleton, ContactSingletonType } from "lib/ContactSingleton";
import { InputGroup } from "components-common/InputGroup";
import { useContactDetailUi } from "../useContactDetailUi";
import { ModalTitle } from "components-common/ModalTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "components-common/Textarea";
import { Button } from "components-common/Button";
import { useContacts } from "hooks/useContacts";
import { contactSchema } from "server/schemas";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

const { contactFormFields } = ContactSingleton;

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
    } = useForm<ContactSingletonType["contactSchemas"]["updateWithoutName"]>({
        resolver: zodResolver(contactSchema().base.partial()),
        defaultValues:
            modal.form == "contact"
                ? (modal.defaultData as ContactSingletonType["contactSchemas"]["updateWithoutName"])
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
            <div className="mt-6 grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-4 md:gap-y-0">
                <InputGroup
                    label={contactFormFields.firstName.label}
                    {...register("firstName")}
                    direction="column"
                    errorMessage={
                        errors && errors.firstName && errors.firstName.message
                    }
                />
                <InputGroup
                    label={contactFormFields.lastName.label}
                    {...register("lastName")}
                    direction="column"
                    errorMessage={
                        errors && errors.lastName && errors.lastName.message
                    }
                />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-4 md:gap-y-0">
                <InputGroup
                    label={contactFormFields.email.label}
                    {...register("email")}
                    direction="column"
                    errorMessage={
                        errors && errors.email && errors.email.message
                    }
                />
                <InputGroup
                    label={contactFormFields.phoneNumber.label}
                    {...register("phoneNumber")}
                    direction="column"
                    errorMessage={
                        errors &&
                        errors.phoneNumber &&
                        errors.phoneNumber.message
                    }
                />
            </div>
            <div className="mt-4">
                <Textarea
                    id="contact-notes"
                    label={contactFormFields.notes.label}
                    {...register("notes")}
                    direction="column"
                />
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
