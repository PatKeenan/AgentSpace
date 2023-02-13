import { trpc } from "utils/trpc";

export const useTasks = () => {
    const { task } = trpc;
    return {
        getAll: task.getAll.useQuery,
        create: task.create.useMutation,
        update: task.update.useMutation,
        updateManyTasks: task.updateManyTasks.useMutation,
        updateStatusOrOrder: task.updateStatusOrOrder.useMutation,
        delete: task.deleteHard.useMutation,
        deleteMany: task.deleteManyHard.useMutation,
    };
};
