export const apiUrl = "/api";

export async function playResource(resource: string) {
    return await fetch(apiUrl+`/play`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: resource
    })
}
export async function queueSongIds(ids: string[]) {
    return await fetch(apiUrl+`/queueIds`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: ids.join(",")
    })
}
export async function previous() {
    return await (await fetch(apiUrl+'/controls/previous', { method: 'POST' })).json()
}
export async function pause() {
    return await (await fetch(apiUrl+'/controls/pause', { method: 'POST' })).json()
}
export async function skip() {
    return await (await fetch(apiUrl+'/controls/skip', { method: 'POST' })).json()
}
export async function clearQueue() {
    await fetch(apiUrl+'/queue', { method: 'DELETE' })
}
export async function shuffle() {
    return await (await fetch(apiUrl+'/controls/shuffle', { method: 'POST' })).json()
}
export async function jump(index: number) {
    return await (await fetch(apiUrl+'/controls/jump?index=' + index, { method: 'POST' })).json()
}
export async function removeIndex(index: number) {
    return await (await fetch(apiUrl+'/controls/remove?index=' + index, { method: 'POST' })).json()
}
export async function reorder(selected = [], pos = 0) {
    return await (await fetch(apiUrl+'/controls/reorder', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ selected, pos })
    })).json()
}