import { ContactSingleton, ContactSingletonType } from "lib/ContactSingleton";
import { useContactDetailUi } from "../useContactDetailUi";
import { InputGroup } from "components-common/InputGroup";
import { ModalTitle } from "components-common/ModalTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubContacts } from "hooks/useSubContacts";
import { Button } from "components-common/Button";
import { useWorkspace } from "hooks/useWorkspace";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import * as React from "react";

const { contactFormFields, subContactSchema } = ContactSingleton;

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
            <ModalTitle>
                {modal.defaultData ? "Edit" : "Add"} Contact
            </ModalTitle>
            <div className="mt-6 grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-4 md:gap-y-0">
                <InputGroup
                    direction="column"
                    required
                    label={contactFormFields.firstName.label}
                    {...register("firstName")}
                    errorMessage={
                        errors && errors.firstName && errors.firstName.message
                    }
                />
                <InputGroup
                    direction="column"
                    label={contactFormFields.lastName.label}
                    {...register("lastName")}
                    errorMessage={
                        errors && errors.lastName && errors.lastName.message
                    }
                />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-4 md:gap-y-0">
                <InputGroup
                    direction="column"
                    label={contactFormFields.email.label}
                    {...register("email")}
                    errorMessage={
                        errors && errors.email && errors.email.message
                    }
                />
                <InputGroup
                    direction="column"
                    label={contactFormFields.phoneNumber.label}
                    {...register("phoneNumber")}
                    errorMessage={
                        errors &&
                        errors.phoneNumber &&
                        errors.phoneNumber.message
                    }
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
