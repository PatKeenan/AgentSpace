import { useContactDetailUi } from "../useContactDetailUi";
import { ToggleMenu } from "components-common/ToggleMenu";
import { PlusIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useContactMeta } from "hooks/useContactMeta";
import { GridSectionTitle } from "./GridSectionTitle";
import { Button } from "components-common/Button";

import { DetailsRow } from "./DetailsRow";
import { GridCard } from "./GridCard";

import type { ContactMeta } from "@prisma/client";

export const ContactMetaList = ({ contactId }: { contactId: string }) => {
    const { getAllForContact, softDeleteMeta } = useContactMeta();
    const { setModal } = useContactDetailUi();

    const { data: contactMetas, refetch } = getAllForContact({ contactId });
    const { mutate: deleteMetaMutation } = softDeleteMeta();

    const handleClick = (contactMeta: ContactMeta) => {
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
            form: "contactMeta",
        });
    };

    const handleDeleteMeta = (id: string) => {
        deleteMetaMutation(
            { id },
            {
                onSuccess: () => {
                    refetch();
                },
            }
        );
    };

    return (
        <section>
            <div className="space-y-6">
                <div>
                    <GridSectionTitle
                        title="Contacts"
                        titleIcon={
                            contactMetas ? (
                                <div className="flex h-5 w-5 justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                                    <span className="my-auto">
                                        {contactMetas.length}
                                    </span>
                                </div>
                            ) : null
                        }
                        subTitle="People that are associated with each other."
                        actions={
                            <Button
                                variant="outlined"
                                onClick={() =>
                                    setModal({
                                        state: true,
                                        form: "contactMeta",
                                    })
                                }
                            >
                                <PlusIcon className="mr-1 h-4 w-4 text-gray-400" />
                                <span>Add</span>
                            </Button>
                        }
                    />

                    <div className="mt-4 py-5 sm:p-0">
                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {contactMetas?.map((i, idx) => (
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
                                            items={
                                                i.isPrimaryContact
                                                    ? [
                                                          {
                                                              text: "Edit",
                                                              onClick: () =>
                                                                  handleClick(
                                                                      i
                                                                  ),
                                                          },
                                                      ]
                                                    : [
                                                          {
                                                              text: "Edit",
                                                              onClick: () =>
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
                                                              onClick: () =>
                                                                  handleDeleteMeta(
                                                                      i.id
                                                                  ),
                                                          },
                                                      ]
                                            }
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
                </div>
            </div>
        </section>
    );
};
