import React, { createContext, useCallback, useEffect, useState } from 'react';
import { categoryService } from '../services/categoryService';
import { chapterService } from '../services/chapterService';
import { noteService } from '../services/noteService';
import { subjectService } from '../services/subjectService';
import { userService } from '../services/userService';

export const NoteContext = createContext(null);

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryService.getCategories();
      if (res?.data?.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  }, []);

  // Fetch Subjects (optionally by category)
  const fetchSubjects = useCallback(async (categoryId = '') => {
    try {
      const params = categoryId ? { category: categoryId } : {};
      const res = await subjectService.getSubjects(params);
      if (res?.data?.subjects) {
        setSubjects(res.data.subjects);
      }
    } catch (err) {
      console.error('Error fetching subjects', err);
    }
  }, []);

  // Fetch Chapters (optionally by subject)
  const fetchChapters = useCallback(async (subjectId = '') => {
    try {
      const params = subjectId ? { subject: subjectId } : {};
      const res = await chapterService.getChapters(params);
      if (res?.data?.chapters) {
        setChapters(res.data.chapters);
      }
    } catch (err) {
      console.error('Error fetching chapters', err);
    }
  }, []);

  // Fetch Notes with active filters
  const fetchNotes = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {
        category: selectedCategory || undefined,
        subject: selectedSubject || undefined,
        chapter: selectedChapter || undefined,
        search: searchQuery || undefined,
        ...params,
      };

      const res = await noteService.getNotes(queryParams);
      if (res?.data?.notes) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.error('Error fetching notes', err);
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSubject, selectedChapter, searchQuery]);

  // Initial load
  useEffect(() => {
    fetchCategories();
    fetchSubjects();
    fetchChapters();
  }, [fetchCategories, fetchSubjects, fetchChapters]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSubject('');
    setSelectedChapter('');
    setSearchQuery('');
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        setNotes,
        categories,
        subjects,
        chapters,
        selectedCategory,
        setSelectedCategory,
        selectedSubject,
        setSelectedSubject,
        selectedChapter,
        setSelectedChapter,
        searchQuery,
        setSearchQuery,
        bookmarks,
        setBookmarks,
        loading,
        error,
        fetchNotes,
        fetchCategories,
        fetchSubjects,
        fetchChapters,
        clearFilters,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
