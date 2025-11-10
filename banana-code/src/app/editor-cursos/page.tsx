'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Code, Plus, ChevronDown, ChevronRight, GripVertical, Trash2, Lock, Unlock, X } from 'lucide-react';
import EditorCurso from '../components/navbar/EditorCurso';

interface ContentBlock {
  id: string;
  type: 'Text' | 'Code';
  content: string;
}

interface Topic {
  id: number;
  title: string;
  description: string;
  isOpen: boolean;
  isPublished: boolean;
  contents: ContentBlock[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  students: number;
  topics: number;
  progress: number;
  lastUpdated: string;
  content: {
    topics: Topic[];
  };
}

const CourseEditor = () => {
  const [view, setView] = useState<'courses' | 'editor'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [saveStatus, setSaveStatus] = useState<'' | 'saving' | 'saved' | 'error'>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [editorData, setEditorData] = useState<{ title: string; description: string; topics: Topic[] } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]);
    }
  };

  const saveCourse = async () => {
    if (!selectedCourse || !editorData) return;
    setSaveStatus('saving');

    // Delay mínimo para que se vea la animación de la banana
    const startTime = Date.now();

    try {
      const updatedCourse = {
        ...selectedCourse,
        title: editorData.title,
        description: editorData.description,
        content: { topics: editorData.topics },
        lastUpdated: new Date().toISOString(),
        topics: editorData.topics.length,
      };

      const response = await fetch(`/api/courses/${selectedCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCourse),
      });

      if (response.ok) {
        await loadCourses();
        setSelectedCourse(updatedCourse);

        // Asegurar que la banana se muestre al menos 1.5 segundos
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1500 - elapsedTime);

        await new Promise(resolve => setTimeout(resolve, remainingTime));

        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const createNewCourse = async () => {
    const newCourse = {
      title: 'Nuevo Curso',
      description: 'Descripción del curso',
      students: 0,
      topics: 0,
      progress: 0,
      content: { topics: [] },
    };

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      });

      if (response.ok) {
        const createdCourse = await response.json();
        await loadCourses();
        openEditor(createdCourse);
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const deleteCourse = async (courseId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('¿Estás seguro de eliminar este curso?')) return;

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadCourses();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const toggleTopic = (topicId: number) => {
    setEditorData((prev) =>
      prev
        ? {
          ...prev,
          topics: prev.topics.map((topic) =>
            topic.id === topicId ? { ...topic, isOpen: !topic.isOpen } : topic
          ),
        }
        : prev
    );
  };

  const addTopic = () => {
    setEditorData((prev) =>
      prev
        ? {
          ...prev,
          topics: [
            ...prev.topics,
            {
              id: Date.now(),
              title: 'Nuevo Tópico',
              description: '',
              isOpen: true,
              isPublished: false,
              contents: [],
            },
          ],
        }
        : prev
    );
  };

  const updateTopicTitle = (topicId: number, newTitle: string) => {
    setEditorData((prev) =>
      prev
        ? {
          ...prev,
          topics: prev.topics.map((topic) =>
            topic.id === topicId ? { ...topic, title: newTitle } : topic
          ),
        }
        : prev
    );
  };

  const updateTopicDescription = (topicId: number, newDescription: string) => {
    setEditorData((prev) =>
      prev
        ? {
          ...prev,
          topics: prev.topics.map((topic) =>
            topic.id === topicId ? { ...topic, description: newDescription } : topic
          ),
        }
        : prev
    );
  };

  const toggleTopicPublish = (topicId: number) => {
    setEditorData((prev) =>
      prev
        ? {
          ...prev,
          topics: prev.topics.map((topic) =>
            topic.id === topicId ? { ...topic, isPublished: !topic.isPublished } : topic
          ),
        }
        : prev
    );
  };

  const deleteTopic = (topicId: number) => {
    if (!confirm('¿Eliminar este tópico?')) return;
    setEditorData((prev) =>
      prev
        ? {
          ...prev,
          topics: prev.topics.filter((topic) => topic.id !== topicId),
        }
        : prev
    );
  };

  const moveTopic = (topicId: number, direction: 'up' | 'down') => {
    setEditorData((prev) => {
      if (!prev) return prev;
      const topics = [...prev.topics];
      const index = topics.findIndex((t) => t.id === topicId);
      if (index === -1) return prev;

      if (direction === 'up' && index > 0) {
        [topics[index - 1], topics[index]] = [topics[index], topics[index - 1]];
      } else if (direction === 'down' && index < topics.length - 1) {
        [topics[index], topics[index + 1]] = [topics[index + 1], topics[index]];
      }

      return { ...prev, topics };
    });
  };

  const addContentBlock = (topicId: number, type: 'Text' | 'Code') => {
    setEditorData((prev) =>
      prev
        ? {
          ...prev,
          topics: prev.topics.map((topic) =>
            topic.id === topicId
              ? {
                ...topic,
                contents: [
                  ...topic.contents,
                  {
                    id: type.toLowerCase() + '-' + Date.now(),
                    type,
                    content:
                      type === 'Text'
                        ? 'Escribe tu contenido aquí...'
                        : "# Código Python\ndef ejemplo():\n    return 'Hola'\n\nprint(ejemplo())",
                  },
                ],
              }
              : topic
          ),
        }
        : prev
    );
  };

  const updateContentBlock = (topicId: number, contentId: string, newContent: string) => {
    setEditorData((prev) =>
      prev
        ? {
          ...prev,
          topics: prev.topics.map((topic) =>
            topic.id === topicId
              ? {
                ...topic,
                contents: topic.contents.map((c) =>
                  c.id === contentId ? { ...c, content: newContent } : c
                ),
              }
              : topic
          ),
        }
        : prev
    );
  };

  const deleteContentBlock = (topicId: number, contentId: string) => {
    setEditorData((prev) =>
      prev
        ? {
          ...prev,
          topics: prev.topics.map((topic) =>
            topic.id === topicId
              ? {
                ...topic,
                contents: topic.contents.filter((c) => c.id !== contentId),
              }
              : topic
          ),
        }
        : prev
    );
  };

  const moveContentBlock = (topicId: number, contentId: string, direction: 'up' | 'down') => {
    setEditorData((prev) =>
      prev
        ? {
          ...prev,
          topics: prev.topics.map((topic) => {
            if (topic.id !== topicId) return topic;
            const contents = [...topic.contents];
            const index = contents.findIndex((c) => c.id === contentId);
            if (index === -1) return topic;

            if (direction === 'up' && index > 0) {
              [contents[index - 1], contents[index]] = [contents[index], contents[index - 1]];
            } else if (direction === 'down' && index < contents.length - 1) {
              [contents[index], contents[index + 1]] = [contents[index + 1], contents[index]];
            }

            return { ...topic, contents };
          }),
        }
        : prev
    );
  };

  const openEditor = (course: Course) => {
    setSelectedCourse(course);
    setEditorData({
      title: course.title,
      description: course.description,
      topics: course.content?.topics || []
    });
    setView('editor');
  };

  const updateCourseTitle = (newTitle: string) => {
    setSelectedCourse((prev) => (prev ? { ...prev, title: newTitle } : prev));
    setEditorData((prev) => (prev ? { ...prev, title: newTitle } : prev));
  };

  const updateCourseDescription = (newDescription: string) => {
    setSelectedCourse((prev) => (prev ? { ...prev, description: newDescription } : prev));
    setEditorData((prev) => (prev ? { ...prev, description: newDescription } : prev));
  };

  if (view === 'editor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <EditorCurso
          isEditing={true}
          courseTitle={selectedCourse?.title || ''}
          onTitleChange={updateCourseTitle}
          onSave={saveCourse}
          onBack={async () => {
            await saveCourse();
            setView('courses');
          }}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          saveStatus={saveStatus}
        />
        {saveStatus === 'saving' && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
              <div className="text-7xl mb-4 animate-spin">🍌</div>
              <p className="text-gray-700 font-medium text-lg">Guardando...</p>
            </div>
          </div>
        )}

        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="flex gap-4 sm:gap-6 relative">
            {isSidebarOpen && (
              <div
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            <div
              className={
                'fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-72 lg:w-64 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-none lg:rounded-xl p-5 shadow-xl z-40 transform transition-transform duration-300 lg:top-24 ' +
                (isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')
              }
            >
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-gray-800 font-semibold">Menú</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-orange-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              <button
                onClick={addTopic}
                className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 flex items-center justify-center gap-2 mb-6 text-sm font-medium shadow-md"
              >
                <Plus className="w-4 h-4" />
                Nuevo Tópico
              </button>
              <div className="space-y-1 max-h-[70vh] overflow-y-auto">
                {editorData?.topics &&
                  editorData.topics.map((topic, idx) => (
                    <div key={topic.id}>
                      <div className="flex items-center gap-2 px-3 py-2.5 hover:bg-orange-100 rounded-lg group transition-colors">
                        <button onClick={() => toggleTopic(topic.id)}>
                          {topic.isOpen ? (
                            <ChevronDown className="w-4 h-4 text-orange-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-orange-600" />
                          )}
                        </button>
                        <span className="text-xs font-semibold text-orange-700 bg-orange-200 px-2 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-800 flex-1 truncate">
                          {topic.title}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTopicPublish(topic.id);
                          }}
                          className="opacity-0 group-hover:opacity-100"
                        >
                          {topic.isPublished ? (
                            <Unlock className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-orange-400" />
                          )}
                        </button>
                      </div>
                      {topic.isOpen && (
                        <div className="ml-11 mt-1 space-y-1">
                          {topic.contents && topic.contents.length > 0 ? (
                            topic.contents.map((content) => (
                              <div
                                key={content.id}
                                className="flex items-center gap-2 px-3 py-1.5 hover:bg-orange-100 rounded-lg text-gray-600 transition-colors"
                              >
                                {content.type === 'Text' ? (
                                  <FileText className="w-3.5 h-3.5" />
                                ) : (
                                  <Code className="w-3.5 h-3.5" />
                                )}
                                <span className="text-xs">{content.type}</span>
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 space-y-1.5">
                              <button
                                onClick={() => addContentBlock(topic.id, 'Text')}
                                className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-orange-100 w-full text-left px-2 py-1.5 rounded-lg transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                Texto
                              </button>
                              <button
                                onClick={() => addContentBlock(topic.id, 'Code')}
                                className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-orange-100 w-full text-left px-2 py-1.5 rounded-lg transition-colors"
                              >
                                <Code className="w-3.5 h-3.5" />
                                Código
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">
                      Descripción del Curso
                    </label>
                    <textarea
                      value={editorData?.description || ''}
                      onChange={(e) => updateCourseDescription(e.target.value)}
                      className="w-full text-sm text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent rounded-lg px-4 py-3 resize-none"
                      rows={3}
                      placeholder="Escribe una descripción para tu curso..."
                    />
                  </div>
                </div>
              </div>
              {editorData?.topics &&
                editorData.topics.map((topic, idx) => (
                  <div
                    key={topic.id}
                    className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-semibold text-gray-500 uppercase">
                            Tópico {idx + 1}
                          </span>
                          <button
                            onClick={() => toggleTopicPublish(topic.id)}
                            className={
                              'px-2 py-1 rounded text-xs font-medium ' +
                              (topic.isPublished
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700')
                            }
                          >
                            {topic.isPublished ? 'Publicado' : 'Borrador'}
                          </button>
                        </div>
                        <input
                          type="text"
                          value={topic.title}
                          onChange={(e) => updateTopicTitle(topic.id, e.target.value)}
                          className="text-xl sm:text-2xl font-semibold text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg px-2 py-2 w-full mb-2"
                        />
                        <textarea
                          value={topic.description || ''}
                          onChange={(e) => updateTopicDescription(topic.id, e.target.value)}
                          className="text-sm text-gray-600 border-none focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg px-2 py-1 w-full resize-none"
                          rows={2}
                          placeholder="Descripción del tópico"
                        />
                      </div>
                      <div className="flex gap-2 self-end sm:self-start">
                        <button
                          onClick={() => moveTopic(topic.id, 'up')}
                          disabled={idx === 0}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-orange-50 rounded-lg disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4 rotate-180" />
                        </button>
                        <button
                          onClick={() => moveTopic(topic.id, 'down')}
                          disabled={idx === editorData.topics.length - 1}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-orange-50 rounded-lg disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTopic(topic.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        onClick={() => addContentBlock(topic.id, 'Text')}
                        className="px-3 py-2 border border-orange-200 text-gray-700 rounded-lg hover:bg-orange-50 flex items-center gap-2 text-sm"
                      >
                        <FileText className="w-4 h-4" />
                        Texto
                      </button>
                      <button
                        onClick={() => addContentBlock(topic.id, 'Code')}
                        className="px-3 py-2 border border-orange-200 text-gray-700 rounded-lg hover:bg-orange-50 flex items-center gap-2 text-sm"
                      >
                        <Code className="w-4 h-4" />
                        Código
                      </button>
                    </div>
                    <div className="space-y-4">
                      {topic.contents && topic.contents.length > 0 ? (
                        topic.contents.map((content, contentIdx) => (
                          <div
                            key={content.id}
                            className="border border-orange-100 rounded-lg p-3 sm:p-4 hover:border-orange-300 group"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                              <span className="text-xs font-semibold text-gray-600 bg-orange-50 px-2 py-1 rounded">
                                {content.type}
                              </span>
                              <div className="flex gap-1 ml-auto opacity-0 group-hover:opacity-100">
                                <button
                                  onClick={() => moveContentBlock(topic.id, content.id, 'up')}
                                  disabled={contentIdx === 0}
                                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-orange-50 rounded disabled:opacity-30"
                                >
                                  <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                                </button>
                                <button
                                  onClick={() => moveContentBlock(topic.id, content.id, 'down')}
                                  disabled={contentIdx === topic.contents.length - 1}
                                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-orange-50 rounded disabled:opacity-30"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteContentBlock(topic.id, content.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <textarea
                              value={content.content}
                              onChange={(e) =>
                                updateContentBlock(topic.id, content.id, e.target.value)
                              }
                              className={
                                'w-full px-3 py-2 border border-orange-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none text-sm ' +
                                (content.type === 'Code'
                                  ? 'font-mono bg-slate-900 text-emerald-400'
                                  : 'bg-orange-50/30')
                              }
                              rows={content.type === 'Code' ? 6 : 4}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-orange-200 rounded-lg">
                          <Plus className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Sin contenido</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              {(!editorData?.topics || editorData.topics.length === 0) && (
                <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-8 sm:p-16 text-center">
                  <BookOpen className="w-12 sm:w-16 h-12 sm:h-16 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                    Comienza tu curso
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">Crea tu primer tópico</p>
                  <button
                    onClick={addTopic}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 font-medium inline-flex items-center gap-2 shadow-md"
                  >
                    <Plus className="w-5 h-5" />
                    Crear Tópico
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <EditorCurso onCreateCourse={createNewCourse} />
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {courses.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="text-5xl sm:text-6xl mb-4">🍌</div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              No tienes cursos aún
            </h3>
            <p className="text-sm text-gray-500 mb-6">Crea tu primer curso</p>
            <button
              onClick={createNewCourse}
              className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 inline-flex items-center gap-2 font-medium shadow-md"
            >
              <Plus className="w-5 h-5" />
              Crear Curso
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-orange-100 rounded-xl hover:shadow-lg transition-all p-4 sm:p-6"
              >
                <div className="mb-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Título</span>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-1">
                    {course.title}
                  </h3>
                </div>
                <div className="mb-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Descripción</span>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-orange-100">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {course.content?.topics?.length || 0} tópicos
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-sm text-gray-400 italic">
                    Última actualización: {new Date(course.lastUpdated).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => deleteCourse(course.id, e)}
                      className="px-4 py-2 border border-orange-200 text-gray-700 rounded-lg hover:bg-orange-50 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => openEditor(course)}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 text-sm font-medium shadow-md"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseEditor;
