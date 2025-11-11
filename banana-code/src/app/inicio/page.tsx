"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function InicioPage() {
  const [course, setCourse] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch("/api/courses/status?status=ACTIVO");
        const course = await response.json();
        const teachers = await fetchTeacherByIdCourse(course[0].id);
        setCourse(course[0]);
        setTeachers(teachers);
        setLoading(false);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error al obtener los datos";
        console.error(message);
      }
    };
    fetchCourseDetails();
  }, []);

  const fetchTeacherByIdCourse = async (idCourse: string) => {
    const response = await fetch("/api/courses/teachers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(idCourse),
    });
    const data = await response.json();
    return data;
  };

  return (
    <>
      <div className="h-screen bg-gradient-to-b from-orange-50 to-gray-50">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Cargando...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full bg-white rounded-none shadow-sm overflow-hidden border-t-4 border-orange-500">
              <div className="p-4 md:p-6">
                <div className="bg-orange-50 rounded-lg p-3 mb-4 border-l-4 border-orange-400">
                  <h2 className="text-xl font-medium mb-2 text-orange-700">
                    {course.title}
                  </h2>
                  <div className="mb-2">
                    <p className="text-base text-gray-600 mb-1">Docente:</p>
                    <p className="font-medium text-base">
                      {teachers[0].name ?? "Docente no asignado"}
                    </p>
                  </div>
                  <div className="mb-1">
                    <p className="text-base text-gray-600 mb-1">Descripción:</p>
                    <p className="text-base">{course.description}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="text-xl font-medium mb-2 text-orange-700">
                    Contenido del curso
                  </h2>
                  <div className="space-y-2 w-full">
                    {course.content.topics.map((topic) => (
                      <Link
                        key={topic.id}
                        href={`/vista_curso?view=topics&topic=${topic.id}`}
                        className="block border border-gray-200 rounded-md p-3 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                      >
                        <h3 className="font-medium text-base">{topic.title}</h3>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
