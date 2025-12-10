import React from 'react';
import { TimelineEvent } from '../types';

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-stone-800 text-center mb-12 serif border-b-2 border-stone-300 pb-4">
        Línea de Tiempo: La Prehistoria
      </h2>
      
      <div className="relative border-l-4 border-stone-400 ml-4 md:ml-1/2 space-y-12">
        {events.map((event, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div key={index} className="relative group">
              {/* Dot on the line */}
              <div 
                className={`
                  absolute top-0 w-6 h-6 bg-amber-600 rounded-full border-4 border-white 
                  shadow-md -left-[14px] md:left-1/2 md:-ml-[14px] z-10
                `}
              ></div>
              
              {/* Content Card */}
              <div 
                className={`
                  ml-10 md:ml-0 
                  md:w-[45%] 
                  ${isLeft ? 'md:mr-auto md:pr-8 md:text-right' : 'md:ml-auto md:pl-8 md:text-left'}
                  relative top-[-6px]
                `}
              >
                <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200 break-inside-avoid">
                  <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 text-sm font-bold rounded-full mb-2 border border-stone-300">
                    {event.year}
                  </span>
                  <h3 className="text-xl font-bold text-stone-800 mb-2 serif">{event.title}</h3>
                  <p className="text-stone-600 leading-relaxed text-sm">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 text-center text-stone-500 text-sm italic no-print">
        * Lista para copiar o imprimir
      </div>
    </div>
  );
};