import { trpc } from "utils/trpc";

export const useTasks = () => {
    const { task } = trpc;
    return {
        getAll: task.getAll.useQuery,
        create: task.create.useMutation,
        update: task.update.useMutation,
        updateMany: task.updateMany.useMutation,
        updateStatusOrOrder: task.updateStatusOrOrder.useMutation,
        delete:
            process.env.NODE_ENV == "development"
                ? task.deleteHard.useMutation
                : task.deleteSoft.useMutation,
        deleteMany:
            process.env.NODE_ENV == "development"
                ? task.deleteManyHard.useMutation
                : task.deleteManySoft.useMutation,
    };
};
