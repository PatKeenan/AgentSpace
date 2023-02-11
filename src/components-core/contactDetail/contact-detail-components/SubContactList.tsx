import { useContactDetailUi } from "../useContactDetailUi";
import { ToggleMenu } from "components-common/ToggleMenu";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useSubContacts } from "hooks/useSubContacts";
import { GridSectionTitle } from "./GridSectionTitle";
import { Button } from "components-common/Button";

import { DetailsRow } from "./DetailsRow";
import { GridCard } from "./GridCard";

import type { SubContact } from "@prisma/client";
import { trpc } from "utils/trpc";
import { NoData } from "components-common/NoData";

export const SubContactList = ({
    subContacts,
}: {
    subContacts: SubContact[] | undefined;
}) => {
    const { softDeleteMeta } = useSubContacts();
    const { setModal } = useContactDetailUi();
    const utils = trpc.useContext();

    const { mutate: deleteMetaMutation } = softDeleteMeta();

    const handleClick = (contactMeta: SubContact) => {
        setModal({ state: true });
        const { lastName, firstName, email, phoneNumber, contactId, id } =
            contactMeta;

        setModal({
            defaultData: {
                lastName: lastName as string | undefined,
                email: email as string | undefined,
                firstName: firstName as string,
                phoneNumber: phoneNumber as string | undefined,
                contactId,
                id,
            },
            form: "subContact",
        });
    };

    const handleDeleteMeta = (id: string) => {
        deleteMetaMutation(
            { id },
            {
                onSuccess: (data) => {
                    utils.contacts.getOne.invalidate({ id: data.contactId });
                },
            }
        );
    };

    return (
        <section>
            <div className="space-y-6">
                <div>
                    <GridSectionTitle
                        title="Secondary Contacts"
                        titleIcon={
                            subContacts ? (
                                <div className="flex h-5 w-5 justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                                    <span className="my-auto">
                                        {subContacts.length}
                                    </span>
                                </div>
                            ) : null
                        }
                        subTitle="People that are associated with each other."
                        actions={
                            <Button
                                variant="primary"
                                onClick={() =>
                                    setModal({
                                        state: true,
                                        form: "subContact",
                                    })
                                }
                                actionIcon="add"
                            >
                                Add New
                            </Button>
                        }
                    />

                    {subContacts && subContacts.length > 0 ? (
                        <div className="mt-4 py-5 sm:p-0">
                            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {subContacts?.map((i, idx) => (
                                    <GridCard key={i.id}>
                                        <div className="mb-4 grid grid-cols-2 gap-2">
                                            <div className="inline-flex space-x-2">
                                                <h4 className="flex-shrink-0 font-medium">
                                                    {`Contact ${idx + 1}`}
                                                </h4>
                                            </div>
                                            <ToggleMenu
                                                items={[
                                                    {
                                                        text: "Edit",
                                                        onClick: () =>
                                                            handleClick(i),
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
                                                        onClick: () =>
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
                                                    i?.firstName && i?.lastName
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
                                                value={i?.phoneNumber}
                                                valueSpan={3}
                                            />
                                        </dl>
                                    </GridCard>
                                ))}
                            </dl>
                        </div>
                    ) : (
                        <p className="mt-8 text-center text-sm text-gray-500">
                            No Secondary Contacts
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};
