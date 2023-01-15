import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components-common/Button";
import { InputGroup } from "components-common/InputGroup";
import { useForm } from "react-hook-form";
import {
    DefaultProfileDataType,
    useContactDetailUi,
} from "../useContactDetailUi";
import * as React from "react";

import { useRouter } from "next/router";
import { useProfile } from "hooks/useProfile";
import { Textarea } from "components-common/Textarea";
import { Select } from "components-common/Select";
import { PROFILE_TYPES } from "@prisma/client";
import { ModalTitle } from "components-common/ModalTitle";
import {
    ProfileSingleton,
    type ProfileSingletonType,
} from "lib/ProfileSingleton";

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
    } = useForm<ProfileSingletonType["profileSchemas"]["createSchema"]>({
        defaultValues: {
            name: defaultFormState?.name,
            notes: defaultFormState?.notes as string | undefined,
            type: defaultFormState?.type,
            active: defaultFormState?.active == false ? false : true,
        },
        resolver: zodResolver(profileSchemas.createSchema),
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

    const [selected, setSelected] = React.useState(
        profileTypeOptions.filter(
            (i) => i.value == defaultFormState?.type
        )[0] || profileTypeOptions[0]
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
                    label={profileFormFields.name.label}
                    {...register("name")}
                    errorMessage={errors && errors.name && errors.name.message}
                />
            </div>
            <div className="mt-4">
                <Select
                    options={profileTypeOptions}
                    label={profileFormFields.type.label}
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
                    label={profileFormFields.notes.label}
                    direction="column"
                    {...register("notes")}
                />
            </div>
            <div className="mt-4 max-w-[150px]">
                <InputGroup
                    direction="row"
                    type="checkbox"
                    label={profileFormFields.active.label}
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
}
