import React from "react";
import { trpc } from "utils/trpc";

export const useShowings = () => {
    const { showing } = trpc;

    return {
        getByDate: showing.getByDate.useQuery,
        create: showing.create.useMutation,
    };
};
