import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "components-common/Button";
import { ShowingStopCard } from "./ShowingStopCard";

export const ShowingDetailList = () => {
    return (
        <div className="block">
            <Button variant="outlined" className="w-full justify-center">
                <PlusIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                />
                Add Showing
            </Button>
            <ol className="mt-3 divide-y divide-gray-100">
                {[...Array.from(Array(4))].map((i, index) => (
                    <ShowingStopCard key={index} showing={index} />
                ))}
            </ol>
        </div>
    );
};
