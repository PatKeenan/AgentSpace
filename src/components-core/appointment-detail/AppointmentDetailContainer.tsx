import { CalendarIcon, MapPinIcon } from "@heroicons/react/20/solid";
import { SectionHeading, PageBody } from "components-layout";
import { Breadcrumb } from "components-layout/Breadcrumb";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useWorkspace } from "hooks/useWorkspace";
import { Button } from "components-common/Button";
import { useRouter } from "next/router";
import * as React from "react";
import {
    AppointmentDetailList,
    AppointmentDetailMap,
} from "./appointment-detail-components";

import type { AppointmentFormState } from "./types";
import type { FC } from "react";

type SubHeadingProps = {
    text: string;
    icon: FC<React.ComponentProps<"svg">>;
};

const SubHeadingItem = (props: SubHeadingProps) => {
    const { text, icon: Icon } = props;
    return (
        <div className="mt-2 flex items-center text-sm">
            <Icon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden={true}
            />
            <span className="text-gray-500">{text}</span>
        </div>
    );
};

export const AppointmentDetailContainer = () => {
    const router = useRouter();
    const [appointments, setAppointments] = React.useState<
        AppointmentFormState[] | undefined
    >();

    const workspace = useWorkspace();
    const breadCrumbItems = [
        {
            title: "Appointments",
            href: `/workspace/${workspace.id}/appointments`,
            active: false,
        },
        {
            title: router.query.id as string,
            href: `/workspace/${workspace.id}/appointments/${router.query.id}`,
            active: true,
        },
    ];

    return (
        <>
            <Breadcrumb items={breadCrumbItems} />
            <PageBody fullHeight>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>
                            Appointment Details
                        </SectionHeading.Title>

                        <SectionHeading.Subtitle>
                            <div className="flex items-center space-x-6">
                                <SubHeadingItem
                                    icon={CalendarIcon}
                                    text="Saturday January 9, 2020"
                                />
                                <SubHeadingItem
                                    icon={MapPinIcon}
                                    text="Group"
                                />
                            </div>
                        </SectionHeading.Subtitle>
                    </SectionHeading.TitleContainer>
                    <SectionHeading.Actions>
                        <div className="flex pr-1">
                            <span className="hidden sm:block">
                                <Button variant="outlined">
                                    <PencilIcon
                                        className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                        aria-hidden="true"
                                    />
                                    Edit
                                </Button>
                            </span>
                        </div>
                    </SectionHeading.Actions>
                </SectionHeading>

                <div className="flex flex-grow flex-col-reverse p-1  lg:mt-4 lg:grid lg:grid-cols-12 lg:gap-x-4">
                    <div className=" mt-4 h-2/3 lg:col-span-7 lg:h-full">
                        <AppointmentDetailList
                            handleAddAppointment={setAppointments}
                            appointments={appointments}
                        />
                    </div>
                    <div className="relative mt-4 h-1/3 lg:col-start-8 lg:col-end-13 lg:h-full">
                        <AppointmentDetailMap appointments={appointments} />
                    </div>
                </div>
                {/* <div className="mt-8">
                    <EmptyData />
                </div> */}
            </PageBody>
        </>
    );
};

AppointmentDetailContainer.layout = "dashboard";
