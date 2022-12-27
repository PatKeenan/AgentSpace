import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusIcon,
} from "@heroicons/react/20/solid";
import { SectionHeading, Breadcrumb, PageBody } from "components-layout";
import { useWorkspace, useCalendar, useAppointments } from "hooks";
import { Loading, NoData, Button } from "components-common";
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

import {
    AppointmentCard,
    AppointmentModal,
    AppointmentsMap,
} from "./appointments-components";
import { useAppointmentsUI } from "./useAppointmentsUI";

import type { NextPageExtended } from "types/index";
import { dateUtils } from "utils/dateUtils";
import { isEmpty } from "./appointments-utils";

export const AppointmentsContainer: NextPageExtended = () => {
    const calendar = useCalendar({ activeMonth: new Date() });
    const appointments = useAppointments();
    const workspace = useWorkspace();
    const { setModal } = useAppointmentsUI();
    const router = useRouter();

    const [selectedDate, setSelectedDate] = React.useState<Date>(
        () => new Date()
    );

    const appointmentsQuery = appointments.getByMonth(
        {
            workspaceId: workspace.id as string,
            date: String(calendar.activeMonth),
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

        if (data) {
            return data;
        }
        return [];
    }, [selectedDate, appointmentsQuery]);

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
            <AppointmentModal
                selectedDate={selectedDate}
                onSuccessCallback={() => appointmentsQuery.refetch()}
            />
            <PageBody fullHeight>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>
                            Appointments{" "}
                        </SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>

                <div className="mt-3 h-full overflow-hidden lg:grid lg:grid-cols-12 lg:gap-x-8">
                    <div className="flex h-full flex-1 flex-col overflow-hidden pr-2 lg:col-span-6">
                        <div className="flex items-center justify-between border-b border-b-gray-200 pt-2 pb-4">
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
                            <Button
                                variant="outlined"
                                onClick={() => setModal({ state: true })}
                            >
                                <PlusIcon
                                    className="gray-600 -ml-0.5 mr-1 h-4 w-4"
                                    aria-hidden
                                />
                                Add
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
                                                className="relative mx-2"
                                            >
                                                <AppointmentCard
                                                    idx={idx}
                                                    appointment={i}
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
                            <div className="text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 xl:col-start-7">
                                <div className="flex items-center p-2 text-gray-900">
                                    <button
                                        type="button"
                                        className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                        onClick={() =>
                                            calendar.handleChangeMonth(
                                                "decrement"
                                            )
                                        }
                                    >
                                        <span className="sr-only">
                                            Previous month
                                        </span>
                                        <ChevronLeftIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </button>
                                    <div className="flex-auto font-semibold">
                                        {calendar.monthName}
                                    </div>
                                    <button
                                        type="button"
                                        className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                        onClick={() =>
                                            calendar.handleChangeMonth(
                                                "increment"
                                            )
                                        }
                                    >
                                        <span className="sr-only">
                                            Next month
                                        </span>
                                        <ChevronRightIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                                <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
                                    {["M", "T", "W", "T", "F", "S", "S"].map(
                                        (i, idx) => (
                                            <div key={idx}>{i}</div>
                                        )
                                    )}
                                </div>
                                <div className="isolate mt-2 grid grid-cols-7 gap-px bg-gray-200 text-sm shadow ring-1 ring-gray-200">
                                    {[
                                        ...Array.from(
                                            Array(
                                                calendar.firstDayOffset !== 0
                                                    ? calendar.firstDayOffset -
                                                          1
                                                    : 0
                                            ).keys()
                                        ),
                                    ].map((i) => (
                                        <div className="h-7 w-7" key={i}></div>
                                    ))}

                                    {calendar.allDates.map((day, dayIdx) => {
                                        const isTodayBoolean = isToday(day);
                                        const isCurrentMonthBoolean =
                                            isSameMonth(
                                                day,
                                                calendar.activeMonth
                                            );
                                        const isSelected = selectedDate
                                            ? isSameDay(day, selectedDate)
                                            : false;

                                        const hasAppointmentsOnDate =
                                            statusIndicators?.includes(
                                                dateUtils.transform(day)
                                                    .isoDateOnly
                                            );
                                        return (
                                            <button
                                                key={dayIdx}
                                                type="button"
                                                className={clsx(
                                                    "py-1.5 hover:bg-gray-100 focus:z-10",
                                                    isCurrentMonthBoolean
                                                        ? "bg-white"
                                                        : "bg-gray-50",
                                                    (isSelected ||
                                                        isToday(day)) &&
                                                        "font-semibold",
                                                    isSelected && "text-white",
                                                    !isSelected &&
                                                        isThisMonth(day) &&
                                                        !isTodayBoolean &&
                                                        "text-gray-900",
                                                    !isSelected &&
                                                        !isCurrentMonthBoolean &&
                                                        !isTodayBoolean &&
                                                        "text-gray-400",
                                                    isTodayBoolean &&
                                                        !isSelected &&
                                                        "text-indigo-600"
                                                )}
                                                onClick={() =>
                                                    setSelectedDate(day)
                                                }
                                            >
                                                <time
                                                    dateTime={day.toDateString()}
                                                    className={clsx(
                                                        "relative mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                                                        isSelected &&
                                                            isTodayBoolean &&
                                                            "bg-indigo-600",
                                                        isSelected &&
                                                            !isTodayBoolean &&
                                                            "bg-gray-900"
                                                    )}
                                                >
                                                    {String(day.getDate())}
                                                    {!isSelected &&
                                                        hasAppointmentsOnDate && (
                                                            <div className="absolute bottom-0 h-[4px] w-[4px] rounded-full bg-green-600" />
                                                        )}
                                                </time>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className=" h-2/3 w-full">
                            <AppointmentsMap />
                        </div>
                    </div>
                </div>
            </PageBody>
        </>
    );
};

AppointmentsContainer.layout = "dashboard";
