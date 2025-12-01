"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type SubTopic = {
  id: number;
  title: string;
  content: string | null;
};

type Topic = {
  id: number;
  title: string;
  content: string | null;
  subtopics: SubTopic[];
};

type CourseType = {
  id: string;
  title: string;
  description: string;
  content: {
    topics: Topic[];
  };
};

export default function HomePage() {
  const router = useRouter();

  const [theme] = useState<"dark" | "light">("light");
  const [course, setCourse] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedTopic, setSelectedTopic] = useState<number | null>(1);
  const searchParams = useSearchParams();

  const cardRef = useRef<HTMLElement | null>(null);
  const scrollVelocityRef = useRef(0);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch("/api/courses/status?status=ACTIVO");
        const courseData = (await response.json()) as CourseType[];
        setCourse(courseData[0] || null);
        setLoading(false);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error al obtener los datos";
        console.error(message);
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      scrollVelocityRef.current = currentScroll - lastScrollRef.current;
      lastScrollRef.current = currentScroll;
    };

    const handleMouseMove = () => {};

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const viewParam = searchParams.get("view");
    const topicParam = searchParams.get("topic");
    if (viewParam === "topics") {
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

  const renderTopicsView = () => {
    if (
      !course ||
      !course.content ||
      !course.content.topics ||
      course.content.topics.length === 0
    ) {
      return null;
    }

    const currentTopic =
      course.content.topics.find((t) => t.id === selectedTopic) ||
      course.content.topics[0];

    const currentTopicIndex = course.content.topics.findIndex(
      (t) => t.id === currentTopic.id
    );

    const isFirstTopic = currentTopicIndex === 0;
    const isLastTopic = currentTopicIndex === course.content.topics.length - 1;

    return (
      <div className="flex flex-col items-start justify-start h-screen bg-gradient-to-b from-orange-50 to-gray-50 p-0">
        <div className="w-full h-full bg-white shadow-none border-t-4 border-orange-500 mx-0 flex flex-col rounded-none">
          <div className="p-3 md:p-4 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => router.push("/inicio")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-sm ring-1 ring-orange-300/40 hover:from-orange-600 hover:to-orange-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Inicio
              </button>
              <div className="w-12"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 h-full">
              <div className="w-full md:w-1/4 lg:w-1/5">
                <h2 className="text-lg font-medium mb-2">Tópicos del curso</h2>
                <div className="space-y-1">
                  {course.content.topics.map((topic, index) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`w-full text-left p-2 rounded-md border text-sm ${
                        selectedTopic === topic.id
                          ? "bg-orange-50 border-orange-300"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <p className="font-medium truncate">
                        {index + 1}. {topic.title}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-3/4 lg:w-4/5 border border-orange-200 rounded-lg p-3 bg-white shadow-sm h-[500px] flex flex-col">
                <h2 className="text-lg font-medium mb-2 text-orange-700 text-center">
                  {currentTopic.title}
                </h2>
                <div className="prose max-w-none flex-1 text-sm overflow-y-auto">
                  <p className="text-gray-600 text-center mb-2">
                    Contenido del tópico seleccionado
                  </p>
                  <p className="text-center">{currentTopic.content}</p>

                  {currentTopic.subtopics &&
                    currentTopic.subtopics.length > 0 && (
                      <div className="mt-3">
                        <ul className="list-disc pl-5 space-y-1">
                          {currentTopic.subtopics.map((subtopic) => (
                            <li key={subtopic.id}>
                              <h3 className="font-medium text-orange-600 text-base">
                                {subtopic.title}
                              </h3>
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
                      if (currentTopicIndex > 0) {
                        const previousTopic =
                          course.content.topics[currentTopicIndex - 1];
                        setSelectedTopic(previousTopic.id);
                      }
                    }}
                  >
                    Anterior
                  </button>
                  <button
                    className="bg-orange-500 text-white px-4 py-1.5 rounded-md hover:bg-orange-600 shadow-sm transition-colors text-sm"
                    disabled={isLastTopic}
                    onClick={() => {
                      if (
                        currentTopicIndex <
                        course.content.topics.length - 1
                      ) {
                        const nextTopic =
                          course.content.topics[currentTopicIndex + 1];
                        setSelectedTopic(nextTopic.id);
                      }
                    }}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
      ) : (
        renderTopicsView()
      )}
    </div>
  );
}
