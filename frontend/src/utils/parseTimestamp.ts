export default function parseTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();

    const diff = now.getTime() - date.getTime();

    if (diff < 1000 * 60) {
        return diff < 2000 ? 'Just now' : '1 minute ago';
    } else if (diff < 1000 * 60 * 60) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else if (diff < 1000 * 60 * 60 * 24) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (diff < 1000 * 60 * 60 * 24 * 7) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return days === 1 ? '1 day ago' : `${days} days ago`;
    } else {
        return date.toDateString();
    }
}
