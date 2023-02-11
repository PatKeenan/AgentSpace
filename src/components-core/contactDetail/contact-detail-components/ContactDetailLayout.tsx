//This is a layout for the contact components. See the other layout in components-layouts from the contact page layouts
import React, { Suspense } from "react";
import { Tabs } from "components-common";

import { useRouter } from "next/router";
import { useWorkspace } from "hooks";
import { ErrorBoundary } from "components-core/ErrorBoundary";

export const ContactDetailLayout = ({
    children,
    activeTab,
}: {
    children: React.ReactNode;
    activeTab: "Overview" | "Profiles" | "Appointments";
}) => {
    const router = useRouter();
    const id = router.query.contactId;

    const workspace = useWorkspace();

    const tabs: { title: typeof activeTab; href: string }[] = [
        {
            title: "Overview",
            href: `/workspace/${workspace.id}/contacts/${id}`,
        },
        {
            title: "Appointments",
            href: `/workspace/${workspace.id}/contacts/${id}/appointments`,
        },
        {
            title: "Profiles",
            href: `/workspace/${workspace.id}/contacts/${id}/profiles`,
        },
    ];

    return (
        <>
            <div className="mb-6">
                <Tabs
                    activeTab={activeTab}
                    id="contact-detail-tabs"
                    tabs={tabs}
                />
            </div>
            <ErrorBoundary>
                <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </ErrorBoundary>
        </>
    );
};
