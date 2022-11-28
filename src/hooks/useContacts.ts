import { trpc } from "utils/trpc";

export const useContacts = () => {
    const { contacts } = trpc;
    const utils = trpc.useContext();
    utils.contacts.getAll.invalidate;

    return {
        getAll: contacts.getAll.useQuery,
        search: contacts.search.useQuery,
        invalidateGetAll: utils.contacts.getAll.invalidate,
        getOne: contacts.getOne.useQuery,
        createContact: contacts.createContact.useMutation,
        createMeta: contacts.createMeta,
        updateMeta: contacts.updateMeta.useMutation,
        softDelete: contacts.softDelete.useMutation,
        hardDelete: contacts.hardDelete.useMutation,
        softDeleteMany: contacts.softDeleteMany.useMutation,
        hardDeleteMany: contacts.hardDeleteMany.useMutation,
    };
};
