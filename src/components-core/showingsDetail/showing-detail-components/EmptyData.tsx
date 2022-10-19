import { HomeModernIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "components-common/Button";

export const EmptyData = () => {
    return (
        <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 ">
            <HomeModernIcon className="mx-auto h-10 w-10 text-gray-700" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stops</h3>
            <p className="mt-1 text-sm text-gray-500">
                Get started by adding a stop.
            </p>
            <Button variant="primary">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Stop
            </Button>
        </div>
    );
};
