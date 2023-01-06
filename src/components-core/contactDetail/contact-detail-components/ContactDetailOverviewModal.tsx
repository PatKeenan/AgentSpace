import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components-common/Button";
import { InputGroup } from "components-common/InputGroup";
import { Modal } from "components-common/Modal";
import { ContactFormTextArea } from "components-core/create-contact/create-contact-components";
import { Controller, useForm } from "react-hook-form";
import {
    DefaultProfileDataType,
    useContactDetailUi,
} from "../useContactDetailUi";
import * as React from "react";
import {
    subContactSchema,
    contactSchema,
    profileSchema,
    ProfileSchema,
} from "server/schemas";

import type { SubContactSchema, ContactSchema } from "server/schemas";

import { useContacts } from "hooks/useContacts";
import { useWorkspace } from "hooks/useWorkspace";
import { useRouter } from "next/router";
import { useSubContacts } from "hooks/useSubContacts";
import { useProfile } from "hooks/useProfile";
import { Textarea } from "components-common/Textarea";
import { Select } from "components-common/Select";
import { PROFILE_TYPES } from "@prisma/client";
import { ModalTitle } from "components-common/ModalTitle";
import { SubRouter } from "components-common/SubRouter";

export const ContactDetailOverviewModal = () => {
    const { modal, resetModal } = useContactDetailUi();
    return (
        <Modal
            open={modal.state || false}
            onClose={resetModal}
            showInnerContainer={modal.form !== undefined}
        >
            <SubRouter
                component={<EditContactForm />}
                active={modal?.form == "contact"}
            />
            <SubRouter
                component={<SubContactForm />}
                active={modal?.form == "subContact"}
            />
            <SubRouter
                component={<AddProfileForm />}
                active={modal?.form == "profile"}
            />
        </Modal>
    );
};

const EditContactForm = () => {
    const { modal, resetModal } = useContactDetailUi();
    const router = useRouter();
    const id = router.query.contactId;
    const { update, utils } = useContacts();
    const { mutate: updateContact } = update();

    const { register, handleSubmit } = useForm<ContactSchema["base"]>({
        resolver: zodResolver(contactSchema().base),
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
                        resetModal();
                    },
                }
            );
        }
    });

    return (
        <form onSubmit={onSubmit}>
            <ModalTitle>Edit General Info</ModalTitle>
            <InputGroup
                label="Display Name"
                {...register("name")}
                direction="row"
            />
            <ContactFormTextArea label="Notes" {...register("notes")} />

            <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outlined" onClick={resetModal}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </div>
        </form>
    );
};

const SubContactForm = () => {
    const router = useRouter();
    const { modal, resetModal } = useContactDetailUi();
    const [defaultFormState] = React.useState<
        SubContactSchema["update"] | SubContactSchema["create"] | undefined
    >(
        modal.form == "subContact"
            ? (modal.defaultData as
                  | SubContactSchema["create"]
                  | SubContactSchema["update"])
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
    } = useForm<SubContactSchema["update"] | SubContactSchema["create"]>({
        resolver: zodResolver(
            defaultFormState
                ? subContactSchema().update
                : subContactSchema().create.omit({ contactId: true })
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
                <Button variant="outlined" onClick={resetModal}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </div>
        </form>
    );
};

const AddProfileForm = () => {
    const { resetModal, modal } = useContactDetailUi();
    const { create, utils, update } = useProfile();
    const router = useRouter();

    const [defaultFormState] = React.useState<
        DefaultProfileDataType | undefined
    >(
        modal.form == "profile"
            ? (modal.defaultData as DefaultProfileDataType)
            : undefined
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileSchema["create"]>({
        defaultValues: {
            name: defaultFormState?.name,
            notes: defaultFormState?.notes as string | undefined,
            type: defaultFormState?.type,
            active: defaultFormState?.active == false ? false : true,
        },
        resolver: zodResolver(
            profileSchema().create.pick({
                name: true,
                notes: true,
                active: true,
            })
        ),
    });
    const { mutate } = create();
    const { mutate: updateMutation } = update();
    const onSubmit = handleSubmit(async (data) => {
        const workspaceId = router.query.workspaceId;
        const contactId = router.query.contactId;
        if (!defaultFormState && workspaceId && contactId && selected)
            return mutate(
                {
                    ...data,
                    workspaceId: workspaceId as string,
                    contactId: contactId as string,
                    type: selected.value as PROFILE_TYPES,
                },
                {
                    onSuccess: (data) =>
                        utils.getManyForContact
                            .invalidate({ contactId: data.contactId, take: 5 })
                            .then(() => resetModal()),
                }
            );
        if (defaultFormState && workspaceId && contactId && selected) {
            return updateMutation(
                {
                    id: defaultFormState.id,
                    ...data,
                    type: selected.value as PROFILE_TYPES,
                },
                {
                    onSuccess: (data) =>
                        utils.getManyForContact
                            .invalidate({ contactId: data.contactId, take: 5 })
                            .then(() => resetModal()),
                }
            );
        }
    });

    const generateOptions = () => {
        const data = Object.keys(PROFILE_TYPES).map((i, index) => {
            return {
                id: String(index + 1),
                value: i,
                display: i.toLowerCase(),
            };
        });
        return data;
    };

    const options: {
        id: string;
        value: PROFILE_TYPES[number];
        display: string;
    }[] = generateOptions();

    const [selected, setSelected] = React.useState(
        options.filter((i) => i.value == defaultFormState?.type)[0] ||
            options[0]
    );

    return (
        <form onSubmit={onSubmit}>
            <ModalTitle>
                {modal.defaultData ? "Edit" : "Add"} Profile
            </ModalTitle>
            <InputGroup
                required
                label="Name"
                {...register("name")}
                errorMessage={errors && errors.name && errors.name.message}
            />
            <Select
                options={options}
                label="Type"
                displayField="display"
                direction="row"
                selected={selected}
                setSelected={setSelected}
                className={"max-h-[125px]"}
            />
            <Textarea
                id="notes"
                label="Notes"
                direction="row"
                {...register("notes")}
            />
            <div>
                <InputGroup
                    type="checkbox"
                    label="Active"
                    className="h-5 w-5"
                    {...register("active")}
                />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outlined" onClick={resetModal}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </div>
        </form>
    );
};
