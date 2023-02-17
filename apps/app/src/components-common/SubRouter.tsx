export const SubRouter = ({
    component,
    active,
}: {
    component: JSX.Element;
    active: boolean;
}) => {
    return active ? component : null;
};
