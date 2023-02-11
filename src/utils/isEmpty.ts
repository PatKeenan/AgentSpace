export function isEmpty<T>(arr?: T[]) {
    return !arr || (arr && arr.length == 0);
}
