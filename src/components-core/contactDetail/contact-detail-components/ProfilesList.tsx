import clsx from "clsx";
import { useProfile } from "hooks/useProfile";
import { useWorkspace } from "hooks/useWorkspace";
import { SidebarList } from "./SidebarList";

export const ProfilesList = ({ contactId }: { contactId: string }) => {
    const { getManyForContact } = useProfile();

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
                <div>
                    <div className="flex space-x-2">
                        <div className="flex items-center overflow-hidden">
                            <h4 className="truncate text-sm font-semibold capitalize text-gray-800">
                                {i.name}
                            </h4>
                            <div
                                className={clsx(
                                    i.active ? "bg-green-400" : "bg-gray-400",
                                    "my-auto ml-2 h-1.5 w-1.5 rounded-full"
                                )}
                            />
                        </div>
                        <span className="flex-shrink-0 text-sm capitalize text-gray-500/80">
                            ({i.type.toLowerCase()})
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {i.notes}
                    </p>
                </div>
            )}
            buttonTitle={"View All"}
        />
    );
};
