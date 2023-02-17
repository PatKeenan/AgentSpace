import clsx from "clsx";

const colOptions = {
    "1": "grid-cols-1",
    "2": "grid-cols-2",
    "3": "grid-cols-3",
    auto: "auto-cols-fr grid-flow-col",
    "not-set": "",
};
interface FieldGroupProps {
    children: React.ReactNode;
    className?: string;
    cols?: keyof typeof colOptions;
}

export const FieldGroup = (props: FieldGroupProps) => {
    const { className, cols = "auto", ...htmlProps } = props;
    return (
        <div
            className={clsx(
                "block gap-x-1 md:grid md:gap-x-4",
                colOptions[cols],
                className
            )}
            {...htmlProps}
        />
    );
};
