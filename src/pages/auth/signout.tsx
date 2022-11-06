import { Button } from "components-common/Button";
import { useGlobalStore } from "global-store/useGlobalStore";
import { signOut } from "next-auth/react";

const SignOut = () => {
    const { setActiveWorkspaceId } = useGlobalStore();
    const handleSignOut = () => {
        setActiveWorkspaceId(undefined);
        signOut({
            callbackUrl: "/api/auth/signin",
        });
    };

    return (
        <div className="grid h-full place-items-center">
            <div>
                <h3 className="mb-2 text-xl text-gray-700">Sign Out?</h3>
                <Button variant="primary" onClick={() => handleSignOut()}>
                    Sing Out
                </Button>
            </div>
        </div>
    );
};

export default SignOut;
