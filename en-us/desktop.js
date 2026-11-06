// ==============================
// Global window focus and z-index management
// ==============================
let maxZIndex = 1000;
let activeWindowDom = null;

/**
 * Bring the specified window to the front and give it focus.
 * @param {HTMLElement} winDom Window DOM element
 */
function bringWindowToTop(winDom) {
    if (activeWindowDom) {
        activeWindowDom.classList.remove("win-focus");
    }
    maxZIndex++;
    winDom.style.zIndex = maxZIndex;
    winDom.classList.add("win-focus");
    activeWindowDom = winDom;
}

// ==============================
// App list (record format v2: use whitepath/blackpath for the active theme, or fall back to path)
// ==============================
const DEFAULT_APPS = [
    { id: "appstore", name: "App Store", icon: "apps/appstore/ico.svg", whitepath: "apps/appstore/white.html", blackpath: "apps/appstore/black.html", version: "2" },
    { id: "reg", name: "Software Registry", icon: "apps/reg/ico.png", whitepath: "apps/reg/white.html", blackpath: "apps/reg/black.html", version: "2" },
    { id: "appinstall", name: "WGAPP Installer", icon: "apps/reg/ico.png", whitepath: "apps/appinstall/white.html", blackpath: "apps/appinstall/black.html", version: "2" },
    { id: "settings", name: "Settings", icon: "apps/settings/ico.svg", whitepath: "apps/settings/personalized_w.html", blackpath: "apps/settings/personalized_b.html", version: "2" },
    { id: "wgver", name: "About Wildgoose SE", icon: "icon.png", whitepath: "apps/wgver/white.html", blackpath: "apps/wgver/black.html", version: "2" },
    {"id": "browser","name": "Browser","icon": "apps/browser/ico.svg","path": "apps/browser/index.html","color": "#2563eb","category": "Network","developer": "Wildgoose"},
    {"id": "backtobe","name": "Return to Wildgoose BE","icon": "icon.png","path": "setup/backtobe/1.html"}

];

// Resolve the app path for the current theme, falling back to path for older formats.
function resolveAppPath(app) {
    const theme = localStorage.getItem("WG_color") || "w";
    const themedPath = theme === "b" ? app.blackpath : app.whitepath;
    return themedPath || app.path;
}

function applyDesktopTheme(theme) {
    if (theme !== "w" && theme !== "b") return;
    const themeLink = document.getElementById("desktop-theme");
    if (themeLink) {
        themeLink.href = theme === "w" ? "whitedesktop.css" : "blackdesktop.css";
    }
    const startMenuFrame = document.getElementById("startMenuFrame");
    if (startMenuFrame && startMenuFrame.contentWindow) {
        startMenuFrame.contentWindow.postMessage({ type: "theme-change", theme }, "*");
    }
}

function getLocalApps() {
    try {
        const local = localStorage.getItem("app_list");
        return local ? JSON.parse(local) : [];
    } catch (e) {
        return [];
    }
}

function mergeAppList() {
    const localApps = getLocalApps();
    const result = [...DEFAULT_APPS];
    for (const app of localApps) {
        if (!app.id) continue;
        const exists = result.some(item => item.id === app.id);
        if (!exists) {
            result.push(app);
        }
    }
    return result;
}

const APP_LIST = mergeAppList();
let currentRightClickApp = null;
let taskbarUnpinnedOrder = [];

if (!localStorage.getItem("fixedApps")) {
    localStorage.setItem("fixedApps", JSON.stringify(["doc", "setting"]));
}
if (!localStorage.getItem("desktopIcons")) {
    localStorage.setItem("desktopIcons", JSON.stringify(["doc", "setting"]));
}

// ==============================
// Render desktop icons
// ==============================
function renderDesktopIcons() {
    const container = document.getElementById("desktop-icons");
    container.innerHTML = "";
    const ids = JSON.parse(localStorage.getItem("desktopIcons"));
    ids.forEach(id => {
        const app = APP_LIST.find(a => a.id === id);
        if (!app) return;
        const el = document.createElement("div");
        el.className = "desktop-icon";
        el.innerHTML = `<img src="${app.icon}" alt=""><div>${app.name}</div>`;
        el.ondblclick = () => openApp(app);
        el.oncontextmenu = event => {
            event.preventDefault();
            event.stopPropagation();
            currentRightClickApp = app;
            showContextMenu(event.clientX, event.clientY);
        };
        container.appendChild(el);
    });
}

