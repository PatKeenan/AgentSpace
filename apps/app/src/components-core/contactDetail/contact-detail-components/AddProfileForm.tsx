import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components-common/Button";
import { useForm } from "react-hook-form";
import {
    DefaultProfileDataType,
    useContactDetailUi,
} from "../useContactDetailUi";
import * as React from "react";

import { useRouter } from "next/router";
import { useProfile } from "hooks/useProfile";
import { PROFILE_TYPES } from "@prisma/client";
import { ModalTitle } from "components-common/ModalTitle";
import {
    ProfileSingleton,
    type ProfileSingletonType,
} from "lib/ProfileSingleton";
import { NewInputGroup } from "components-common/NewInputGroup";
import { FieldGroup } from "components-common/FieldGroup";

const { profileFormFields, profileSchemas, profileTypeOptions } =
    ProfileSingleton;

export default function AddProfileForm() {
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
    } = useForm<
        Omit<
            ProfileSingletonType["profileSchemas"]["createSchema"],
            "contactId" | "type"
        >
    >({
        defaultValues: {
            name: defaultFormState?.name,
            notes: defaultFormState?.notes as string | undefined,
            active: defaultFormState?.active == false ? false : true,
        },
        resolver: zodResolver(
            profileSchemas.createSchema.omit({ contactId: true, type: true })
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
                            .invalidate({ contactId: data.contactId })
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
                            .invalidate({ contactId: data.contactId })
                            .then(() => resetModal()),
                }
            );
        }
    });

    const [selected, setSelected] = React.useState<
        (typeof profileTypeOptions)[number]
    >(
        (profileTypeOptions.find(
            (i) => i.value == defaultFormState?.type
        ) as (typeof profileTypeOptions)[number]) || profileTypeOptions[0]
    );

    return (
        <form onSubmit={onSubmit}>
            <ModalTitle>
                {modal.defaultData ? "Edit" : "Add"} Profile
            </ModalTitle>

            <FieldGroup className="mt-4">
                <NewInputGroup
                    isRequired
                    isInvalid={errors && errors.name ? true : false}
                >
                    <NewInputGroup.Label htmlFor={profileFormFields.name.label}>
                        {profileFormFields.name.label}
                    </NewInputGroup.Label>
                    <NewInputGroup.Input
                        {...register("name")}
                        placeholder="Profile Name"
                    />
                    <NewInputGroup.Error>
                        {errors && errors.name && errors.name.message}
                    </NewInputGroup.Error>
                </NewInputGroup>
                <NewInputGroup isRequired>
                    <NewInputGroup.Label htmlFor={profileFormFields.type.name}>
                        {profileFormFields.type.label}
                    </NewInputGroup.Label>
                    <NewInputGroup.Select
                        options={profileTypeOptions}
                        displayField="display"
                        selected={
                            profileTypeOptions.find(
                                (i) => i.value == selected.value
                            ) as typeof selected
                        }
                        setSelected={(i) => setSelected(i)}
                    />
                    <NewInputGroup.Error>{""}</NewInputGroup.Error>
                </NewInputGroup>
            </FieldGroup>
            <FieldGroup cols="1">
                <NewInputGroup
                    isInvalid={errors && errors.notes ? true : false}
                    hasHelpText
                >
                    <NewInputGroup.Label
                        htmlFor={profileFormFields.notes.label}
                    >
                        {profileFormFields.notes.label}
                    </NewInputGroup.Label>
                    <NewInputGroup.TextArea
                        placeholder="Notes"
                        {...register("notes")}
                        rows={3}
                    />
                    <NewInputGroup.HelpText>
                        Brief description for this profile
                    </NewInputGroup.HelpText>
                    <NewInputGroup.Error>
                        {errors && errors.notes && errors.notes.message}
                    </NewInputGroup.Error>
                </NewInputGroup>
            </FieldGroup>
            <div className="mt-3 flex">
                <div className="flex h-5 items-center">
                    <input
                        {...register("active")}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label
                        htmlFor="active"
                        className="font-medium text-gray-700"
                    >
                        {profileFormFields.active.label}
                    </label>
                </div>
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
}
