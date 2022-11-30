import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components-common/Button";
import { InputGroup } from "components-common/InputGroup";
import { Modal } from "components-common/Modal";
import { ContactFormTextArea } from "components-core/create-contact/create-contact-components";
import { useForm } from "react-hook-form";
import { useContactDetailUi } from "../useContactDetailUi";
import * as React from "react";
import { ContactMetaSchema } from "server/schemas";
import { useContacts } from "hooks/useContacts";
import { useWorkspace } from "hooks/useWorkspace";
import { router } from "@trpc/server";
import { exists } from "utils/helpers";
import { useRouter } from "next/router";
import { useContactMeta } from "hooks/useContactMeta";

export const ContactDetailOverviewModal = () => {
    const { modalOpen, setModalOpen, setDefaultModalData } =
        useContactDetailUi();

    return (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <ContactMetaForm />
        </Modal>
    );
};

/* const EditContactForm = () => {
    const { setModalOpen } = useContactDetailUi();
    return (
        <form>
            <h3 className="text-sm font-medium leading-6">Edit General Info</h3>
            <InputGroup
                label="Display Name"
                name="displayName"
                direction="row"
            />
            <ContactFormTextArea label="Notes" name="notes" />

            <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outlined" onClick={() => setModalOpen(false)}>
                    Cancel
                </Button>
                <Button variant="primary">Save</Button>
            </div>
        </form>
    );
};
 */
const ContactMetaForm = () => {
    const router = useRouter();
    const { setModalOpen, defaultModalData, setDefaultModalData, modalOpen } =
        useContactDetailUi();
    const [defaultFormState, setDefaultFormState] =
        React.useState(defaultModalData);

    const { updateMeta, utils, createMeta } = useContactMeta();

    const { id } = useWorkspace();

    const { mutate: updateMetaMutation } = updateMeta();
    const { mutate: createMetaMutation } = createMeta();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ContactMetaSchema["create"] | ContactMetaSchema["update"]>({
        resolver: zodResolver(
            defaultFormState
                ? ContactMetaSchema().update
                : ContactMetaSchema().create.omit({ contactId: true })
        ),
        defaultValues: defaultFormState,
    });

    const onSubmit = handleSubmit(async (data) => {
        if (defaultFormState) {
            updateMetaMutation(
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
                            .then(() => setModalOpen(false));
                    },
                }
            );
        }

        if (!defaultFormState && router.query.contactId && id) {
            createMetaMutation(
                { ...data, contactId: router.query.contactId as string },
                {
                    onSuccess: (data) =>
                        utils.getAllForContact
                            .invalidate({
                                contactId: data.contactId,
                            })
                            .then(() => setModalOpen(false)),
                }
            );
        }
    });
    React.useEffect(() => {
        return () => setDefaultModalData(undefined);
    }, [modalOpen]);

    return (
        <form onSubmit={onSubmit}>
            <h3 className="font-medium leading-6">
                {defaultModalData ? "Edit" : "Add"} Contact
            </h3>

            <InputGroup
                required
                label="First Name"
                {...register("firstName")}
                errorMessage={
                    errors && errors.firstName && errors.firstName.message
                }
            />
            <InputGroup
                label="Last Name"
                {...register("lastName")}
                className="mt-1"
                errorMessage={
                    errors && errors.lastName && errors.lastName.message
                }
            />
            <InputGroup
                label="Email"
                {...register("email")}
                className="mt-1"
                errorMessage={errors && errors.email && errors.email.message}
            />
            <InputGroup
                label="Phone"
                {...register("phoneNumber")}
                className="mt-1"
                errorMessage={
                    errors && errors.phoneNumber && errors.phoneNumber.message
                }
            />
            <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outlined" onClick={() => setModalOpen(false)}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </div>
        </form>
    );
};
