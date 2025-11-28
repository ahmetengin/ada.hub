import React from 'react';
import { ExternalLink, GitBranch, FolderOpen, Github, Cpu } from 'lucide-react';
import { Repository } from '../types';

interface RepoCardProps {
  repo: Repository;
  onOpenDetails?: (repo: Repository) => void;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo, onOpenDetails }) => {
  const Icon = repo.icon;
  const isAgentOrMCP = repo.tags.some(t => t.includes('Agent') || t.includes('MCP'));

  return (
    <div 
      onClick={() => onOpenDetails?.(repo)}
      className="group relative bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-ada-500/50 rounded-xl p-6 transition-all hover:shadow-xl hover:shadow-ada-500/10 flex flex-col h-full overflow-hidden cursor-pointer"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-ada-500/0 via-ada-500/0 to-ada-500/0 group-hover:from-ada-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg border transition-colors ${
              isAgentOrMCP 
                ? 'bg-purple-900/20 border-purple-500/30 text-purple-400 group-hover:text-purple-300' 
                : 'bg-slate-950 border-slate-800 text-ada-400 group-hover:text-white group-hover:border-ada-500/30'
            }`}>
              <Icon size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-ada-400 transition-colors line-clamp-1">
                {repo.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <GitBranch size={12} />
                <span>main</span>
                {isAgentOrMCP && (
                  <span className="flex items-center gap-1 text-purple-400 ml-1">
                    <Cpu size={10} />
                    <span>Active Protocol</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
          {repo.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {repo.tags.slice(0, 3).map(tag => (
            <span 
              key={tag} 
              className={`px-2 py-1 text-[10px] font-medium uppercase tracking-wider rounded-md border ${
                tag === 'MCP' || tag === 'Agent' 
                  ? 'bg-purple-900/30 border-purple-800 text-purple-300' 
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              {tag}
            </span>
          ))}
          {repo.tags.length > 3 && (
            <span className="px-2 py-1 text-[10px] font-medium text-slate-500">+ {repo.tags.length - 3}</span>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between gap-3 pointer-events-auto">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails?.(repo);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-sm text-slate-300 transition-colors group/btn"
          >
            <FolderOpen size={16} />
            <span>View Blueprint</span>
          </button>
          <a 
            href={repo.url} 
            target="_blank" 
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 text-slate-500 hover:text-ada-400 hover:bg-slate-900 rounded-lg transition-colors"
            title="Open on GitHub"
          >
            <Github size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RepoCard;