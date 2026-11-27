(function () {
    const storageKey = "komunikator-theme";
    const root = document.documentElement;

    function applyTheme(theme) {
        root.dataset.theme = theme;

        document.querySelectorAll(".theme-toggle").forEach(toggle => {
            toggle.checked = theme === "dark";
        });
    }

    applyTheme(localStorage.getItem(storageKey) === "dark" ? "dark" : "light");

    document.addEventListener("DOMContentLoaded", () => {
        if (typeof window.savedSettings !== "undefined" && window.savedSettings.motyw !== undefined) {
            const theme = Number(window.savedSettings.motyw) === 1 ? "dark" : "light";
            localStorage.setItem(storageKey, theme);
            applyTheme(theme);
        }

        applyTheme(root.dataset.theme);

        document.querySelectorAll(".theme-toggle").forEach(toggle => {
            toggle.addEventListener("change", () => {
                const theme = toggle.checked ? "dark" : "light";
                localStorage.setItem(storageKey, theme);
                applyTheme(theme);
            });
        });
    });
})();
