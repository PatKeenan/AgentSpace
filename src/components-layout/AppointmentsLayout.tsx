import { AppointmentModal } from "components-core/appointments/appointments-components";
import { Breadcrumb, PageBody, SectionHeading } from "components-common";
import { useAppointmentsUI } from "components-core/appointments";
import { Button } from "components-common/Button";
import { useRouter } from "next/router";
import React from "react";

export const AppointmentsLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const router = useRouter();
    const { setModal, modal } = useAppointmentsUI();
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
                fullHeight={
                    router.pathname == "/workspace/[workspaceId]/appointments"
                }
                noMaxWidth
                noPadding
                extraClassName="max-w-7xl"
            >
                <div className="hidden lg:block">
                    <SectionHeading>
                        <SectionHeading.TitleContainer>
                            <SectionHeading.Title>
                                Appointments
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
                                actionIcon="add"
                            >
                                Add New
                            </Button>
                        </SectionHeading.Actions>
                    </SectionHeading>
                </div>
                {children}
            </PageBody>
        </>
    );
};
