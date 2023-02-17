export function capitalize(value: string) {
    const arr = value.toLowerCase().replace("_", " ").split(" ");

    for (let i = 0; i < arr.length; i++) {
        if (typeof arr !== undefined && arr.length > 0) {
            // @typescript-eslint/ban-ts-comment
            //@ts-ignore
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
    }
    return arr.join(" ");
}
