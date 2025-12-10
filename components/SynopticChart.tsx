import React, { useState } from 'react';
import { HistoricalData } from '../types';
import { Footprints, Map as MapIcon, X, Info, Image as ImageIcon, ZoomIn, Anchor, Landmark, Triangle, Scroll, Swords, Crown, Clapperboard, PlayCircle, ExternalLink } from 'lucide-react';

interface SynopticChartProps {
  data: HistoricalData;
}

// -- Helper: Dynamic Image URL Generator --
const getImageUrl = (prompt: string, seed: string) => {
  const encodedPrompt = encodeURIComponent(`educational illustration, historical realistic style, cinematic lighting, ${prompt}`);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=500&seed=${seed}&nologo=true&model=flux`;
};

// -- Components --

const Modal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  imagePrompt: string;
  videoKeywords?: string;
  type: 'origin' | 'period';
  data: any; 
}> = ({ isOpen, onClose, title, imagePrompt, videoKeywords, type, data }) => {
  const [cinemaMode, setCinemaMode] = useState(false);

  if (!isOpen) return null;

  const imageUrl = getImageUrl(imagePrompt, title);

  const handleVideoSearch = () => {
    // Fallback to title + "historia documental animado" if no keywords
    const baseQuery = videoKeywords || `${title} historia documental animado`;
    // Explicitly append "español" to ensure audio is in Spanish
    const query = `${baseQuery} español`; 
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-stone-600" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image/Media Section */}
        <div className="md:w-3/5 bg-black relative min-h-[300px] md:min-h-full overflow-hidden group">
           <img 
             src={imageUrl} 
             alt={title} 
             className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${cinemaMode ? 'animate-cinema' : ''}`}
           />
           
           {/* Overlay Gradient */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-end p-6 pointer-events-none">
              <h2 className="text-3xl md:text-4xl font-bold text-white serif drop-shadow-lg leading-tight">{title}</h2>
              <span className="text-amber-400 text-sm mt-2 uppercase tracking-widest font-bold flex items-center gap-2">
                {type === 'origin' ? 'Orígenes' : 'Periodo Histórico'}
                <div className="h-0.5 w-10 bg-amber-400"></div>
              </span>
           </div>

           {/* Media Controls */}
           <div className="absolute top-4 right-4 flex gap-2 z-20">
              <button 
                 onClick={() => setCinemaMode(!cinemaMode)}
                 className={`p-2 rounded-full backdrop-blur-md transition-all ${cinemaMode ? 'bg-amber-500 text-white' : 'bg-black/40 text-white hover:bg-white/20'}`}
                 title={cinemaMode ? "Detener Animación" : "Modo Cine (Animar)"}
              >
                <Clapperboard size={20} />
              </button>
           </div>
           
           {/* Play Button Overlay (Central) */}
           {!cinemaMode && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/30 p-4 rounded-full backdrop-blur-sm border border-white/20">
                   <PlayCircle size={48} className="text-white/80" />
                </div>
             </div>
           )}
        </div>

        {/* Content Section */}
        <div className="md:w-2/5 p-6 md:p-8 bg-[#fdfdfc] overflow-y-auto flex flex-col">
           <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2 text-stone-500 text-xs font-mono uppercase tracking-widest">
                <span>Archivo Histórico</span>
                <span>•</span>
                <span>Nº {Math.floor(Math.random() * 9000) + 1000}</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                <X size={24} className="text-stone-500" />
              </button>
           </div>

           <div className="flex-grow space-y-6">
             {/* Description */}
             <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-full"></div>
                <p className="pl-5 text-stone-700 leading-relaxed text-lg font-serif">
                   {type === 'origin' ? data.description : data.details.description}
                </p>
             </div>

             {/* Attributes Grid */}
             <div className="grid grid-cols-1 gap-3 pt-4">
               {((type === 'origin' ? data.attributes : data.details.attributes) || []).map((attr: any, idx: number) => (
                 <div key={idx} className="flex flex-col bg-white border border-stone-200 p-3 rounded shadow-sm hover:border-amber-300 transition-colors">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">{attr.label}</span>
                    <span className="text-stone-800 font-medium">{attr.value}</span>
                 </div>
               ))}
             </div>
           </div>

           {/* Footer Action */}
           <div className="mt-8 pt-6 border-t border-stone-200">
              <button 
                onClick={handleVideoSearch}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg group"
              >
                <PlayCircle size={20} className="fill-current" />
                <span>Ver Video / Documental</span>
                <ExternalLink size={16} className="opacity-50 group-hover:opacity-100" />
              </button>
              <p className="text-center text-xs text-stone-400 mt-2">Búsqueda de videos educativos en español</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const FlowNode: React.FC<{ 
  title: string; 
  type?: 'start' | 'process' | 'terminator';
  onClick?: () => void;
  colorClass?: string;
  subtitle?: string;
  hasInteractive?: boolean;
}> = ({ title, type = 'process', onClick, colorClass = 'bg-white', subtitle, hasInteractive }) => {
  const shapeClass = type === 'start' ? 'rounded-full px-12' : 'rounded-lg';
  const borderClass = type === 'start' ? 'border-4' : 'border-2';
  
  return (
    <div className={`relative flex flex-col items-center z-10 w-full max-w-sm`}>
      <button 
        onClick={onClick}
        disabled={!onClick}
        className={`
          ${shapeClass} ${borderClass} ${colorClass}
          border-stone-800 shadow-[4px_4px_0px_rgba(28,25,23,0.2)]
          p-4 text-center w-full transition-all duration-200
          ${onClick ? 'hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(28,25,23,0.3)] cursor-pointer group' : ''}
        `}
      >
        <h3 className="font-bold text-stone-900 uppercase tracking-wider serif text-lg flex items-center justify-center gap-2">
           {title}
           {hasInteractive && <ZoomIn size={16} className="text-stone-500 group-hover:text-stone-900" />}
        </h3>
        {subtitle && <p className="text-xs font-mono mt-1 text-stone-600 bg-white/50 inline-block px-2 rounded">{subtitle}</p>}
        
        {hasInteractive && (
           <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse flex items-center gap-1">
             <Clapperboard size={10} /> VER +
           </span>
        )}
      </button>
    </div>
  );
};

