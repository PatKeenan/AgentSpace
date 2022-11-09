import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

export const usePeople = () => {
    const { people } = trpc;
    const utils = trpc.useContext();
    utils.people.getAll.invalidate;
    return {
        getAll: people.getAll.useQuery,
        invalidateGetAll: utils.people.getAll.invalidate,
        getOne: people.getOne.useQuery,
        createPerson: people.createPerson.useMutation,
        createMeta: people.createMeta,
    };
};
