import { Suspense } from "react";
import StudentsContent from "./components/StudentsContent";

export default function StudentsPage() {
  return (
    <Suspense fallback={<div>Cargando la interfaz de estudiantes...</div>}>
      <StudentsContent />
    </Suspense>
  );
}
