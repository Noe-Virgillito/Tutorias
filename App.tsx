import React, { useState, useEffect } from 'react';
import { SynopticChart } from './components/SynopticChart';
import { Timeline } from './components/Timeline';
import { fetchHistoricalData } from './services/geminiService';
import { HistoricalData, Topic } from './types';
import { ArrowDownCircle, Printer, RefreshCw, BookOpen, Landmark, Anchor, Skull, Triangle, Share2, Download } from 'lucide-react';

export function App() {
  // App State
  const [data, setData] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'chart' | 'timeline'>('chart');
  const [topic, setTopic] = useState<Topic>('Prehistoria');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Install PWA Logic
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  // Fetch data when topic changes
  useEffect(() => {
    loadData(topic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const loadData = async (selectedTopic: Topic) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetchHistoricalData(selectedTopic);
      setData(result);
    } catch (err) {
      setError("Error al cargar los datos. Verifica tu conexión o API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tutorías ENA',
          text: 'Descubre la historia de forma interactiva con Tutorías ENA.',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error compartiendo:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  // -- RENDER: MAIN APP --
  return (
    <div className="min-h-screen bg-[#f4f4f0]">
      {/* Navbar */}
      <nav className="bg-stone-800 text-stone-100 shadow-lg sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between h-auto md:h-16 py-2 md:py-0 gap-4 md:gap-0">
            <div className="flex items-center gap-2">
               {/* Custom ENA Icon */}
               <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center font-black text-[10px] tracking-tighter border border-stone-600 select-none">
                 <span className="text-red-600">E</span>
                 <span className="text-white">N</span>
                 <span className="text-green-600">A</span>
               </div>
               <h1 className="text-xl font-bold tracking-wider">TUTORÍAS <span className="font-light text-stone-400">ENA</span></h1>
            </div>
            
            {/* Topic Selector */}
            <div className="flex bg-stone-900 rounded-lg p-1 overflow-x-auto max-w-full">
               <button 
                 onClick={() => setTopic('Prehistoria')}
                 className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${topic === 'Prehistoria' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
               >
                 <Skull size={16} /> Prehistoria
               </button>
               <button 
                 onClick={() => setTopic('Egipto')}
                 className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${topic === 'Egipto' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
               >
                 <Triangle size={16} /> Egipto
               </button>
               <button 
                 onClick={() => setTopic('Grecia')}
                 className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${topic === 'Grecia' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
               >
                 <Anchor size={16} /> Grecia
               </button>
               <button 
                 onClick={() => setTopic('Roma')}
                 className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${topic === 'Roma' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
               >
                 <Landmark size={16} /> Roma
               </button>
            </div>

            <div className="flex items-center space-x-2">
               {/* Install Button (PWA) */}
               {deferredPrompt && (
                 <button 
                   onClick={handleInstallClick}
                   className="px-3 py-1 rounded-md text-sm font-bold bg-green-700 text-white hover:bg-green-600 flex items-center gap-1 transition-colors animate-pulse"
                   title="Instalar App"
                 >
                   <Download size={14} /> Instalar
                 </button>
               )}

               <button 
                 onClick={() => setView('chart')}
                 className={`px-3 py-1 rounded-md text-sm font-medium transition-colors border border-stone-600 ${view === 'chart' ? 'bg-stone-700 text-white' : 'hover:bg-stone-700'}`}
               >
                 Diagrama
               </button>
               <button 
                 onClick={() => setView('timeline')}
                 className={`px-3 py-1 rounded-md text-sm font-medium transition-colors border border-stone-600 ${view === 'timeline' ? 'bg-stone-700 text-white' : 'hover:bg-stone-700'}`}
               >
                 Línea
               </button>
               
               <div className="h-6 w-px bg-stone-600 mx-1"></div>

               <button 
                 onClick={handleShare}
                 className="p-2 rounded-full hover:bg-stone-700 transition-colors text-blue-400"
                 title="Compartir App"
               >
                 <Share2 size={20} />
               </button>

               <button 
                 onClick={handlePrint}
                 className="p-2 rounded-full hover:bg-stone-700 transition-colors text-amber-500"
                 title="Imprimir"
               >
                 <Printer size={20} />
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Loading State */}
      {loading && (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center animate-pulse">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600 mb-6"></div>
          <h2 className="text-2xl font-bold text-stone-700 serif">Consultando los archivos históricos...</h2>
          <p className="text-stone-500 mt-2">Generando diagrama para {topic}...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-lg text-center">
            <p className="font-bold mb-2">Error</p>
            <p>{error}</p>
            <button onClick={() => loadData(topic)} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2 mx-auto">
              <RefreshCw size={16} /> Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && data && (
        <>
          <div className="bg-white border-b border-stone-200 py-8 px-4 no-print">
             <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-stone-800 serif mb-4">{data.topic === 'Prehistoria' ? 'La Prehistoria' : `La Civilización: ${data.topic}`}</h2>
                <p className="text-lg text-stone-600 leading-relaxed">{data.introduction}</p>
                <div className="mt-6 flex justify-center">
                   <ArrowDownCircle className="text-stone-400 animate-bounce" />
                </div>
             </div>
          </div>

          <main className="pb-20">
            {view === 'chart' && <SynopticChart data={data} />}
            {view === 'timeline' && <Timeline events={data.timeline} />}
          </main>
        </>
      )}

      <div className="hidden print:block fixed bottom-0 left-0 w-full text-center p-4 text-xs text-stone-400 border-t">
         Tutorías ENA - Material Educativo Generado por IA
      </div>
    </div>
  );
}