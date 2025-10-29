"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function CourseEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const [courseData, setCourseData] = useState({
    title: 'Introducción a la programación',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl ligula, pulvinar accumsan varius et, volutpat eget ipsum. Sed at libero vel turpis blandit sollicitudin vitae nec lectus.'
  });

  const [editData, setEditData] = useState(courseData);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(courseData);
  };

  const handleSave = () => {
    setCourseData(editData);
    console.log('Datos guardados exitosamente:', editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(courseData);
    setIsEditing(false);
  };

  // Parallax effect calculation
  const parallaxLeft = Math.min(scrollY * 0.08, 150);
  const parallaxRight = Math.min(scrollY * 0.08, 150);
  
  // Efecto de velocidad de scroll
  const scrollVelocity = scrollVelocityRef.current;
  const velocityEffect = Math.max(-30, Math.min(30, scrollVelocity * 0.5));
  
  // Mouse hover effect
  const mouseInfluenceLeft = (mousePos.x / (typeof window !== 'undefined' ? window.innerWidth : 1) - 0.5) * 20;
  const mouseInfluenceRight = (mousePos.x / (typeof window !== 'undefined' ? window.innerWidth : 1) - 0.5) * -20;

  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#fef5e7] via-[#fef9f3] via-[#fdf6ec] via-[#fef9f3] to-[#fef5e7] bg-[length:200%_200%] animate-[gradientShift_15s_ease_infinite] p-8 pt-32 relative overflow-hidden">
        {/* Plátanos animados con parallax */}
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
        
        {/* Partículas flotantes */}
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
        
        <div className="max-w-5xl mx-auto relative">
          {/* Edit/Save Button */}
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="absolute -top-4 right-0 flex items-center gap-2 bg-white hover:bg-gray-50 text-[#666666] px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200 border border-gray-200 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span className="text-sm">Editar campo</span>
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="absolute -top-4 right-0 flex items-center gap-2 bg-[#F4C430] hover:bg-[#E6B623] text-[#1C1C1C] px-6 py-3 rounded-md shadow-lg transition-all duration-200 font-semibold z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              <span className="text-base">Guardar</span>
            </button>
          )}

          {/* Course Card */}
          <div className="bg-[#fdfbf7] rounded-xl shadow-md p-12 mt-8 relative z-0 border border-gray-200">
            {!isEditing ? (
              <>
                <div className="mb-8">
                  <p className="text-[10px] font-semibold text-[#BDBDBD] uppercase tracking-widest mb-2">
                    TÍTULO
                  </p>
                  <h1 className="text-4xl font-bold text-[#1C1C1C]">
                    {courseData.title}
                  </h1>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-[#BDBDBD] uppercase tracking-widest mb-2">
                    DESCRIPCIÓN
                  </p>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    {courseData.description}
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#5B5B5B] mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-[#8D8D8D]/30 rounded-md focus:ring-2 focus:ring-[#8D8D8D] focus:border-transparent outline-none text-lg text-[#1C1C1C]"
                    placeholder="Nuevo título"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5B5B5B] mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-[#8D8D8D]/30 rounded-md focus:ring-2 focus:ring-[#8D8D8D] focus:border-transparent outline-none text-lg resize-none text-[#1C1C1C]"
                    placeholder="Nueva descripción"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-[#F5F5F5] hover:bg-[#E8E8E8] text-[#5B5B5B] font-medium px-6 py-3 rounded-md transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}