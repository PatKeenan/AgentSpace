import Link from "next/link";
import * as React from "react";

type NextLinkPropType = {
    href: string;
    children: React.ReactNode;
};

export const NextLink = React.forwardRef<HTMLAnchorElement, NextLinkPropType>(
    (props, ref) => {
        const { href, children, ...rest } = props;
        return (
            <Link href={href} {...rest}>
                {children}
            </Link>
        );
    }
);

NextLink.displayName = "NextLink";
