import { NextPageExtended } from "types/index";
import { TrashIcon } from "@heroicons/react/20/solid";
import { Button, Card, NoData, ToggleMenu } from "components-common";
import { useProfile } from "hooks/useProfile";
import { useRouter } from "next/router";
import { useContactDetailUi } from "./useContactDetailUi";
import { GridSectionTitle } from "./contact-detail-components";
import clsx from "clsx";
import { ContactDetailLayout } from "./contact-detail-components/ContactDetailLayout";
import { isEmpty } from "utils/isEmpty";

export const ContactDetailProfilesContainer: NextPageExtended = () => {
    const { getManyForContact, update } = useProfile();
    const { setModal } = useContactDetailUi();
    const router = useRouter();

    const contactId = router.query.contactId;

    const {
        data: profiles,
        refetch,
        isLoading,
    } = getManyForContact(
        { contactId: contactId as string, take: 5 },
        { enabled: typeof contactId == "string", refetchOnWindowFocus: false }
    );
    const { mutate } = update();

    const handleSoftDelete = (id: string) => {
        mutate({ id, deleted: true }, { onSuccess: () => refetch() });
    };

    return (
        <ContactDetailLayout activeTab="Profiles">
            <div>
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
                                    variant="primary"
                                    onClick={() =>
                                        setModal({
                                            state: true,
                                            form: "profile",
                                        })
                                    }
                                    actionIcon="add"
                                >
                                    Add New
                                </Button>
                            }
                        />

                        <div className="mt-4 py-5 sm:p-0">
                            <dl className="grid grid-cols-1 gap-4">
                                {!isLoading && isEmpty(profiles) ? (
                                    <NoData
                                        height="h-[70vh]"
                                        title="No profiles"
                                        message="Start by adding a new profile."
                                    />
                                ) : profiles && profiles.length > 0 ? (
                                    profiles.map((i) => (
                                        <Card key={i.id} className="relative">
                                            <div className="absolute right-4 top-4 md:top-6 md:right-6">
                                                <ToggleMenu
                                                    items={[
                                                        {
                                                            text: "Edit",
                                                            onClick: () =>
                                                                setModal({
                                                                    state: true,
                                                                    form: "profile",
                                                                    defaultData:
                                                                        i,
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
                                                                "border-t border-gray-200 ",
                                                            onClick: () =>
                                                                handleSoftDelete(
                                                                    i.id
                                                                ),
                                                        },
                                                    ]}
                                                />
                                            </div>
                                            <div className="flex flex-auto p-1 ">
                                                <div className="flex max-w-md flex-grow items-center space-x-2 overflow-hidden sm:items-start">
                                                    <h3 className="text-md break-words font-semibold text-gray-600">
                                                        {i.name}
                                                        <span className="ml-3 text-sm font-medium capitalize text-gray-500">
                                                            (
                                                            {i.type.toLocaleLowerCase()}
                                                            )
                                                        </span>
                                                    </h3>
                                                    <div
                                                        className={clsx(
                                                            i.active
                                                                ? "bg-green-400"
                                                                : "bg-gray-400",
                                                            "my-auto h-2 w-2 rounded-full"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            {i.notes && (
                                                <div className="flex items-center  text-gray-500">
                                                    <span>{i.notes}</span>
                                                </div>
                                            )}
                                        </Card>
                                    ))
                                ) : null}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </ContactDetailLayout>
    );
};

ContactDetailProfilesContainer.layout = "dashboard";
ContactDetailProfilesContainer.subLayout = "contact";