function moveTaskbarItem(taskApps, draggedItem, targetItem, insertBefore) {
    if (draggedItem === insertBefore || draggedItem.nextElementSibling === insertBefore) return;

    const items = [...taskApps.querySelectorAll(".task-app-item")];
    const previousPositions = new Map(items.map(item => [item, item.getBoundingClientRect().left]));
    taskApps.insertBefore(draggedItem, insertBefore);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    items.forEach(item => {
        if (item === draggedItem) return;
        const offset = previousPositions.get(item) - item.getBoundingClientRect().left;
        if (offset) {
            item.animate(
                [{ transform: `translateX(${offset}px)` }, { transform: "translateX(0)" }],
                { duration: 180, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
            );
        }
    });
}

// ==============================
// Render taskbar app icons
// ==============================
function renderTaskbarApps() {
    const taskApps = document.querySelector(".task-apps");
    if (!taskApps) return;
    taskApps.innerHTML = "";
    const fixedIds = JSON.parse(localStorage.getItem("fixedTaskbarApps") || "[]");
    const runningWindows = [...document.querySelectorAll(".app-window")];
    const runningUnpinnedIds = [];
    runningWindows.forEach(win => {
        const appId = win.dataset.id;
        if (!fixedIds.includes(appId) && !runningUnpinnedIds.includes(appId)) {
            runningUnpinnedIds.push(appId);
        }
    });
    taskbarUnpinnedOrder = taskbarUnpinnedOrder.filter(appId => runningUnpinnedIds.includes(appId));
    runningUnpinnedIds.forEach(appId => {
        if (!taskbarUnpinnedOrder.includes(appId)) taskbarUnpinnedOrder.push(appId);
    });
    const appIds = [...fixedIds, ...taskbarUnpinnedOrder];

    appIds.forEach(appId => {
        const app = mergeAppList().find(item => item.id === appId);
        if (!app) return;
        const win = runningWindows.find(item => item.dataset.id === appId);
        const isPinned = fixedIds.includes(appId);
        const item = document.createElement("div");
        item.className = "task-app-item";
        item.dataset.appId = appId;
        item.draggable = true;
        if (isPinned) item.classList.add("pinned");
        if (win) item.classList.add("running");
        item.title = app.name;
        item.setAttribute("aria-label", app.name);
        item.innerHTML = `<img src="${app.icon}" alt="">`;
        item.ondragstart = event => {
            item.classList.add("dragging");
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", appId);
        };
        item.ondragover = event => {
            event.preventDefault();
            const draggedItem = taskApps.querySelector(".task-app-item.dragging");
            if (!draggedItem || draggedItem === item
                || draggedItem.classList.contains("pinned") !== isPinned) return;
            const rect = item.getBoundingClientRect();
            moveTaskbarItem(
                taskApps,
                draggedItem,
                item,
                event.clientX < rect.left + rect.width / 2 ? item : item.nextSibling
            );
        };
        item.ondragend = () => {
            item.classList.remove("dragging");
            if (isPinned) {
                const nextFixedIds = [...taskApps.querySelectorAll(".task-app-item.pinned")]
                    .map(taskItem => taskItem.dataset.appId);
                localStorage.setItem("fixedTaskbarApps", JSON.stringify(nextFixedIds));
            } else {
                taskbarUnpinnedOrder = [...taskApps.querySelectorAll(".task-app-item:not(.pinned)")]
                    .map(taskItem => taskItem.dataset.appId);
            }
        };
        item.onclick = () => {
            const currentWindow = [...document.querySelectorAll(".app-window")]
                .find(windowItem => windowItem.dataset.id === appId);
            if (!currentWindow) {
                openApp(app);
                return;
            }
            const shouldShow = currentWindow.style.display === "none";
            currentWindow.style.display = shouldShow ? "flex" : "none";
            if (shouldShow) bringWindowToTop(currentWindow);
        };
        item.oncontextmenu = event => {
            event.preventDefault();
            event.stopPropagation();
            showTaskbarContextMenu(event.clientX, event.clientY, app);
        };
        taskApps.appendChild(item);
    });
}

// ==============================
// Render the Start menu (the menu was refactored into an iframe; its main logic is in startmenu.html).
// Push the latest app list to the iframe when the list changes; retain compatibility with the legacy DOM renderer.
// ==============================
function renderStartMenu() {
    const frame = document.getElementById("startMenuFrame");
    if (frame && frame.contentWindow) {
        // In iframe mode, send the merged app list and pinned items to refresh its contents.
        frame.contentWindow.postMessage(
            {
                type: "startmenu-init",
                apps: mergeAppList(),
                fixed: JSON.parse(localStorage.getItem("fixedApps") || "[]")
            }, "*");
        return;
    }

    // Legacy DOM rendering (fallback when there is no iframe).
    const fixedIds = JSON.parse(localStorage.getItem("fixedApps"));
    const fixedEl = document.getElementById("fixedApps");
    const allEl = document.getElementById("allApps");
    if (!fixedEl || !allEl) return;

    fixedEl.innerHTML = `<h4>Pinned apps</h4>`;
    allEl.innerHTML = `<h4>All apps</h4>`;

    fixedIds.forEach(id => {
        const app = APP_LIST.find(a => a.id === id);
        if (app) fixedEl.appendChild(createAppItem(app));
    });

    APP_LIST.forEach(app => {
        allEl.appendChild(createAppItem(app));
    });
}

// ==============================
// Create an app item.
// ==============================
function createAppItem(app) {
    const item = document.createElement("div");
    item.className = "app-item";
    item.innerHTML = `<img src="${app.icon}"><span>${app.name}</span>`;
    item.onclick = () => {
        openApp(app);
        const menu = document.getElementById("startMenu");
        if (menu) menu.style.display = "none";
        hideContextMenu();
    };
    item.oncontextmenu = (e) => {
        e.preventDefault();
        currentRightClickApp = app;
        showContextMenu(e.clientX, e.clientY);
    };
    return item;
}

// ==============================
// Context menus.
// ==============================
function createContextMenu() {
    const menu = document.createElement("div");
    menu.id = "customContextMenu";
    menu.style.cssText = `
        position: fixed;
        width: 180px;
        background: #222;
        color: white;
        border-radius: 10px;
        padding: 6px 0;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 99999;
        display: none;
    `;
    document.body.appendChild(menu);
}

function createTaskbarContextMenu() {
    if (document.getElementById("taskbarContextMenu")) return;
    const menu = document.createElement("div");
    menu.id = "taskbarContextMenu";
    menu.className = "taskbar-context-menu";
    menu.setAttribute("role", "menu");
    document.body.appendChild(menu);
}

function showTaskbarContextMenu(x, y, app) {
    const menu = document.getElementById("taskbarContextMenu");
    if (!menu) return;
    menu.innerHTML = "";

    const fixedIds = JSON.parse(localStorage.getItem("fixedTaskbarApps") || "[]");
    const isPinned = fixedIds.includes(app.id);
    const win = [...document.querySelectorAll(".app-window")]
        .find(item => item.dataset.id === app.id);
    const entries = [
        { text: app.name, action: "open", className: "taskbar-context-title" },
        { text: isPinned ? "Unpin from taskbar" : "Pin to taskbar", action: "pin" },
        { text: "Close window", action: "close", disabled: !win }
    ];

    entries.forEach(entry => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = entry.className || "";
        button.setAttribute("role", "menuitem");
        button.textContent = entry.text;
        button.disabled = Boolean(entry.disabled);
        button.onclick = event => {
            event.stopPropagation();
            if (entry.action === "open") {
                openApp(app);
            } else if (entry.action === "pin") {
                const latestIds = JSON.parse(localStorage.getItem("fixedTaskbarApps") || "[]");
                const nextIds = isPinned
                    ? latestIds.filter(id => id !== app.id)
                    : [...latestIds, app.id];
                localStorage.setItem("fixedTaskbarApps", JSON.stringify(nextIds));
                renderTaskbarApps();
            } else if (entry.action === "close" && win) {
                win.remove();
                renderTaskbarApps();
            }
            hideContextMenu();
        };
        menu.appendChild(button);
        if (entry.action !== "close") {
            const separator = document.createElement("div");
            separator.className = "taskbar-context-separator";
            menu.appendChild(separator);
        }
    });

    menu.style.display = "block";
    const rect = menu.getBoundingClientRect();
    menu.style.left = Math.max(8, Math.min(x, window.innerWidth - rect.width - 8)) + "px";
    menu.style.top = Math.max(8, Math.min(y, window.innerHeight - rect.height - 8)) + "px";
}

