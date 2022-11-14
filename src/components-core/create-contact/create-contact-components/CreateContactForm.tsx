import { MinusCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Accordion } from "components-common/Accordion";
import { Button } from "components-common/Button";
import * as React from "react";
import { ContactFormInput } from "./ContactFormInput";
import { ContactFormTextArea } from "./ContactFormTextArea";

const initialState = {
    "display-name": "",
};

const initialMeta = { firstName: "", lastName: "", email: "", phoneNumber: "" };

export const CreateContactForm = () => {
    const [formState, setFormState] = React.useState(() => initialState);

    const [metaFields, setMetaFields] = React.useState([{ ...initialMeta }]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const handleChangeMeta = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const data = [...metaFields];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        data[index][e.target.name] = e.target.value;
        return setMetaFields(data);
    };

    const addFields = () => {
        setMetaFields((prev) => [...prev, { ...initialMeta }]);
    };
    const removeField = (index: number) => {
        const fields = [...metaFields];
        fields.splice(index, 1);
        setMetaFields(fields);
    };

    return (
        <form
            className="mt-8 space-y-8 divide-y divide-gray-200"
            onSubmit={handleSubmit}
        >
            <div>
                <Accordion
                    defaultOpen={true}
                    label="General Information"
                    description="This information will be
                                                displayed publicly so be careful
                                                what you share."
                >
                    <div className="space-y-6 sm:space-y-5">
                        <div className="space-y-6 sm:space-y-5">
                            <ContactFormInput
                                label="Display Name"
                                name="name"
                                className="max-w-xs"
                                required
                            />
                            <ContactFormInput
                                label="Tags"
                                name="tags"
                                className="max-w-xs"
                            />
                            <ContactFormInput
                                label="Referred By"
                                name="referredBy"
                                className="max-w-xs"
                            />
                            <ContactFormTextArea
                                label="Notes"
                                name="notes"
                                className="max-w-lg"
                                rows={3}
                            />
                        </div>
                    </div>
                </Accordion>
            </div>
            <div>
                <Accordion
                    defaultOpen={true}
                    label="Mailing Address"
                    description="Use a permanent address where you can
                                    receive mail."
                    className="pt-6"
                >
                    <div className="space-y-6 sm:space-y-5">
                        <ContactFormInput
                            label="Street address"
                            name="streetAddress"
                            className="max-w-sm"
                        />
                        <ContactFormInput
                            label="City"
                            name="city"
                            className="max-w-sm"
                        />
                        <ContactFormInput
                            label="State"
                            name="state"
                            className="max-w-[15rem]"
                        />
                        <ContactFormInput
                            label="Zip / Postal code"
                            name="zip"
                            className="max-w-[10rem]"
                        />
                    </div>
                </Accordion>
            </div>
            <div className="divide-y divide-gray-200">
                {metaFields.map((fields, idx) => (
                    <Accordion
                        defaultOpen={idx == 0}
                        key={idx}
                        label={
                            idx == 0
                                ? "Primary Contact Information"
                                : ` Additional Contact ${idx}`
                        }
                        className="py-6"
                        description={
                            idx == 0
                                ? "This information will be used for communication and scheduling."
                                : ""
                        }
                        toggleContainer={
                            idx !== 0 ? (
                                <button
                                    type="button"
                                    className="group inline-flex items-center rounded-full border border-transparent text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    onClick={() => removeField(idx)}
                                >
                                    <span className="sr-only">
                                        Remove Contact
                                    </span>
                                    <MinusCircleIcon
                                        className="h-5 w-5 rounded-full bg-white text-gray-500 group-hover:bg-gray-600 group-hover:text-white"
                                        aria-hidden="true"
                                    />
                                </button>
                            ) : null
                        }
                    >
                        <div className="space-y-6 sm:space-y-5">
                            <ContactFormInput
                                label="First Name"
                                required
                                name="firstName"
                                value={fields.firstName}
                                className="max-w-xs"
                                onChange={(e) => handleChangeMeta(idx, e)}
                            />
                            <ContactFormInput
                                label="Last Name"
                                name="lastName"
                                value={fields.lastName}
                                className="max-w-xs"
                                onChange={(e) => handleChangeMeta(idx, e)}
                            />
                            <ContactFormInput
                                label="Email"
                                name="email"
                                type="email"
                                value={fields.email}
                                className="max-w-lg"
                                onChange={(e) => handleChangeMeta(idx, e)}
                            />
                            <ContactFormInput
                                label="Phone Number"
                                name="phoneNumber"
                                type="tel"
                                value={fields.email}
                                className="max-w-xs"
                                onChange={(e) => handleChangeMeta(idx, e)}
                            />
                        </div>
                    </Accordion>
                ))}

                <div className="mb-2 pt-4">
                    <Button
                        variant="outlined"
                        className="my-2 w-full justify-center"
                        onClick={addFields}
                    >
                        Add Sub Contact
                    </Button>
                </div>
            </div>

            <div className="pt-5">
                <div className="flex justify-end space-x-2">
                    <Button variant="outlined">Cancel</Button>
                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                </div>
            </div>
        </form>
    );
};
