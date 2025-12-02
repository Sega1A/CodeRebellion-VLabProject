"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
}

export default function StudentsContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    setLoading(true);
    fetch(`/api/students?q=${searchQuery}`)
      .then((res) => res.json())
      .then((data: Student[]) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch students:", error);
        setLoading(false);
      });
  }, [searchQuery]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Gestión de Estudiantes</h1>
      <p className="mb-4">
        Mostrando resultados para: **{searchQuery || "todos"}**
      </p>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul className="space-y-3">
          {students.length > 0 ? (
            students.map((student) => (
              <li key={student.id} className="p-3 border rounded-md shadow-sm">
                {student.name} ({student.email})
              </li>
            ))
          ) : (
            <p>No se encontraron estudiantes.</p>
          )}
        </ul>
      )}
    </div>
  );
}
