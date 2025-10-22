"use client";

import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

type Role = "estudiante" | "profesorEditor" | "admin";

const defaultCourse = {
  title: "Introducción a la programación",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl ligula, pulvinar accumsan varius et, volutpat eget ipsum. Sed at libero vel turpis blandit sollicitudin vitae nec lectus.",
};

export default function HomePage() {
  const initialRole = (globalThis as any).__TEST_ROLE__ ?? ("estudiante" as Role);
  const [role] = useState<Role>(initialRole);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [course, setCourse] = useState(defaultCourse);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(course);

  const editable = role === "profesorEditor" || role === "admin";
  const cardRef = useRef<HTMLElement | null>(null);
  const brandRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const animateIn = () => {
      if (brandRef.current) {
        brandRef.current.style.animation = "slideInLeft 0.6s ease-out forwards";
      }
      if (userRef.current) {
        userRef.current.style.animation = "slideInRight 0.6s ease-out 0.12s forwards";
      }
      if (cardRef.current) {
        cardRef.current.style.animation = "fadeInUp 0.7s ease-out forwards";
      }
    };
    animateIn();
  }, []);

  useEffect(() => {
    const icon = document.getElementById("themeIcon");
    if (icon) {
      icon.style.animation = theme === "dark" 
        ? "rotateIcon 0.6s ease-out forwards" 
        : "rotateIconReverse 0.6s ease-out forwards";
    }
  }, [theme]);

  function startEdit() {
    setDraft(course);
    setEditing(true);
  }

  function onSave() {
    setCourse(draft);
    setEditing(false);
    console.log("Guardado (simulado):", draft);
    alert("Guardado exitoso: " + draft.title);
  }

  function onCancel() {
    setDraft(course);
    setEditing(false);
  }

  return (
    <div className={`container ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <div className="inner">
        <header className="navbar">
          <div className="left-nav">
            <div ref={brandRef} className="brand-wrapper" title="BananaCode logo">
              <div className="brand-emoji" aria-hidden="true">
                🍌
              </div>
            </div>
            <div className="breadcrumb">Inicio <span className="sep">|</span> Curso</div>
          </div>

          <div className="right-nav">
            <button
              className="theme-toggle"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
              id="themeToggle"
            >
              {theme === "dark" ? (
                <svg id="themeIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2"></path><path d="M12 21v2"></path><path d="M4.2 4.2l1.4 1.4"></path><path d="M18.4 18.4l1.4 1.4"></path><path d="M1 12h2"></path><path d="M21 12h2"></path><path d="M4.2 19.8l1.4-1.4"></path><path d="M18.4 5.6l1.4-1.4"></path></svg>
              ) : (
                <svg id="themeIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>
              )}
            </button>

            <div ref={userRef} className="user">Gerson <span className="caret">▾</span></div>
          </div>
        </header>

        <div className="layout">
          <main>
            <section ref={cardRef as any} className="card">
              <div className="card-header">
                <div style={{ flex: 1 }}>
                  <div className="field-label">Título</div>
                  {!editing ? (
                    <h2 className="card-title">{course.title}</h2>
                  ) : (
                    <input
                      className="input"
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    />
                  )}

                  <div className="field-label">Descripción</div>
                  {!editing ? (
                    <p className="card-description">{course.description}</p>
                  ) : (
                    <textarea
                      className="textarea"
                      value={draft.description}
                      onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    />
                  )}
                </div>

                {editable && (
                  <div className="controls">
                    {!editing ? (
                      <button id="editBtn" className="btn-primary" onClick={startEdit}>
                        Editar
                      </button>
                    ) : (
                      <>
                        <button id="saveBtn" className="btn-save" onClick={onSave}>
                          Guardar
                        </button>
                        <button className="btn" onClick={onCancel}>
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <footer className="card-footer">
                endpoint para devolver la información del curso (simulado)
              </footer>
            </section>

            {/* Modelo 3D de Spline */}
            {/* <SplineModel /> */}
          </main>
        </div>
      </div>
    </div>
  );
}