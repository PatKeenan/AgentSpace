import { AppointmentModal } from "./appointments-components";
import { SectionHeading, Breadcrumb, PageBody } from "components-layout";
import { Button, SubRouter, Tabs } from "components-common";
import { useAppointmentsUI } from "./useAppointmentsUI";
import { PlusIcon } from "@heroicons/react/20/solid";
import type { NextPageExtended } from "types/index";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import * as React from "react";
import { trpc } from "utils/trpc";
import { useWorkspace } from "hooks/useWorkspace";

const AppointmentsMapView = dynamic(
    () => import("./appointments-components/AppointmentsMapView"),
    {
        suspense: true,
    }
);
const AppointmentsListView = dynamic(
    () => import("./appointments-components/AppointmentsListView"),
    {
        suspense: true,
    }
);

export const AppointmentsContainer: NextPageExtended = () => {
    const { setModal, modal, activeTab, setActiveTab } = useAppointmentsUI();
    const router = useRouter();
    const { id } = useWorkspace();

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName as typeof activeTab);
    };

    const utils = trpc.useContext();

    /*  const invalidate = (date: Date) =>
        utils.appointment.getByDate.invalidate({
            date: String(date),
            workspaceId: id as string,
        }); */

    ///////////////////////////////////
    return (
        <>
            {modal.state && <AppointmentModal />}
            <Breadcrumb
                items={[
                    {
                        title: "Appointments",
                        href: `/workspace/${router.query.workspaceId}/appointments`,
                    },
                ]}
            />

            <PageBody
                fullHeight={activeTab == "View By Day"}
                noMaxWidth
                noPadding
                extraClassName="max-w-7xl"
            >
                <div className="hidden lg:block">
                    <SectionHeading>
                        <SectionHeading.TitleContainer>
                            <SectionHeading.Title>
                                Appointments{" "}
                            </SectionHeading.Title>
                        </SectionHeading.TitleContainer>
                        <SectionHeading.Actions>
                            <Button
                                variant="primary"
                                onClick={() =>
                                    setModal({
                                        state: true,
                                        selectedDate: modal.selectedDate,
                                    })
                                }
                            >
                                <PlusIcon
                                    className="gray-600 h-4 w-4 xl:-ml-0.5 xl:mr-1"
                                    aria-hidden
                                />
                                <span className="hidden xl:block">Add New</span>
                            </Button>
                        </SectionHeading.Actions>
                    </SectionHeading>
                </div>
                <div className="mx-2">
                    <Tabs
                        activeTab={activeTab}
                        id="appointment-tabs"
                        tabs={[{ title: "View By Day" }, { title: "View All" }]}
                        onTabClick={handleTabClick}
                    />
                </div>
                <React.Suspense fallback={<p>Loading..</p>}>
                    <SubRouter
                        component={<AppointmentsListView />}
                        active={activeTab == "View All"}
                    />
                    <SubRouter
                        component={<AppointmentsMapView />}
                        active={activeTab == "View By Day"}
                    />
                </React.Suspense>
            </PageBody>
        </>
    );
};

AppointmentsContainer.layout = "dashboard";