function showContextMenu(x, y) {
    const menu = document.getElementById("customContextMenu");
    if (!menu || !currentRightClickApp) return;
    menu.innerHTML = "";

    const fixedStartList = JSON.parse(localStorage.getItem("fixedApps"));
    const desktopList = JSON.parse(localStorage.getItem("desktopIcons"));
    const fixedTaskbarList = JSON.parse(localStorage.getItem("fixedTaskbarApps") || "[]");
    const isFixedStart = fixedStartList.includes(currentRightClickApp.id);
    const isFixedDesktop = desktopList.includes(currentRightClickApp.id);
    const isFixedTaskbar = fixedTaskbarList.includes(currentRightClickApp.id);

    const menuItems = [
        { text: "Open", action: "open" },
        isFixedStart
            ? { text: "Unpin from Start", action: "unfixStart" }
            : { text: "Pin to Start", action: "fixStart" },
        isFixedDesktop
            ? { text: "Remove from desktop", action: "unfixDesktop" }
            : { text: "Add to desktop", action: "fixDesktop" },
        isFixedTaskbar
            ? { text: "Unpin from taskbar", action: "unfixTaskbar" }
            : { text: "Pin to taskbar", action: "fixTaskbar" }
    ];

    menuItems.forEach(it => {
        const div = document.createElement("div");
        div.innerText = it.text;
        div.style.padding = "8px 14px";
        div.style.cursor = "pointer";
        div.style.fontSize = "14px";
        div.onclick = () => {
            if (it.action === "open" && currentRightClickApp) openApp(currentRightClickApp);
            if (it.action === "fixStart" && currentRightClickApp) toggleFixed(currentRightClickApp.id, true);
            if (it.action === "unfixStart" && currentRightClickApp) toggleFixed(currentRightClickApp.id, false);
            if (it.action === "fixDesktop" && currentRightClickApp) toggleDesktopPin(currentRightClickApp.id, true);
            if (it.action === "unfixDesktop" && currentRightClickApp) toggleDesktopPin(currentRightClickApp.id, false);
            if (it.action === "fixTaskbar" && currentRightClickApp) toggleTaskbarPin(currentRightClickApp.id, true);
            if (it.action === "unfixTaskbar" && currentRightClickApp) toggleTaskbarPin(currentRightClickApp.id, false);

            hideContextMenu();
            if (it.action === "open") {
                const menu = document.getElementById("startMenu");
                if (menu) menu.style.display = "none";
            }
        };
        div.onmouseover = () => div.style.background = "rgba(255,255,255,0.1)";
        div.onmouseout = () => div.style.background = "transparent";
        menu.appendChild(div);
    });

    // Keep the menu within the viewport.
    let posX = x;
    let posY = y;
    const rect = menu.getBoundingClientRect();
    if (posX + rect.width > window.innerWidth) posX = window.innerWidth - rect.width - 10;
    if (posY + rect.height > window.innerHeight) posY = window.innerHeight - rect.height - 10;

    menu.style.left = posX + "px";
    menu.style.top = posY + "px";
    menu.style.display = "block";
}

