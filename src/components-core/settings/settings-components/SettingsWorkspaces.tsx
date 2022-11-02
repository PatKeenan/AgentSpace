import clsx from "clsx";
import { Button } from "components-common/Button";

const SettingsWorkspaces = () => {
    return (
        <div>
            <div className="flex items-center">
                <div className="flex items-center">
                    <h3 className="ml-2 font-bold text-gray-700">Workspaces</h3>
                    <span
                        className={clsx(
                            true
                                ? "bg-indigo-100 text-indigo-600"
                                : "bg-gray-100 text-gray-900",
                            "ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block"
                        )}
                    >
                        1
                    </span>
                </div>

                <Button variant="primary" className="ml-auto">
                    Add Workspace
                </Button>
            </div>

            <div className="mt-4 flex py-2 px-2">
                <p className="mr-2 text-gray-700">Cool Workspace Name</p>{" "}
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                    active
                </span>
                <div className="ml-auto space-x-4">
                    <Button variant="text">Details</Button>
                    <Button variant="text">Edit</Button>
                </div>
            </div>
            <h3 className="ml-2 mt-8 font-bold text-gray-700">
                Shared with me
            </h3>
        </div>
    );
};

export default SettingsWorkspaces;
