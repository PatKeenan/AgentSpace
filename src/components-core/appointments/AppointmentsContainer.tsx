import { AppointmentCard, AppointmentModal } from "./appointments-components";
import { SectionHeading, Breadcrumb, PageBody } from "components-layout";
import { Loading, NoData, Button, Calendar } from "components-common";
import { isToday, format, isTomorrow, isYesterday } from "date-fns";
import { TruckIcon } from "@heroicons/react/24/outline";
import { useAppointmentsUI } from "./useAppointmentsUI";
import { useWorkspace, useAppointments } from "hooks";
import { PlusIcon, PlusSmallIcon } from "@heroicons/react/20/solid";
import type { NextPageExtended } from "types/index";
import { isEmpty, useSelectedDate } from "./appointments-utils";
import { dateUtils } from "utils/dateUtils";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { trpc } from "utils/trpc";
import * as React from "react";

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
    /*  const { selectedDate, setSelectedDate, activeMonth, setActiveMonth } =
        useSelectedDate(new Date()); */

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
        const hasStartTimes: typeof data = [];
        const noStartTimes: typeof data = [];

        data?.map((i) => {
            if (i.startTime) {
                return hasStartTimes.push(i);
            }
            return noStartTimes.push(i);
        });

        const sorted = hasStartTimes.concat(noStartTimes);

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
            {modal.state && (
                <AppointmentModal
                    selectedDate={dateUtils.transform(selectedDate).isoDateOnly}
                    onSuccessCallback={handleOnSuccess}
                />
            )}
            <div className="hidden lg:block">
                <Breadcrumb
                    items={[
                        {
                            title: "Appointments",
                            href: `/workspace/${router.query.workspaceId}/appointments`,
                        },
                    ]}
                />
            </div>

            <PageBody fullHeight noMaxWidth extraClassName="max-w-7xl">
                <div className="hidden lg:block">
                    <SectionHeading>
                        <SectionHeading.TitleContainer>
                            <SectionHeading.Title>
                                Appointments{" "}
                            </SectionHeading.Title>
                        </SectionHeading.TitleContainer>
                    </SectionHeading>
                </div>
                <div className="flex flex-col lg:mt-3 lg:grid lg:h-full lg:grid-cols-12 lg:gap-x-8 lg:overflow-hidden">
                    {/* Left Side */}
                    <div className="order-2 flex h-full flex-1 flex-col overflow-hidden pr-2 pl-2 lg:order-1 lg:col-span-6 lg:pl-0">
                        <div className="hidden items-center justify-between border-b border-b-gray-200 pt-2 pb-4 lg:flex">
                            <div className="flex items-center space-x-4">
                                <p className="text-lg font-normal">
                                    {isToday(selectedDate)
                                        ? "Today "
                                        : isTomorrow(selectedDate)
                                        ? "Tomorrow "
                                        : isYesterday(selectedDate)
                                        ? "Yesterday "
                                        : `${format(selectedDate, "EEEE")}, `}
                                    {format(selectedDate, "PP")}
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
                                    className="gray-600 h-4 w-4 xl:-ml-0.5 xl:mr-1"
                                    aria-hidden
                                />
                                <span className="hidden xl:block">Add New</span>
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
                    <div className="order-1 flex flex-shrink-0 flex-col lg:order-2 lg:col-span-6">
                        <div className="mb-1 w-full border-b border-gray-200 lg:mb-4 lg:border-b-0">
                            <Calendar
                                activeMonth={activeMonth}
                                onChangeMonth={setActiveMonth}
                                selectedDate={selectedDate}
                                onSelectDay={setSelectedDate}
                                statusIndicatorsArr={statusIndicators}
                                mobileActionButton={
                                    <div>
                                        <Button
                                            variant="primary"
                                            onClick={() =>
                                                setModal({ state: true })
                                            }
                                        >
                                            <span className="sr-only">
                                                Add Appointment
                                            </span>
                                            <PlusIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                }
                                headerClasses="px-4 lg:px-0"
                            />
                        </div>
                        <div className="h-[200px] w-full md:h-[300px] lg:h-2/3">
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
