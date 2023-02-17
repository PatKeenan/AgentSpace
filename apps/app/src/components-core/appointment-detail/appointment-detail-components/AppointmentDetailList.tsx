import { useAppointmentDetailUI } from "../useAppointmentDetailUI";
import { PlusIcon } from "@heroicons/react/24/outline";

import { Button } from "components-common/Button";
import { AppointmentFormState } from "../types";

type AppointmentDetailListProps = {
    handleAddAppointment: React.Dispatch<
        React.SetStateAction<AppointmentFormState[] | undefined>
    >;
    appointments: AppointmentFormState[] | undefined;
};
export const AppointmentDetailList = (props: AppointmentDetailListProps) => {
    const {} = props;
    const { setEditSliderOpen } = useAppointmentDetailUI();

    return (
        <>
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
                    Add Appointment
                </Button>
            </div>
        </>
    );
};
