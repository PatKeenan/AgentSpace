import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { SectionHeading, Breadcrumb, PageBody } from "components-layout";
import { useWorkspace, useCalendar, useShowings } from "hooks";
import { Loading, NoData, Button } from "components-common";
import { TruckIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { exists } from "utils/helpers";
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

import { AddShowingModal } from "./showings-components/AddShowingModal";
import { useShowingsUI } from "./useShowingsUI";

import type { NextPageExtended } from "types/index";

export const ShowingsContainer: NextPageExtended = () => {
    const calendar = useCalendar({ activeMonth: new Date() });
    const showings = useShowings();
    const workspace = useWorkspace();
    const showingUI = useShowingsUI();
    const router = useRouter();

    const [selectedDate, setSelectedDate] = React.useState<Date>(
        () => new Date()
    );

    const showingQuery = showings.getByDate(
        { workspaceId: workspace.id as string, date: selectedDate },
        { enabled: exists(workspace.id) && exists(selectedDate) }
    );

    ///////////////////////////////////
    return (
        <>
            <Breadcrumb
                items={[
                    {
                        title: "Showings",
                        href: `/workspace/${router.query.workspaceId}/showings`,
                    },
                ]}
            />
            <AddShowingModal selectedDate={selectedDate} />
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>Showings </SectionHeading.Title>
                        <p className="mt-2 text-lg font-normal">
                            {isToday(selectedDate)
                                ? "Today "
                                : isTomorrow(selectedDate)
                                ? "Tomorrow "
                                : isYesterday(selectedDate)
                                ? "Yesterday "
                                : `${format(selectedDate, "EEEE")}, `}
                            {format(selectedDate, "PPP")}
                        </p>
                    </SectionHeading.TitleContainer>
                </SectionHeading>

                <div className="mt-10 lg:grid lg:grid-cols-12 lg:gap-x-16">
                    <div className="text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 xl:col-start-7">
                        <div className="flex items-center text-gray-900">
                            <button
                                type="button"
                                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                onClick={() =>
                                    calendar.handleChangeMonth("decrement")
                                }
                            >
                                <span className="sr-only">Previous month</span>
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
                                    calendar.handleChangeMonth("increment")
                                }
                            >
                                <span className="sr-only">Next month</span>
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
                                            ? calendar.firstDayOffset - 1
                                            : 0
                                    ).keys()
                                ),
                            ].map((i) => (
                                <div className="h-7 w-7" key={i}></div>
                            ))}

                            {calendar.allDates.map((day, dayIdx) => {
                                const isTodayBoolean = isToday(day);
                                const isCurrentMonthBoolean = isSameMonth(
                                    day,
                                    calendar.activeMonth
                                );
                                const isSelected = selectedDate
                                    ? isSameDay(day, selectedDate)
                                    : false;

                                return (
                                    <button
                                        key={dayIdx}
                                        type="button"
                                        className={clsx(
                                            "py-1.5 hover:bg-gray-100 focus:z-10",
                                            isCurrentMonthBoolean
                                                ? "bg-white"
                                                : "bg-gray-50",
                                            (isSelected || isToday(day)) &&
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
                                        onClick={() => setSelectedDate(day)}
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
                                            {!isSelected && isTomorrow(day) && (
                                                <div className="absolute bottom-0 h-[4px] w-[4px] rounded-full bg-green-600" />
                                            )}
                                        </time>
                                    </button>
                                );
                            })}
                        </div>
                        <Button
                            variant="primary"
                            className="mt-4 w-full justify-center"
                            onClick={() => showingUI.setModalOpen(true)}
                        >
                            Add Showing
                        </Button>
                    </div>
                    <div className="mt-4  lg:col-span-7 xl:col-span-6">
                        {!showingQuery.data?.length &&
                            showingQuery.isLoading && <Loading />}
                        {showingQuery.data &&
                            showingQuery.data.length == 0 &&
                            !showingQuery.isLoading && (
                                <div className="grid h-full w-full place-items-center">
                                    <NoData
                                        icon={TruckIcon}
                                        title="No Showings"
                                        message="Get started by adding a showing for this date."
                                    />
                                </div>
                            )}
                        <ol className=" divide-y divide-gray-100 text-sm leading-6">
                            {/* {meetings.map((meeting) => (
                        <li
                            key={meeting.id}
                            className="relative flex space-x-6 py-6 xl:static"
                        >
                            <img
                                src={meeting.imageUrl}
                                alt=""
                                className="h-14 w-14 flex-none rounded-full"
                            />
                            <div className="flex-auto">
                                <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">
                                    {meeting.name}
                                </h3>
                                <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
                                    <div className="flex items-start space-x-3">
                                        <dt className="mt-0.5">
                                            <span className="sr-only">
                                                Date
                                            </span>
                                            <CalendarIcon
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </dt>
                                        <dd>
                                            <time dateTime={meeting.datetime}>
                                                {meeting.date} at {meeting.time}
                                            </time>
                                        </dd>
                                    </div>
                                    <div className="mt-2 flex items-start space-x-3 xl:mt-0 xl:ml-3.5 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
                                        <dt className="mt-0.5">
                                            <span className="sr-only">
                                                Location
                                            </span>
                                            <MapPinIcon
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </dt>
                                        <dd>{meeting.location}</dd>
                                    </div>
                                </dl>
                            </div>
                            <Menu
                                as="div"
                                className="absolute top-6 right-0 xl:relative xl:top-auto xl:right-auto xl:self-center"
                            >
                                <div>
                                    <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600">
                                        <span className="sr-only">
                                            Open options
                                        </span>
                                        <EllipsisHorizontalIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        href="#"
                                                        className={classNames(
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700",
                                                            "block px-4 py-2 text-sm"
                                                        )}
                                                    >
                                                        Edit
                                                    </a>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        href="#"
                                                        className={classNames(
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700",
                                                            "block px-4 py-2 text-sm"
                                                        )}
                                                    >
                                                        Cancel
                                                    </a>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </li>
                    ))} */}
                        </ol>
                    </div>
                </div>
            </PageBody>
        </>
    );
};

ShowingsContainer.layout = "dashboard";
