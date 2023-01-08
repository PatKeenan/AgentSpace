import React from "react";
import { NextPageExtended } from "types/index";

import { useRouter } from "next/router";
import { SubContactList } from "./contact-detail-components/SubContactList";
import { ContactAppointmentList } from "./contact-detail-components/ContactAppointmentList";
import { ContactProfilesList } from "./contact-detail-components/ContactProfilesList";
import { EnvelopeIcon, PencilIcon, PhoneIcon } from "@heroicons/react/20/solid";
import { GridSectionTitle } from "./contact-detail-components/GridSectionTitle";
import { useContacts } from "hooks/useContacts";
import { Button, IconButton } from "components-common/Button";
import { useContactDetailUi } from "./useContactDetailUi";
import { ContactDetailLayout } from "./contact-detail-components/ContactDetailLayout";
import { ContactSchema } from "server/schemas";

export const ContactDetailOverviewContainer: NextPageExtended = () => {
    const router = useRouter();
    const { setModal } = useContactDetailUi();
    const id = router.query.contactId;
    const { getOne } = useContacts();

    const { data: contactQuery } = getOne(
        { id: id as string },
        { enabled: typeof id !== undefined }
    );

    return (
        <ContactDetailLayout activeTab="Overview">
            <div>
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    {/* Main Content */}

                    <div className="grid grid-cols-1 gap-4 pb-4 lg:col-span-2 lg:pb-0">
                        <div className="">
                            <div className="w-full">
                                <GridSectionTitle
                                    title="Primary Information"
                                    subTitle="People that are associated with each other."
                                    actions={
                                        <Button
                                            variant="outlined"
                                            type="button"
                                            onClick={() =>
                                                setModal({
                                                    state: true,
                                                    form: "contact",
                                                    defaultData: {
                                                        firstName:
                                                            contactQuery?.firstName,
                                                        lastName:
                                                            contactQuery?.lastName,
                                                        phoneNumber:
                                                            contactQuery?.phoneNumber,
                                                        email: contactQuery?.email,
                                                        notes: contactQuery?.notes,
                                                    } as Omit<
                                                        ContactSchema["base"],
                                                        "name"
                                                    >,
                                                })
                                            }
                                        >
                                            <PencilIcon
                                                className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            <span>Edit</span>
                                        </Button>
                                    }
                                />
                            </div>
                            <dl className="divide-y divide-gray-200">
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                    <dt className="text-sm font-medium text-gray-500">
                                        First Name
                                    </dt>
                                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        <span className="flex-grow">
                                            {contactQuery?.firstName || "--"}
                                        </span>
                                    </dd>
                                </div>
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Last Name
                                    </dt>
                                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        <span className="flex-grow">
                                            {contactQuery?.lastName || "--"}
                                        </span>
                                    </dd>
                                </div>
                                <div className="items-center py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Email
                                    </dt>
                                    <dd className="mt-1 flex items-center text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        <span className="flex-grow">
                                            {contactQuery?.email || "--"}
                                        </span>
                                        {contactQuery?.email && (
                                            <IconButton
                                                title="Email"
                                                icon={EnvelopeIcon}
                                            />
                                        )}
                                    </dd>
                                </div>
                                <div className="items-center py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Phone Number
                                    </dt>
                                    <dd className="mt-1 flex items-center text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        <span className="flex-grow">
                                            {contactQuery?.phoneNumber || "--"}
                                        </span>
                                        {contactQuery?.phoneNumber && (
                                            <IconButton
                                                title="Call"
                                                icon={PhoneIcon}
                                            />
                                        )}
                                    </dd>
                                </div>

                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Notes
                                    </dt>
                                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        <span className="max-h-[200px] flex-grow flex-wrap overflow-auto whitespace-pre-line">
                                            {contactQuery?.notes || "--"}
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                        <div className="grid grid-cols-1 gap-4 divide-y lg:col-span-2">
                            {router.query.contactId && (
                                <SubContactList
                                    subContacts={contactQuery?.subContacts}
                                />
                            )}

                            <ContactProfilesList className="mt-5 pt-5" />
                        </div>
                    </div>
                    {/* Sidebar */}
                    <div className="col-span-1 col-start-3 space-y-8 border-t pt-4 lg:mt-0 lg:border-t-0 lg:pt-0">
                        {router.query.contactId ? (
                            <React.Fragment>
                                <ContactAppointmentList
                                    contactId={id as string}
                                />
                                {/*   <ContactTagsList contactId={id as string} /> */}
                            </React.Fragment>
                        ) : null}
                    </div>
                </div>
            </div>
        </ContactDetailLayout>
    );
};

ContactDetailOverviewContainer.layout = "dashboard";
ContactDetailOverviewContainer.subLayout = "contact";
