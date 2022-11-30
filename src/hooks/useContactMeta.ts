import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

export const useContactMeta = () => {
    const { contactMeta } = trpc;
    const utils = trpc.useContext();

    return {
        getAllForContact: contactMeta.getAllForContact.useQuery,
        createMeta: contactMeta.create.useMutation,
        updateMeta: contactMeta.update.useMutation,
        softDeleteMeta: contactMeta.softDelete.useMutation,
        utils: utils.contactMeta,
    };
};
