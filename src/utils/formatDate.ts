export const formatDate = (date: Date | string | null, format?: keyof typeof dateFormats) => {
    if(!date) throw new Error('Expected a date')

    const baseDate = new Date(date)
    const year = baseDate.getUTCFullYear()
    const month = baseDate.getUTCMonth() + 1
    const day = baseDate.getUTCDate()
    const dateFormats = {
        M: month,
        D: day,
        'MM/DD': month + '/' + day,
        'MM/DD/YYYY': month + '/' + day + '/' + year,
        'YYY-MM-DD': `${year}-${month <= 9 ? '0' + month : month}-${day <= 9?'0' + day : day}`
    }
    return dateFormats[format ?? 'MM/DD/YYYY'] as string

}