function hideContextMenu() {
    const menu = document.getElementById("customContextMenu");
    if (menu) menu.style.display = "none";
    const taskbarMenu = document.getElementById("taskbarContextMenu");
    if (taskbarMenu) taskbarMenu.style.display = "none";
}

// Pin or unpin an app in the Start menu.
function toggleFixed(appId, isFix) {
    let fixed = JSON.parse(localStorage.getItem("fixedApps"));
    if (isFix) {
        if (!fixed.includes(appId)) fixed.push(appId);
    } else {
        fixed = fixed.filter(id => id !== appId);
    }
    localStorage.setItem("fixedApps", JSON.stringify(fixed));
    renderStartMenu();
}

// Pin or unpin an app on the desktop.
function toggleDesktopPin(appId, isFix) {
    let list = JSON.parse(localStorage.getItem("desktopIcons"));
    if (isFix) {
        if (!list.includes(appId)) list.push(appId);
    } else {
        list = list.filter(id => id !== appId);
    }
    localStorage.setItem("desktopIcons", JSON.stringify(list));
    renderDesktopIcons();
}

function toggleTaskbarPin(appId, isFix) {
    let list = JSON.parse(localStorage.getItem("fixedTaskbarApps") || "[]");
    if (isFix) {
        if (!list.includes(appId)) list.push(appId);
    } else {
        list = list.filter(id => id !== appId);
    }
    localStorage.setItem("fixedTaskbarApps", JSON.stringify(list));
    renderTaskbarApps();
}

// ==============================
// Search.
// ==============================
function bindSearch() {
    const search = document.getElementById("appSearch");
    if (!search) return;
    search.oninput = () => {
        const key = search.value.toLowerCase();
        const allEl = document.getElementById("allApps");
        if (!allEl) return;
        allEl.innerHTML = `<h4>All apps</h4>`;
        APP_LIST.forEach(app => {
            if (app.name.toLowerCase().includes(key)) allEl.appendChild(createAppItem(app));
        });
    };
}

// ==============================
// Open an app (including clicks inside iframes).
// ==============================
function openApp(app) {
    const container = document.getElementById("window-container");
    if (!container) return;

    const exists = document.querySelector(`.app-window[data-id="${app.id}"]`);
    if (exists) {
        exists.style.display = "flex";
        bringWindowToTop(exists);
        renderTaskbarApps();
        return;
    }

    const win = document.createElement("div");
    win.className = "app-window";
    win.dataset.id = app.id;
    win.style.left = "100px";
    win.style.top = "100px";

    win.innerHTML = `
        <div class="window-header">
            <div>${app.name}</div>
            <div class="window-actions">
                <button class="fullscreen-toggle" type="button" aria-label="Enter full screen" title="Enter full screen">⛶</button>
                <button class="minimize">—</button>
                <button class="maximize">□</button>
                <button class="close">×</button>
            </div>
        </div>
        <iframe src="${resolveAppPath(app)}"></iframe>
    `;

    container.appendChild(win);
    makeWindowDraggable(win);
    bindWindowActions(win);
    renderTaskbarApps();
    bringWindowToTop(win);

    // Bring the window to the front when its header or border is clicked.
    win.addEventListener("mousedown", () => {
        bringWindowToTop(win);
    })
    // Bring the window to the front when the iframe is clicked.
    const iframe = win.querySelector("iframe");
    iframe.addEventListener("load", ()=>{
        iframe.contentWindow.addEventListener("mousedown", ()=>{
            bringWindowToTop(win);
        })
    })
}

// ==============================
// Eight-direction Aero Snap with a frosted-glass preview.
// ==============================
// The global translucent preview highlights the target snap area.
let snapPreviewEl = null;
function ensureSnapPreview() {
    if (snapPreviewEl) return snapPreviewEl;
    snapPreviewEl = document.createElement("div");
    snapPreviewEl.id = "snap-preview";
    snapPreviewEl.style.cssText =
        "position:fixed;display:none;pointer-events:none;z-index:999999;" +
        "background:rgba(127,127,127,0.28);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);" +
        "border:2px solid rgba(255,255,255,0.65);border-radius:8px;box-sizing:border-box;" +
        "transition:left .12s ease,top .12s ease,width .12s ease,height .12s ease;";
    document.body.appendChild(snapPreviewEl);
    return snapPreviewEl;
}

function taskbarHeight() {
    const tb = document.querySelector(".taskbar");
    return tb ? tb.offsetHeight : 50;
}

// Calculate the snap target (eight directions) from the pointer position.
// Returns { mode, rect }; rect is in pixels and excludes the taskbar.
function getSnapTarget(e) {
    // Prefer viewport dimensions and fall back to screen dimensions if unavailable.
    const W = window.innerWidth > 0 ? window.innerWidth : window.screen.width;
    const H = window.innerHeight > 0 ? window.innerHeight : window.screen.height;
    const th = taskbarHeight();
    const usableH = H - th;
    const cornerW = W * 0.25;  // Width of each corner detection area.
    const cornerH = H * 0.25;  // Height of each corner detection area.
    const edgeX = 40;          // Trigger width for left and right edges.
    const edgeY = 40;          // Trigger height for top and bottom edges.

    // Check corners first (each covers one quarter of the screen).
    if (e.clientX <= cornerW && e.clientY <= cornerH) {
        return { mode: "topleft", rect: { left: 0, top: 0, width: W * 0.5, height: usableH * 0.5 } };
    }
    if (e.clientX >= W - cornerW && e.clientY <= cornerH) {
        return { mode: "topright", rect: { left: W * 0.5, top: 0, width: W * 0.5, height: usableH * 0.5 } };
    }
    if (e.clientX <= cornerW && e.clientY >= H - cornerH) {
        return { mode: "bottomleft", rect: { left: 0, top: usableH * 0.5, width: W * 0.5, height: usableH * 0.5 } };
    }
    if (e.clientX >= W - cornerW && e.clientY >= H - cornerH) {
        return { mode: "bottomright", rect: { left: W * 0.5, top: usableH * 0.5, width: W * 0.5, height: usableH * 0.5 } };
    }
    // Then check edges (each covers half the screen).
    if (e.clientX <= edgeX) {
        return { mode: "left", rect: { left: 0, top: 0, width: W * 0.5, height: usableH } };
    }
    if (e.clientX >= W - edgeX) {
        return { mode: "right", rect: { left: W * 0.5, top: 0, width: W * 0.5, height: usableH } };
    }
    if (e.clientY <= edgeY) {
        return { mode: "top", rect: { left: 0, top: 0, width: W, height: usableH * 0.5 } };
    }
    if (e.clientY >= H - edgeY) {
        return { mode: "bottom", rect: { left: 0, top: usableH * 0.5, width: W, height: usableH * 0.5 } };
    }
    return null;
}

