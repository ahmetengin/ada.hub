import React from 'react';
import { X, ExternalLink, GitBranch, Folder, FileText, Check, Copy, Bot, Terminal } from 'lucide-react';
import { Repository } from '../types';

interface RepoModalProps {
  repo: Repository | null;
  onClose: () => void;
  onAnalyze: (repoName: string) => void;
}

const RepoModal: React.FC<RepoModalProps> = ({ repo, onClose, onAnalyze }) => {
  const [copied, setCopied] = React.useState(false);

  if (!repo) return null;

  const handleCopyClone = () => {
    navigator.clipboard.writeText(`git clone ${repo.url}.git`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg text-ada-400">
              <repo.icon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">{repo.name}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="uppercase tracking-widest">Blueprint ID:</span>
                <span className="font-mono text-ada-400">{repo.id.toUpperCase().substring(0, 8)}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">System Description</h3>
                <p className="text-slate-300 leading-relaxed text-lg">
                  {repo.description}
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Folder size={14} /> Internal Structure
                </h3>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-sm">
                  {repo.structure && repo.structure.length > 0 ? (
                    <ul className="space-y-2">
                      {repo.structure.map((item, idx) => {
                        const isDoc = item.includes('md') || item.includes('doc');
                        return (
                          <li key={idx} className="flex items-center gap-2 text-slate-400">
                            {isDoc ? <FileText size={14} className="text-yellow-500/70" /> : <Folder size={14} className="text-ada-500/70" />}
                            <span className={isDoc ? 'text-slate-300' : 'text-ada-200'}>{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="text-slate-600 italic">No structural data available for scanning.</div>
                  )}
                </div>
              </section>

              <div className="flex flex-wrap gap-2">
                {repo.tags.map(tag => (
                  <span 
                    key={tag} 
                    className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border ${
                      tag.includes('MCP') || tag.includes('Agent') 
                        ? 'bg-purple-900/30 border-purple-500/30 text-purple-300' 
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Quick Actions</h4>
                <div className="space-y-3">
                  <a 
                    href={repo.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-ada-600 hover:bg-ada-500 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    <ExternalLink size={16} />
                    Open Repository
                  </a>
                  <button 
                    onClick={() => {
                      onAnalyze(repo.name);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-ada-300 border border-slate-700 hover:border-ada-500/50 rounded-lg transition-colors font-medium text-sm"
                  >
                    <Bot size={16} />
                    Analyze with Ada
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Clone Protocol</h4>
                <div className="relative group">
                  <div className="bg-black/50 border border-slate-800 rounded-lg p-3 pr-10 font-mono text-xs text-slate-300 break-all">
                    git clone {repo.url}.git
                  </div>
                  <button 
                    onClick={handleCopyClone}
                    className="absolute right-2 top-2 p-1.5 text-slate-500 hover:text-white transition-colors"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                 <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Docs Status</h4>
                 <div className="flex items-center gap-2 text-emerald-400 text-sm">
                   <Check size={16} />
                   <span>Docs Detected</span>
                 </div>
                 <p className="text-xs text-slate-500 mt-1">
                   High-quality markdown files found in /docs and root.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoModal;