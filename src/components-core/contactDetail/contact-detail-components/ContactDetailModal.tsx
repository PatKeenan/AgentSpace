import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components-common/Button";
import { InputGroup } from "components-common/InputGroup";
import { Modal } from "components-common/Modal";
import { useForm } from "react-hook-form";
import {
    DefaultProfileDataType,
    useContactDetailUi,
} from "../useContactDetailUi";
import * as React from "react";
import { contactSchema, profileSchema, ProfileSchema } from "server/schemas";

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
import { ContactSingleton, ContactSingletonType } from "lib/ContactSingleton";

const { contactFormFields, subContactSchema } = ContactSingleton;

export const ContactDetailModal = () => {
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
            <SubRouter
                component={<EditGeneralInfoForm />}
                active={modal?.form == "generalInfo"}
            />
        </Modal>
    );
};

const EditGeneralInfoForm = () => {
    const { modal, resetModal } = useContactDetailUi();
    const router = useRouter();
    const id = router.query.contactId;
    const { update, utils } = useContacts();
    const { mutate: updateContact } = update();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Pick<ContactSingletonType["contactSchemas"]["base"], "name">>({
        resolver: zodResolver(
            ContactSingleton.contactSchemas.update.pick({ name: true })
        ),
        defaultValues:
            modal.form == "generalInfo"
                ? (modal.defaultData as Pick<
                      ContactSingletonType["contactSchemas"]["update"],
                      "name"
                  >)
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
            <ModalTitle>Edit General Info</ModalTitle>
            <div className="mt-6">
                <InputGroup
                    label={contactFormFields.name.label}
                    {...register("name")}
                    direction="column"
                    errorMessage={errors && errors.name && errors.name.message}
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
};

const EditContactForm = () => {
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
};

const SubContactForm = () => {
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
                            .invalidate({ contactId: data.contactId, take: 3 })
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
                            .invalidate({ contactId: data.contactId, take: 3 })
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
            <div className="mt-6">
                <InputGroup
                    direction="column"
                    containerClass="sm:items-center"
                    required
                    label="Unique Name"
                    {...register("name")}
                    errorMessage={errors && errors.name && errors.name.message}
                />
            </div>
            <div className="mt-4">
                <Select
                    options={options}
                    label="Type"
                    displayField="display"
                    direction="column"
                    selected={selected}
                    setSelected={setSelected}
                    className={"max-h-[125px]"}
                />
            </div>

            <div className="mt-4">
                <Textarea
                    id="notes"
                    label="Notes"
                    direction="column"
                    {...register("notes")}
                />
            </div>
            <div className="mt-4 max-w-[150px]">
                <InputGroup
                    direction="row"
                    type="checkbox"
                    label="Active"
                    className="h-5 w-5"
                    containerClass="sm:items-center"
                    {...register("active")}
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
};