function showSnapPreview(rect) {
    const el = ensureSnapPreview();
    el.style.display = "block";
    el.style.left = rect.left + "px";
    el.style.top = rect.top + "px";
    el.style.width = rect.width + "px";
    el.style.height = rect.height + "px";
}
function hideSnapPreview() {
    if (snapPreviewEl) snapPreviewEl.style.display = "none";
}

// ==============================
// Window dragging and eight-direction Aero Snap.
// ==============================
function makeWindowDraggable(win) {
    const header = win.querySelector(".window-header");
    if (!header) return;
    header.addEventListener("mousedown", function (e) {
        if (e.target.closest("button") || win.classList.contains("maximized")
            || win.classList.contains("fullscreen")) return;
        const rect = win.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        // Save the normal position for restoring from Snap.
        // Update it only when dragging a window that is not already snapped.
        const snapCls = win.classList.contains("snap-left") ? "left"
            : (win.classList.contains("snap-right") ? "right" : null);
        if (!snapCls) {
            win._dragNormal = {
                width: win.style.width,
                height: win.style.height,
                left: win.style.left,
                top: win.style.top
            };
        }
        const original = win._dragNormal || { width: "600px", height: "400px", left: "100px", top: "50px" };
        // Current Snap mode: left, right, top, bottom, a corner, or null.
        let snapped = snapCls;

        function applySnap(mode, r) {
            snapped = mode;
            win.classList.remove("snap-left", "snap-right");
            win.style.width = r.width + "px";
            win.style.height = r.height + "px";
            win.style.left = r.left + "px";
            win.style.top = r.top + "px";
            // Optionally add a preview border color to snapped windows.
        }

        function restoreSnap() {
            snapped = null;
            win.classList.remove("snap-left", "snap-right");
            win.style.width = original.width;
            win.style.height = original.height;
            win.style.left = original.left;
            win.style.top = original.top;
        }

        function move(e) {
            const target = getSnapTarget(e);
            if (target) {
                // Show the frosted preview at an edge and move the window with the pointer; snap on release.
                showSnapPreview(target.rect);
            } else {
                hideSnapPreview();
                if (snapped) {
                    // When dragged away from a snap zone, restore the normal position.
                    restoreSnap();
                    // Recalculate the offset so the window continues following the pointer from its restored position.
                    const nr = win.getBoundingClientRect();
                    offsetX = e.clientX - nr.left;
                    offsetY = e.clientY - nr.top;
                }
            }
            win.style.left = e.clientX - offsetX + "px";
            win.style.top = e.clientY - offsetY + "px";
        }
        function stop(e) {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", stop);
            hideSnapPreview();
            // Snap on release if the pointer is still in a snap zone; otherwise restore the window.
            const target = getSnapTarget(e);
            if (target) {
                applySnap(target.mode, target.rect);
            } else if (snapped) {
                restoreSnap();
            }
            win.classList.remove("dragging");
        }

        win.classList.add("dragging");
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", stop);
        e.preventDefault();
    });
}

// ==============================
// Window controls.
// ==============================
function closeAppWindow(win) {
    if (win.classList.contains("fullscreen")) {
        document.body.classList.remove("window-fullscreen");
    }
    win.remove();
    renderTaskbarApps();
}

