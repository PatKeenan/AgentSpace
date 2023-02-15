import {
    Button,
    FieldGroup,
    ModalTitle,
    NewInputGroup,
} from "components-common";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, Profile, PROFILE_TYPES } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import { ContactSingleton, ProfileSingleton } from "lib";
import { useContacts } from "hooks/useContacts";

import type { ContactSingletonType } from "lib";
import { FormSections } from "types/index";

const { contactFormFields, contactSchemas, subContactSchema } =
    ContactSingleton;
const { profileTypeOptions, profileFormFields } = ProfileSingleton;

const { name, firstName, lastName, phoneNumber, email } = contactFormFields;

const formFields: FormSections<ContactSingletonType["contactFormFields"]>[] = [
    [{ field: name, required: true }],
    [{ field: firstName, required: true }, { field: lastName }],
    [{ field: email }, { field: phoneNumber }],
];

type QuickAddContactProps = {
    setName: (input: string) => void;
    onSuccessCallback: (
        data: Contact & {
            profiles: Profile[];
        }
    ) => void;
    title?: string;
    defaultName?: string;
    workspaceId: string;
    onCancel: () => void;
} & React.ComponentProps<"div">;

export const QuickAddContactFrom = (props: QuickAddContactProps) => {
    const [attachProfile, setAttachProfile] = React.useState(false);

    const [selectedProfile, setSelectedProfile] = React.useState(
        profileTypeOptions[4]
    );

    const {
        title = "Quick Add Contact",
        defaultName,
        workspaceId,
        onCancel,
        onSuccessCallback,
    } = props;

    const handleOnCancel = () => {
        onCancel();
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<
        ContactSingletonType["contactSchemas"]["create"] &
            Omit<
                ContactSingletonType["subContactSchema"]["create"],
                "contactId"
            >
    >({
        resolver: zodResolver(
            contactSchemas.create.merge(subContactSchema.create)
        ),
        defaultValues: {
            name: defaultName,
            firstName: defaultName?.split(" ")[0],
        },
    });

    const handleOnSave = handleSubmit(async (data) => {
        createContactAndProfileMutation(
            {
                workspaceId,
                name: data.name,
                firstName: data.firstName,
                lastName: data?.lastName,
                email: data?.email,
                phoneNumber: data?.phoneNumber,
                profile:
                    attachProfile && selectedProfile
                        ? {
                              type: selectedProfile.value as PROFILE_TYPES,
                              name: selectedProfile.display,
                          }
                        : undefined,
            },
            {
                onSuccess: (data) => {
                    onSuccessCallback(data);
                    onCancel();
                },
            }
        );
    });

    const handleCancelAddProfile = () => {
        setAttachProfile(false);
    };

    const { createContactAndProfile } = useContacts();

    const { mutate: createContactAndProfileMutation } =
        createContactAndProfile();

    React.useEffect(() => {
        return () => setSelectedProfile(profileTypeOptions[4]);
    }, [attachProfile]);

    return (
        <div>
            <ModalTitle className="text-center lg:text-left">
                {title}
            </ModalTitle>
            <div className="mt-4 block">
                {formFields.map((section, sectionIdx) => (
                    <FieldGroup key={sectionIdx}>
                        {section.map(({ field, required }) => (
                            <NewInputGroup
                                key={field.name}
                                isRequired={required}
                                isInvalid={
                                    errors && errors[field.name] ? true : false
                                }
                            >
                                <NewInputGroup.Label htmlFor={field.name}>
                                    {field.label}
                                </NewInputGroup.Label>
                                <NewInputGroup.Input
                                    placeholder={field.label}
                                    {...register(field.name)}
                                />
                                <NewInputGroup.Error>
                                    {errors && errors[field.name]?.message}
                                </NewInputGroup.Error>
                            </NewInputGroup>
                        ))}
                    </FieldGroup>
                ))}
                {attachProfile ? (
                    <div className="grid grid-cols-12">
                        <div className="col-span-12 mb-3">
                            <h5 className="text-sm font-medium">Add Profile</h5>
                        </div>
                        <div className="col-span-11">
                            <NewInputGroup isInvalid={false}>
                                <NewInputGroup.Label
                                    optionalIndicator={false}
                                    htmlFor={profileFormFields.type.name}
                                >
                                    {profileFormFields.type.label}
                                </NewInputGroup.Label>
                                <NewInputGroup.Select
                                    options={profileTypeOptions}
                                    name={profileFormFields.type.name}
                                    displayField="display"
                                    selected={
                                        selectedProfile ||
                                        (profileTypeOptions[4] as typeof profileTypeOptions[number])
                                    }
                                    setSelected={setSelectedProfile}
                                />
                            </NewInputGroup>
                        </div>
                        <div className="col-span-1 flex justify-center">
                            <div className="mt-auto">
                                <button
                                    className="appearance-none"
                                    onClick={handleCancelAddProfile}
                                >
                                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                                    <span className="sr-only">
                                        Cancel Add Profile
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Button
                        variant="outlined"
                        className="w-full justify-center"
                        onClick={() => setAttachProfile(true)}
                    >
                        Attach Profile
                    </Button>
                )}
            </div>

            <div className="mt-8 flex items-center justify-between ">
                <Button
                    variant="outlined"
                    onClick={handleOnCancel}
                    actionIcon="backArrow"
                    iconPosition="left"
                    iconSize="md"
                    hideChildrenOnMobile={false}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleOnSave}
                    actionIcon="forwardArrow"
                    iconPosition="right"
                    iconSize="md"
                    hideChildrenOnMobile={false}
                >
                    Continue
                </Button>
            </div>
        </div>
    );
};
