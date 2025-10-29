"use client";

import React, { useState, useEffect } from "react";

interface Student {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	studentCode: string;
	enrolledAt: string;
}

interface Course {
	id: string;
	name: string;
	code: string;
}

interface StudentsListProps {
	courseId: string;
}

export default function StudentsList({ courseId }: StudentsListProps) {
	const [students, setStudents] = useState<Student[]>([]);
	const [course, setCourse] = useState<Course | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api/students?courseId=${courseId}`);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Error al cargar estudiantes");
				}

				setStudents(data.students);
				setCourse(data.course);
				setError(null);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error desconocido");
			} finally {
				setLoading(false);
			}
		};

		if (courseId) {
			fetchStudents();
		}
	}, [courseId]);

	const toggleStudent = (studentId: string) => {
		setSelectedStudents((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(studentId)) {
				newSet.delete(studentId);
			} else {
				newSet.add(studentId);
			}
			return newSet;
		});
	};

	const toggleAllStudents = () => {
		if (selectedStudents.size === students.length) {
			setSelectedStudents(new Set());
		} else {
			setSelectedStudents(new Set(students.map((s) => s.id)));
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
					<p className="mt-4 text-gray-600">Cargando estudiantes...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
					<h3 className="text-red-800 font-semibold mb-2">Error</h3>
					<p className="text-red-600">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2 sm:space-x-4">
							<div className="text-xl sm:text-2xl">🍌</div>
							<div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
								<span>Inicio</span>
								<span>/</span>
								<span className="font-medium text-gray-900">Curso</span>
							</div>
						</div>
						<div className="flex items-center space-x-2 sm:space-x-4">
							<span className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[100px] sm:max-w-none">Sergio</span>
							<button className="text-gray-500 hover:text-gray-700">
								<svg
									className="w-4 h-4 sm:w-5 sm:h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200">
					{/* Course Header */}
					<div className="border-b border-gray-200 px-4 sm:px-6 py-4">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
							<div>
								<h1 className="text-lg sm:text-2xl font-bold text-gray-900">
									Vista de lista de estudiantes
								</h1>
								<p className="text-xs sm:text-sm text-gray-600 mt-1">Profesor Ejecutor</p>
							</div>
							<div className="self-start sm:self-auto">
								{course && (
									<span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
										{course.code}
									</span>
								)}
							</div>
						</div>
					</div>

					{/* Students List */}
					<div className="px-4 sm:px-6 py-4">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
							<h2 className="text-base sm:text-lg font-semibold text-gray-900">
								{students.length} estudiante{students.length !== 1 ? "s" : ""}
							</h2>
							{students.length > 0 && (
								<button
									onClick={toggleAllStudents}
									className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium self-start sm:self-auto"
								>
									{selectedStudents.size === students.length
										? "Deseleccionar todos"
										: "Seleccionar todos"}
								</button>
							)}
						</div>

						{students.length === 0 ? (
							<div className="text-center py-12">
								<svg
									className="mx-auto h-12 w-12 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
								<p className="mt-4 text-gray-500">No hay estudiantes registrados en este curso</p>
							</div>
						) : (
							<div className="space-y-3">
								{students.map((student) => (
									<div
										key={student.id}
										className={`flex items-start sm:items-center p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${selectedStudents.has(student.id)
											? "border-blue-500 bg-blue-50"
											: "border-gray-200 bg-white hover:border-gray-300"
											}`}
										onClick={() => toggleStudent(student.id)}
									>
										{/* Checkbox */}
										<div className="flex-shrink-0 mr-3 sm:mr-4 mt-1 sm:mt-0">
											<div
												className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedStudents.has(student.id)
													? "border-blue-500 bg-blue-500"
													: "border-gray-300"
													}`}
											>
												{selectedStudents.has(student.id) && (
													<svg
														className="w-3 h-3 sm:w-4 sm:h-4 text-white"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={3}
															d="M5 13l4 4L19 7"
														/>
													</svg>
												)}
											</div>
										</div>

										{/* Avatar - Hidden on mobile */}
										<div className="hidden sm:flex flex-shrink-0 mr-4">
											<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm sm:text-lg">
												{student.firstName.charAt(0)}
												{student.lastName.charAt(0)}
											</div>
										</div>

										{/* Student Info */}
										<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
											<div>
												<p className="text-sm sm:text-base font-medium text-gray-900 truncate">
													{student.firstName} {student.lastName}
												</p>
												<p className="text-xs text-gray-500">Nombre estudiante</p>
											</div>
											<div>
												<p className="text-xs sm:text-sm text-gray-700 truncate">{student.email}</p>
												<p className="text-xs text-gray-500">Correo</p>
											</div>
											<div>
												<p className="text-xs sm:text-sm text-gray-700">{student.studentCode}</p>
												<p className="text-xs text-gray-500">Código</p>
											</div>
											<div>
												<p className="text-xs sm:text-sm text-gray-700">
													<span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
														Activo
													</span>
												</p>
												<p className="text-xs text-gray-500">Estado</p>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Footer */}
					<div className="border-t border-gray-200 px-4 sm:px-6 py-3 bg-gray-50">
						<p className="text-xs text-gray-500 text-center truncate">
							{course?.name || "Curso"}
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
