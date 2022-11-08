import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Button, ButtonLink } from "components-common/Button";

export const NotAuthorized = () => {
    const refresh = () => {
        window.location.reload();
    };

    return (
        <div className="grid h-full place-items-center">
            <div className="text-center">
                <Button
                    variant="text"
                    className="mx-auto mb-6 flex flex-col text-center"
                    onClick={() => refresh()}
                >
                    <ArrowPathIcon className="mx-auto h-5 w-5" />
                    <p className="mt-2">Try Again</p>
                </Button>
                <h1></h1>
                <h3 className="font-700 max-w-lg text-2xl font-bold ">
                    Not Found/Permission Error
                </h3>
                <p className="font-600 mt-4 max-w-lg">
                    The workspace you are looking for can&apos;t be found or you
                    do not have the correct permissions.
                </p>
                <div className="mt-4 flex items-baseline justify-center space-x-2">
                    <ButtonLink variant="primary" href="/workspace/create">
                        Choose a Workspace
                    </ButtonLink>
                    <p>or</p>
                    <ButtonLink variant="text" href="/workspace/create">
                        Request Access
                    </ButtonLink>
                </div>
            </div>
        </div>
    );
};
