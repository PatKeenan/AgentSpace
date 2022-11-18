import { useContacts } from "hooks/useContacts";
import { useWorkspace } from "hooks/useWorkspace";
import { useRouter } from "next/router";
import React from "react";
import { exists } from "utils/helpers";
import { Loading } from "components-common/Loading";
import { useContactDetailUi } from "../useContactDetailUi";
import { Button } from "components-common/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ToggleMenu } from "components-common/ToggleMenu";
import { EnvelopeIcon, PhoneIcon, TrashIcon } from "@heroicons/react/20/solid";
import { GridCard } from "./GridCard";
import { GridSectionTitle } from "./GridSectionTitle";
import clsx from "clsx";
import { DetailsRow } from "./DetailsRow";

const ContactDetailOverview = () => {
    const workspace = useWorkspace();
    const router = useRouter();
    const contacts = useContacts();

    const id = router.query.contactId;
    const { setContactDisplayName } = useContactDetailUi();

    const { data: contact, isLoading: loadingPerson } = contacts.getOne(
        { id: id as string, workspaceId: workspace.id as string },
        {
            enabled: exists(id) && exists(workspace.id),
        }
    );

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

    const primaryContact = React.useMemo(() => {
        return contact?.contactMeta.find((i) => i.isPrimaryContact);
    }, [contact]);

    return loadingPerson && !contact ? (
        <Loading />
    ) : (
        <div>
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                {/* General Info */}
                <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                    <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                        <section>
                            <div className="space-y-6">
                                <div>
                                    <GridSectionTitle
                                        title="General Information"
                                        subTitle="Personal details and application."
                                        actions={
                                            <ToggleMenu
                                                items={[
                                                    {
                                                        text: "Edit",
                                                        onClick: () => "",
                                                    },
                                                ]}
                                            />
                                        }
                                    />
                                    <GridCard>
                                        <dl className="space-y-3 divide-y">
                                            <DetailsRow
                                                title="Display Name:"
                                                value={contact?.displayName}
                                            />
                                            {/* <DetailsRow
                                                title="First Name:"
                                                value={
                                                    primaryContact?.firstName
                                                }
                                                className="pt-3"
                                            />

                                            <DetailsRow
                                                title="Last Name:"
                                                value={primaryContact?.lastName}
                                                className="pt-3"
                                            /> */}

                                            <DetailsRow
                                                title="Primary Phone:"
                                                value={
                                                    primaryContact?.phoneNumber
                                                }
                                                action={
                                                    primaryContact?.phoneNumber ? (
                                                        <Button
                                                            variant="outlined"
                                                            className="w-24 justify-center"
                                                        >
                                                            <PhoneIcon
                                                                className="-ml-1 mr-2 h-4 w-4 text-gray-400"
                                                                aria-hidden="true"
                                                            />
                                                            <span>Phone</span>
                                                        </Button>
                                                    ) : null
                                                }
                                                className="pt-3"
                                            />
                                            <DetailsRow
                                                title="Primary Email:"
                                                value={primaryContact?.email}
                                                action={
                                                    primaryContact?.email ? (
                                                        <Button
                                                            variant="outlined"
                                                            className="w-24 justify-center"
                                                        >
                                                            <EnvelopeIcon
                                                                className="-ml-1 mr-2 h-4 w-4 text-gray-400"
                                                                aria-hidden="true"
                                                            />
                                                            <span>Email</span>
                                                        </Button>
                                                    ) : null
                                                }
                                                className="pt-3"
                                            />
                                        </dl>
                                    </GridCard>
                                </div>
                                <div className="pt-6">
                                    <GridSectionTitle
                                        title="Contacts"
                                        titleIcon={
                                            contact?.contactMeta ? (
                                                <div className="flex h-5 w-5 justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                                                    <span className="my-auto">
                                                        {
                                                            contact.contactMeta
                                                                .length
                                                        }
                                                    </span>
                                                </div>
                                            ) : null
                                        }
                                        subTitle="Personal details and application."
                                        actions={
                                            <Button variant="outlined">
                                                <PlusIcon className="mr-1 h-4 w-4 text-gray-400" />
                                                <span>Add</span>
                                            </Button>
                                        }
                                    />

                                    <div className="mt-4 py-5 sm:p-0">
                                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            {contact?.contactMeta.map(
                                                (i, idx) => (
                                                    <GridCard key={i.contactId}>
                                                        <div className="mb-4 grid grid-cols-2 gap-2">
                                                            <div className="inline-flex space-x-2">
                                                                <h4 className="flex-shrink-0 font-medium">
                                                                    {i.isPrimaryContact
                                                                        ? "Primary Contact"
                                                                        : `Contact
                                                                    ${idx + 1}`}
                                                                </h4>
                                                            </div>
                                                            <ToggleMenu
                                                                items={[
                                                                    {
                                                                        text: "Edit",
                                                                        onClick:
                                                                            () =>
                                                                                alert(
                                                                                    "Clicked!"
                                                                                ),
                                                                    },
                                                                    {
                                                                        text: "Update",
                                                                        onClick:
                                                                            () =>
                                                                                alert(
                                                                                    "Clicked!"
                                                                                ),
                                                                    },
                                                                    {
                                                                        text: (
                                                                            <div className="flex items-center text-sm text-red-600">
                                                                                <TrashIcon
                                                                                    className="mr-2 h-4 w-4"
                                                                                    aria-hidden="true"
                                                                                />
                                                                                <span>
                                                                                    Delete
                                                                                </span>
                                                                            </div>
                                                                        ),
                                                                        extraClasses:
                                                                            "border-t border-gray-200",
                                                                        href: "/Cool",
                                                                    },
                                                                ]}
                                                            />
                                                        </div>
                                                        <dl className="space-y-1 ">
                                                            <DetailsRow
                                                                title="Name:"
                                                                value={
                                                                    i?.firstName &&
                                                                    i?.lastName
                                                                        ? `${i.firstName} ${i.lastName}`
                                                                        : i?.firstName
                                                                        ? i.firstName
                                                                        : undefined
                                                                }
                                                                valueSpan={3}
                                                            />

                                                            <DetailsRow
                                                                title="Email:"
                                                                value={i?.email}
                                                                valueSpan={3}
                                                            />
                                                            <DetailsRow
                                                                title="Phone:"
                                                                value={
                                                                    i?.phoneNumber
                                                                }
                                                                valueSpan={3}
                                                            />
                                                        </dl>
                                                    </GridCard>
                                                )
                                            )}
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                {/* Upcoming Appointments */}
                <div className="col-span-1 col-start-3 space-y-8">
                    <GridCard>
                        <GridSectionTitle title="Upcoming Appointments" />
                        <ul
                            role="list"
                            className="-mt-3 flow-root divide-y divide-gray-200"
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
                                        1450 Rahway Road, Scotch Plains NJ
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
                            className="mt-3 w-full justify-center"
                        >
                            View All
                        </Button>
                    </GridCard>
                    <GridCard className="">
                        <GridSectionTitle
                            title="Tags"
                            subTitle="A collection of tags"
                        />
                        <ul className="-mx-4 h-[200px] space-y-2 divide-y overflow-auto px-4">
                            {[...Array.from(Array(10).keys())].map((i) => (
                                <li
                                    key={i}
                                    className="flex items-center space-x-4 [&:not(:first-child)]:pt-4"
                                >
                                    <div className="h-2 w-2 rounded-full bg-green-400" />
                                    <div>Tag Name</div>
                                </li>
                            ))}
                        </ul>

                        <Button
                            variant="outlined"
                            className="mt-6 w-full justify-center"
                        >
                            <PlusIcon className="mr-1 h-4 w-4 text-gray-400" />
                            <span>Add</span>
                        </Button>
                    </GridCard>
                </div>
            </div>
        </div>
    );
};

export default ContactDetailOverview;
