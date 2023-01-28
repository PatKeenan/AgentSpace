import { NextPageExtended } from "types/index";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Button, Card, ToggleMenu } from "components-common";
import { useProfile } from "hooks/useProfile";
import { useRouter } from "next/router";
import { useContactDetailUi } from "./useContactDetailUi";
import {
    GridCard,
    DetailsRow,
    GridSectionTitle,
} from "./contact-detail-components";
import clsx from "clsx";
import { ContactDetailLayout } from "./contact-detail-components/ContactDetailLayout";

export const ContactDetailProfilesContainer: NextPageExtended = () => {
    const { getManyForContact, update } = useProfile();
    const { setModal } = useContactDetailUi();
    const router = useRouter();

    const contactId = router.query.contactId;

    const { data: profiles, refetch } = getManyForContact(
        { contactId: contactId as string, take: 5 },
        { enabled: typeof contactId == "string" }
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
                                {profiles && profiles.length > 0 ? (
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
                                                    <span className="truncate">
                                                        {i.notes}
                                                    </span>
                                                </div>
                                            )}

                                            {/* <div className="flex items-center justify-between">
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
                                            </div>
                                            <dl className="mt-3 space-y-2">
                                                <dt>Name</dt>
                                                <dd>{i.name}</dd>
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
                                            </dl> */}
                                        </Card>
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
            </div>
        </ContactDetailLayout>
    );
};

ContactDetailProfilesContainer.layout = "dashboard";
ContactDetailProfilesContainer.subLayout = "contact";

{
    /* <Card
    className={clsx(
        createdAt
            ? "mt-3 px-2 pb-4 md:px-6 md:pt-6 md:pb-8 lg:pb-6"
            : "p-3 md:p-6",
        "text-sm"
    )}
>
    <div className="flex flex-auto p-1 md:hidden">
        <div className="relative max-w-md flex-grow space-y-2 overflow-hidden">
            <div className="relative pb-2">
                <h3 className="text-md font-semibold text-gray-600">
                    {date
                        ? format(formatStringToDate(date) || new Date(), "PP")
                        : "--"}
                </h3>
                <span
                    className={clsx(
                        status && statusColorsLight[status],
                        "capitalize",
                        "absolute top-0 right-0 rounded-md px-2 py-1 text-xs"
                    )}
                >
                    {statusDisplay(status)}
                </span>
            </div>

            {time && (
                <div className="flex items-center  text-gray-500">
                    <ClockIcon className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="truncate">{thisOrThat(time, "--")}</span>
                </div>
            )}

            {address && (
                <div className="flex space-x-2">
                    <div className="flex flex-grow  items-center overflow-hidden text-gray-500">
                        <HomeIcon className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span className="overflow-ellipsis line-clamp-2">
                            {thisOrThat(address, "--")}
                        </span>
                    </div>
                    {address_2 && (
                        <div className="block border-l border-l-gray-300 pl-4 md:flex md:border-0">
                            <h4 className=" pb-2 font-medium text-gray-600">
                                Apt/Bldg.
                            </h4>
                            <span className="">
                                {thisOrThat(address_2, "")}
                            </span>
                        </div>
                    )}
                </div>
            )}
            {contacts && contacts.length > 0 && (
                <div className="flex items-center  text-gray-500">
                    <UserGroupIcon className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="truncate">
                        {thisOrThat(contacts, "--")}
                    </span>
                </div>
            )}
        </div>
        <div className="ml-auto flex flex-shrink-0 items-center px-4">
            <button>
                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
            </button>
        </div>
    </div>

</Card>;
 */
}
