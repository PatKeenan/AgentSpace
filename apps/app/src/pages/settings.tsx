import { Loading } from "components-common/Loading";
import { SettingsContainer } from "components-core/settings";
import { signIn, useSession } from "next-auth/react";
export default function Settings() {
    const { status, data: session } = useSession({
        required: true,
        onUnauthenticated: () => signIn(),
    });
    return status == "loading" ? (
        <Loading />
    ) : session ? (
        <SettingsContainer />
    ) : null;
}
