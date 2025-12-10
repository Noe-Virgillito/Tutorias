import { GoogleGenAI, Type, Schema } from "@google/genai";
import { HistoricalData, Topic } from "../types";

// Generic schema for any historical topic
const historySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    introduction: { type: Type.STRING, description: "Introducción general al tema." },
    origins: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Título de la sección de orígenes." },
        description: { type: Type.STRING, description: "Resumen general." },
        stages: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Nombre de la etapa/tribu/personaje." },
              description: { type: Type.STRING },
              attributes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING }
                  }
                },
                description: "2-3 atributos clave."
              },
              imagePrompt: { type: Type.STRING, description: "Prompt visual en inglés para la generación de imagen." },
              videoKeywords: { type: Type.STRING, description: "Palabras clave EN ESPAÑOL para buscar un video educativo en YouTube (ej: 'Batalla de Zama animada', 'Senado Romano explicado')." }
            }
          }
        }
      }
    },
    periods: {
      type: Type.ARRAY,
      description: "Los periodos históricos principales.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          timeframe: { type: Type.STRING },
          details: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              attributes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING }
                  }
                }
              },
              imagePrompt: { type: Type.STRING },
              videoKeywords: { type: Type.STRING, description: "Palabras clave EN ESPAÑOL para video (ej: 'Imperio Romano mapa animado')." }
            }
          }
        }
      }
    },
    timeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          year: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    }
  },
  required: ["topic", "introduction", "origins", "periods", "timeline"]
};

// Contexts
const GREECE_CONTEXT = `
  INFORMACIÓN DE BASE:
  1. Geografía: Noreste Mediterráneo, 80% montañas, marineros.
  2. Orígenes: Minoicos, Micénicos.
  3. Economía: Moneda (Dracma), Colonización (Apoikias) por falta de tierras, Nuevos Ricos vs Aristocracia.
  4. Política: Polis. Atenas (Democracia), Esparta (Militarismo).
  5. Conflictos: Guerras Médicas (vs Persia), Guerra del Peloponeso (Atenas vs Esparta).
  6. Cultura: Filosofía, Religión.
`;

const EGYPT_CONTEXT = `
  INFORMACIÓN DE BASE:
  1. Nilo, inundaciones, agricultura.
  2. Imperio Antiguo (Pirámides, Menfis).
  3. Imperio Medio (Tebas).
  4. Imperio Nuevo (Expansión, Templos Karnak/Luxor).
  5. Decadencia (Pueblos del Mar).
  6. Cultura: Jeroglíficos, Religión, Faraón.
`;

const ROME_CONTEXT = `
  INFORMACIÓN DE BASE (ROMA):
  1. ORÍGENES:
     - Fundación: 753 a.C. Leyenda (Rómulo y Remo, hijos de Marte, loba) vs Historia (Latinos + Influencia Etrusca).
     - Ubicación: Siete Colinas, río Tíber.
  
  2. SOCIEDAD Y GOBIERNO (MONARQUÍA -> REPÚBLICA):
     - Clases Sociales: Patricios (descendientes fundadores, dueños de tierras, Gens, Pater Familias) vs Plebeyos (sin linaje, campesinos/artesanos, Clientes). Esclavos al final.
     - Gobierno República:
       * Cónsules (2 líderes, poder militar/civil).
       * Senado (300 patricios, ratifican leyes, política exterior).
       * Asambleas (Comicios): Centuriada (militar), Curiada (religiosa), Tribuna de la Plebe (después de luchas sociales).
  
  3. EXPANSIÓN Y CONFLICTO:
     - Guerras Púnicas (vs Cartago): Lucha por el Mediterráneo Occidental. Aníbal vs Escipión. Roma gana y domina el "Mare Nostrum".
     - Consecuencias: Riqueza, latifundios, aumento de esclavitud, crisis de la República.
  
  4. IMPERIO Y ECONOMÍA:
     - Augusto y la Pax Romana.
     - Economía: Agricultura, Comercio (rutas, denario de plata), Esclavitud masiva.
     - Urbanismo: Foro, Termas, Acueductos.
  
  5. CRISTIANISMO:
     - De secta judía perseguida a religión oficial (Edicto de Milán - Constantino, Edicto de Tesalónica - Teodosio).
  
  6. CAÍDA:
     - Invasiones Bárbaras (Germanos, Hunos). Caída del Imperio de Occidente (476 d.C.).
`;

export const fetchHistoricalData = async (topic: Topic): Promise<HistoricalData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });

  let prompt = "";
  if (topic === 'Prehistoria') {
    prompt = `
      Genera un cuadro sinóptico detallado sobre la Prehistoria.
      Origins: Hominización (Australopithecus -> Sapiens).
      Periods: Paleolítico (Caza/Fuego), Neolítico (Agricultura/Sedentarismo), Edad Metales.
      Asegúrate de que videoKeywords estén en ESPAÑOL.
    `;
  } else if (topic === 'Roma') {
    prompt = `
      Genera un cuadro sinóptico detallado y cohesivo sobre la Antigua Roma BASADO EN EL SIGUIENTE CONTEXTO:
      ${ROME_CONTEXT}

      ESTRUCTURA REQUERIDA (Úsala para definir 'origins' y 'periods'):
      1. Origins: "Monarquía y Fundación" (Incluye Mito vs Realidad y las Clases Sociales Patricios/Plebeyos como atributos).
      2. Periodos (Stages):
         - "La República": Detalla el Senado, Cónsules y la Lucha de los Órdenes.
         - "Expansión y Guerras Púnicas": Detalla el control del Mediterráneo y el Ejército.
         - "El Alto Imperio": Augusto, Pax Romana y Prosperidad Económica.
         - "El Cristianismo y la Caída": De la persecución a la religión oficial, y las invasiones bárbaras.
      
      IMPORTANTE:
      - Incluye 'videoKeywords' EN ESPAÑOL para cada etapa (ej: "Rómulo y Remo mito animado", "Senado Romano explicado", "Guerras Púnicas mapa animado", "Invasiones bárbaras resumen").
      - Atributos clave: Gobierno, Economía, Religión, Sociedad.
    `;
  } else if (topic === 'Grecia') {
    prompt = `
      Genera un cuadro sinóptico sobre Grecia:
      ${GREECE_CONTEXT}
      Incluye intereses comerciales vs militares, democracia vs oligarquía.
      Asegúrate de que videoKeywords estén en ESPAÑOL.
    `;
  } else if (topic === 'Egipto') {
    prompt = `
      Genera un cuadro sinóptico sobre Egipto:
      ${EGYPT_CONTEXT}
      Asegúrate de que videoKeywords estén en ESPAÑOL.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: historySchema,
        systemInstruction: "Eres un profesor de historia experto. Genera contenido educativo estructurado en JSON. Los 'imagePrompt' deben ser muy visuales y 'cinematic' en inglés. Los 'videoKeywords' deben ser en ESPAÑOL.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    return JSON.parse(text) as HistoricalData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};