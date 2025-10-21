import React, { useState, useRef } from "react";

export default function Navbar() {
  const [theme, setTheme] = useState("light");
  const brandRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);

  return (
    <div>
      <header className="navbar">
        <div className="left-nav">
          <div ref={brandRef} className="brand-wrapper" title="BananaCode logo">
            <div className="brand-emoji" aria-hidden="true">
              🍌
            </div>
          </div>
          <div className="breadcrumb">
            Inicio <span className="sep">|</span> Curso
          </div>
        </div>

        <div className="right-nav">
          <button
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            aria-label="Toggle theme"
            id="themeToggle"
          >
            {theme === "dark" ? (
              <svg
                id="themeIcon"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2"></path>
                <path d="M12 21v2"></path>
                <path d="M4.2 4.2l1.4 1.4"></path>
                <path d="M18.4 18.4l1.4 1.4"></path>
                <path d="M1 12h2"></path>
                <path d="M21 12h2"></path>
                <path d="M4.2 19.8l1.4-1.4"></path>
                <path d="M18.4 5.6l1.4-1.4"></path>
              </svg>
            ) : (
              <svg
                id="themeIcon"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
              </svg>
            )}
          </button>

          <div ref={userRef} className="user">
            Gerson <span className="caret">▾</span>
          </div>
        </div>
      </header>
    </div>
  );
}
