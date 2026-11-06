(function () {
    let theme = localStorage.getItem("WG_color");
    if (theme !== "b" && theme !== "w") {
        theme = "w";
        localStorage.setItem("WG_color", theme);
    }

    window.WG_settingsTheme = theme;
    document.documentElement.classList.add(theme === "b" ? "theme-dark" : "theme-light");
    window.openPersonalizedSettings = function () {
        window.location.href = "personalized_" + theme + ".html";
    };
})();
