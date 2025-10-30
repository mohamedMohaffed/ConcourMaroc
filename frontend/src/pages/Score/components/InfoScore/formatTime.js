function formatTime(time) {
    if (typeof time === "string" && time.includes(":")) {
        return time;
    }
    const sec = Number(time);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return [h, m, s]
        .map(v => v.toString().padStart(2, '0'))
        .join(':');
}

export default formatTime;