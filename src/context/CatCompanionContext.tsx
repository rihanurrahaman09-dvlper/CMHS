import React, { createContext, useCallback, useContext, useState } from 'react';

export type CatMood =
  | 'idle'
  | 'greeting'
  | 'watching-email'
  | 'watching-password'
  | 'celebrating'
  | 'hover';

interface CatCompanionContextValue {
  mood: CatMood;
  speechText: string | null;
  setCatReaction: (mood: CatMood, speechText?: string | null) => void;
  clearSpeech: () => void;
}

const CatCompanionContext = createContext<CatCompanionContextValue | undefined>(undefined);

export function CatCompanionProvider({ children }: { children: React.ReactNode }) {
  const [mood, setMood] = useState<CatMood>('greeting');
  const [speechText, setSpeechText] = useState<string | null>('Hello! Need a little help?');

  const setCatReaction = useCallback((nextMood: CatMood, nextSpeech?: string | null) => {
    setMood(nextMood);
    if (nextSpeech !== undefined) {
      setSpeechText(nextSpeech);
    }
  }, []);

  const clearSpeech = useCallback(() => {
    setSpeechText(null);
  }, []);

  return (
    <CatCompanionContext.Provider
      value={{
        mood,
        speechText,
        setCatReaction,
        clearSpeech,
      }}
    >
      {children}
    </CatCompanionContext.Provider>
  );
}

export function useCatCompanion(): CatCompanionContextValue {
  const ctx = useContext(CatCompanionContext);
  if (!ctx) {
    throw new Error('useCatCompanion must be used within a CatCompanionProvider');
  }
  return ctx;
}
