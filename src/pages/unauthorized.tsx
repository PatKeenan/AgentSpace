import React from "react";
import { customLocalStorage } from "utils/customLocalStorage";

const Unauthorized = () => {
    React.useEffect(() => {
        customLocalStorage().setItem("activeWorkspaceId", "");
    }, []);

    return <div>You&apos;re Not Allowed to see this page</div>;
};

export default Unauthorized;
