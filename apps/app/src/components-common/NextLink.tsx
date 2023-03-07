import Link from "next/link";
import * as React from "react";

type NextLinkPropType = {
    href: string;
} & Omit<React.ComponentProps<"a">, "href">;

export const NextLink = React.forwardRef<HTMLAnchorElement, NextLinkPropType>(
    (props, ref) => {
        const { href, children, ...rest } = props;
        return (
            <Link href={href} passHref>
                <a ref={ref} {...rest}>
                    {children}
                </a>
            </Link>
        );
    }
);

NextLink.displayName = "NextLink";
