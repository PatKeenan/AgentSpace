import { zodResolver } from "@hookform/resolvers/zod";
import { ContactMeta } from "@prisma/client";
import { Button } from "components-common/Button";
import { InputGroup } from "components-common/InputGroup";
import { Modal } from "components-common/Modal";
import { ContactFormTextArea } from "components-core/create-contact/create-contact-components";
import { useForm } from "react-hook-form";
import { useContactDetailUi } from "../useContactDetailUi";
import * as React from "react";
import { Schemas } from "server/schemas";
import { useContacts } from "hooks/useContacts";

export const ContactDetailOverviewModal = () => {
    const { modalOpen, setModalOpen, setDefaultModalData } =
        useContactDetailUi();

    return (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <ContactMetaForm />
        </Modal>
    );
};

const EditContactForm = () => {
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

const ContactMetaForm = () => {
    const { setModalOpen, defaultModalData, setDefaultModalData, modalOpen } =
        useContactDetailUi();

    const { updateMeta } = useContacts();
    const { mutate } = updateMeta();
    const { register, handleSubmit } = useForm<Partial<ContactMeta>>({
        resolver: zodResolver(Schemas.contact().create.meta),
        defaultValues: defaultModalData,
    });

    React.useEffect(() => {
        return () => setDefaultModalData(undefined);
    }, [modalOpen]);

    const onSubmit = handleSubmit(async (data) => {
        if (
            defaultModalData &&
            defaultModalData.id &&
            defaultModalData.contactId
        ) {
            /*  mutate({
                ...data,
                contactId: defaultModalData.contactId as string,
                id: defaultModalData.id as string,
            }); */
        }
    });

    return (
        <form onSubmit={onSubmit}>
            <h3 className="text-sm font-medium leading-6">
                {defaultModalData ? "Edit" : "Add"} Contact
            </h3>
            {/* 
            <InputGroup label="First Name" {...register("firstName")} />
            <InputGroup label="Last Name" {...register("lastName")} />
            <InputGroup label="Email" {...register("email")} />
            <InputGroup label="Phone" {...register("phoneNumber")} /> */}
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
