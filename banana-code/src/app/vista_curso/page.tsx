"use client";

import React, { useState, useEffect, useRef } from "react";

type Role = "estudiante" | "profesorEditor" | "admin";

interface GlobalThisWithTestRole {
  __TEST_ROLE__?: Role;
}

const defaultCourse = {
  title: "Introducción a la programación",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl ligula, pulvinar accumsan varius et, volutpat eget ipsum. Sed at libero vel turpis blandit sollicitudin vitae nec lectus.",
};

export default function HomePage() {
  const initialRole = (globalThis as GlobalThisWithTestRole).__TEST_ROLE__ ?? ("estudiante" as Role);
  const [role] = useState<Role>(initialRole);
  const [theme] = useState<"dark" | "light">("light");
  const [course, setCourse] = useState(defaultCourse);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(course);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const editable = role === "profesorEditor" || role === "admin";
  const cardRef = useRef<HTMLElement | null>(null);
  const scrollVelocityRef = useRef(0);
  const lastScrollRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      scrollVelocityRef.current = currentScroll - lastScrollRef.current;
      lastScrollRef.current = currentScroll;
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(currentScroll);
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const animateIn = () => {
      if (cardRef.current) {
        cardRef.current.style.animation = "fadeInUp 0.7s ease-out forwards";
      }
    };
    animateIn();
  }, []);

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

  // Parallax effect calculation
  const parallaxLeft = Math.min(scrollY * 0.08, 150);
  const parallaxRight = Math.min(scrollY * 0.08, 150);
  
  // Efecto de velocidad de scroll
  const scrollVelocity = scrollVelocityRef.current;
  const velocityEffect = Math.max(-30, Math.min(30, scrollVelocity * 0.5));
  
  // Mouse hover effect
  const mouseInfluenceLeft = (mousePos.x / window.innerWidth - 0.5) * 20;
  const mouseInfluenceRight = (mousePos.x / window.innerWidth - 0.5) * -20;

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bananaEntranceLeft {
          0% { 
            opacity: 0; 
            transform: translateY(-50%) translateX(-200px) rotate(-45deg) scale(0.3);
          }
          60% {
            opacity: 0.15;
            transform: translateY(-50%) translateX(20px) rotate(-10deg) scale(1.05);
          }
          100% { 
            opacity: 0.12; 
            transform: translateY(-50%) translateX(0) rotate(-15deg) scale(1);
          }
        }

        @keyframes bananaEntranceRight {
          0% { 
            opacity: 0; 
            transform: translateY(-50%) translateX(200px) rotate(45deg) scale(0.3);
          }
          60% {
            opacity: 0.15;
            transform: translateY(-50%) translateX(-20px) rotate(20deg) scale(1.05);
          }
          100% { 
            opacity: 0.12; 
            transform: translateY(-50%) translateX(0) rotate(15deg) scale(1);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .course-page-wrapper {
          min-height: calc(100vh - 80px);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
        }

        .course-theme-light {
          background: linear-gradient(135deg, #fef5e7 0%, #fef9f3 25%, #fdf6ec 50%, #fef9f3 75%, #fef5e7 100%);
          background-size: 200% 200%;
          animation: gradientShift 15s ease infinite;
          color: #2d3436;
        }

        .course-banana-left,
        .course-banana-right {
          position: fixed;
          font-size: 350px;
          pointer-events: none;
          z-index: 0;
          transition: none;
          will-change: transform;
          opacity: 0.12;
        }

        .course-banana-left {
          left: -150px;
          top: 50%;
          animation: bananaEntranceLeft 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .course-banana-right {
          right: -150px;
          top: 50%;
          animation: bananaEntranceRight 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .course-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .course-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(255, 193, 7, 0) 70%);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
          opacity: 0.3;
        }

        .course-page-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px 16px;
          position: relative;
          z-index: 2;
        }

        @media (min-width: 768px) {
          .course-page-inner {
            padding: 40px 24px;
          }
        }

        .course-page-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 40px;
        }

        .course-page-card {
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          opacity: 0;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        @media (min-width: 768px) {
          .course-page-card {
            padding: 40px;
          }
        }

        .course-page-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }

        .course-card-header {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (min-width: 768px) {
          .course-card-header {
            flex-direction: row;
            justify-content: space-between;
            gap: 24px;
          }
        }

        .course-field-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.5;
          margin-bottom: 12px;
          font-weight: 700;
          color: #666;
        }

        .course-card-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 28px;
          color: #1a1a1a;
          line-height: 1.2;
        }

        .course-card-description {
          line-height: 1.8;
          opacity: 0.75;
          font-size: 16px;
          color: #4a4a4a;
        }

        .course-input, .course-textarea {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          font-family: inherit;
          font-size: 16px;
          transition: all 0.3s;
          margin-bottom: 16px;
          background: white;
          color: #2d3748;
        }

        .course-input:focus, .course-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .course-textarea {
          min-height: 140px;
          resize: vertical;
        }

        .course-controls {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .course-button {
          padding: 14px 28px;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 15px;
        }

        .course-btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .course-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .course-btn-save {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .course-btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
        }

        .course-btn {
          background: rgba(128, 128, 128, 0.15);
          color: #4a4a4a;
          font-weight: 600;
        }

        .course-btn:hover {
          background: rgba(128, 128, 128, 0.25);
        }

        .course-card-footer {
          padding-top: 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          font-size: 13px;
          opacity: 0.4;
          font-style: italic;
          color: #666;
        }
      `}</style>

      <div className={`course-page-wrapper ${theme === "dark" ? "theme-dark" : "course-theme-light"}`}>
        {theme === "light" && (
          <>
            <div 
              className="course-banana-left"
              style={{
                transform: `translateY(calc(-50% + ${parallaxLeft + velocityEffect}px)) rotate(-15deg) translateX(${mouseInfluenceLeft}px)`
              }}
            >
              🍌
            </div>
            <div 
              className="course-banana-right"
              style={{
                transform: `translateY(calc(-50% + ${parallaxRight + velocityEffect}px)) rotate(15deg) translateX(${mouseInfluenceRight}px)`
              }}
            >
              🍌
            </div>
            
            <div className="course-particles">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="course-particle"
                  style={{
                    left: `${8 + i * 10}%`,
                    top: `${15 + (i % 4) * 22}%`,
                    animationDelay: `${i * 0.7}s`,
                    animationDuration: `${5 + (i % 3)}s`
                  }}
                />
              ))}
            </div>
          </>
        )}

        <div className="course-page-inner">
          <div className="course-page-layout">
            <main>
              <section ref={cardRef as React.RefObject<HTMLElement>} className="course-page-card">
                <div className="course-card-header">
                  <div style={{ flex: 1 }}>
                    <div className="course-field-label">Título</div>
                    {!editing ? (
                      <h2 className="course-card-title">{course.title}</h2>
                    ) : (
                      <input
                        className="course-input"
                        value={draft.title}
                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      />
                    )}

                    <div className="course-field-label">Descripción</div>
                    {!editing ? (
                      <p className="course-card-description">{course.description}</p>
                    ) : (
                      <textarea
                        className="course-textarea"
                        value={draft.description}
                        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                      />
                    )}
                  </div>

                  {editable && (
                    <div className="course-controls">
                      {!editing ? (
                        <button id="editBtn" className="course-button course-btn-primary" onClick={startEdit}>
                          Editar
                        </button>
                      ) : (
                        <>
                          <button id="saveBtn" className="course-button course-btn-save" onClick={onSave}>
                            Guardar
                          </button>
                          <button className="course-button course-btn" onClick={onCancel}>
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <footer className="course-card-footer">
                  endpoint para devolver la información del curso (simulado)
                </footer>
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}