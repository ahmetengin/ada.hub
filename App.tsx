import React, { useState } from 'react';
import { Layers, Terminal, Waves, Cpu, Search, Network, ExternalLink, ArrowRight, X, Copy, Check, Activity } from 'lucide-react';
import RepoCard from './components/RepoCard';
import AdaAssistant from './components/AdaAssistant';
import NeuralBackground from './components/NeuralBackground';
import RepoModal from './components/RepoModal';
import { REPOSITORIES, GITHUB_USER, MONOREPO_SCRIPT } from './constants';
import { Repository } from './types';

// Levenshtein distance algorithm for fuzzy matching
const levenshteinDistance = (a: string, b: string): number => {
  const matrix = Array.from({ length: b.length + 1 }, () => Array(a.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return matrix[b.length][a.length];
};

const App: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [showTerminal, setShowTerminal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [assistantTrigger, setAssistantTrigger] = useState<string | null>(null);

  const categories = ['All', 'AI', 'Maritime', 'Stargate', 'Core'];

  const filteredRepos = REPOSITORIES.filter(repo => {
    const query = search.toLowerCase().trim();
    const matchesCategory = filter === 'All' || repo.category === filter;

    // If strictly filtering by category and no search, return match
    if (!query) return matchesCategory;
    if (!matchesCategory) return false;

    // Combine all searchable text
    const repoTextCombined = `${repo.name} ${repo.description} ${repo.tags.join(' ')}`.toLowerCase();

    // 1. Exact Substring Match (Standard Search)
    if (repoTextCombined.includes(query)) return true;

    // 2. Fuzzy Match (Typo Tolerance)
    // Only attempt fuzzy match if query is > 2 chars to avoid noise
    if (query.length <= 2) return false;

    const words = repoTextCombined.split(/[\s-_.]+/); // Split by space, hyphens, dots
    
    return words.some(word => {
      // Skip if length difference is too big (optimization)
      if (Math.abs(word.length - query.length) > 3) return false;

      const dist = levenshteinDistance(word, query);
      const tolerance = query.length < 6 ? 1 : query.length < 10 ? 2 : 3;
      return dist <= tolerance;
    });
  });

  // Strategy Groups Data (English)
  const strategyGroups = [
    {
      title: 'Maritime Intelligence',
      subtitle: 'Navigation & Environment',
      icon: Waves,
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
      border: 'border-blue-500/30',
      description: 'AI-powered maritime operations and oceanographic data processing.',
      repos: REPOSITORIES.filter(r => r.category === 'Maritime')
    },
    {
      title: 'Core & AI Nexus',
      subtitle: 'Processing & Logic',
      icon: Cpu,
      color: 'text-purple-400',
      bg: 'bg-purple-900/20',
      border: 'border-purple-500/30',
      description: 'Central frameworks, Node.js backend systems, and Gemini interpreters.',
      repos: REPOSITORIES.filter(r => r.category === 'Core' || r.category === 'AI')
    },
    {
      title: 'Stargate Protocols',
      subtitle: 'Connectivity & Architecture',
      icon: Network,
      color: 'text-emerald-400',
      bg: 'bg-emerald-900/20',
      border: 'border-emerald-500/30',
      description: 'Gateway interfaces and architectural blueprints for the network.',
      repos: REPOSITORIES.filter(r => r.category === 'Stargate')
    }
  ];

  const handleCopyScript = () => {
    navigator.clipboard.writeText(MONOREPO_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeAgentsCount = REPOSITORIES.filter(r => r.tags.some(t => t.includes('Agent') || t.includes('MCP'))).length;

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-ada-500/30 relative overflow-hidden">
      {/* Dynamic Neural Background */}
      <NeuralBackground />
      
      {/* Background Gradient Mesh (Static fallback/overlay) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-ada-900/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <header className="mb-12 text-center relative">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-ada-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-ada-500 animate-pulse"></span>
              SYSTEM ONLINE
            </div>
            {activeAgentsCount > 0 && (
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-mono">
                <Activity size={12} className="animate-bounce" />
                {activeAgentsCount} MCP AGENTS ACTIVE
              </div>
            )}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            ADA <span className="text-transparent bg-clip-text bg-gradient-to-r from-ada-400 to-purple-400">Ecosystem</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-slate-400 text-lg leading-relaxed mb-8">
            The convergence of Maritime Operations, Artificial Intelligence, and Stargate Protocols.
            <br />
            Curated by <a href={`https://github.com/${GITHUB_USER}`} className="text-ada-400 hover:text-white underline underline-offset-4 decoration-ada-500/30 hover:decoration-ada-400 transition-all">Ahmet Engin</a>.
          </p>

          <button 
            onClick={() => setShowTerminal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-ada-500/50 text-slate-200 rounded-lg transition-all shadow-lg shadow-black/50 group backdrop-blur-sm"
          >
            <Terminal size={18} className="text-ada-400 group-hover:text-ada-300" />
            <span className="font-mono font-semibold">Initialize System</span>
          </button>
        </header>

        {/* Strategic Architecture Overview */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6 px-2">
            <Layers size={20} className="text-ada-400" />
            <h2 className="text-lg font-mono font-bold text-slate-200 tracking-wider">STRATEGIC ARCHITECTURE</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strategyGroups.map((group) => (
              <div key={group.title} className={`rounded-xl border ${group.border} ${group.bg} p-6 backdrop-blur-sm transition-all hover:bg-slate-900/50 hover:border-slate-700 group relative overflow-hidden`}>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-slate-950/50 ${group.color}`}>
                      <group.icon size={24} />
                    </div>
                    <div>
                      <h3 className={`font-bold ${group.color}`}>{group.title}</h3>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">{group.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-4 h-10">{group.description}</p>
                  
                  <ul className="space-y-2">
                    {group.repos.map(repo => (
                      <li key={repo.id} className="flex items-center gap-2 text-sm text-slate-300 group/item cursor-pointer" onClick={() => setSelectedRepo(repo)}>
                        <ArrowRight size={12} className={`opacity-0 group-hover/item:opacity-100 transition-opacity ${group.color}`} />
                        <span className="hover:text-white transition-colors truncate">
                          {repo.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Controls */}
        <div className="sticky top-4 z-30 bg-slate-950/80 backdrop-blur-lg border border-slate-800/50 rounded-2xl p-4 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    filter === cat 
                      ? 'bg-ada-600 text-white shadow-lg shadow-ada-500/25' 
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64 group">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-ada-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search modules, agents..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-ada-500 focus:ring-1 focus:ring-ada-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map((repo) => (
            <RepoCard 
              key={repo.id} 
              repo={repo} 
              onOpenDetails={setSelectedRepo}
            />
          ))}
        </div>

        {filteredRepos.length === 0 && (
          <div className="text-center py-20">
            <Layers size={48} className="mx-auto text-slate-700 mb-4" />
            <h3 className="text-xl text-slate-400 font-mono">No modules found.</h3>
            <p className="text-slate-600">Try adjusting your search criteria.</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-slate-900 text-center text-slate-600 text-sm relative z-10">
          <p>© {new Date().getFullYear()} Ahmet Engin. Ada Ecosystem. All systems nominal.</p>
        </footer>
      </div>

      {/* Monorepo Terminal Modal */}
      {showTerminal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-400">
                <Terminal size={16} />
                <span className="text-xs font-mono font-bold uppercase">System Unification Protocol</span>
              </div>
              <button onClick={() => setShowTerminal(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 bg-[#0c0c0c] overflow-y-auto font-mono text-sm relative">
              <pre className="text-emerald-500 whitespace-pre-wrap leading-relaxed">
                {MONOREPO_SCRIPT}
              </pre>
              
              <div className="mt-8 pt-4 border-t border-slate-800 flex justify-between items-center">
                <p className="text-slate-500 text-xs">
                  Run this script in your local terminal to unify all repositories into a single entity.
                </p>
                <button 
                  onClick={handleCopyScript}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors border border-slate-700"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy Code"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Repo Detail Modal */}
      <RepoModal 
        repo={selectedRepo} 
        onClose={() => setSelectedRepo(null)} 
        onAnalyze={(repoName) => setAssistantTrigger(repoName)}
      />

      {/* Assistant */}
      <AdaAssistant 
        externalTrigger={assistantTrigger} 
        onTriggerHandled={() => setAssistantTrigger(null)}
      />
    </div>
  );
};

export default App;