import { AppointmentCard } from "../appointments-components";
import { Loading, NoData, Button, Calendar } from "components-common";
import { TruckIcon } from "@heroicons/react/24/outline";
import { useAppointmentsUI } from "../useAppointmentsUI";
import { useWorkspace, useAppointments } from "hooks";
import { PlusIcon } from "@heroicons/react/20/solid";
import { isEmpty } from "../appointments-utils";
import { dateUtils } from "utils/dateUtils";
import dynamic from "next/dynamic";
import { trpc } from "utils/trpc";
import * as React from "react";
import { formatDate } from "utils/formatDate";

const AppointmentsMap = dynamic(() => import("./AppointmentsMap"), {
    ssr: false,
});
const AppointmentsMapView = () => {
    const appointments = useAppointments();
    const workspace = useWorkspace();
    const { setModal, modal } = useAppointmentsUI();
    const utils = trpc.useContext();

    const [selectedDate, setSelectedDate] = React.useState<Date>(
        () => new Date()
    );
    /*  const { selectedDate, setSelectedDate, activeMonth, setActiveMonth } =
        useSelectedDate(new Date()); */

    const [activeMonth, setActiveMonth] = React.useState<Date>(
        () => new Date()
    );

    const invalidate = (date?: Date) =>
        utils.appointment.getByDate.invalidate({
            date: dateUtils.transform(date || selectedDate).isoDateOnly,
            workspaceId: workspace.id as string,
        });

    const appointmentsQuery = appointments.getByDate(
        {
            workspaceId: workspace.id as string,
            date: dateUtils.transform(selectedDate).isoDateOnly,
        },
        {
            refetchOnWindowFocus: false,
            enabled: typeof workspace.id !== undefined,
        }
    );

    const statusIndicatorQuery = appointments.getIndicators(
        {
            workspaceId: workspace.id as string,
            date: formatDate(activeMonth, "YYYY-MM"),
        },
        {
            refetchOnWindowFocus: false,
            enabled: typeof workspace.id !== undefined,
        }
    );

    const sortedByTime = React.useCallback(() => {
        const hasStartTimes: typeof appointmentsQuery.data = [];
        const noStartTimes: typeof appointmentsQuery.data = [];

        appointmentsQuery.data?.map((i) => {
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
    }, [appointmentsQuery]);

    React.useEffect(() => {
        setModal({
            selectedDate: dateUtils.transform(selectedDate).isoDateOnly,
        });
    }, [selectedDate, setModal, modal.state]);

    return (
        <div className="flex flex-col lg:mt-3 lg:grid lg:h-full lg:grid-cols-12 lg:gap-x-8 lg:overflow-hidden">
            {/* Left Side */}
            <div className="order-2 flex h-full flex-1 flex-col overflow-hidden pr-2 pl-2 lg:order-1 lg:col-span-6 lg:pl-0">
                <div className="flex flex-grow flex-col overflow-hidden">
                    <ul className="h-full space-y-4 overflow-auto py-4 pb-4 text-sm leading-6">
                        {appointmentsQuery.isLoading &&
                        !appointmentsQuery.data ? (
                            <Loading />
                        ) : !isEmpty(sortedByTime()) ? (
                            sortedByTime().map((i, idx) => (
                                <li key={i.id} className="relative lg:mx-2">
                                    <AppointmentCard
                                        idx={idx}
                                        appointment={i}
                                        invalidate={invalidate}
                                    />
                                </li>
                            ))
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
            <div className="order-1 mt-4 flex flex-shrink-0 flex-col sm:mt-0 lg:order-2 lg:col-span-6">
                <div className="mb-1 w-full border-b border-gray-200 lg:mb-4 lg:border-b-0">
                    <Calendar
                        activeMonth={activeMonth}
                        onChangeMonth={setActiveMonth}
                        selectedDate={selectedDate}
                        onSelectDay={setSelectedDate}
                        statusIndicatorsArr={statusIndicatorQuery.data?.flatMap(
                            (i) => i.date
                        )}
                        mobileActionButton={
                            <div>
                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        setModal({
                                            state: true,
                                            selectedDate:
                                                dateUtils.transform(
                                                    selectedDate
                                                ).isoDateOnly,
                                        })
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
                <div className=" h-[200px] w-full md:h-[300px] lg:h-2/3">
                    <React.Suspense fallback={""}>
                        <AppointmentsMap appointments={sortedByTime()} />
                    </React.Suspense>
                </div>
            </div>
        </div>
    );
};
export default AppointmentsMapView;
