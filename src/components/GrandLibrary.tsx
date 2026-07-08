import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, ChevronRight, Library } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export function GrandLibrary() {
  const { formulas, kingdoms, fetchFormulas, fetchKingdoms } = useGameStore();
  const [search, setSearch] = useState('');
  const [activeKingdom, setActiveKingdom] = useState<string | null>(null);
  const [selectedFormula, setSelectedFormula] = useState<string | null>(null);

  useEffect(() => { fetchKingdoms(); fetchFormulas(); }, [fetchKingdoms, fetchFormulas]);

  useEffect(() => {
    const timeout = setTimeout(() => { fetchFormulas(search || undefined, activeKingdom || undefined); }, 300);
    return () => clearTimeout(timeout);
  }, [search, activeKingdom, fetchFormulas]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof formulas>();
    formulas.forEach((f) => {
      const key = f.topic_name;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [formulas]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center justify-center gap-2"><Library className="w-8 h-8" />Grand Library</h1>
        <p className="text-[var(--text-muted)]">{formulas.length} formulas, rules, and definitions across all topics</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-4 mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input type="text" placeholder="Search formulas, topics..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-game pl-12" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button onClick={() => setActiveKingdom(null)} className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${!activeKingdom ? 'bg-indigo-500 text-white' : 'bg-[var(--surface)] text-[var(--text-muted)]'}`}>All</button>
          {kingdoms.map((k) => (
            <button key={k.id} onClick={() => setActiveKingdom(k.id)} className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${activeKingdom === k.id ? 'text-white' : 'bg-[var(--surface)] text-[var(--text-muted)]'}`} style={activeKingdom === k.id ? { background: k.color } : {}}>{k.name}</button>
          ))}
        </div>
      </motion.div>

      {grouped.length === 0 ? (
        <div className="text-center py-12"><BookOpen className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-4" /><p className="text-[var(--text-muted)]">No formulas found. Try a different search.</p></div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([topic, topicFormulas], idx) => (
            <motion.div key={topic} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
              <h2 className="font-semibold mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-indigo-400" />{topic} <span className="text-xs text-[var(--text-muted)] font-normal">({topicFormulas.length})</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topicFormulas.map((f, i) => (
                  <motion.div key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} onClick={() => setSelectedFormula(selectedFormula === f.id ? null : f.id)} className="glass rounded-xl p-4 cursor-pointer" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{f.formula_name}</h3>
                      <ChevronRight className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${selectedFormula === f.id ? 'rotate-90' : ''}`} />
                    </div>
                    <p className="text-sm font-mono text-indigo-400 mb-2">{f.formula_text}</p>
                    {selectedFormula === f.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                        <p className="text-sm text-[var(--text-muted)] mb-2">{f.description}</p>
                        {f.example && <div className="bg-[var(--surface)] rounded-lg p-3"><p className="text-xs"><span className="font-medium text-green-400">Example: </span>{f.example}</p></div>}
                        <div className="flex flex-wrap gap-1 mt-2">{f.tags.map((tag) => <span key={tag} className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded">{tag}</span>)}</div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
