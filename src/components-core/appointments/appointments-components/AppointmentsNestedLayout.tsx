import { Button, Tabs } from "components-common";
import { useAppointmentsUI } from "../useAppointmentsUI";

import { useRouter } from "next/router";
import * as React from "react";

export const AppointmentsNestedLayout = ({
    activeTab,
    children,
}: {
    activeTab: "View By Day" | "View All";
    children: React.ReactNode;
}) => {
    const { setModal, modal } = useAppointmentsUI();
    const router = useRouter();

    const tabs: { title: typeof activeTab; href: string }[] = [
        {
            title: "View By Day",
            href: `/workspace/${router.query.workspaceId}/appointments`,
        },
        {
            title: "View All",
            href: `/workspace/${router.query.workspaceId}/appointments/view-all`,
        },
    ];

    ///////////////////////////////////
    return (
        <>
            <div className="mx-2">
                <Tabs
                    activeTab={activeTab}
                    id="appointment-tabs"
                    tabs={tabs}
                    actions={
                        activeTab == "View All" ? (
                            <Button
                                variant="primary"
                                onClick={() =>
                                    setModal({
                                        state: true,
                                        selectedDate: modal.selectedDate,
                                    })
                                }
                                actionIcon="add"
                                className="mb-1 md:mb-0 lg:hidden"
                            >
                                Add New
                            </Button>
                        ) : null
                    }
                />
            </div>
            {children}
        </>
    );
};
