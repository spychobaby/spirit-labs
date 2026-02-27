/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Music, 
  Settings, 
  LayoutGrid, 
  ExternalLink, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Volume2,
  Terminal,
  Ghost,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { smartSearch } from './services/geminiService';

// --- Mock Data ---
const TRACKS = [
  {
    id: '1',
    title: 'Lofi Study',
    artist: 'Spirit Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/lofi/300/300'
  },
  {
    id: '2',
    title: 'Cyberpunk Night',
    artist: 'Neon Ghost',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber/300/300'
  },
  {
    id: '3',
    title: 'Ambient Void',
    artist: 'The Lab',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/void/300/300'
  }
];

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'music', icon: Music, label: 'Music' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-20 md:w-64 h-full glass border-r border-white/10 flex flex-col items-center md:items-start py-8 px-4 gap-8 z-50">
      <div className="flex items-center gap-3 px-2 mb-4">
        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center neon-glow">
          <Ghost className="text-black" size={24} />
        </div>
        <span className="hidden md:block font-display font-bold text-xl tracking-tight neon-text text-emerald-400">
          SPIRIT LABS
        </span>
      </div>

      <nav className="flex-1 w-full flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
              activeTab === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={22} />
            <span className="hidden md:block font-medium">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="ml-auto hidden md:block w-1.5 h-1.5 rounded-full bg-emerald-500"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto w-full p-4 glass rounded-2xl hidden md:block">
        <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
          <Terminal size={12} />
          <span>SYSTEM STATUS</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-mono">ONLINE_STABLE</span>
        </div>
      </div>
    </div>
  );
};

const SearchTab = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    const res = await smartSearch(query);
    setResults(res);
    setLoading(false);
  };

  return (
    <div className="p-8 h-full flex flex-col max-w-4xl mx-auto">
      <header className="mb-12 text-center">
        <h2 className="text-4xl font-display font-bold mb-2">Smart Search</h2>
        <p className="text-white/50">Powered by Gemini AI to find games and info.</p>
      </header>

      <form onSubmit={handleSearch} className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for games, proxies, or anything..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pl-14 focus:outline-none focus:border-emerald-500/50 transition-all text-lg"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={24} />
        <button 
          type="submit"
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 px-6 rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Search'}
        </button>
      </form>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
              <p className="text-white/40 font-mono">SCANNING_THE_VOID...</p>
            </motion.div>
          ) : results ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-3xl"
            >
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {results.text}
                </div>
              </div>
              
              {results.sources.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h4 className="text-sm font-mono text-white/30 uppercase tracking-widest mb-4">Sources</h4>
                  <div className="flex flex-wrap gap-3">
                    {results.sources.map((source, i) => (
                      <a 
                        key={i}
                        href={source.web?.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-xs transition-all"
                      >
                        <ExternalLink size={12} />
                        {source.web?.title || 'Source'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Best unblocked games 2024', 'How to play Slope unblocked', 'Spirit Labs features', 'Cool math games'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => { setQuery(suggestion); }}
                  className="glass p-4 rounded-xl text-left hover:bg-white/10 transition-all flex items-center justify-between group"
                >
                  <span className="text-white/60">{suggestion}</span>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-emerald-400" />
                </button>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MusicTab = () => {
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const currentIndex = TRACKS.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % TRACKS.length;
    setCurrentTrack(TRACKS[nextIndex]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    const currentIndex = TRACKS.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrack(TRACKS[prevIndex]);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    }
  }, [currentTrack]);

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={nextTrack}
      />
      
      <div className="w-full max-w-md">
        <motion.div 
          key={currentTrack.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass aspect-square rounded-3xl overflow-hidden mb-8 relative group"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Music size={48} className="text-emerald-500 animate-pulse" />
          </div>
        </motion.div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold mb-1">{currentTrack.title}</h2>
          <p className="text-emerald-400 font-mono tracking-widest uppercase text-sm">{currentTrack.artist}</p>
        </div>

        <div className="glass p-6 rounded-3xl">
          <div className="flex items-center justify-center gap-8 mb-6">
            <button onClick={prevTrack} className="text-white/50 hover:text-white transition-colors">
              <SkipBack size={28} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform neon-glow"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
            <button onClick={nextTrack} className="text-white/50 hover:text-white transition-colors">
              <SkipForward size={28} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Volume2 size={18} className="text-white/30" />
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500" 
                animate={{ width: isPlaying ? '100%' : '30%' }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-2">
          {TRACKS.map((track) => (
            <button
              key={track.id}
              onClick={() => { setCurrentTrack(track); setIsPlaying(true); }}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                currentTrack.id === track.id ? 'bg-emerald-500/10 border border-emerald-500/20' : 'hover:bg-white/5'
              }`}
            >
              <img src={track.cover} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
              <div className="text-left">
                <div className="font-bold text-sm">{track.title}</div>
                <div className="text-xs text-white/40">{track.artist}</div>
              </div>
              {currentTrack.id === track.id && isPlaying && (
                <div className="ml-auto flex gap-0.5 items-end h-3">
                  {[1, 2, 3].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: [4, 12, 4] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-emerald-500 rounded-full"
                    />
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ 
  backgroundType, 
  setBackgroundType 
}) => {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <header className="mb-12">
        <h2 className="text-4xl font-display font-bold mb-2">Settings</h2>
        <p className="text-white/50">Configure your Spirit Labs experience.</p>
      </header>

      <div className="space-y-6">
        <section className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-400" />
            Appearance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Neon Accents</span>
              <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Crosses Background</span>
              <button 
                onClick={() => setBackgroundType(backgroundType === 'crosses' ? 'default' : 'crosses')}
                className={`w-12 h-6 rounded-full relative transition-colors ${backgroundType === 'crosses' ? 'bg-emerald-500' : 'bg-white/10'}`}
              >
                <motion.div 
                  animate={{ x: backgroundType === 'crosses' ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full" 
                />
              </button>
            </div>
          </div>
        </section>

        <section className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <LayoutGrid size={18} className="text-emerald-400" />
            Proxy Configuration
          </h3>
          <p className="text-sm text-white/40 mb-4">Spirit Labs uses advanced routing to bypass restrictions.</p>
          <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-sm font-mono">
            REGENERATE_PROXY_TOKEN
          </button>
        </section>

        <div className="text-center text-xs text-white/20 font-mono">
          SPIRIT LABS v1.0.4 // BUILD_2024_ALPHA
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [backgroundType, setBackgroundType] = useState('default');

  return (
    <div className={`flex h-screen w-screen overflow-hidden selection:bg-emerald-500/30 transition-colors duration-500 ${backgroundType === 'crosses' ? 'bg-crosses' : 'bg-[#050505]'}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {backgroundType === 'default' && (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
          </>
        )}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 relative z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            {activeTab === 'search' && <SearchTab />}
            {activeTab === 'music' && <MusicTab />}
            {activeTab === 'settings' && (
              <SettingsTab 
                backgroundType={backgroundType} 
                setBackgroundType={setBackgroundType} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
