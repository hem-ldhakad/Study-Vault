import React from 'react';
import { useNotes } from '../hooks/useNotes';
import { Folder, ArrowRight } from 'lucide-react';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import { useNavigate } from 'react-router-dom';

export const Categories = () => {
  const { categories, loading, setSelectedCategory } = useNotes();
  const navigate = useNavigate();

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    navigate('/browse');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Note Categories</h1>
        <p className="text-slate-700 dark:text-slate-300 text-sm font-medium mt-1">Browse study materials organized by academic department</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Card
            key={cat._id}
            onClick={() => handleSelectCategory(cat._id)}
            className="cursor-pointer group flex items-center justify-between hover:border-indigo-500/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <Folder className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-0.5">Explore notes</p>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Categories;
