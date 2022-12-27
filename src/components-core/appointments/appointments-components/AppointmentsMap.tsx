import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../../components-common/Map"), {
    ssr: false,
});

export const AppointmentsMap = () => {
    const cords = [{ longitude: -74.945221, latitude: 39.90601 }];
    return <Map cords={cords} />;
};
