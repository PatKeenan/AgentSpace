import { trpc } from "utils/trpc";

export const useSubContacts = () => {
    const { subContact } = trpc;
    const utils = trpc.useContext();

    return {
        getAllForContact: subContact.getAllForContact.useQuery,
        create: subContact.create.useMutation,
        update: subContact.update.useMutation,
        softDeleteMeta: subContact.softDelete.useMutation,
        utils: utils.subContact,
    };
};
