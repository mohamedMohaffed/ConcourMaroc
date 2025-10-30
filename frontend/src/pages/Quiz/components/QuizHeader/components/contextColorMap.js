export function getContextColorMap(questionsArray) {
    const map = {};
    const excludedHex = new Set(['#3b82f6', '#ff6700', '#f1f5f9'].map(h => h.toLowerCase()));

    const hslToHex = (h, s, l) => {
        s = Math.max(0, Math.min(1, s));
        l = Math.max(0, Math.min(1, l));
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const hh = (h / 60);
        const x = c * (1 - Math.abs((hh % 2) - 1));
        let r1 = 0, g1 = 0, b1 = 0;
        if (hh >= 0 && hh < 1) { r1 = c; g1 = x; b1 = 0; }
        else if (hh >= 1 && hh < 2) { r1 = x; g1 = c; b1 = 0; }
        else if (hh >= 2 && hh < 3) { r1 = 0; g1 = c; b1 = x; }
        else if (hh >= 3 && hh < 4) { r1 = 0; g1 = x; b1 = c; }
        else if (hh >= 4 && hh < 5) { r1 = x; g1 = 0; b1 = c; }
        else { r1 = c; g1 = 0; b1 = x; }
        const m = l - c / 2;
        const r = Math.round((r1 + m) * 255);
        const g = Math.round((g1 + m) * 255);
        const b = Math.round((b1 + m) * 255);
        const toHex = v => v.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
    };

    const stringToHslColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let h = Math.abs(hash) % 360;
        const s = 0.70;
        const l = 0.45;
        let hex = hslToHex(h, s, l);
        let attempts = 0;
        while (excludedHex.has(hex) && attempts < 12) {
            h = (h + 37) % 360;
            hex = hslToHex(h, s, l);
            attempts++;
        }
        return `hsl(${h} 70% 45%)`;
    };

    for (const q of questionsArray) {
        const ctx = q?.exercice_context?.context_text;
        if (ctx && !map[ctx]) map[ctx] = stringToHslColor(ctx);
    }
    return map;
}
