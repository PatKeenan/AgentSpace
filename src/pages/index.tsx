import { useRouter } from "next/router";
import { NextPageExtended } from "types/index";
import * as React from "react";
import { signIn, useSession } from "next-auth/react";

const Dashboard: NextPageExtended = () => {
    const { status } = useSession({
        required: true,
        onUnauthenticated: () => {
            signIn();
        },
    });
    return <div>Hello</div>;
};

Dashboard.layout == "dashboard";
export default Dashboard;
