import {
    CheckCircleIcon,
    ChevronRightIcon,
    EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { NextLink } from "components-common/NextLink";
import { useGlobalStore } from "global-store/useGlobalStore";

type ShowingCardProps = {
    candidate: {
        email: string;
        imageUrl: string;
        status: string;
        name: string;
        applied: string;
        appliedDatetime: string;
    };
};
export const ShowingCard = (props: ShowingCardProps) => {
    const { candidate } = props;

    //TODO: Replace with showing workspace id
    const { activeWorkspace } = useGlobalStore();
    return (
        <NextLink
            href={`/workspace/${activeWorkspace?.id}/showings/dfgd`}
            className="group block"
        >
            <div className="flex items-center py-5 px-4 sm:py-6 sm:px-0">
                <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                    <div>
                        <p className="truncate text-sm font-medium text-purple-600">
                            {candidate.name}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                            <EnvelopeIcon
                                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                aria-hidden="true"
                            />
                            <span className="truncate">{candidate.email}</span>
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div>
                            <p className="text-sm text-gray-900">
                                Applied on{" "}
                                <time dateTime={candidate.appliedDatetime}>
                                    {candidate.applied}
                                </time>
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500">
                                <CheckCircleIcon
                                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
                                    aria-hidden="true"
                                />
                                {candidate.status}
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <ChevronRightIcon
                        className="h-5 w-5 text-gray-400 group-hover:text-gray-700"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </NextLink>
    );
};
