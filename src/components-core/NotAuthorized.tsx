import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Button, ButtonLink } from "components-common/Button";
import { useGlobalStore } from "global-store/useGlobalStore";

export const NotAuthorized = () => {
    const refresh = () => {
        window.location.reload();
    };
    return (
        <div className="grid h-full place-items-center">
            <div className="text-center">
                <Button
                    variant="text"
                    className="mx-auto mb-8 flex flex-col text-center"
                    onClick={() => refresh()}
                >
                    <ArrowPathIcon className="mx-auto h-5 w-5" />
                    <p className="mt-2">Try Again</p>
                </Button>
                <h3 className="font-700 ">
                    You are not allowed to view this workspace.
                </h3>
                <ButtonLink
                    variant="primary"
                    href="/workspace/create"
                    className="mx-auto mt-4"
                >
                    Choose Workspace
                </ButtonLink>
            </div>
        </div>
    );
};
