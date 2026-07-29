import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, ArrowRight, Search, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotes } from '../hooks/useNotes';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const Subjects = () => {
  const { subjects, setSelectedSubject } = useNotes();
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleSubjectSelect = (subjId) => {
    setSelectedSubject(subjId);
    navigate('/browse');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Academic Subjects</h1>
        <p className="text-slate-400 text-sm mt-1">Explore course subjects categorized across disciplines</p>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter subjects..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 pl-10 pr-4 py-2 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
        <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subj, idx) => (
          <motion.div
            key={subj._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card
              onClick={() => handleSubjectSelect(subj._id)}
              className="cursor-pointer group hover:border-purple-500/60 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 bg-purple-950/80 border border-purple-800/60 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                  <Book className="w-6 h-6" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
              </div>

              <div className="mt-4 space-y-2">
                <h3 className="font-bold text-lg text-slate-100 group-hover:text-purple-400 transition-colors">
                  {subj.name}
                </h3>
                {subj.category?.name && (
                  <Badge variant="indigo">{subj.category.name}</Badge>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
