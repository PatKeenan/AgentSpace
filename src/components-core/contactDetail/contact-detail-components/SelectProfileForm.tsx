import { Button } from "components-common/Button";
import { useProfile } from "hooks/useProfile";
import React from "react";

import { AppointmentSingletonType } from "lib";
import { Loading } from "components-common/Loading";

const SelectProfileForm = ({
    contactId,
    onCancel,
    onContinue,
    contactName,
}: {
    contactId: string;
    contactName: string;
    onCancel: () => void;
    onContinue: (
        contact: AppointmentSingletonType["appointmentSchemas"]["extendedContactOnAppointmentSchema"]
    ) => void;
}) => {
    const [selectedProfile, setSelectedProfile] = React.useState<
        | AppointmentSingletonType["appointmentSchemas"]["extendedContactOnAppointmentSchema"]
        | undefined
    >();

    const { getManyForContact } = useProfile();

    const { data: profiles, isLoading } = getManyForContact({ contactId });

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        onContinue(
            selectedProfile
                ? { ...selectedProfile, contactId, name: contactName }
                : { contactId, name: contactName }
        );
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        value: typeof selectedProfile
    ) => {
        if (e.target.value == "on") {
            setSelectedProfile(value);
        }
    };

    React.useEffect(() => {
        if (profiles && profiles.length == 0) {
            onContinue({ contactId, name: contactName });
        }
    }, [profiles, onContinue, contactId, contactName]);

    return !profiles && isLoading ? (
        <Loading />
    ) : (
        <form onSubmit={handleContinue}>
            <div>
                <label className="text-base font-medium text-gray-900">
                    Choose Profile
                </label>
                <p className="text-sm leading-5 text-gray-500">
                    Which profile will be connected to the appointment?
                </p>
                <fieldset className="mt-4">
                    <legend className="sr-only">Profile for appointment</legend>
                    <div className="space-y-4">
                        {profiles?.map((profile) => (
                            <div key={profile.id} className="flex items-center">
                                <input
                                    id={profile.id}
                                    name="notification-method"
                                    type="radio"
                                    checked={
                                        selectedProfile?.selectedProfileId ===
                                        profile.id
                                    }
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    onChange={(e) =>
                                        handleChange(e, {
                                            selectedProfileId: profile.id,
                                            profileName: profile.name,
                                            contactId,
                                            name: contactName,
                                        })
                                    }
                                />
                                <label
                                    htmlFor={profile.id}
                                    className="ml-3 block text-sm font-medium text-gray-700"
                                >
                                    {profile.name}
                                    <span className="ml-4 text-sm capitalize text-gray-400">
                                        - {profile.type.toLowerCase()}
                                    </span>
                                </label>
                            </div>
                        ))}
                        <div className="flex items-center">
                            <input
                                type="radio"
                                checked={!selectedProfile?.selectedProfileId}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                onChange={(e) =>
                                    handleChange(e, {
                                        contactId: contactId,
                                        name: contactName,
                                        selectedProfileId: undefined,
                                        profileName: undefined,
                                    })
                                }
                            />
                            <label className="ml-3 block text-sm font-medium text-gray-700">
                                None
                            </label>
                        </div>
                    </div>
                </fieldset>
            </div>
            <div className="mt-8 flex justify-end space-x-3">
                <Button variant="outlined" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    Continue
                </Button>
            </div>
        </form>
    );
};

export default SelectProfileForm;
