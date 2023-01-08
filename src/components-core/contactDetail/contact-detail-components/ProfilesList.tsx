import { PlusIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { IconButton } from "components-common/Button";
import { useProfile } from "hooks/useProfile";
import { useWorkspace } from "hooks/useWorkspace";
import { useContactDetailUi } from "../useContactDetailUi";
import { SidebarList } from "./SidebarList";

export const ProfilesList = ({ contactId }: { contactId: string }) => {
    const { getManyForContact } = useProfile();
    const { setModal } = useContactDetailUi();

    const { data: profiles } = getManyForContact(
        { contactId: contactId as string, take: 3 },
        { enabled: typeof contactId == "string" }
    );
    const { id } = useWorkspace();

    return (
        <SidebarList
            title="Profiles"
            href={`/workspace/${id}/contacts/${contactId}/profiles`}
            data={profiles}
            renderItem={(i) => (
                <div className="block">
                    <div className="flex items-center space-x-2 truncate text-sm">
                        <p className="font-medium capitalize text-gray-600">
                            {i.type.toLowerCase()}:
                        </p>
                        <div className="flex items-center">
                            <span
                                className={clsx(
                                    i.active ? "bg-green-400" : "bg-gray-200",
                                    "mr-1 h-1 w-1 rounded-full"
                                )}
                            />
                            <span className="ml-.5 truncate text-gray-600">
                                {i.name}
                            </span>
                        </div>
                    </div>
                </div>
            )}
            buttonTitle={"View All"}
            action={
                <IconButton
                    title="Add Profile"
                    textColor="text-gray-500 group-hover:text-gray-600"
                    icon={PlusIcon}
                    onClick={() => setModal({ state: true, form: "profile" })}
                />
            }
        />
    );
};
