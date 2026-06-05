<div align="center">

# Anti-UX Login Hell

**Frontend-only parody login flow with hostile UX, mock session auth, Sudoku, and Minesweeper captcha chaos**

![React](https://img.shields.io/badge/react-latest-20232a?style=flat-square&logo=react&logoColor=61dafb)
![Vite](https://img.shields.io/badge/vite-latest-646cff?style=flat-square&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-latest-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwind-latest-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)
![PixiJS](https://img.shields.io/badge/pixijs-latest-e91e63?style=flat-square)
![Zustand](https://img.shields.io/badge/state-zustand-111111?style=flat-square)
![Vitest](https://img.shields.io/badge/tests-25%20passed-6e9f18?style=flat-square&logo=vitest&logoColor=white)
![Privacy](https://img.shields.io/badge/storage-sessionStorage-4b5563?style=flat-square)
![Security](https://img.shields.io/badge/security-parody%20only-black?style=flat-square)

</div>

---

Anti-UX Login Hell is a polished, frontend-only parody of a login/register experience. It looks modern, behaves intentionally badly, and never pretends to provide real authentication or real captcha security.

## Features

- **Mock Session Auth** - Signup stores a session-scoped mock user with `username`, `email`, `salt`, `passwordHash`, and `createdAt`.
- **No Raw Password Storage** - Passwords are hashed with Web Crypto API / SHA-256 and a session salt.
- **Password Rule Hell** - 16-17 chars, uppercase, lowercase, number, special character, and Turkish character requirements.
- **Anti-UX Form Interactions** - Copy, paste, drag, drop, and context menu blocks in carefully annoying places.
- **PixiJS Dot Field** - White background with animated black dots, drift, wrapping, and mouse magnifier behavior.
- **Sudoku Captcha** - More empty-looking cells, but only 3 editable target cells.
- **Minesweeper Captcha** - 16x16 board, exactly 55 mines, no flood-fill, and 16 safe reveals required.
- **Hostile Close Button** - The Minesweeper close button does not close; it grows the modal instead.
- **Windows Launchers** - One BAT starts localhost, another stops the dev server on port `5173`.

## Tech Stack

- **App** - Vite, React, TypeScript
- **Styling** - Tailwind CSS, system fonts
- **Animation** - Motion
- **Canvas** - PixiJS, used imperatively
- **State** - Zustand
- **Validation** - Zod
- **Icons** - Lucide React
- **Storage** - `sessionStorage`
- **Mock Hashing** - Web Crypto API / SHA-256
- **Testing** - Vitest, React Testing Library, jsdom

## Run Locally

```bat
npm.cmd install
npm.cmd run dev
```

Then open:

```txt
http://localhost:5173/
```

## Windows Launcher

```bat
start-localhost.bat
```

Starts the Vite dev server with `npm.cmd` and opens `http://localhost:5173/` in the default browser.

```bat
stop-localhost.bat
```

Stops the dev server process listening on port `5173`.

## Test

```bat
npm.cmd test
```

## Build

```bat
npm.cmd run build
```

## Project Boundaries

- No backend.
- No API routes.
- No database.
- No real authentication.
- No real captcha/security guarantee.
- No `localStorage`.
- No raw password persistence.
- No remote fonts.
- No analytics or tracking.
- No shadcn/ui, Next.js, Redux, Three.js, GSAP, React Hook Form, or Formik.

## Generated Folders

The generated folders below are ignored and should not be committed:

```txt
node_modules/
dist/
```

---

<div align="center">

**Modern on the surface. Unreasonable by design. Frontend-only by constraint.**

</div>
