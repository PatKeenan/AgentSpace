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
import { PlusIcon } from "@heroicons/react/24/outline";
import { ToggleMenu } from "components-common/ToggleMenu";
import { EnvelopeIcon, PhoneIcon, TrashIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

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
                                    <div className="relative rounded-md border border-gray-100 bg-white p-4 shadow">
                                        <dl className="space-y-3 divide-y">
                                            <div className="grid grid-cols-4">
                                                <dt className="text-gray-899 text-sm font-medium">
                                                    Display Name:
                                                </dt>
                                                <dd className="col-span-3 text-gray-600">
                                                    {contact?.displayName}
                                                </dd>
                                            </div>
                                            <div className="grid grid-cols-4 pt-3">
                                                <dt className="text-gray-899 text-sm font-medium">
                                                    First Name:
                                                </dt>
                                                <dd className="col-span-3 text-gray-600">
                                                    {primaryContact?.firstName}
                                                </dd>
                                            </div>
                                            <div className="grid grid-cols-4 pt-3">
                                                <dt className="text-gray-899 text-sm font-medium">
                                                    Last Name:
                                                </dt>
                                                <dd className="col-span-3 text-gray-600">
                                                    {primaryContact?.lastName ||
                                                        "---"}
                                                </dd>
                                            </div>
                                            <div className="grid grid-cols-4 pt-3">
                                                <dt className="text-gray-899 text-sm font-medium">
                                                    Phone:
                                                </dt>
                                                <dd className="col-span-2 text-gray-600">
                                                    {primaryContact?.phoneNumber ||
                                                        "---"}
                                                </dd>
                                                {primaryContact?.phoneNumber ? (
                                                    <div className="ml-auto">
                                                        <button
                                                            type="button"
                                                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        >
                                                            <PhoneIcon
                                                                className="-ml-1 mr-2 h-4 w-4 text-gray-400"
                                                                aria-hidden="true"
                                                            />
                                                            <span>Phone</span>
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="grid grid-cols-4 items-center pt-3">
                                                <dt className="text-gray-899 text-sm font-medium">
                                                    Email:
                                                </dt>
                                                <dd className="col-span-2 text-gray-600">
                                                    {primaryContact?.email ||
                                                        "---"}
                                                </dd>
                                                {primaryContact?.email ? (
                                                    <div className="ml-auto">
                                                        <button
                                                            type="button"
                                                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        >
                                                            <EnvelopeIcon
                                                                className="-ml-1 mr-2 h-4 w-4 text-gray-400"
                                                                aria-hidden="true"
                                                            />
                                                            <span>Email</span>
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <GridSectionTitle
                                        title="Sub Contacts"
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
                                        <dl className="grid grid-cols-2 gap-4">
                                            {contact?.contactMeta.map(
                                                (i, idx) => (
                                                    <div
                                                        key={i.contactId}
                                                        className="rounded-md border border-gray-100 bg-white p-4 shadow"
                                                    >
                                                        <div className="mb-4 grid grid-cols-2 gap-2">
                                                            <div className="inline-flex space-x-2">
                                                                <h4 className="flex-shrink-0 font-medium">
                                                                    Contact{" "}
                                                                    {idx + 1}
                                                                </h4>
                                                                {i.isPrimaryContact ? (
                                                                    <div className="ml-auto flex justify-center rounded-lg bg-purple-100 px-1.5 py-0.5 text-xs font-medium">
                                                                        <span className="my-auto text-purple-600">
                                                                            Primary
                                                                        </span>
                                                                    </div>
                                                                ) : null}
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
                                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                                            <div className="text-sm">
                                                                <h5 className="font-medium text-gray-700">
                                                                    First Name
                                                                </h5>
                                                                <p className="text-gray-500">
                                                                    {i.firstName ||
                                                                        "---"}
                                                                </p>
                                                            </div>
                                                            <div className="text-sm">
                                                                <h5 className="font-medium text-gray-700">
                                                                    Last Name
                                                                </h5>
                                                                <p className="font-medium text-gray-500">
                                                                    {i?.lastName ||
                                                                        "---"}
                                                                </p>
                                                            </div>
                                                            <div className=" text-sm">
                                                                <h5 className="font-medium text-gray-700">
                                                                    Email
                                                                </h5>
                                                                <p className="break-words  text-gray-500">
                                                                    {i.email ||
                                                                        "---"}
                                                                </p>
                                                            </div>
                                                            <div className=" text-sm">
                                                                <h5 className="font-medium text-gray-700">
                                                                    Phone
                                                                </h5>
                                                                <p className="text-gray-500">
                                                                    {i.phoneNumber ||
                                                                        "---"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                {/* Upcoming Showings */}
                <div className="col-span-1 col-start-3">
                    <GridCard>
                        <GridSectionTitle title="Upcoming Showings" />
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
                </div>
            </div>
        </div>
    );
};

export default ContactDetailOverview;

const GridSectionTitle = (props: {
    title: string;
    subTitle?: string;
    actions?: React.ReactNode | React.ReactNode[];
    titleIcon?: React.ReactNode | React.ReactNode[];
}) => {
    const { title, subTitle, actions, titleIcon } = props;
    return (
        <div className="mb-4 flex items-center">
            <div
                className={clsx(
                    "flex-shrink-0 space-y-1",
                    !actions && "flex-grow"
                )}
            >
                <div className="inline-flex items-center space-x-2">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {title}
                    </h3>
                    {titleIcon ? titleIcon : null}
                </div>

                {subTitle ? (
                    <p className="max-w-2xl text-sm text-gray-500">
                        {subTitle}
                    </p>
                ) : null}
            </div>
            {actions ? (
                <>
                    <div className="flex flex-grow"></div>
                    <div className="flex-shrink-0">{actions}</div>
                </>
            ) : null}
        </div>
    );
};

const GridCard = (htmlProps: React.ComponentProps<"div">) => (
    <div
        className={clsx(
            "relative overflow-hidden rounded-lg border border-gray-100 bg-white p-4 shadow",
            htmlProps.className
        )}
        {...htmlProps}
    />
);
