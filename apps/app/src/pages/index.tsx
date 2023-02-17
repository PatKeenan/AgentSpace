import { Loading } from "components-common/Loading";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import type { NextPageExtended } from "types/index";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from "../server/db/client";

import { NotAuthorized } from "components-core/NotAuthorized";

const Dashboard: NextPageExtended = () => {
    const { status, data: session } = useSession();

    return status == "loading" ? (
        <Loading />
    ) : !session ? (
        <NotAuthorized />
    ) : null;
};

export async function getServerSideProps(context: any) {
    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
    );
    if (!session || !session.user) {
        return {
            redirect: {
                destination: "/api/auth/signin",
                permanent: false,
            },
        };
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            workspaceMeta: true,
            defaultWorkspace: true,
        },
    });

    if (user?.defaultWorkspace) {
        return {
            redirect: {
                destination: `/workspace/${user.defaultWorkspace}`,
                permanent: false,
            },
        };
    }

    if (!user?.defaultWorkspace && user?.workspaceMeta.length == 0) {
        const workspace = await prisma.workspace.create({
            data: {
                title: "My Workspace",
                usersOnWorkspace: {
                    create: {
                        userId: session.user.id,
                        role: "ADMIN",
                    },
                },
            },
            include: {
                usersOnWorkspace: {
                    where: { userId: session.user.id },
                },
            },
        });

        if (workspace) {
            await prisma.user.update({
                where: {
                    id: session.user.id,
                },
                data: {
                    defaultWorkspace: workspace.id,
                },
            });

            return {
                redirect: {
                    destination: `/workspace/${workspace.id}`,
                    permanent: false,
                },
            };
        }
    }

    return {
        redirect: {
            destination: `/api/auth/signin`,
            permanent: false,
        },
    };
}
export default Dashboard;
