import { Menu, Transition } from "@headlessui/react";
import {
    ChevronRightIcon,
    EllipsisVerticalIcon,
    EyeIcon,
    PlusIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Button } from "components-common/Button";
import { NextLink } from "components-common/NextLink";
import { Fragment } from "react";
import { useShowingDetailUI } from "../useShowingDetailUI";

export const ShowingDetailList = () => {
    const { setDetailViewActive, detailViewActive } = useShowingDetailUI();
    return (
        <div className="pl-1">
            <Button variant="outlined" className="w-full justify-center">
                <PlusIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                />
                Add Showing
            </Button>
            <ol className="mt-3 divide-y divide-gray-100">
                <ShowingStopCard />
            </ol>
        </div>
    );
};

const ShowingStopCard = () => {
    return (
        <li className="group block">
            <p className="truncate text-sm font-semibold text-purple-600">
                Showing 1
            </p>
            <p className="mt-2 truncate text-gray-900">
                1450 Rahway Rd, Scotch Plain NJ, 07076
            </p>
            <div className="relative mt-1 flex items-center justify-between">
                <Tag name="Patrick" />
            </div>
            <p className="mt-2 truncate text-gray-900"></p>
            <div className="flex items-center">
                <p className="text-gray-700">
                    <time dateTime={"2022-01-21T13:00"}>5pm</time> -{" "}
                    <time dateTime={"2022-01-21T14:00"}>6pm</time>
                </p>
            </div>
        </li>
    );
};

const Tag = ({ name }: { name: string }) => {
    return (
        <div className="z-[1000] flex items-center rounded-lg bg-gray-50 px-2 py-1 text-sm shadow-sm">
            <p className="text-sm">{name}</p>
            <Menu as="div" className="relative ml-2">
                <div>
                    <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
                        <span className="sr-only">Open options</span>
                        <EllipsisVerticalIcon
                            className="h-6 w-6"
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
                    <Menu.Items className="absolute left-7 -top-3 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={clsx(
                                            active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700",
                                            "block px-4 py-2 text-sm"
                                        )}
                                    >
                                        Quick View
                                    </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={clsx(
                                            active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700",
                                            "block px-4 py-2 text-sm"
                                        )}
                                    >
                                        Call
                                    </a>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};
