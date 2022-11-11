import React from "react";
import { trpc } from "utils/trpc";

export const useShowings = () => {
    const { showing } = trpc;

    return {
        getAll: showing.getAll.useQuery,
        getByMonth: showing.getByMonth.useQuery,
        getByDate: showing.getByDate.useQuery,
        create: showing.create.useMutation,
    };
};
