export const parseTimeToSeconds = (hms) => {
    if (!hms) return 0;
    const parts = String(hms).split(':').map(p => Number(p || 0));
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
};

export const formatSecondsToHMS = (sec) => {
    if (sec == null || Number.isNaN(sec)) return '00:00:00';
    sec = Math.floor(Number(sec));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
};
