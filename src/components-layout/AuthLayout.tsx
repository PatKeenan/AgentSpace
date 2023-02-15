import { Loading } from "components-common/Loading";
import { NotAuthorized } from "components-core/NotAuthorized";
import { signIn, useSession } from "next-auth/react";
import React from "react";

const AuthLayout = ({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const { status, data: session } = useSession({
        required: true,
        onUnauthenticated: () => signIn(),
    });

    return status == "loading" ? (
        <Loading />
    ) : !session.user ? (
        <NotAuthorized />
    ) : (
        <React.Fragment>{children}</React.Fragment>
    );
};

export default AuthLayout;
