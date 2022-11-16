import { useContacts } from "hooks/useContacts";
import { useWorkspace } from "hooks/useWorkspace";
import { useRouter } from "next/router";
import router from "next/router";
import React from "react";
import { exists } from "utils/helpers";
import { Loading } from "components-common/Loading";
import { useContactDetailUi } from "../useContactDetailUi";
import { Accordion } from "components-common/Accordion";
import { Button } from "components-common/Button";

const ContactDetailOverview = () => {
    const workspace = useWorkspace();
    const router = useRouter();
    const contacts = useContacts();

    const id = router.query.contactId;
    const { setContactDisplayName } = useContactDetailUi();

    const {
        data: contact,
        isLoading: loadingPerson,
        isError: contactError,
    } = contacts.getOne(
        { id: id as string, workspaceId: workspace.id as string },
        {
            enabled: exists(id) && exists(workspace.id),
        }
    );

    const primaryContact = contact?.contactMeta.filter(
        (i) => i.isPrimaryContact
    )[0];

    React.useEffect(() => {
        return () => {
            if (router.query.contactId !== contact?.id) {
                setContactDisplayName(undefined);
            }
        };
    }, [router, setContactDisplayName, contact]);

    React.useEffect(() => {
        if (contact) {
            setContactDisplayName(contact.displayName);
        }
    }, [setContactDisplayName, contact]);

    const primaryContactMeta = contact?.contactMeta.find(
        (i) => i.isPrimaryContact
    );

    return loadingPerson && !contact ? (
        <Loading />
    ) : (
        <div>
            <div className="lg:grid lg:grid-cols-3 lg:gap-6">
                {/* General Info */}
                <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                    <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                        <section>
                            <div className="rounded-md border-gray-200 p-6 shadow">
                                <div>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        General Information
                                    </h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        Personal details and application.
                                    </p>

                                    <div className="mt-4 grid grid-cols-3 text-sm">
                                        <p className="text-gray-700">
                                            Display Name
                                        </p>
                                        <p className="text-gray-500">
                                            {contact?.displayName}
                                        </p>
                                        <div>
                                            <Button variant="text">
                                                Update
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-3 text-sm">
                                        <p className="text-gray-700">Notes</p>
                                        <p className="text-gray-500">
                                            {contact?.notes || "--"}
                                        </p>
                                        <div>
                                            <Button variant="text">
                                                Update
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-3 text-sm">
                                        <p className="text-gray-700">Created</p>
                                        <p className="col-start-3 text-gray-500">
                                            {contact?.createdAt.toDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Meta */}
                        <section className="">
                            <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow">
                                <div className="p-6">
                                    <h3 className="text-base font-medium text-gray-900">
                                        Sub Contacts
                                    </h3>
                                    <ul>
                                        {contact?.contactMeta.map((meta) => (
                                            <div key={meta.id}>
                                                {meta.firstName}
                                            </div>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                {/* Upcoming Showings */}
                <div className="col-span-1 col-start-3">
                    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow">
                        <div className="p-6">
                            <h3 className="text-base font-medium text-gray-900">
                                Upcoming Showings
                            </h3>
                            <div className="mt-6 flow-root">
                                <ul
                                    role="list"
                                    className="-my-5 divide-y divide-gray-200"
                                >
                                    <li className="py-5">
                                        <div className="relative focus-within:ring-2 focus-within:ring-cyan-500">
                                            <h3 className="text-sm font-semibold text-gray-800">
                                                <a
                                                    /*  href={announcement.href} */
                                                    className="hover:underline focus:outline-none"
                                                >
                                                    {/* Extend touch target to entire panel */}
                                                    <span
                                                        className="absolute inset-0"
                                                        aria-hidden="true"
                                                    />
                                                    Saturday 1/24/2021
                                                </a>
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                                1450 Rahway Road, Scotch Plains
                                                NJ
                                            </p>
                                        </div>
                                    </li>
                                    <li className="py-5">
                                        <div className="relative focus-within:ring-2 focus-within:ring-cyan-500">
                                            <h3 className="text-sm font-semibold text-gray-800">
                                                <a
                                                    /*  href={announcement.href} */
                                                    className="hover:underline focus:outline-none"
                                                >
                                                    {/* Extend touch target to entire panel */}
                                                    <span
                                                        className="absolute inset-0"
                                                        aria-hidden="true"
                                                    />
                                                    Saturday 1/25/2021
                                                </a>
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                                130 Monmouth Green NJ
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                                <Button
                                    variant="outlined"
                                    className="mt-4 w-full justify-center"
                                >
                                    View All
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Accordion
                defaultOpen={true}
                label="General Information"
                description="This information will be
                                                displayed publicly so be careful
                                                what you share."
            >
                <div className="mt-5 border-t border-gray-200">
                    <dl>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500">
                                Display name
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <span className="flex-grow">
                                    {contact?.displayName}
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
                                Primary Email address
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <span className="flex-grow">
                                    {primaryContactMeta?.email || "--"}
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
                                Primary Phone Number
                            </dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <span className="flex-grow">
                                    {primaryContactMeta?.phoneNumber || "--"}
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
                                    {contact?.notes || "--"}
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
            </Accordion> */}
        </div>
    );
};

export default ContactDetailOverview;
