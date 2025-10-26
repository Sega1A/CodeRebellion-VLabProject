"use client";

import StudentsList from "@/app/components/students-list";
import { useSearchParams } from "next/navigation";

export default function StudentsListPage() {
	const searchParams = useSearchParams();

	// Obtener el courseId de los query params, o usar un valor por defecto
	const courseId = searchParams.get("courseId") || "default-course-id";

	return <StudentsList courseId={courseId} />;
}
