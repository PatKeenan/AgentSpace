export type InputContextType = {
    isInvalid?: boolean;
    isRequired?: boolean;
    hasHelpText?: boolean;
};

interface Children {
    children: React.ReactNode;
}

export interface InputGroupProps extends Children {
    isInvalid?: boolean;
    isRequired?: boolean;
    hasHelpText?: boolean;
}

export interface InputLabelProps extends Children {
    htmlFor: string;
    optionalIndicator?: boolean;
}

export type InputErrorProps = Children;
