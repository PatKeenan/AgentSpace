import { Loading } from "components-common/Loading";
import { signIn, useSession } from "next-auth/react";
import { ChildrenPropsObj } from "types/index";

export const Protected = (props: ChildrenPropsObj) => {
    const { children } = props;

    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            signIn();
        },
    });

    return status == "loading" ? (
        <Loading />
    ) : status == "authenticated" ? (
        <>{children}</>
    ) : null;
};
