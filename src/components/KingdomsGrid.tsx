import { motion } from 'framer-motion';
import { Swords, Crown, Brain, BookOpen, BarChart3, Dice5, Code, ChevronRight } from 'lucide-react';
import type { Database } from '../lib/supabase';

type Kingdom = Database['public']['Tables']['kingdoms']['Row'];
const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = { 'calculator': Swords, 'brain': Brain, 'book-open': BookOpen, 'chart-bar': BarChart3, 'dice-5': Dice5, 'code': Code };

interface KingdomsGridProps { kingdoms: Kingdom[]; onSelect?: (kingdom: Kingdom) => void; }

export function KingdomsGrid({ kingdoms, onSelect }: KingdomsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kingdoms.map((kingdom, index) => {
        const IconComponent = iconMap[kingdom.icon] || Crown;
        return (
          <motion.div key={kingdom.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onSelect?.(kingdom)} className="glass rounded-2xl p-6 cursor-pointer relative overflow-hidden group" style={{ '--kingdom-color': kingdom.color } as React.CSSProperties}>
            <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30" style={{ background: `linear-gradient(135deg, ${kingdom.color}33 0%, transparent 100%)` }} />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg, ${kingdom.color}40 0%, ${kingdom.color}20 100%)`, boxShadow: `0 0 20px ${kingdom.color}30` }}>
                <IconComponent className="w-7 h-7" style={{ color: kingdom.color }} />
              </div>
              <h3 className="text-lg font-semibold mb-1">{kingdom.name}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">{kingdom.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((level) => (<div key={level} className={`w-2 h-2 rounded-full ${level <= kingdom.difficulty ? 'bg-yellow-400' : 'bg-gray-600'}`} />))}</div>
                <div className="flex items-center gap-1 text-sm" style={{ color: kingdom.color }}><span>Explore</span><ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
