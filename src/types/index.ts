import type { NextComponentType, NextPage, NextPageContext } from "next";
import type { AppInitialProps } from "next/app";
import type { Router } from "next/router";

/**
 * 
 * Provides typeSafety for choosing the correct layout on a page component
 * 
*/

export type CustomComponentProps = {
    layout?: 'auth' | 'dashboard' | undefined
}

export type NextPageExtended = NextPage & CustomComponentProps

export type ComponentType<P> = NextComponentType<NextPageContext, unknown, P> & CustomComponentProps

// eslint-disable-next-line @typescript-eslint/ban-types
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
export type ChildrenProps = React.ReactNode | React.ReactNode[]
  