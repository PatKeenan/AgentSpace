import dynamic from "next/dynamic";
import { ShowingFormState } from "../types";

const Map = dynamic(() => import("./map"), { ssr: false });

type ShowingDetialMapProps = {
    showings: ShowingFormState[] | undefined;
};
export const ShowingDetailMap = (props: ShowingDetialMapProps) => {
    const { showings } = props;

    const cords = showings?.map((showing) => ({
        longitude: showing.address?.center[1],
        latitude: showing.address?.center[0],
    }));
    return <Map cords={cords} />;
};
