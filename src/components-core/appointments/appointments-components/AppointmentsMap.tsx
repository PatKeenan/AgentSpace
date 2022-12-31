import dynamic from "next/dynamic";
import type { AppointmentRouterOutput } from "server/trpc/router/appointmentRouter";
import * as React from "react";
const Map = dynamic(() => import("../../../components-common/Map"), {
    ssr: false,
});

export const AppointmentsMap = ({
    appointments,
}: {
    appointments: AppointmentRouterOutput["getByDate"];
}) => {
    const cords = appointments
        ? appointments.map((i) => {
              if (i?.latitude && i?.longitude) {
                  return { longitude: i.longitude, latitude: i.latitude };
              }
          })
        : [{ latitude: 0, longitude: 0 }];
    return <Map coords={cords} />;
};
