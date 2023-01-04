import { trpc } from "utils/trpc";

export const useAppointments = () => {
    const { appointment } = trpc;

    return {
        getAllForContact: appointment.getAllForContact.useQuery,
        getAll: appointment.getAll.useQuery,
        getIndicators: appointment.getIndicators.useQuery, // Used for the calendar to quickly show if there is an appointment on a date
        getByDate: appointment.getByDate.useQuery,
        create: appointment.create.useMutation,
        update: appointment.update.useMutation,
        quickUpdate: appointment.quickUpdate.useMutation, // Quick Update is for root level details only, not connected fields such as contacts.
        deleteSoft: appointment.deleteSoft.useMutation,
        deleteHard: appointment.deleteHard.useMutation,
    };
};
