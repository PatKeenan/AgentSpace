import { useRouter } from "next/router";
import React from "react";
import { SubContactList } from "./SubContactList";
import { ContactAppointmentList } from "./ContactAppointmentList";
import { ContactProfilesList } from "./ContactProfilesList";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { GridSectionTitle } from "./GridSectionTitle";
import { useContacts } from "hooks/useContacts";
import { useSubContacts } from "hooks/useSubContacts";

const ContactDetailOverview = () => {
    const router = useRouter();
    const id = router.query.contactId;
    const { update } = useSubContacts();

    /* const handleUpdate = () => {}; */
    return (
        <div>
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                {/* Main Content */}

                <div className="grid grid-cols-1 gap-4 pb-4 lg:col-span-2 lg:pb-0">
                    <div className="">
                        <div className="w-full">
                            <GridSectionTitle
                                title="General Information"
                                subTitle="People that are associated with each other."
                            />
                        </div>
                        <dl className="divide-y divide-gray-200">
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">
                                    Name
                                </dt>
                                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    <span className="flex-grow">
                                        Margot Foster
                                    </span>
                                    <span className="ml-4 flex-shrink-0">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Update
                                        </button>
                                    </span>
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">
                                    Email
                                </dt>
                                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    <span className="flex-grow">
                                        Backend Developer
                                    </span>
                                    <span className="ml-4 flex-shrink-0">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Update
                                        </button>
                                    </span>
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">
                                    Phone Number
                                </dt>
                                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    <span className="flex-grow">
                                        margotfoster@example.com
                                    </span>
                                    <span className="ml-4 flex-shrink-0">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Update
                                        </button>
                                    </span>
                                </dd>
                            </div>

                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                <dt className="text-sm font-medium text-gray-500">
                                    Notes
                                </dt>
                                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    <span className="flex-grow">
                                        Fugiat ipsum ipsum deserunt culpa aute
                                        sint do nostrud anim incididunt cillum
                                        culpa consequat. Excepteur qui ipsum
                                        aliquip consequat sint. Sit id mollit
                                        nulla mollit nostrud in ea officia
                                        proident. Irure nostrud pariatur mollit
                                        ad adipisicing reprehenderit deserunt
                                        qui eu.
                                    </span>
                                    <span className="ml-4 flex-shrink-0">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Update
                                        </button>
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div className="grid grid-cols-1 gap-4 divide-y lg:col-span-2">
                        {router.query.contactId && (
                            <SubContactList contactId={id as string} />
                        )}

                        <ContactProfilesList className="mt-5 pt-5" />
                    </div>
                </div>
                {/* Sidebar */}
                <div className="col-span-1 col-start-3 space-y-8 border-t pt-4 lg:mt-0 lg:border-t-0 lg:pt-0">
                    {router.query.contactId ? (
                        <React.Fragment>
                            <ContactAppointmentList contactId={id as string} />
                            {/*   <ContactTagsList contactId={id as string} /> */}
                        </React.Fragment>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ContactDetailOverview;
