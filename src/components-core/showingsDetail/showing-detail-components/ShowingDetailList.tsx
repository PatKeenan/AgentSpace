import {
    ChevronRightIcon,
    EyeIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import { Button } from "components-common/Button";
import React from "react";
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
                <li className="flex items-center hover:bg-gray-50">
                    <div className="flex items-center px-6 py-4">
                        <h3 className="font-semibold text-gray-900">
                            Showing Address
                        </h3>
                    </div>
                    <button
                        className="ml-auto px-4 text-gray-500 hover:text-gray-600"
                        onClick={() => setDetailViewActive(!detailViewActive)}
                    >
                        <span className="sr-only">Open Detail View</span>
                        <ChevronRightIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                        />
                    </button>
                </li>
                <li className="block  hover:bg-gray-50">
                    <div className="px-6 py-4">
                        <h3 className="font-semibold text-gray-900">
                            Showing Address
                        </h3>
                        <div className="mt-2 flex">
                            <div>Hello</div>
                            <div>Yo</div>
                        </div>
                    </div>
                </li>
            </ol>
        </div>
    );
};
