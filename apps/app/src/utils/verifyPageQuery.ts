export function verifyPageQuery(page: string | string[] | undefined) {
    if (!verifyPageQuery || typeof page !== "string") return false;
    const pageAsNumber = Number(page);
    return Number.isInteger(pageAsNumber) && pageAsNumber >= 1;
}
