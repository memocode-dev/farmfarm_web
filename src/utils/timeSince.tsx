export default function timeSince(date: Date): string {
    const seconds = Math.round((new Date().getTime() - date.getTime()) / 1000);

    // 값이 음수인 경우 바로 처리
    if (seconds < 0) {
        return "방금 전";
    }

    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.round(interval) + "년 전";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.round(interval) + "달 전";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.round(interval) + "일 전";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.round(interval) + "시간 전";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.round(interval) + "분 전";
    }
    return seconds + "초 전";
}
