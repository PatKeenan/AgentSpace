import { trpc } from "utils/trpc";

export const usePeople = () => {
    const { people } = trpc;
    return {
        getAll: people.getAll.useQuery,
        getOne: people.getOne.useQuery,
        createPerson: people.createPerson.useMutation,
        createMeta: people.createMeta,
    };
};
