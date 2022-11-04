import { NextPageExtended } from "types/index";
import { signIn, useSession } from "next-auth/react";

const Dashboard: NextPageExtended = () => {
    useSession({
        required: true,
        onUnauthenticated: () => {
            signIn();
        },
    });
    return <div>Hello</div>;
};

Dashboard.layout == "dashboard";
export default Dashboard;
