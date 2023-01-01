import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusIcon,
} from "@heroicons/react/20/solid";
import { SectionHeading, Breadcrumb, PageBody } from "components-layout";
import { useWorkspace, useCalendar, useAppointments } from "hooks";
import { Loading, NoData, Button, Calendar } from "components-common";
import { TruckIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import * as React from "react";
import clsx from "clsx";
import {
    isToday,
    isThisMonth,
    isSameDay,
    isSameMonth,
    format,
    isTomorrow,
    isYesterday,
} from "date-fns";

import { AppointmentCard, AppointmentModal } from "./appointments-components";
import { useAppointmentsUI } from "./useAppointmentsUI";

import type { NextPageExtended } from "types/index";
import { dateUtils } from "utils/dateUtils";
import { isEmpty } from "./appointments-utils";
import { trpc } from "utils/trpc";
import dynamic from "next/dynamic";

const AppointmentsMap = dynamic(
    () => import("./appointments-components/AppointmentsMap"),
    {
        ssr: false,
    }
);

export const AppointmentsContainer: NextPageExtended = () => {
    const appointments = useAppointments();
    const workspace = useWorkspace();
    const { setModal, modal, resetModal } = useAppointmentsUI();
    const router = useRouter();
    const utils = trpc.useContext();

    const [selectedDate, setSelectedDate] = React.useState<Date>(
        () => new Date()
    );
    const [activeMonth, setActiveMonth] = React.useState<Date>(
        () => new Date()
    );
    const invalidate = () =>
        utils.appointment.getByMonth.invalidate({
            date: String(activeMonth),
            workspaceId: workspace.id as string,
        });

    const appointmentsQuery = appointments.getByMonth(
        {
            workspaceId: workspace.id as string,
            date: String(activeMonth),
        },
        { refetchOnWindowFocus: false }
    );

    const statusIndicators = React.useMemo(
        () => appointmentsQuery.data?.flatMap((i) => i.date),
        [appointmentsQuery.data]
    );

    const filteredAppointmentsByDate = React.useCallback(() => {
        const data = appointmentsQuery.data?.filter((i) => {
            return (
                dateUtils.transform(new Date(i.date)).isoDateOnly ==
                dateUtils.transform(selectedDate).isoDateOnly
            );
        });
        const sorted = data?.sort((a) =>
            typeof a.startTime == undefined ? 1 : -1
        );
        if (sorted) {
            return sorted;
        }
        return [];
    }, [selectedDate, appointmentsQuery]);

    const handleOnSuccess = () => {
        invalidate().then(() => resetModal());
    };

    ///////////////////////////////////
    return (
        <>
            <Breadcrumb
                items={[
                    {
                        title: "Appointments",
                        href: `/workspace/${router.query.workspaceId}/appointments`,
                    },
                ]}
            />
            {modal.state && (
                <AppointmentModal
                    selectedDate={dateUtils.transform(selectedDate).isoDateOnly}
                    onSuccessCallback={handleOnSuccess}
                />
            )}
            <PageBody fullHeight noMaxWidth extraClassName="max-w-7xl">
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>
                            Appointments{" "}
                        </SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>

                <div className="mt-3 lg:grid lg:h-full lg:grid-cols-12 lg:gap-x-8 lg:overflow-hidden">
                    <div className="flex h-full flex-1 flex-col overflow-hidden pr-2 lg:col-span-6">
                        <div className="flex items-center justify-between border-b border-b-gray-200 pt-2 pb-4">
                            <div className="flex items-center space-x-4">
                                <p className="text-lg font-normal">
                                    {isToday(selectedDate)
                                        ? "Today "
                                        : isTomorrow(selectedDate)
                                        ? "Tomorrow "
                                        : isYesterday(selectedDate)
                                        ? "Yesterday "
                                        : `${format(selectedDate, "EEEE")}, `}
                                    {format(selectedDate, "PPP")}
                                </p>
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 p-3 text-xs">
                                    {filteredAppointmentsByDate()?.length}
                                </div>
                            </div>
                            <Button
                                variant="primary"
                                onClick={() => setModal({ state: true })}
                            >
                                <PlusIcon
                                    className="gray-600 -ml-0.5 mr-1 h-4 w-4"
                                    aria-hidden
                                />
                                Add New
                            </Button>
                        </div>

                        <div className="flex flex-grow flex-col overflow-hidden">
                            <ul className="h-full space-y-4 overflow-auto py-4 pb-4 text-sm leading-6">
                                {appointmentsQuery.isLoading &&
                                !appointmentsQuery.data ? (
                                    <Loading />
                                ) : !isEmpty(filteredAppointmentsByDate()) ? (
                                    filteredAppointmentsByDate().map(
                                        (i, idx) => (
                                            <li
                                                key={i.id}
                                                className="relative lg:mx-2"
                                            >
                                                <AppointmentCard
                                                    idx={idx}
                                                    appointment={i}
                                                    invalidate={invalidate}
                                                />
                                            </li>
                                        )
                                    )
                                ) : (
                                    <div className="grid h-full w-full place-items-center">
                                        <NoData
                                            icon={TruckIcon}
                                            title="No Appointments"
                                            message="Get started by adding a appointment for this date."
                                        />
                                    </div>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col lg:col-span-6">
                        <div className="mb-4 w-full">
                            <Calendar
                                activeMonth={activeMonth}
                                onChangeMonth={setActiveMonth}
                                selectedDate={selectedDate}
                                onSelectDay={setSelectedDate}
                                statusIndicatorsArr={statusIndicators}
                            />
                        </div>
                        <div className="h-2/3 w-full">
                            <React.Suspense fallback={""}>
                                <AppointmentsMap
                                    appointments={filteredAppointmentsByDate()}
                                />
                            </React.Suspense>
                        </div>
                    </div>
                </div>
            </PageBody>
        </>
    );
};

AppointmentsContainer.layout = "dashboard";
