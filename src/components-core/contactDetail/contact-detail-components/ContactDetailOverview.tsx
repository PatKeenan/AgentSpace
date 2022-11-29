import { ContactDetailOverviewModal } from "./ContactDetailOverviewModal";
import { useContactDetailUi } from "../useContactDetailUi";
import { ToggleMenu } from "components-common/ToggleMenu";
import { PlusIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/20/solid";
import { GridSectionTitle } from "./GridSectionTitle";
import { Loading } from "components-common/Loading";
import { ContactMetaSchema } from "server/schemas";
import { Button } from "components-common/Button";
import { useWorkspace } from "hooks/useWorkspace";
import { useContacts } from "hooks/useContacts";
import { DetailsRow } from "./DetailsRow";
import { useRouter } from "next/router";
import { exists } from "utils/helpers";
import { GridCard } from "./GridCard";
import React from "react";

import type { ContactMeta } from "@prisma/client";

const ContactDetailOverview = () => {
    const workspace = useWorkspace();
    const router = useRouter();
    const { softDeleteMeta, getOne } = useContacts();

    const { setModalOpen, setDefaultModalData, setContactDisplayName } =
        useContactDetailUi();

    const id = router.query.contactId;

    const {
        data: contact,
        isLoading: loadingPerson,
        refetch,
    } = getOne(
        { id: id as string, workspaceId: workspace.id as string },
        {
            enabled: exists(id) && exists(workspace.id),
        }
    );

    const { mutate: deleteMetaMutation } = softDeleteMeta();

    const handleClick = (contactMeta: ContactMeta) => {
        setModalOpen(true);
        const { lastName, firstName, email, phoneNumber, contactId, id } =
            contactMeta;

        setDefaultModalData({
            lastName: lastName as string | undefined,
            email: email as string | undefined,
            firstName: firstName as string,
            phoneNumber: phoneNumber as string | undefined,
            contactId,
            id,
        });
    };

    const handleDeleteMeta = (id: string) => {
        deleteMetaMutation(
            { id },
            {
                onSuccess: (data) => {
                    refetch();
                },
            }
        );
    };

    React.useEffect(() => {
        return () => {
            if (router.query.contactId !== contact?.id) {
                setContactDisplayName(undefined);
            }
        };
    }, [router, setContactDisplayName, contact]);

    React.useEffect(() => {
        setContactDisplayName(contact?.displayName);
    }, [setContactDisplayName, contact]);

    return loadingPerson && !contact ? (
        <Loading />
    ) : (
        <div>
            <ContactDetailOverviewModal />
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                {/* General Info */}
                <div className="grid grid-cols-1 gap-4 pb-4 lg:col-span-2 lg:pb-0">
                    <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                        <section>
                            <div className="space-y-6">
                                <div>
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
                                            <Button
                                                variant="outlined"
                                                onClick={() =>
                                                    setModalOpen(true)
                                                }
                                            >
                                                <PlusIcon className="mr-1 h-4 w-4 text-gray-400" />
                                                <span>Add</span>
                                            </Button>
                                        }
                                    />

                                    <div className="mt-4 py-5 sm:p-0">
                                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            {contact?.contactMeta.map(
                                                (i, idx) => (
                                                    <GridCard key={i.id}>
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
                                                                                handleClick(
                                                                                    i
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
                                                                        onClick:
                                                                            () =>
                                                                                handleDeleteMeta(
                                                                                    i.id
                                                                                ),
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
                <div className="col-span-1 col-start-3 space-y-8 border-t pt-4 lg:mt-0 lg:border-t-0 lg:pt-0">
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
