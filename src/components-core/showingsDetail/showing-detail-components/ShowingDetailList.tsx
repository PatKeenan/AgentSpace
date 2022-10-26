import { useShowingDetailUI } from "../useShowingDetailUI";
import { PlusIcon } from "@heroicons/react/24/outline";
import { AddShowingModal } from "./AddShowingModal";
import { ShowingStopCard } from "./ShowingStopCard";
import { Button } from "components-common/Button";

export const ShowingDetailList = () => {
    const { setEditSliderOpen } = useShowingDetailUI();
    return (
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
            <AddShowingModal />
            <ol className="mt-3 divide-y divide-gray-100">
                {[...Array.from(Array(4))].map((i, index) => (
                    <ShowingStopCard key={index} showing={index} />
                ))}
            </ol>
        </div>
    );
};
