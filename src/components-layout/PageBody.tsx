/* eslint-disable react/display-name */
import { ChildrenProps } from "types/index";

export const PageBody = (props: {
    children: ChildrenProps;
    fullWidth?: boolean;
}) => {
    const { fullWidth, ...rest } = props;
    return fullWidth ? (
        <div className="pt-10 pb-16" {...rest} />
    ) : (
        <div className="relative mx-auto max-w-6xl md:px-8">
            <div className="pt-10 pb-16" {...rest} />
        </div>
    );
};
