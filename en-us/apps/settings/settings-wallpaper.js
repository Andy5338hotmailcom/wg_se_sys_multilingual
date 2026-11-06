(function () {
    const DEFAULT_WALLPAPER = "./wallpaper/wildgoose/bg.jpg";
    const wallpaperCategories = [
        {
            name: "wildgoose",
            images: [
                { name: "bg.jpg", path: "./wallpaper/wildgoose/bg.jpg" }
            ]
        },
        {
            name: "wip12",
            images: [
                { name: "WP12-DM-blue.png", path: "./wallpaper/wip12/WP12-DM-blue.png" },
                { name: "WP12-DM-green.png", path: "./wallpaper/wip12/WP12-DM-green.png" },
                { name: "WP12-DM-orange.png", path: "./wallpaper/wip12/WP12-DM-orange.png" },
                { name: "WP12-DM-purple.png", path: "./wallpaper/wip12/WP12-DM-purple.png" },
                { name: "WP12-DM.png", path: "./wallpaper/wip12/WP12-DM.png" },
                { name: "WP12-LM-blue.png", path: "./wallpaper/wip12/WP12-LM-blue.png" },
                { name: "WP12-LM-green.png", path: "./wallpaper/wip12/WP12-LM-green.png" },
                { name: "WP12-LM-orange.png", path: "./wallpaper/wip12/WP12-LM-orange.png" },
                { name: "WP12-LM-purple.png", path: "./wallpaper/wip12/WP12-LM-purple.png" },
                { name: "WP12-LM.png", path: "./wallpaper/wip12/WP12-LM.png" }
            ]
        },
        {
            name: "Windows XP",
            images: [
                { name: "Ascent.jpg", path: "./wallpaper/Windows XP/Ascent.jpg" },
                { name: "Autumn.jpg", path: "./wallpaper/Windows XP/Autumn.jpg" },
                { name: "Azul.jpg", path: "./wallpaper/Windows XP/Azul.jpg" },
                { name: "Bliss.bmp", path: "./wallpaper/Windows XP/Bliss.bmp" },
                { name: "Crystal.jpg", path: "./wallpaper/Windows XP/Crystal.jpg" },
                { name: "Follow.jpg", path: "./wallpaper/Windows XP/Follow.jpg" },
                { name: "Friend.jpg", path: "./wallpaper/Windows XP/Friend.jpg" },
                { name: "Home.jpg", path: "./wallpaper/Windows XP/Home.jpg" },
                { name: "Moon flower.jpg", path: "./wallpaper/Windows XP/Moon flower.jpg" },
                { name: "Peace.jpg", path: "./wallpaper/Windows XP/Peace.jpg" },
                { name: "Power.jpg", path: "./wallpaper/Windows XP/Power.jpg" },
                { name: "Purple flower.jpg", path: "./wallpaper/Windows XP/Purple flower.jpg" },
                { name: "Radiance.jpg", path: "./wallpaper/Windows XP/Radiance.jpg" },
                { name: "Red moon desert.jpg", path: "./wallpaper/Windows XP/Red moon desert.jpg" },
                { name: "Ripple.jpg", path: "./wallpaper/Windows XP/Ripple.jpg" },
                { name: "Stonehenge.jpg", path: "./wallpaper/Windows XP/Stonehenge.jpg" },
                { name: "Tulips.jpg", path: "./wallpaper/Windows XP/Tulips.jpg" },
                { name: "Vortec space.jpg", path: "./wallpaper/Windows XP/Vortec space.jpg" },
                { name: "Wind.jpg", path: "./wallpaper/Windows XP/Wind.jpg" },
                { name: "Windows XP.jpg", path: "./wallpaper/Windows XP/Windows XP.jpg" }
            ]
        },
        {
            name: "Windows Vista",
            images: [
                { name: "Autumn Leaves.jpg", path: "./wallpaper/Windows Vista/Autumn Leaves.jpg" },
                { name: "Creek.jpg", path: "./wallpaper/Windows Vista/Creek.jpg" },
                { name: "Desert Landscape.jpg", path: "./wallpaper/Windows Vista/Desert Landscape.jpg" },
                { name: "Dock.jpg", path: "./wallpaper/Windows Vista/Dock.jpg" },
                { name: "Forest Flowers.jpg", path: "./wallpaper/Windows Vista/Forest Flowers.jpg" },
                { name: "Forest.jpg", path: "./wallpaper/Windows Vista/Forest.jpg" },
                { name: "Frangipani Flowers.jpg", path: "./wallpaper/Windows Vista/Frangipani Flowers.jpg" },
                { name: "Garden.jpg", path: "./wallpaper/Windows Vista/Garden.jpg" },
                { name: "Green Sea Turtle.jpg", path: "./wallpaper/Windows Vista/Green Sea Turtle.jpg" },
                { name: "Humpback Whale.jpg", path: "./wallpaper/Windows Vista/Humpback Whale.jpg" },
                { name: "img1.jpg", path: "./wallpaper/Windows Vista/img1.jpg" },
                { name: "img2.jpg", path: "./wallpaper/Windows Vista/img2.jpg" },
                { name: "img3.jpg", path: "./wallpaper/Windows Vista/img3.jpg" },
                { name: "img4.jpg", path: "./wallpaper/Windows Vista/img4.jpg" },
                { name: "img5.jpg", path: "./wallpaper/Windows Vista/img5.jpg" },
                { name: "img6.jpg", path: "./wallpaper/Windows Vista/img6.jpg" },
                { name: "img7.jpg", path: "./wallpaper/Windows Vista/img7.jpg" },
                { name: "img8.jpg", path: "./wallpaper/Windows Vista/img8.jpg" },
                { name: "img9.jpg", path: "./wallpaper/Windows Vista/img9.jpg" },
                { name: "img10.jpg", path: "./wallpaper/Windows Vista/img10.jpg" },
                { name: "img11.jpg", path: "./wallpaper/Windows Vista/img11.jpg" },
                { name: "img12.jpg", path: "./wallpaper/Windows Vista/img12.jpg" },
                { name: "img13.jpg", path: "./wallpaper/Windows Vista/img13.jpg" },
                { name: "img14.jpg", path: "./wallpaper/Windows Vista/img14.jpg" },
                { name: "img15.jpg", path: "./wallpaper/Windows Vista/img15.jpg" },
                { name: "img16.jpg", path: "./wallpaper/Windows Vista/img16.jpg" },
                { name: "img17.jpg", path: "./wallpaper/Windows Vista/img17.jpg" },
                { name: "img18.jpg", path: "./wallpaper/Windows Vista/img18.jpg" },
                { name: "img19.jpg", path: "./wallpaper/Windows Vista/img19.jpg" },
                { name: "img20.jpg", path: "./wallpaper/Windows Vista/img20.jpg" },
                { name: "img21.jpg", path: "./wallpaper/Windows Vista/img21.jpg" },
                { name: "img22.jpg", path: "./wallpaper/Windows Vista/img22.jpg" },
                { name: "img23.jpg", path: "./wallpaper/Windows Vista/img23.jpg" },
                { name: "img24.jpg", path: "./wallpaper/Windows Vista/img24.jpg" },
                { name: "img25.jpg", path: "./wallpaper/Windows Vista/img25.jpg" },
                { name: "img26.jpg", path: "./wallpaper/Windows Vista/img26.jpg" },
                { name: "img27.jpg", path: "./wallpaper/Windows Vista/img27.jpg" },
                { name: "img28.jpg", path: "./wallpaper/Windows Vista/img28.jpg" },
                { name: "img29.jpg", path: "./wallpaper/Windows Vista/img29.jpg" },
                { name: "img30.jpg", path: "./wallpaper/Windows Vista/img30.jpg" },
                { name: "img31.jpg", path: "./wallpaper/Windows Vista/img31.jpg" },
                { name: "img32.jpg", path: "./wallpaper/Windows Vista/img32.jpg" },
                { name: "img33.jpg", path: "./wallpaper/Windows Vista/img33.jpg" },
                { name: "img34.jpg", path: "./wallpaper/Windows Vista/img34.jpg" },
                { name: "img35.jpg", path: "./wallpaper/Windows Vista/img35.jpg" },
                { name: "img36.jpg", path: "./wallpaper/Windows Vista/img36.jpg" },
                { name: "Oryx Antelope.jpg", path: "./wallpaper/Windows Vista/Oryx Antelope.jpg" },
                { name: "Toco Toucan.jpg", path: "./wallpaper/Windows Vista/Toco Toucan.jpg" },
                { name: "Tree.jpg", path: "./wallpaper/Windows Vista/Tree.jpg" },
                { name: "Waterfall.jpg", path: "./wallpaper/Windows Vista/Waterfall.jpg" },
                { name: "Winter Leaves.jpg", path: "./wallpaper/Windows Vista/Winter Leaves.jpg" }
            ]
        },
        {
            name: "Windows 7 - Architecture",
            folder: "Windows 7/Architecture",
            images: numberedImages("Windows 7/Architecture", 13, 18)
        },
        {
            name: "Windows 7 - Characters",
            folder: "Windows 7/Characters",
            images: numberedImages("Windows 7/Characters", 19, 24)
        },
        {
            name: "Windows 7 - Landscapes",
            folder: "Windows 7/Landscapes",
            images: numberedImages("Windows 7/Landscapes", 7, 12)
        },
        {
            name: "Windows 7 - Nature",
            folder: "Windows 7/Nature",
            images: numberedImages("Windows 7/Nature", 1, 6)
        },
        {
            name: "Windows 7 - Scenes",
            folder: "Windows 7/Scenes",
            images: numberedImages("Windows 7/Scenes", 25, 30)
        },
        {
            name: "Windows 7 - Windows",
            folder: "Windows 7/Windows",
            images: numberedImages("Windows 7/Windows", 0, 0)
        },
        {
            name: "Windows 8 - Screen",
            folder: "Windows 8/Screen",
            images: [
                { name: "img100.png", path: "./wallpaper/Windows 8/Screen/img100.png" },
                { name: "img101.jpg", path: "./wallpaper/Windows 8/Screen/img101.jpg" },
                { name: "img102.png", path: "./wallpaper/Windows 8/Screen/img102.png" },
                { name: "img103.jpg", path: "./wallpaper/Windows 8/Screen/img103.jpg" },
                { name: "img104.jpg", path: "./wallpaper/Windows 8/Screen/img104.jpg" },
                { name: "img105.jpg", path: "./wallpaper/Windows 8/Screen/img105.jpg" }
            ]
        },
        {
            name: "Windows 8 - Theme1",
            folder: "Windows 8/Theme1",
            images: numberedImages("Windows 8/Theme1", 1, 6)
        },
        {
            name: "Windows 8 - Flowers",
            folder: "Windows 8/Theme2",
            images: numberedImages("Windows 8/Theme2", 7, 12)
        },
        {
            name: "Windows 8 - Windows",
            folder: "Windows 8/Windows",
            images: numberedImages("Windows 8/Windows", 0, 0)
        },
        {
            name: "Windows 11 - Screen",
            folder: "Windows 11/Screen",
            images: numberedImages("Windows 11/Screen", 100, 105)
        },
        {
            name: "Windows 11 - Glow",
            folder: "Windows 11/ThemeA",
            images: numberedImages("Windows 11/ThemeA", 20, 23)
        },
        {
            name: "Windows 11 - Captured Motion",
            folder: "Windows 11/ThemeB",
            images: numberedImages("Windows 11/ThemeB", 24, 27)
        },
        {
            name: "Windows 11 - Sunrise",
            folder: "Windows 11/ThemeC",
            images: numberedImages("Windows 11/ThemeC", 28, 31)
        },
        {
            name: "Windows 11 - Flow",
            folder: "Windows 11/ThemeD",
            images: numberedImages("Windows 11/ThemeD", 32, 35)
        },
        {
            name: "Windows 11 - Windows",
            folder: "Windows 11/Windows",
            images: [
                { name: "img0.jpg", path: "./wallpaper/Windows 11/Windows/img0.jpg" },
                { name: "img19.jpg", path: "./wallpaper/Windows 11/Windows/img19.jpg" }
            ]
        },
        {
            name: "Windows 11 - TouchKeyboard",
            folder: "Windows 11/touchkeyboard",
            images: [
                { name: "TouchKeyboardThemeDark000.jpg", path: "./wallpaper/Windows 11/touchkeyboard/TouchKeyboardThemeDark000.jpg" },
                { name: "TouchKeyboardThemeDark001.jpg", path: "./wallpaper/Windows 11/touchkeyboard/TouchKeyboardThemeDark001.jpg" },
                { name: "TouchKeyboardThemeDark002.jpg", path: "./wallpaper/Windows 11/touchkeyboard/TouchKeyboardThemeDark002.jpg" },
                { name: "TouchKeyboardThemeDark003.jpg", path: "./wallpaper/Windows 11/touchkeyboard/TouchKeyboardThemeDark003.jpg" },
                { name: "TouchKeyboardThemeLight000.jpg", path: "./wallpaper/Windows 11/touchkeyboard/TouchKeyboardThemeLight000.jpg" },
                { name: "TouchKeyboardThemeLight001.jpg", path: "./wallpaper/Windows 11/touchkeyboard/TouchKeyboardThemeLight001.jpg" },
                { name: "TouchKeyboardThemeLight002.jpg", path: "./wallpaper/Windows 11/touchkeyboard/TouchKeyboardThemeLight002.jpg" },
                { name: "TouchKeyboardThemeLight003.jpg", path: "./wallpaper/Windows 11/touchkeyboard/TouchKeyboardThemeLight003.jpg" }
            ]
        }
    ];

    function numberedImages(folder, first, last) {
        return Array.from({ length: last - first + 1 }, (_, index) => {
            const name = `img${first + index}.jpg`;
            return { name, path: `./wallpaper/${folder}/${name}` };
        });
    }

    function currentWallpaper() {
        return localStorage.getItem("WG_desktop_wallpaper") || DEFAULT_WALLPAPER;
    }

    function wallpaperPaths(value) {
        return value.split(",").map(path => path.trim()).filter(Boolean);
    }

    function currentWallpaperTime() {
        const time = Number(localStorage.getItem("WG_desktop_wallpaper_time"));
        return Number.isInteger(time) && time >= 1 ? time : 60;
    }

    const wallpaperInput = document.getElementById("wallpaper-url");
    const wallpaperInterval = document.getElementById("wallpaper-interval");
    let cycleSelection = wallpaperPaths(currentWallpaper());

    function updateSelection() {
        const selected = new Set(wallpaperPaths(currentWallpaper()));
        document.querySelectorAll(".wallpaper-card").forEach(card => {
            const isSelected = selected.has(card.dataset.wallpaper);
            card.classList.toggle("selected", isSelected);
            card.setAttribute("aria-pressed", String(isSelected));
        });
        document.querySelectorAll(".wallpaper-cycle-checkbox").forEach(checkbox => {
            checkbox.checked = cycleSelection.includes(checkbox.value);
        });
    }

    function applyWallpaper(path) {
        const wallpapers = wallpaperPaths(path);
        if (wallpapers.length === 0) {
            alert("Enter an image path or URL.");
            return;
        }
        const wallpaper = wallpapers.join(", ");
        const interval = Number(wallpaperInterval.value);
        if (!Number.isInteger(interval) || interval < 1) {
            alert("The slideshow interval must be a whole number of at least 1 second.");
            return;
        }
        localStorage.setItem("WG_desktop_wallpaper", wallpaper);
        localStorage.setItem("WG_desktop_wallpaper_time", String(interval));
        parent.postMessage({ action: "desktop-wallpaper-change", wallpaper, interval }, "*");
        wallpaperInput.value = wallpaper;
        cycleSelection = wallpapers;
        updateSelection();
    }

    const categoriesContainer = document.getElementById("wallpaper-categories");
    wallpaperCategories.forEach(category => {
        const section = document.createElement("section");
        section.className = "wallpaper-category";

        const heading = document.createElement("h4");
        heading.textContent = category.name;
        section.appendChild(heading);

        const grid = document.createElement("div");
        grid.className = "wallpaper-grid";
        category.images.forEach(image => {
            const cardWrap = document.createElement("div");
            cardWrap.className = "wallpaper-card-wrap";

            const card = document.createElement("button");
            card.type = "button";
            card.className = "wallpaper-card";
            card.dataset.wallpaper = image.path;
            card.setAttribute("aria-label", `Apply wallpaper ${image.name}`);
            card.addEventListener("click", () => applyWallpaper(image.path));

            const preview = document.createElement("img");
            preview.src = `../../wallpaper/${category.folder || category.name}/${image.name}`;
            preview.alt = image.name;
            preview.loading = "lazy";

            const label = document.createElement("span");
            label.textContent = image.name;

            card.append(preview, label);
            cardWrap.appendChild(card);

            const cycleLabel = document.createElement("label");
            cycleLabel.className = "wallpaper-cycle-option";
            const cycleCheckbox = document.createElement("input");
            cycleCheckbox.type = "checkbox";
            cycleCheckbox.className = "wallpaper-cycle-checkbox";
            cycleCheckbox.value = image.path;
            cycleCheckbox.addEventListener("change", () => {
                if (cycleCheckbox.checked) {
                    if (!cycleSelection.includes(image.path)) cycleSelection.push(image.path);
                } else {
                    cycleSelection = cycleSelection.filter(path => path !== image.path);
                }
                if (cycleSelection.length === 0) {
                    cycleSelection = [DEFAULT_WALLPAPER];
                }
                wallpaperInput.value = cycleSelection.join(", ");
                applyWallpaper(wallpaperInput.value);
            });
            cycleLabel.append(cycleCheckbox, document.createTextNode("Add to slideshow"));
            cardWrap.appendChild(cycleLabel);
            grid.appendChild(cardWrap);
        });
        section.appendChild(grid);
        categoriesContainer.appendChild(section);
    });

    wallpaperInput.value = currentWallpaper();
    wallpaperInterval.value = currentWallpaperTime();
    wallpaperInput.addEventListener("change", () => {
        applyWallpaper(wallpaperInput.value);
    });
    wallpaperInput.addEventListener("keydown", event => {
        if (event.key === "Enter") wallpaperInput.blur();
    });
    wallpaperInterval.addEventListener("change", () => {
        applyWallpaper(wallpaperInput.value);
    });
    window.addEventListener("storage", event => {
        if (event.key === "WG_desktop_wallpaper") {
            wallpaperInput.value = event.newValue || DEFAULT_WALLPAPER;
            cycleSelection = wallpaperPaths(wallpaperInput.value);
            updateSelection();
        } else if (event.key === "WG_desktop_wallpaper_time") {
            wallpaperInterval.value = currentWallpaperTime();
        }
    });
    updateSelection();
})();
