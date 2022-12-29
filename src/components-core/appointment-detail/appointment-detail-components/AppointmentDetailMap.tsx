import dynamic from "next/dynamic";
import { AppointmentFormState } from "../types";

const Map = dynamic(() => import("./map"), { ssr: false });

type AppointmentDetialMapProps = {
    appointments: AppointmentFormState[] | undefined;
};
export const AppointmentDetailMap = (props: AppointmentDetialMapProps) => {
    const { appointments } = props;

    const cords = appointments?.map(() => ({
        longitude: /* appointment.address?.center[1] */ -70,
        latitude: /* appointment.address?.center[0] */ 20,
    }));
    return <Map cords={cords} />;
};
