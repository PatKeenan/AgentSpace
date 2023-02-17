import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

export const useContacts = () => {
    const { contacts } = trpc;
    const router = useRouter();
    const utils = trpc.useContext();
    const contactId = router.query.contactId;
    return {
        getAll: contacts.getAll.useQuery,
        search: contacts.search.useQuery,
        invalidateGetAll: utils.contacts.getAll.invalidate,
        getName: contacts.getName.useQuery,
        getOne: contacts.getOne.useQuery,
        createContact: contacts.createContact.useMutation,
        createContactAndProfile: contacts.createContactAndProfile.useMutation,
        softDelete: contacts.softDelete.useMutation,
        hardDelete: contacts.hardDelete.useMutation,
        softDeleteMany: contacts.softDeleteMany.useMutation,
        hardDeleteMany: contacts.hardDeleteMany.useMutation,
        update: contacts.update.useMutation,
        utils: utils.contacts,
        // Can only be used on a contact detail path
        contactId,
    };
};
