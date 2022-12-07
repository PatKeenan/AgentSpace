import { Contact } from "@prisma/client";
import { AutoComplete } from "components-common/Autocomplete";
import { Button } from "components-common/Button";
import { InputGroup } from "components-common/InputGroup";
import { Select } from "components-common/Select";
import { Textarea } from "components-common/Textarea";
import { useContacts } from "hooks/useContacts";
import { useDebounceState } from "hooks/useDebounce";
import React from "react";

type CreateProfileFormState = {
    name: string;
    client: Contact | undefined;
    type: typeof options[number] | undefined;
    note: string | undefined;
    towns: string | undefined;
};

const createProfileReducer = (
    state: CreateProfileFormState,
    newState: Partial<CreateProfileFormState>
) => ({
    ...state,
    ...newState,
});

const profileTypes = [
    "buyer",
    "renter",
    "listing",
    "rental",
    "agent",
    "vendor",
    "other",
] as const;

const options: { id: string; name: typeof profileTypes[number] }[] = [
    { id: "1", name: "agent" },
    { id: "2", name: "buyer" },
    { id: "5", name: "listing" },
    { id: "3", name: "renter" },
    { id: "4", name: "rental" },
    { id: "6", name: "vendor" },
    { id: "7", name: "other" },
];

export const CreateProfileForm = ({
    workspaceId,
}: {
    workspaceId: string | string[] | undefined;
}) => {
    const [state, setState] = React.useReducer(createProfileReducer, {
        name: "",
        client: undefined,
        type: options[1],
        note: undefined,
        towns: "",
    });

    const contactsInput = useDebounceState("", 400);
    const { search } = useContacts();

    const { data: contacts } = search(
        { workspaceId: workspaceId as string, query: contactsInput.debounced },
        { enabled: typeof workspaceId == "string" }
    );
    const buyerAndRenterFields: typeof profileTypes[number][] = [
        "buyer",
        "renter",
    ];
    const rentalAndListingFields: typeof profileTypes[number][] = [
        "listing",
        "rental",
    ];

    return (
        <form className="max-w-xl">
            <InputGroup name="name" label="Name" />
            <AutoComplete
                name="contact"
                label="Contact"
                options={contacts}
                displayField="displayName"
                query={contactsInput.state}
                setQuery={contactsInput.setState}
                selected={state.client}
                onSelect={(e) => setState({ client: e })}
            />
            <Select
                options={options}
                displayField="name"
                selected={state.type}
                setSelected={(e) => setState({ type: e })}
                label="Type"
                direction="row"
            />
            {state.type && (
                <div className="mt-10">
                    <h4 className=" border-b border-b-gray-200 pb-2 text-base font-medium capitalize">
                        {state.type.name} Options
                    </h4>

                    {buyerAndRenterFields.includes(state.type.name) && (
                        <>
                            <div className="mt-4 grid w-full grid-cols-3 gap-x-4 border-transparent">
                                <p className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Price Range
                                </p>
                                <div className="col-span-2 grid w-full grid-cols-2 gap-x-4">
                                    <InputGroup
                                        name="price-min"
                                        label="Min"
                                        type="number"
                                        direction="column"
                                        containerClass="sm:pt-0 sm:first:border-opacity-0"
                                        startIcon={
                                            <span className="text-gray-500 sm:text-sm">
                                                $
                                            </span>
                                        }
                                    />
                                    <InputGroup
                                        name="price-max"
                                        label="Max"
                                        type="number"
                                        direction="column"
                                        containerClass="sm:pt-0"
                                        startIcon={
                                            <span className="text-gray-500 sm:text-sm">
                                                $
                                            </span>
                                        }
                                    />
                                </div>
                            </div>
                            <div className="mt-4 grid w-full grid-cols-3 gap-x-4 border-transparent">
                                <p className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Details
                                </p>
                                <div className="col-span-2 grid w-full grid-cols-2 gap-x-4">
                                    <InputGroup
                                        name="price-min"
                                        label="Beds"
                                        type="number"
                                        direction="column"
                                        containerClass="sm:pt-0 sm:first:border-opacity-0"
                                    />
                                    <InputGroup
                                        name="price-max"
                                        label="Baths"
                                        type="number"
                                        direction="column"
                                        containerClass="sm:pt-0"
                                    />
                                </div>
                            </div>
                            <InputGroup
                                name="target-date"
                                type="date"
                                label="Target Move in Date"
                                direction="row"
                            />
                            <InputGroup name="towns" label="Towns" />
                        </>
                    )}
                    {rentalAndListingFields.includes(state.type.name) && (
                        <div className="mt-4">
                            <InputGroup
                                name="target-price"
                                label="Target Price"
                                type="number"
                                direction="row"
                                containerClass="sm:pt-0 sm:first:border-opacity-0"
                                startIcon={
                                    <span className="text-gray-500 sm:text-sm">
                                        $
                                    </span>
                                }
                            />
                            <InputGroup
                                name="target-close-date"
                                type="date"
                                label="Target Close Date"
                                direction="row"
                            />
                        </div>
                    )}
                    {state.type.name == "agent" && (
                        <InputGroup
                            name="towns"
                            label="Towns"
                            className="mt-4"
                        />
                    )}
                    <Textarea
                        id="note"
                        name="notes"
                        label="Notes"
                        direction="row"
                    />
                </div>
            )}

            <div className="mt-8 ml-auto flex w-full justify-end space-x-4">
                <Button variant="outlined">Cancel</Button>
                <Button variant="primary">Save Profile</Button>
            </div>
        </form>
    );
};
