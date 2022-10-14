export function assert<T>(condition: T) {
    if (!condition) {
        throw new Error("Expected a value");
    }
    return condition;
}

export const curryPath = (base: string) => {
    return (sub: string) => {
        return "/".concat(base, "/", sub);
    };
};

export const curryPathFilter = (base: string) => {
    return (filterValue: string) => {
        return "/".concat(base, "?filterBy=", filterValue);
    };
};
