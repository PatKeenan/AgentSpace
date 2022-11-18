import React from "react";
import { trpc } from "utils/trpc";

export const useAppointments = () => {
    const { appointment } = trpc;

    return {
        getAll: appointment.getAll.useQuery,
        getByMonth: appointment.getByMonth.useQuery,
        getByDate: appointment.getByDate.useQuery,
        create: appointment.create.useMutation,
    };
};
