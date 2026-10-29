import React, { useState } from 'react';
import { knowledgeService } from '../../services/knowledgeService';
import { KnowledgeArticle } from '../../types/knowledge';
import { BookOpen, Search, Plus, CheckCircle2, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const KnowledgeBasePage: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(() => knowledgeService.getAll());
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isAdmin } = useAuth();

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newManufacturer, setNewManufacturer] = useState('Crestron');
  const [newModel, setNewModel] = useState('');
  const [newSymptom, setNewSymptom] = useState('');
  const [newResolution, setNewResolution] = useState('');
  const [newCitation, setNewCitation] = useState('');

  const filtered = articles.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.symptomPattern.toLowerCase().includes(q) ||
      a.manufacturer.toLowerCase().includes(q) ||
      a.model.toLowerCase().includes(q)
    );
  });

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    knowledgeService.addArticle({
      id: `KB-AV-0${articles.length + 1}`,
      deviceType: 'general',
      manufacturer: newManufacturer,
      model: newModel,
      title: newTitle,
      symptomPattern: newSymptom,
      verifiedResolution: newResolution,
      manualCitation: newCitation,
      ragStatus: 'verified',
      chunkCount: 16,
      lastVerifiedBy: 'Dr. Sarah Chen (Admin)',
      lastUpdatedAt: 'Just now',
    });

    setArticles(knowledgeService.getAll());
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewSymptom('');
    setNewResolution('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold">
              Verified Knowledge Base
            </span>
            <span className="text-xs font-mono text-sky-700 flex items-center gap-1 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              RAG Vector Ingestion Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-1">
            Troubleshooting Manuals & RAG Grounding
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Senior engineer verified failure patterns used by the diagnostic model to generate grounded hypotheses
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono rounded bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-colors shrink-0 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Verified Article
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-xs text-xs font-mono">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search symptoms, error codes, vendor manuals (Panasonic, Shure, Crestron)..."
            className="w-full bg-zinc-50 border border-zinc-200 rounded pl-9 pr-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-400"
          />
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-lg border border-zinc-200 bg-white hover:border-zinc-300 shadow-xs transition-colors space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-sky-700">
                  {item.id}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold">
                  {item.manufacturer} · {item.model}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  RAG Verified ({item.chunkCount} Chunks)
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  Verified by: {item.lastVerifiedBy}
                </span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-zinc-900 font-sans">
              {item.title}
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5 font-semibold">
                  Symptom Pattern
                </span>
                <p className="text-zinc-700 font-sans">{item.symptomPattern}</p>
              </div>

              <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5 font-semibold">
                  Verified Technical Resolution
                </span>
                <p className="text-zinc-700 font-sans">{item.verifiedResolution}</p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-zinc-500">
                <span className="flex items-center gap-1 font-medium">
                  <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                  Citation: {item.manualCitation}
                </span>
                <span>Updated {item.lastUpdatedAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Article Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200 rounded-lg max-w-lg w-full p-6 text-zinc-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="text-sm font-bold uppercase font-mono">
                Add Verified RAG Knowledge Entry
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddArticle} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="HDMI Audio Sync Lag on Extron Switcher"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-600 font-semibold block mb-1">Manufacturer</label>
                  <input
                    type="text"
                    required
                    value={newManufacturer}
                    onChange={(e) => setNewManufacturer(e.target.value)}
                    placeholder="Extron / Crestron"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 font-semibold block mb-1">Model Reference</label>
                  <input
                    type="text"
                    required
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    placeholder="IN1608 xi"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Symptom Pattern</label>
                <textarea
                  rows={2}
                  required
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  placeholder="Describe failure behavior, LED indications, and input modes..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400 resize-none font-sans"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Verified Resolution Steps</label>
                <textarea
                  rows={3}
                  required
                  value={newResolution}
                  onChange={(e) => setNewResolution(e.target.value)}
                  placeholder="Detailed instructions for field technicians..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400 resize-none font-sans"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Manual Reference Citation</label>
                <input
                  type="text"
                  required
                  value={newCitation}
                  onChange={(e) => setNewCitation(e.target.value)}
                  placeholder="Extron IN1608 User Guide Rev 3, Sec 4, p. 73"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-2 text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-white font-semibold"
                >
                  Verify & Ingest into RAG
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
