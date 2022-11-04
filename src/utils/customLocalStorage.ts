export function customLocalStorage() {
    const storedItems = {
        activeWorkspaceId: "",
    };
    return {
        getItem: (key: keyof typeof storedItems) => {
            return window.localStorage.getItem(key);
        },
        setItem: (key: keyof typeof storedItems, val: string) => {
            return window.localStorage.setItem(key, val);
        },
    };
}
