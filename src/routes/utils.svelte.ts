export function getAvatarUrl(user: { id: string, avatar: string }, size = 24) {
    if (user.avatar) {
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=${size}`;
    } else {
        return `/assets/18e336a74a159cfd.png`
    }
}