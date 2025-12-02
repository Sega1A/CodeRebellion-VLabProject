import { Suspense } from "react";
import CourseContent from "./components/CourseContent";

export default function VistaCursoPage() {
  return (
    <Suspense fallback={<div>Preparando la vista del curso...</div>}>
      <CourseContent />
    </Suspense>
  );
}
