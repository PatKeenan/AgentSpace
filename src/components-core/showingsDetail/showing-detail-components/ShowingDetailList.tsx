import { useShowingDetailUI } from "../useShowingDetailUI";
import { PlusIcon } from "@heroicons/react/24/outline";
import { AddShowingModal, ModalState } from "./AddShowingModal";
import { ShowingStopCard } from "./ShowingStopCard";
import { Button } from "components-common/Button";
import * as React from "react";

export const ShowingDetailList = () => {
    const { setEditSliderOpen } = useShowingDetailUI();

    const [showings, setShowings] = React.useState<ModalState[] | undefined>();

    return (
        <>
            <AddShowingModal />
            <div className="block">
                <Button
                    variant="outlined"
                    className="w-full justify-center"
                    onClick={() => setEditSliderOpen(true)}
                >
                    <PlusIcon
                        className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                        aria-hidden="true"
                    />
                    Add Showing
                </Button>

                <ol className="mt-3 divide-y divide-gray-100">
                    {showings?.map((i, index) => (
                        <ShowingStopCard key={index} showing={i} />
                    ))}
                </ol>
            </div>
        </>
    );
};
