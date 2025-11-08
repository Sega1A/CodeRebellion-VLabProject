"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const defaultCourse = {
  title: "Introducción a la programación",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl ligula, pulvinar accumsan varius et, volutpat eget ipsum.",
  instructor: "COSTAS JAUREGUI VLADIMIR ABEL",
  topics: [
    { id: 1, title: "Variables y tipos de datos" },
    { id: 2, title: "Estructuras de control" },
    { id: 3, title: "Funciones y mod" },
  ],
};

export default function InicioPage() {
  const course = defaultCourse;
  // const [course, setCourse] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("/api/courses");
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-orange-50 to-gray-50">
      <div className="w-full bg-white rounded-none shadow-sm overflow-hidden border-t-4 border-orange-500">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-semibold">Inicio</h1>
          </div>

          <div className="bg-orange-50 rounded-lg p-3 mb-4 border-l-4 border-orange-400">
            <h2 className="text-xl font-medium mb-2 text-orange-700">
              {course.title}
            </h2>
            <div className="mb-2">
              <p className="text-base text-gray-600 mb-1">Docente:</p>
              <p className="font-medium text-base">{course.instructor}</p>
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
              {course.topics.map((topic) => (
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
    </div>
  );
}
