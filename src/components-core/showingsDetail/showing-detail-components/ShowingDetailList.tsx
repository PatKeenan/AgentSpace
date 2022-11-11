import { useShowingDetailUI } from "../useShowingDetailUI";
import { PlusIcon } from "@heroicons/react/24/outline";

import { Button } from "components-common/Button";
import * as React from "react";
import { ShowingFormState } from "../types";

type ShowingDetailListProps = {
    handleAddShowing: React.Dispatch<
        React.SetStateAction<ShowingFormState[] | undefined>
    >;
    showings: ShowingFormState[] | undefined;
};
export const ShowingDetailList = (props: ShowingDetailListProps) => {
    const { handleAddShowing, showings } = props;

    const { setEditSliderOpen } = useShowingDetailUI();

    return (
        <>
            {/*   <AddShowingModal handleAddShowing={handleAddShowing} /> */}
            <div className="block">
                <Button
                    variant="outlined"
                    className="w-full justify-center"
                    onClick={() => setEditSliderOpen(true)}
                >
                    <PlusIcon
                        className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                        aria-hidden="true"
                    />
                    Add Showing
                </Button>
                {/* 
                <ol className="mt-3 divide-y divide-gray-100">
                    {showings?.map((showing, index) => (
                        <ShowingStopCard
                            key={index}
                            showing={showing}
                            index={index}
                        />
                    ))}
                </ol> */}
            </div>
        </>
    );
};
