# Wildgoose BE Experience Enhancements

> Purpose: demonstration and learning.
> This phased implementation plan is updated as the project evolves.

---

## 1. Overview

| Phase | Item | Status |
| --- | --- | --- |
| Current release | Start menu refactor (iframe and messaging) | ✅ Complete |
| Current release | App record format upgrade (whitepath/blackpath/version) | ✅ Complete |
| Current release | Automatic desktop icon column wrapping | ✅ Complete |
| Current release | Aero window effects | 🔨 In progress (8-direction Snap ✅; Shake/Peek planned) |
| Current release | Basic cleanup (remove duplication and legacy code; unify theme scripts) | 🔨 Partially complete |
| Deferred to sys10 | ④ Remove eval injection points, sandbox iframes, validate postMessage origins; ⑤ Localize offline resources | TBD |
| Future work | Real installation logic (keep the simulated setup progress bar for now) | TBD |

---

## 2. ✅ Experience improvement 1: Start menu refactor (complete)

- The Start menu is now an **iframe container** (`startmenu.html`) with a Start header, **four buttons** (restart, shut down, sign out, refresh desktop), and the main iframe.
- Apps open through **postMessage**: clicking an app in the iframe sends `postMessage({action:"openApp", appId})`; the main window calls `openApp()` and **automatically closes the Start menu**.
- Right-clicking an app sends `postMessage({action:"startmenu-contextmenu"})`; the main window converts coordinates for the current theme and displays the context menu.
- Pinning or unpinning an app sends the latest list from the main window to the iframe for live synchronization.
- **Responsive layout**: menu width is `min(680px, 100vw-40px)`; it contracts on narrow screens so the four buttons remain visible.
- Files: `startmenu.html`, `desktop.html` (loads the theme from `WG_color`), `whitedesktop.css`, `blackdesktop.css`, and `desktop.js`.

## 3. ✅ App record format upgrade (complete)

- Record format: `path` → `whitepath` + `blackpath` + `version`.
- `resolveAppPath(app)` selects `whitepath` or `blackpath` for the current `WG_color` theme and **falls back to `path`** for compatibility with the legacy format.
- Files: `desktop.js` (`DEFAULT_APPS`, `resolveAppPath`, and `openApp`), `base.wgapp`, and `apps/appinstall/white.html` / `black.html` (format validation).

## 4. ✅ Automatic desktop icon column wrapping (complete)

- `#desktop-icons` uses `flex-direction: column`, `flex-wrap: wrap`, and a constrained container height so icons wrap into a new column after filling the screen vertically.
- Files: `whitedesktop.css` and `blackdesktop.css`.

---

## 5. 🟢 Experience improvement 2: Aero window effects (in progress)

Four Windows Aero-style interactions are being added to the window system in `desktop.js`.

### 1. Snap (eight directions with frosted preview) ✅ Complete

- **Eight snap positions**: left, right, top, and bottom (half screen), plus all four corners (quarter screen).
- **Frosted preview**: dragging to an edge displays a translucent blurred highlight (`#snap-preview`, `backdrop-filter:blur(6px)`) for the target area; the window snaps on release.
- Corners (quarter screen) take priority over edges (half screen).
- Dragging away from a snap zone restores the previous window position; dragging a snapped window again also restores it correctly.
- Implementation: rewrite `makeWindowDraggable` and add `getSnapTarget`, `ensureSnapPreview`, `showSnapPreview`, and `hideSnapPreview` in `desktop.js`.
- Tested: all eight directions, preview display and dismissal, and both quarter-screen and half-screen snapping.

### 2. Shake (planned)

- Quickly shake a window by its title bar to minimize every other window and keep the active one visible.
- Shake it again to restore the minimized windows.

### 3. Peek (planned)

- 悬停任务栏应用图标 → 显示应用名称与窗口缩略预览。✅ 已完成
- Alternatively, “Show desktop” could temporarily make windows transparent instead of hiding them, restoring them when the pointer moves away.
- 实现：任务栏悬停卡片显示名称和 iframe 窗口缩略预览；未运行应用显示图标占位（`desktop.js`、`whitedesktop.css`、`blackdesktop.css`）。
- 待做：或"显示桌面"时临时将窗口透明化（而非全部隐藏），移开后恢复。


### Files

- Primarily `desktop.js`; a `desktop.css` file with transition styles may also be added.

---

## 6. 🟢 Basic cleanup (partially complete)

- ✅ Consolidate the **three duplicate `getLocalApps` / `mergeAppList` implementations** in `desktop.js` into top-level global functions; do not redeclare them inside message listeners.
- ⬜ Consolidate the **duplicate theme-switching scripts** in app `index.html` files (light/dark navigation) into shared logic.
- ⬜ Remove the legacy file `apps/appstore/white.html.old`.
- ⬜ Change the backslash in `loginwait.html`'s `src="media\startup.mp3"` path to a forward slash.
- ⬜ The desktop defaults reference missing `doc` / `setting` IDs (`desktop.js`, lines 59–64); verify and fix or retain them intentionally.

---

## 7. 🟡 Deferred to sys10 (not included here)

- **④ Security**: replace calculator `eval()` with safe expression parsing; sandbox iframes; validate `event.origin` / `event.source` in `postMessage` handlers.
- **⑤ Offline support**: localize Tailwind and Font Awesome to remove CDN dependencies.

---

## 8. 🔴 Future work (not included here)

- Real installation logic: keep the simulated progress bar currently in `setup/index.html`; later, add actual file writing and installation.
