"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Role = "estudiante" | "profesorEditor" | "admin";

interface GlobalThisWithTestRole {
  __TEST_ROLE__?: Role;
}

const defaultCourse = {
  title: "Introducción a la programación",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl ligula, pulvinar accumsan varius et, volutpat eget ipsum. Sed at libero vel turpis blandit sollicitudin vitae nec lectus.",
  instructor: "COSTAS JAUREGUI VLADIMIR ABEL",
  topics: [
    {
      id: 1,
      title: "Variables y tipos de datos",
      content: "Declaración de variables, etc...",
      subtopics: [
        {
          id: 101,
          title: "Tipos de datos primitivos",
          content: "contenido ... etc..."
        }
      ]
    },
    {
      id: 2,
      title: "Estructuras de control",
      content: "Contenido sobre estructuras de control"
    },
    {
      id: 3,
      title: "Funciones y mod",
      content: "Contenido sobre funciones"
    }
  ]
};

export default function HomePage() {
  const router = useRouter();
  const initialRole = (globalThis as GlobalThisWithTestRole).__TEST_ROLE__ ?? ("estudiante" as Role);
  const [role] = useState<Role>(initialRole);
  const [theme] = useState<"dark" | "light">("light");
  const [course, setCourse] = useState(defaultCourse);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(course);
  // Estados de parallax eliminados por no ser necesarios para la UI actual
  const [currentView, setCurrentView] = useState<"preview" | "topics">("topics");
  const [selectedTopic, setSelectedTopic] = useState<number | null>(1);
  const searchParams = useSearchParams();

  const editable = role === "profesorEditor" || role === "admin";
  const cardRef = useRef<HTMLElement | null>(null);
  const scrollVelocityRef = useRef(0);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      scrollVelocityRef.current = currentScroll - lastScrollRef.current;
      lastScrollRef.current = currentScroll;
    };

    const handleMouseMove = () => {
      
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Leer parámetros de la URL para abrir directamente la vista de curso
    const viewParam = searchParams.get("view");
    const topicParam = searchParams.get("topic");
    if (viewParam === "topics") {
      setCurrentView("topics");
      setSelectedTopic(topicParam ? Number(topicParam) : 1);
    }
  }, [searchParams]);

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
  
  function goToTopics() {
    setCurrentView("topics");
    setSelectedTopic(1); 
  }
  
  function goToPreview() {
    setCurrentView("preview");
    setSelectedTopic(null);
  }

  
  
  
  
  const renderCoursePreview = () => {
    return (
      <div className="flex flex-col items-center justify-start h-screen bg-gradient-to-b from-orange-50 to-gray-50 p-0 pt-2">
        <div className="w-full h-full max-w-none bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-orange-500 mx-0 flex flex-col">
          <div className="p-3 md:p-4 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <button className="text-orange-600 hover:text-orange-800 flex items-center text-base">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Mis cursos
              </button>
              <h1 className="text-2xl font-semibold text-center flex-grow">{course.title}</h1>
              <div className="flex items-center gap-2">
                {!editing && editable && (
                  <button
                    onClick={startEdit}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  >
                    Editar
                  </button>
                )}
                {editing && (
                  <>
                    <button
                      onClick={onSave}
                      className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 shadow-sm transition-colors text-sm"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={onCancel}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3 mb-4 border-l-4 border-orange-400">
              <h2 className="text-xl font-medium mb-2 text-orange-700">Información del curso</h2>
              {!editing ? (
                <>
                  <div className="mb-2">
                    <p className="text-base text-gray-600 mb-1">Docente:</p>
                    <p className="font-medium text-base">{course.instructor}</p>
                  </div>
                  <div className="mb-1">
                    <p className="text-base text-gray-600 mb-1">Descripción:</p>
                    <p className="text-base">{course.description}</p>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none text-base"
                      placeholder="Nuevo título"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      value={draft.description}
                      onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none text-base resize-none"
                      placeholder="Nueva descripción"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-4 flex flex-col items-center">
              <h2 className="text-xl font-medium mb-2 text-orange-700">Contenido del curso</h2>
              <div className="space-y-2 w-full">
                {course.topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopic(topic.id);
                      setCurrentView("topics");
                    }}
                    className="w-full text-left border border-gray-200 rounded-md p-3 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                  >
                    <h3 className="font-medium text-base">{topic.title}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  
  const renderTopicsView = () => {
    const currentTopic = course.topics.find(t => t.id === selectedTopic) || course.topics[0];
    const isFirstTopic = selectedTopic === 1;
    
    return (
      <div className="flex flex-col items-start justify-start h-screen bg-gradient-to-b from-orange-50 to-gray-50 p-0">
        <div className="w-full h-full bg-white shadow-none border-t-4 border-orange-500 mx-0 flex flex-col rounded-none">
          {/* Área scrollable */}
          <div className="p-3 md:p-4 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <button 
                onClick={() => router.push("/inicio")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-sm ring-1 ring-orange-300/40 hover:from-orange-600 hover:to-orange-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                Inicio
              </button>
              <div className="w-12"></div> {/* Espacio para equilibrar el diseño */}
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 h-full">
              {/* Sidebar con tópicos */}
              <div className="w-full md:w-1/4 lg:w-1/5">
                <h2 className="text-lg font-medium mb-2">Tópicos del curso</h2>
                <div className="space-y-1">
                  {course.topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`w-full text-left p-2 rounded-md border text-sm ${
                        selectedTopic === topic.id 
                          ? "bg-orange-50 border-orange-300" 
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <p className="font-medium truncate">{topic.id}. {topic.title}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Contenido del tópico seleccionado */}
              <div className="w-full md:w-3/4 lg:w-4/5 border border-orange-200 rounded-lg p-3 bg-white shadow-sm h-5/6 flex flex-col">
                <h2 className="text-lg font-medium mb-2 text-orange-700 text-center">{currentTopic.id}. {currentTopic.title}</h2>
                <div className="prose max-w-none flex-1 text-sm overflow-y-auto">
                  <p className="text-gray-600 text-center mb-2">Contenido del tópico seleccionado</p>
                  <p className="text-center">{currentTopic.content}</p>
                  
                  {currentTopic.subtopics && currentTopic.subtopics.length > 0 && (
                    <div className="mt-3">
                      <ul className="list-disc pl-5 space-y-1">
                        {currentTopic.subtopics.map(subtopic => (
                          <li key={subtopic.id}>
                            <h3 className="font-medium text-orange-600 text-base">{subtopic.title}</h3>
                            <p>{subtopic.content}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mt-3 sticky bottom-0 bg-white/80 backdrop-blur-sm pt-2 border-t border-orange-100">
                  <button 
                    className="border border-orange-300 text-orange-700 px-4 py-1.5 rounded-md hover:bg-orange-50 transition-colors text-sm"
                    disabled={isFirstTopic}
                    onClick={() => {
                      if (selectedTopic && selectedTopic > 1) {
                        setSelectedTopic(selectedTopic - 1);
                      }
                    }}
                  >
                    Anterior
                  </button>
                  <button 
                    className="bg-orange-500 text-white px-4 py-1.5 rounded-md hover:bg-orange-600 shadow-sm transition-colors text-sm"
                    disabled={selectedTopic === course.topics.length}
                    onClick={() => {
                      if (selectedTopic && selectedTopic < course.topics.length) {
                        setSelectedTopic(selectedTopic + 1);
                      }
                    }}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Footer visible y elevado */}
          <div className="fixed bottom-4 left-0 right-0 z-40 px-4">
            <div className="max-w-6xl mx-auto border rounded-md px-4 py-2 shadow-sm backdrop-blur
              bg-white/70 border-gray-200 text-gray-800
              dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100">
              <div className="flex items-center justify-between text-sm">
                <div>Estado del curso:</div>
                <div className="font-medium text-green-600">Activo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {renderTopicsView()}
    </div>
  );
}