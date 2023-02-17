import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Button, ToggleMenu } from "components-common";
import { useProfile } from "hooks/useProfile";
import { useRouter } from "next/router";
import React from "react";
import { useContactDetailUi } from "../useContactDetailUi";
import { DetailsRow } from "./DetailsRow";

import { GridCard } from "./GridCard";
import { GridSectionTitle } from "./GridSectionTitle";

export const ContactProfilesList = (
    htmlProps: React.ComponentProps<"section">
) => {
    const { getManyForContact, update } = useProfile();
    const { setModal } = useContactDetailUi();
    const router = useRouter();

    const contactId = router.query.contactId;

    const { data: profiles, refetch } = getManyForContact(
        { contactId: contactId as string, take: 5 },
        { enabled: typeof contactId == "string", refetchOnWindowFocus: false }
    );
    const { mutate } = update();

    const handleSoftDelete = (id: string) => {
        mutate({ id, deleted: true }, { onSuccess: () => refetch() });
    };

    return (
        <section {...htmlProps}>
            <div className="space-y-6">
                <div>
                    <GridSectionTitle
                        titleIcon={
                            profiles ? (
                                <div className="flex h-5 w-5 justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                                    <span className="my-auto">
                                        {profiles?.length}
                                    </span>
                                </div>
                            ) : null
                        }
                        title="Profiles"
                        subTitle="Personal details and application."
                        actions={
                            <Button
                                variant="outlined"
                                onClick={() =>
                                    setModal({ state: true, form: "profile" })
                                }
                            >
                                <PlusIcon className="mr-1 h-4 w-4 text-gray-400" />
                                <span>Add</span>
                            </Button>
                        }
                    />

                    <div className="mt-4 py-5 sm:p-0">
                        <dl className="grid grid-cols-1 gap-4">
                            {profiles && profiles.length > 0 ? (
                                profiles.map((i) => (
                                    <GridCard key={i.id}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <h3 className="font-medium capitalize">
                                                    {i.type.toLowerCase()}
                                                </h3>

                                                <p
                                                    className={clsx(
                                                        i.active
                                                            ? "text-green-600"
                                                            : "text-gray-500",
                                                        "text-xs font-medium uppercase"
                                                    )}
                                                >
                                                    {i.active
                                                        ? "Active"
                                                        : "Not Active"}
                                                </p>
                                            </div>
                                            <ToggleMenu
                                                items={[
                                                    {
                                                        text: "Edit",
                                                        onClick: () =>
                                                            setModal({
                                                                state: true,
                                                                form: "profile",
                                                                defaultData: i,
                                                            }),
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
                                                            handleSoftDelete(
                                                                i.id
                                                            ),
                                                    },
                                                ]}
                                            />
                                        </div>
                                        <dl className="mt-3 space-y-2">
                                            <DetailsRow
                                                title="Name:"
                                                value={i.name}
                                                valueSpan={3}
                                            />
                                            <DetailsRow
                                                title="Notes:"
                                                value={i.notes}
                                                valueSpan={3}
                                                rawText
                                            />
                                        </dl>
                                    </GridCard>
                                ))
                            ) : (
                                <p className="text-center text-sm text-gray-600">
                                    No profiles found
                                </p>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    );
};