function bindWindowActions(win) {
    const fullscreenBtn = win.querySelector(".fullscreen-toggle");
    const minBtn = win.querySelector(".minimize");
    const maxBtn = win.querySelector(".maximize");
    const closeBtn = win.querySelector(".close");

    let oldWinStyle = {};

    if (fullscreenBtn) fullscreenBtn.onclick = () => {
        const isFullscreen = win.classList.toggle("fullscreen");
        document.body.classList.toggle("window-fullscreen", isFullscreen);
        fullscreenBtn.classList.toggle("is-active", isFullscreen);
        fullscreenBtn.textContent = isFullscreen ? "Exit full screen" : "⛶";
        fullscreenBtn.setAttribute("aria-label", isFullscreen ? "Exit full screen" : "Enter full screen");
        fullscreenBtn.title = isFullscreen ? "Exit full screen" : "Enter full screen";
        if (isFullscreen) {
            document.querySelectorAll(".app-window.fullscreen").forEach(fullscreenWin => {
                if (fullscreenWin !== win) fullscreenWin.classList.remove("fullscreen");
            });
            const startMenu = document.getElementById("startMenu");
            if (startMenu) startMenu.style.display = "none";
            hideContextMenu();
        }
        bringWindowToTop(win);
    };
    if (minBtn) minBtn.onclick = () => {
        win.style.display = "none";
        renderTaskbarApps();
    };
    if (maxBtn) maxBtn.onclick = () => {
        win.classList.toggle("maximized");
        bringWindowToTop(win);
        if(win.classList.contains("maximized")){
            oldWinStyle = {
                width: win.style.width,
                height: win.style.height,
                left: win.style.left,
                top: win.style.top
            };
            const taskbar = document.querySelector(".taskbar");
            const taskHeight = taskbar.offsetHeight;
            win.style.width = "100vw";
            win.style.height = `calc(100vh - ${taskHeight}px)`;
            win.style.left = "0";
            win.style.top = "0";
        }else{
            win.style.width = oldWinStyle.width;
            win.style.height = oldWinStyle.height;
            win.style.left = oldWinStyle.left;
            win.style.top = oldWinStyle.top;
        }
    };
    if (closeBtn) closeBtn.onclick = () => {
        closeAppWindow(win);
    };
}

// ==============================
// Window resizing.
// ==============================
function enableWindowResize() {
    document.addEventListener('mousedown', function (e) {
        const win = e.target.closest('.app-window');
        if (!win || win.classList.contains('maximized') || win.classList.contains('fullscreen')) return;
        const rect = win.getBoundingClientRect();
        const edge = 8;
        let mode = '';
        if (e.clientX > rect.right - edge) mode = 'e';
        if (e.clientY > rect.bottom - edge) mode += 's';
        if (mode === '') return;
        document.onmousemove = (ev) => {
            let w = parseInt(win.style.width) || 600;
            let h = parseInt(win.style.height) || 400;
            if (mode.includes('e')) w = ev.clientX - rect.left + 10;
            if (mode.includes('s')) h = ev.clientY - rect.top + 10;
            win.style.width = Math.max(300, w) + 'px';
            win.style.height = Math.max(200, h) + 'px';
        };
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    });
}

// ==============================
// Clock.
// ==============================
function updateTime() {
    const timeEl = document.getElementById("time");
    if (timeEl) timeEl.innerText = new Date().toLocaleTimeString();
}

// ==============================
// Shut down, restart, sign out, refresh the desktop, or restore.
// ==============================
function shutdown() { location.href = "shutdown.html"; }
function restart() { location.href = "restart.html"; }
function logout() { location.href = "logout.html"; }
function desktopreflash() { location.href = "desktop.html"; }
function restore() { location.href = "./setup/backtobe/1.html"; }

// ==============================
// Page load entry point.
// ==============================
window.onload = () => {
    createContextMenu();
    createTaskbarContextMenu();
    renderDesktopIcons();
    renderTaskbarApps();
    bindSearch();
    enableWindowResize();

    const desktopBg = document.querySelector(".desktop-bg");
    if(desktopBg){
        desktopBg.addEventListener("mousedown", (e) => {
            if (e.target.closest(".app-window")) return;
            if (activeWindowDom) {
                activeWindowDom.classList.remove("win-focus");
                activeWindowDom = null;
            }
        })
    }

    const showDesktop = document.querySelector(".show-desktop");
    if (showDesktop) {
        showDesktop.onclick = () => {
            document.querySelectorAll(".app-window").forEach(win => win.style.display = "none");
            const menu = document.getElementById("startMenu");
            if (menu) menu.style.display = "none";
            hideContextMenu();
            renderTaskbarApps();
        };
    }

    const startBtn = document.querySelector(".start-btn");
    if (startBtn) {
        startBtn.onclick = () => {
            const menu = document.getElementById("startMenu");
            if (!menu) return;
            const willShow = menu.style.display !== "block";
            menu.style.display = willShow ? "block" : "none";
            hideContextMenu();
            // Refresh the iframe's app list when opening the menu so newly installed apps appear immediately.
            if (willShow) {
                const frame = document.getElementById("startMenuFrame");
                if (frame && frame.contentWindow) {
                    frame.contentWindow.postMessage(
                        { type: "startmenu-init", apps: mergeAppList() }, "*");
                }
            }
        };
    }

    document.onclick = hideContextMenu;

    updateTime();
    setInterval(updateTime, 1000);
};

