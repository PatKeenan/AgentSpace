import { Button, InputGroup, ModalTitle, Select } from "components-common";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, Profile, PROFILE_TYPES } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import { subContactSchema, contactSchema } from "server/schemas";
import type { SubContactSchema, ContactSchema } from "server/schemas";
import { useContacts } from "hooks/useContacts";

const profileOptions = Object.keys(PROFILE_TYPES).map((i, index) => ({
    id: `${index}`,
    name: i.toLowerCase(),
    value: i,
}));

type QuickAddContactProps = {
    setDisplayName: (input: string) => void;
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
        profileOptions[4]
    );

    const {
        title = "Quick Add Contact",
        defaultName,
        workspaceId,
        setDisplayName,
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
        Omit<ContactSchema["create"], "id"> &
            Omit<SubContactSchema["create"], "contactId">
    >({
        resolver: zodResolver(
            subContactSchema()
                .create.omit({ contactId: true })
                .merge(contactSchema().create)
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
                subContact: {
                    firstName: data.firstName,
                    lastName: data?.lastName,
                    email: data?.email,
                    phoneNumber: data?.phoneNumber,
                },
                profile:
                    attachProfile && selectedProfile
                        ? {
                              type: selectedProfile.value as PROFILE_TYPES,
                              name: selectedProfile.name,
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
        return () => setSelectedProfile(profileOptions[4]);
    }, [attachProfile]);

    return (
        <div>
            <ModalTitle className="text-center lg:text-left">
                {title}
            </ModalTitle>
            <div className="mt-2 grid w-full grid-cols-8">
                <div className="col-span-8">
                    <InputGroup
                        label="Display Name"
                        direction="column"
                        required
                        {...register("name", {
                            value: defaultName,
                            onChange(event) {
                                setDisplayName(event.target.value);
                            },
                        })}
                        errorMessage={errors?.name && errors.name.message}
                    />
                </div>

                <div className="col-span-8 mt-6 grid grid-cols-2 gap-x-4">
                    <h4 className="col-span-2 mb-4 text-center text-sm font-medium leading-6 lg:text-left">
                        Primary Contact Information
                    </h4>
                    <InputGroup
                        label="First Name"
                        required
                        className="col-span-4"
                        containerClass="sm:pt-2"
                        direction="column"
                        {...register("firstName")}
                        errorMessage={
                            errors?.firstName && errors.firstName.message
                        }
                    />

                    <InputGroup
                        label="Last Name"
                        className="col-span-4"
                        direction="column"
                        containerClass="sm:pt-2"
                        {...register("lastName")}
                        errorMessage={
                            errors?.lastName && errors.lastName.message
                        }
                    />
                </div>
                <div className="col-span-8 mb-2 mt-2 block lg:grid lg:grid-cols-2 lg:gap-y-0 lg:gap-x-4">
                    <InputGroup
                        containerClass="sm:pt-0"
                        label="Email"
                        direction="column"
                        {...register("email")}
                        errorMessage={errors?.email && errors.email.message}
                    />

                    <InputGroup
                        containerClass="mt-2 sm:pt-0"
                        label="Phone Number"
                        direction="column"
                        {...register("phoneNumber")}
                        errorMessage={
                            errors?.phoneNumber && errors.phoneNumber.message
                        }
                    />
                </div>

                {attachProfile ? (
                    <div className="col-span-8 mt-4 grid grid-cols-8">
                        <div className="col-span-8 mb-10 grid grid-cols-12">
                            <div className="col-span-11">
                                <Select
                                    label="Profile"
                                    options={profileOptions}
                                    displayField="name"
                                    className="max-h-[110px]"
                                    selected={selectedProfile}
                                    setSelected={setSelectedProfile}
                                    direction="col"
                                />
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
                    </div>
                ) : (
                    <div className="col-span-8 mt-4">
                        <Button
                            variant="outlined"
                            className="w-full justify-center"
                            onClick={() => setAttachProfile(true)}
                        >
                            Attach Profile
                        </Button>
                    </div>
                )}
            </div>
            <div className="mt-8 flex items-center justify-between">
                <Button
                    variant="text"
                    onClick={handleOnCancel}
                    className="flex items-center space-x-2"
                >
                    <ArrowLeftIcon className="h-4" />
                    <span>Cancel</span>
                </Button>
                <Button variant="primary" onClick={handleOnSave}>
                    Continue
                </Button>
            </div>
        </div>
    );
};
