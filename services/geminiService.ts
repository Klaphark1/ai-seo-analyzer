import { GoogleGenAI, Type } from "@google/genai";
import { SEOReport } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const checkSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Titel van de SEO-check (bijv. 'H1 Kop'). De titel moet in het Nederlands zijn." },
        description: { type: Type.STRING, description: "Een korte, gebruiksvriendelijke uitleg waar deze check voor dient. De beschrijving moet in het Nederlands zijn." },
        status: { type: Type.STRING, enum: ["passed", "warning", "failed"], description: "Het resultaat van de check." },
        details: { type: Type.STRING, description: "Specifieke feedback voor de gebruiker op basis van de analyse (bijv. 'Je H1-tag ontbreekt. Voeg er een toe aan de pagina.'). De details moeten in het Nederlands zijn." },
    },
    required: ["title", "description", "status", "details"]
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { 
        type: Type.INTEGER, 
        description: "Een algehele SEO-score van 0 tot 100, waarbij 100 uitstekend is." 
    },
    summary: {
        type: Type.OBJECT,
        properties: {
            passed: { type: Type.INTEGER, description: "Aantal geslaagde checks." },
            warnings: { type: Type.INTEGER, description: "Aantal checks met waarschuwingen." },
            failed: { type: Type.INTEGER, description: "Aantal mislukte checks." },
        },
        required: ["passed", "warnings", "failed"]
    },
    basicSeo: {
      type: Type.ARRAY,
      description: "Analyse van basis, fundamentele SEO-elementen.",
      items: checkSchema
    },
    advancedSeo: {
        type: Type.ARRAY,
        description: "Analyse van meer geavanceerde technische SEO-elementen.",
        items: checkSchema
    }
  },
  required: ["overallScore", "summary", "basicSeo", "advancedSeo"]
};

export const analyzeWebsiteSeo = async (url: string): Promise<SEOReport> => {
  const prompt = `
    U bent een deskundige SEO-analist, vergelijkbaar met de tool van RankMath.
    Uw taak is om een gedetailleerd, eenvoudig te begrijpen SEO-rapport te verstrekken voor de website-URL: "${url}".
    
    BELANGRIJK: Probeer de live website niet te crawlen of te bezoeken. Uw analyse moet gebaseerd zijn op algemene SEO best practices en onderbouwde aannames op basis van de URL en gangbare websitestructuren. Ga ervan uit dat het een standaard WordPress-website is.

    Genereer een rapport met een algehele score en een uitsplitsing in twee categorieën: Basis SEO en Geavanceerde SEO.
    
    Voer voor elke categorie verschillende controles uit. Geef voor elke controle:
    - title: De naam van de controle (in het Nederlands).
    - description: Een eenvoudige uitleg waarom deze controle belangrijk is (in het Nederlands).
    - status: 'passed', 'warning', of 'failed'.
    - details: Concreet advies of de specifieke bevinding (in het Nederlands).

    Dit zijn de controles die u moet uitvoeren:

    1. Basis SEO:
        - SEO Titel: Controleer of een title-tag waarschijnlijk aanwezig en geoptimaliseerd is.
        - Meta Description: Controleer of een meta-omschrijving waarschijnlijk aanwezig en goed opgesteld is.
        - H1 Kop: Controleer op de aanwezigheid van een enkele, relevante H1-tag.
        - Koppen (H2-H6): Controleer op een logische koppenstructuur.
        - Image ALT Attributen: Controleer op het gebruik van beschrijvende ALT-tekst voor afbeeldingen.
        - Interne Links: Beoordeel de waarschijnlijke aanwezigheid van interne links.
    
    2. Geavanceerde SEO:
        - Canonical Tag: Controleer op het juiste gebruik van canonical tags om dubbele content te voorkomen.
        - Noindex Meta: Controleer op correct gebruik van noindex-tags.
        - Robots.txt: Controleer op een goed geconfigureerd robots.txt-bestand.
        - Schema Markup: Beoordeel of gestructureerde gegevens (Schema.org) waarschijnlijk geïmplementeerd zijn.
    
    Bereken tot slot een 'overallScore' van 0-100 op basis van de resultaten en geef een 'summary' telling van geslaagde, waarschuwende en mislukte controles.
    De uiteindelijke output MOET een JSON-object zijn dat overeenkomt met het verstrekte schema. Alle tekstuele inhoud (title, description, details) moet in het Nederlands zijn.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      }
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as SEOReport;
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get SEO analysis from AI.");
  }
};