// ==============================
// Open an app by appId from an iframe, reading the latest installed app list.
// ==============================
window.openAppById = function (appId) {
    // Merge default and locally installed apps on each open to get the latest list.
    function getLocalApps() {
        try {
            const local = localStorage.getItem("app_list");
            return local ? JSON.parse(local) : [];
        } catch (e) {
            return [];
        }
    }
    function mergeAppList() {
        const localApps = getLocalApps();
        const result = [...DEFAULT_APPS];
        for (const app of localApps) {
            if (!app.id) continue;
            const exists = result.some(item => item.id === app.id);
            if (!exists) {
                result.push(app);
            }
        }
        return result;
    }
    const latestAppList = mergeAppList();
    const app = latestAppList.find(item => item.id === appId);
    if (!app) {
        console.warn("App ID not found:", appId);
        alert("The app could not be found. Make sure it is installed.");
        return;
    }
    openApp(app);
};

// ==============================
// Handle app-open requests from child pages via postMessage.
// ==============================
window.addEventListener("message", function (e) {
    const data = e.data;
    if (!data) return;

    if (data.action === "theme-change") {
        applyDesktopTheme(data.theme);
        return;
    }

    if (data.action === "desktop-wallpaper-change") {
        if (typeof data.wallpaper !== "string" || !data.wallpaper.trim()) return;
        const interval = Number(data.interval);
        if (!Number.isInteger(interval) || interval < 1) return;
        localStorage.setItem("WG_desktop_wallpaper", data.wallpaper.trim());
        localStorage.setItem("WG_desktop_wallpaper_time", String(interval));
        window.applyDesktopWallpaper(data.wallpaper.trim(), interval);
        return;
    }

    if (data.action === "closeApp") {
        const appWindow = Array.from(document.querySelectorAll(".app-window")).find(win => {
            const iframe = win.querySelector("iframe");
            return iframe && iframe.contentWindow === e.source;
        });
        if (appWindow) closeAppWindow(appWindow);
        return;
    }

    // Return the merged app list when requested by the Start menu iframe.
    if (data.action === "startmenu-request") {
        const latestAppList = mergeAppList();
        const frame = document.getElementById("startMenuFrame");
        if (frame && frame.contentWindow) {
            frame.contentWindow.postMessage(
                { type: "startmenu-init", apps: latestAppList }, "*");
        }
        return;
    }

    // Handle power actions requested by the Start menu iframe.
    if (data.action === "power") {
        const cmd = data.cmd;
        if (cmd === "shutdown") shutdown();
        else if (cmd === "restart") restart();
        else if (cmd === "logout") logout();
        else if (cmd === "reflash") desktopreflash();
        else if (cmd === "restore") {
            if (data.target === "phase2") {
                location.href = "https://andy5338hotmailcom.github.io/wg_sys_be/setup/backtobe/2.html";
            } else {
                restore();
            }
        }
        return;
    }

    // Show the context menu in the main window when requested by the Start menu iframe.
    if (data.action === "startmenu-contextmenu") {
        const app = mergeAppList().find(item => item.id === data.appId);
        if (!app) {
            console.warn("Context menu: app not found", data.appId);
            return;
        }
        currentRightClickApp = app;
        // Convert iframe coordinates to coordinates in the main window.
        const frame = document.getElementById("startMenuFrame");
        let x = data.x, y = data.y;
        if (frame) {
            const rect = frame.getBoundingClientRect();
            x = data.x + rect.left;
            y = data.y + rect.top;
        }
        showContextMenu(x, y);
        return;
    }

    // Open an app using the top-level mergeAppList/getLocalApps helpers.
    if (data.action === "openApp" && data.appId) {
        const latestAppList = mergeAppList();
        const app = latestAppList.find(item => item.id === data.appId);
        if (!app) {
            console.warn("App ID not found:", data.appId);
            alert("The app could not be found. Make sure it is installed.");
            return;
        }
        openApp(app);
        // Automatically close the Start menu after opening an app.
        const menu = document.getElementById("startMenu");
        if (menu) menu.style.display = "none";
        hideContextMenu();
    }
});