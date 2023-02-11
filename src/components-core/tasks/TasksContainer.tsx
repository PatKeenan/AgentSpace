import {
    Breadcrumb,
    NoData,
    PageBody,
    SectionHeading,
} from "components-common";
import { NextPageExtended } from "types/index";
import { useRouter } from "next/router";
import { useTasks } from "hooks/useTasks";
import { Kanban } from "./Kanban";
import { ErrorBoundary } from "..";
import { Suspense } from "react";
import { isEmpty } from "utils/isEmpty";

export const TasksContainer: NextPageExtended = () => {
    const router = useRouter();

    const { getAll } = useTasks();

    const { data: tasks, isLoading } = getAll(
        { workspaceId: router.query.workspaceId as string },
        {
            enabled: typeof router.query.workspaceId !== "undefined",
            refetchOnWindowFocus: false,
        }
    );

    return (
        <>
            <Breadcrumb
                items={[
                    {
                        title: "Tasks",
                        href: `/workspace/${router.query.workspaceId}/tasks`,
                    },
                ]}
            />
            <PageBody fullHeight noMaxWidth>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>Tasks</SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>

                {/* Main Container */}
                <div className="relative mx-auto mt-4 flex h-full max-h-full w-full flex-1 grid-cols-3 overflow-x-auto overflow-y-hidden ">
                    <ErrorBoundary>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Kanban tasks={tasks} />
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </PageBody>
        </>
    );
};

TasksContainer.layout = "dashboard";