export const SynopticChart: React.FC<SynopticChartProps> = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState<{ type: 'origin' | 'period', data: any, title: string, prompt: string, videoKeywords?: string } | null>(null);

  // Determine icons based on topic
  let OriginIcon = Footprints;
  let PeriodIcon = MapIcon;
  let topicColor = "bg-amber-400"; // Default
  
  if (data.topic === 'Roma') { 
    OriginIcon = Scroll; 
    PeriodIcon = Swords; 
    topicColor = "bg-red-500 text-white";
  }
  if (data.topic === 'Grecia') { OriginIcon = Anchor; PeriodIcon = Crown; }
  if (data.topic === 'Egipto') { OriginIcon = Triangle; PeriodIcon = Scroll; }

  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8 overflow-x-auto relative">
      <Modal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title || ''}
        imagePrompt={selectedItem?.prompt || ''}
        videoKeywords={selectedItem?.videoKeywords}
        type={selectedItem?.type || 'origin'}
        data={selectedItem?.data}
      />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <div className="mb-4 text-center text-stone-500 text-sm flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-200">
           <Clapperboard size={16} className="text-red-500" />
           <span>Haz click para ver detalles e imágenes en movimiento</span>
        </div>

        {/* LEVEL 1: START NODE */}
        <FlowNode title={`LA CIVILIZACIÓN: ${data.topic.toUpperCase()}`} type="start" colorClass={topicColor} />
        
        {/* Connector Line split */}
        <div className="h-12 w-0.5 bg-stone-800"></div>
        <div className="relative w-full max-w-5xl h-0.5 bg-stone-800 mb-12 hidden md:block">
           <div className="absolute left-1/4 top-0 h-8 w-0.5 bg-stone-800"></div>
           <div className="absolute right-1/4 top-0 h-8 w-0.5 bg-stone-800"></div>
        </div>

        {/* LEVEL 2: BRANCHES */}
        <div className="flex flex-col md:flex-row justify-center w-full gap-16 md:gap-8">
          
          {/* LEFT BRANCH: ORIGINS */}
          <div className="flex-1 max-w-md flex flex-col items-center">
             <div className="md:hidden h-8 w-0.5 bg-stone-800 -mt-12 mb-2"></div>
             
             <div className="bg-stone-800 text-white px-6 py-2 rounded-lg font-bold mb-8 shadow-md uppercase text-sm flex items-center gap-2">
                <OriginIcon size={16} className="text-amber-400"/>
                {data.origins.title || 'Orígenes'}
             </div>

             <div className="w-full space-y-6 relative">
                 {/* Connecting line for the list */}
                 <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-stone-300 -z-0"></div>

                 {data.origins.stages.map((stage, idx) => (
                    <div key={idx} className="relative z-10">
                        <FlowNode 
                          title={stage.name} 
                          colorClass="bg-white" 
                          hasInteractive
                          onClick={() => setSelectedItem({
                             type: 'origin',
                             title: stage.name,
                             data: stage,
                             prompt: stage.imagePrompt || `Historical origin ${stage.name}`,
                             videoKeywords: stage.videoKeywords
                          })}
                        />
                         <div className="mt-2 text-center">
                            <span className="text-[10px] text-stone-400 font-mono">click para ver</span>
                         </div>
                    </div>
                 ))}
             </div>
          </div>

          {/* RIGHT BRANCH: PERIODS */}
          <div className="flex-1 max-w-md flex flex-col items-center">
             <div className="md:hidden h-8 w-0.5 bg-stone-800 mb-2"></div>

             <div className="bg-stone-800 text-white px-6 py-2 rounded-lg font-bold mb-8 shadow-md uppercase text-sm flex items-center gap-2">
                <PeriodIcon size={16} className="text-amber-400"/>
                Etapas y Sucesos
             </div>

             <div className="w-full space-y-8 relative">
                {/* Connecting line for the list */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-stone-300 -z-0"></div>

                {data.periods.map((period, index) => (
                   <React.Fragment key={index}>
                      <div className="relative z-10 group">
                         <div 
                           onClick={() => setSelectedItem({
                              type: 'period',
                              title: period.name,
                              data: period,
                              prompt: period.details.imagePrompt || `Historical period ${period.name}`,
                              videoKeywords: period.details.videoKeywords
                           })}
                           className="w-full bg-white border-2 border-stone-800 rounded-lg shadow-[4px_4px_0px_rgba(28,25,23,0.2)] overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform"
                         >
                            <div className="bg-stone-100 p-4 border-b-2 border-stone-800 flex justify-between items-center">
                                <h4 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                                  {period.name}
                                  {data.topic === 'Roma' && <Swords size={16} className="text-red-800" />}
                                </h4>
                                <span className="text-[10px] font-mono bg-stone-800 text-white px-2 py-1 rounded">
                                  {period.timeframe}
                                </span>
                            </div>
                            
                            <div className="p-4">
                                <div className="text-sm text-stone-600 line-clamp-3 mb-2">
                                  {period.details.description}
                                </div>
                                <div className="flex justify-end items-center gap-1 text-xs text-red-500 font-bold">
                                   <Clapperboard size={12} />
                                   Ver interactivo
                                </div>
                            </div>
                         </div>
                      </div>

                      {/* Connector Arrow (if not last) */}
                      {index < data.periods.length - 1 && (
                         <div className="h-6 w-0.5 bg-stone-800 mx-auto relative z-10">
                            <div className="absolute -bottom-1 -left-[5px] w-0 h-0 
                              border-l-[6px] border-l-transparent
                              border-r-[6px] border-r-transparent
                              border-t-[8px] border-t-stone-800">
                            </div>
                         </div>
                      )}
                   </React.Fragment>
                ))}

             </div>
          </div>

        </div>

      </div>
    </div>
  );
};