import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components-common/Button";
import { InputGroup } from "components-common/InputGroup";
import { Modal } from "components-common/Modal";
import { ContactFormTextArea } from "components-core/create-contact/create-contact-components";
import { useForm } from "react-hook-form";
import { useContactDetailUi } from "../useContactDetailUi";
import * as React from "react";
import { ContactMetaSchema, ContactSchema } from "server/schemas";
import { useContacts } from "hooks/useContacts";
import { useWorkspace } from "hooks/useWorkspace";
import { useRouter } from "next/router";
import { useContactMeta } from "hooks/useContactMeta";

export const ContactDetailOverviewModal = () => {
    const { modal, setModal } = useContactDetailUi();

    return (
        <Modal
            open={modal.state || false}
            onClose={() => setModal({ state: false })}
        >
            {modal?.form && modal.form == "contactMeta" ? (
                <ContactMetaForm />
            ) : (
                <EditContactForm />
            )}
        </Modal>
    );
};

const EditContactForm = () => {
    const { modal, setModal } = useContactDetailUi();
    const router = useRouter();
    const id = router.query.contactId;
    const { update, utils } = useContacts();
    const { mutate: updateContact } = update();

    const { register, handleSubmit } = useForm<ContactSchema["base"]>({
        resolver: zodResolver(ContactSchema().base),
        defaultValues:
            modal.form == "contact"
                ? (modal.defaultData as ContactSchema["base"])
                : undefined,
    });

    const onSubmit = handleSubmit(async (data) => {
        if (id) {
            updateContact(
                { ...data, id: id as string },
                {
                    onSuccess: (data) => {
                        utils.getOne.invalidate({ id: data.id });
                        setModal({ state: false });
                    },
                }
            );
        }
    });

    React.useEffect(() => {
        return () => setModal({ defaultData: undefined });
    }, [modal.state]);

    return (
        <form onSubmit={onSubmit}>
            <h3 className="text-sm font-medium leading-6">Edit General Info</h3>
            <InputGroup
                label="Display Name"
                {...register("displayName")}
                direction="row"
            />
            <ContactFormTextArea label="Notes" {...register("notes")} />

            <div className="mt-6 flex justify-end space-x-3">
                <Button
                    variant="outlined"
                    onClick={() => setModal({ state: false })}
                >
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </div>
        </form>
    );
};

const ContactMetaForm = () => {
    const router = useRouter();
    const { modal, setModal } = useContactDetailUi();
    const [defaultFormState] = React.useState<
        ContactMetaSchema["update"] | ContactMetaSchema["create"] | undefined
    >(
        modal.form == "contactMeta"
            ? (modal.defaultData as
                  | ContactMetaSchema["create"]
                  | ContactMetaSchema["update"])
            : undefined
    );

    const { updateMeta, utils, createMeta } = useContactMeta();

    const { id } = useWorkspace();

    const { mutate: updateMetaMutation } = updateMeta();
    const { mutate: createMetaMutation } = createMeta();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ContactMetaSchema["update"] | ContactMetaSchema["create"]>({
        resolver: zodResolver(
            defaultFormState
                ? ContactMetaSchema().update
                : ContactMetaSchema().create.omit({ contactId: true })
        ),
        defaultValues: defaultFormState,
    });

    const onSubmit = handleSubmit(async (data) => {
        if (defaultFormState && "id" in defaultFormState) {
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
                            .then(() => setModal({ state: false }));
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
                            .then(() => setModal({ state: false })),
                }
            );
        }
    });
    React.useEffect(() => {
        return () => setModal({ defaultData: undefined });
    }, [modal.state]);

    return (
        <form onSubmit={onSubmit}>
            <h3 className="font-medium leading-6">
                {modal.defaultData ? "Edit" : "Add"} Contact
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
                <Button
                    variant="outlined"
                    onClick={() => setModal({ state: false })}
                >
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </div>
        </form>
    );
};
