import React from "react";
import { trpc } from "utils/index";

export const useProfile = () => {
    const { profile, useContext } = trpc;
    const { profile: profileUtils } = useContext();
    return {
        getManyForContact: profile.getManyForContact.useQuery,
        getOne: profile.getOne.useQuery,
        create: profile.create.useMutation,
        update: profile.update.useMutation,
        utils: profileUtils,
    };
};
