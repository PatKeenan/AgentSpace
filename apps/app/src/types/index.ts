import type { NextComponentType, NextPage, NextPageContext } from "next";
import type { AppInitialProps } from "next/app";
import type { Router } from "next/router";

/**
 *
 * Provides typeSafety for choosing the correct layout on a page component
 *
 */

export type CustomComponentProps = {
    layout?: "auth" | "dashboard" | undefined;
    subLayout?: "appointments" | "contact";
};

export type NextPageExtended = NextPage & CustomComponentProps;

export type ComponentType<P> = NextComponentType<NextPageContext, unknown, P> &
    CustomComponentProps;

export type AppProps<P = {}> = AppInitialProps & {
    Component: ComponentType<P>;
    router: Router;
    __N_SSG?: boolean | undefined;
    __N_SSP?: boolean | undefined;
    __N_RSC?: boolean | undefined;
};

export type ChildrenPropsObj = {
    children: React.ReactNode | React.ReactNode[];
};
export type ChildrenProps = React.ReactNode | React.ReactNode[];

export type FormSections<T> = {
    field: {
        name: keyof T;
        label: string;
    };
    required?: boolean;
    className?: string;
}[];
