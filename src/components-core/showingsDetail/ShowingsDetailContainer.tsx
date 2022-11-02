import * as React from "react";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/20/solid";

import { Breadcrumb } from "components-layout/Breadcrumb";
import { PencilIcon, PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { SectionHeading } from "components-layout/SectionHeading";
import { useRouter } from "next/router";

import type { FC } from "react";
import { PageBody } from "components-layout/PageBody";
import clsx from "clsx";
import {
    EmptyData,
    ShowingDetailList,
    ShowingDetailMap,
} from "./showing-detail-components";
import { Button } from "components-common/Button";
import { useShowingDetailUI } from "./useShowingDetailUI";
import { ShowingFormState } from "./types";

type SubHeadingProps = {
    text: string;
    icon: FC<React.ComponentProps<"svg">>;
};

const SubHeadingItem = (props: SubHeadingProps) => {
    const { text, icon: Icon } = props;
    return (
        <div className="mt-2 flex items-center text-sm">
            <Icon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden={true}
            />
            <span className="text-gray-500">{text}</span>
        </div>
    );
};

export const ShowingDetailContainer = () => {
    const router = useRouter();
    const [showings, setShowings] = React.useState<
        ShowingFormState[] | undefined
    >();
    const breadCrumbItems = [
        { title: "Showings", href: "/showings", active: false },
        {
            title: router.query.id as string,
            href: ("/showings/" + router.query.id) as string,
            active: true,
        },
    ];

    return (
        <>
            <Breadcrumb items={breadCrumbItems} />
            <PageBody fullHeight>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>
                            Showing Details
                        </SectionHeading.Title>

                        <SectionHeading.Subtitle>
                            <div className="flex items-center space-x-6">
                                <SubHeadingItem
                                    icon={CalendarIcon}
                                    text="Saturday January 9, 2020"
                                />
                                <SubHeadingItem
                                    icon={MapPinIcon}
                                    text="Group"
                                />
                            </div>
                        </SectionHeading.Subtitle>
                    </SectionHeading.TitleContainer>
                    <SectionHeading.Actions>
                        <div className="flex pr-1">
                            <span className="hidden sm:block">
                                <Button variant="outlined">
                                    <PencilIcon
                                        className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                        aria-hidden="true"
                                    />
                                    Edit
                                </Button>
                            </span>
                        </div>
                    </SectionHeading.Actions>
                </SectionHeading>

                <div className="flex flex-grow flex-col-reverse p-1  lg:mt-4 lg:grid lg:grid-cols-12 lg:gap-x-4">
                    <div className=" mt-4 h-2/3 lg:col-span-7 lg:h-full">
                        <ShowingDetailList
                            handleAddShowing={setShowings}
                            showings={showings}
                        />
                    </div>
                    <div className="relative  mt-4 h-1/3 lg:col-start-8 lg:col-end-13 lg:h-full">
                        <ShowingDetailMap showings={showings} />
                    </div>
                </div>
                {/* <div className="mt-8">
                    <EmptyData />
                </div> */}
            </PageBody>
        </>
    );
};

ShowingDetailContainer.layout = "dashboard";
