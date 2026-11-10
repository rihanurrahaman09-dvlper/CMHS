import React, { useEffect, useRef, useState } from 'react';
import { useCatCompanion } from '../../context/CatCompanionContext';
import { CatAssistantPanel } from './CatAssistantPanel';
import { CatCharacter } from './CatCharacter';
import { CatSpeechBubble } from './CatSpeechBubble';

const STORAGE_KEY = 'school_cat_position_v1';

interface Position {
  x: number;
  y: number;
}

function getDefaultPosition(): Position {
  if (typeof window === 'undefined') {
    return { x: 24, y: 24 };
  }
  const isMobile = window.innerWidth < 640;
  return {
    x: isMobile ? 16 : 28,
    y: isMobile ? 16 : 28,
  };
}

export function GlobalCatAssistant() {
  const { mood, speechText, setCatReaction, clearSpeech } = useCatCompanion();
  const [isOpen, setIsOpen] = useState(false);

  // Position is stored as bottom-right offset (right, bottom) in pixels
  const [offset, setOffset] = useState<Position>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Position;
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch {
      // Ignore storage errors
    }
    return getDefaultPosition();
  });

  const dragRef = useRef<{
    dragging: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
  }>({
    dragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(offset));
    } catch {
      // Ignore storage errors
    }
  }, [offset]);

  // Auto-hide initial greeting bubble after a few seconds
  useEffect(() => {
    if (!speechText) return;
    const timer = window.setTimeout(() => {
      clearSpeech();
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [speechText, clearSpeech]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    dragRef.current = {
      dragging: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragRef.current.moved = true;
    }

    const maxRight = Math.max(16, window.innerWidth - 96);
    const maxBottom = Math.max(16, window.innerHeight - 96);

    const nextX = Math.min(maxRight, Math.max(12, dragRef.current.startOffsetX - dx));
    const nextY = Math.min(maxBottom, Math.max(12, dragRef.current.startOffsetY - dy));

    setOffset({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (!dragRef.current.moved) {
      setIsOpen((prev) => !prev);
      clearSpeech();
    }
  };

  return (
    <div
      style={{ right: `${offset.x}px`, bottom: `${offset.y}px` }}
      className="fixed z-50 flex flex-col items-end pointer-events-none"
    >
      <div className="pointer-events-auto flex flex-col items-end">
        {isOpen && <CatAssistantPanel onClose={() => setIsOpen(false)} />}

        {!isOpen && speechText && (
          <CatSpeechBubble text={speechText} onDismiss={clearSpeech} />
        )}

        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onMouseEnter={() => {
            if (mood === 'idle' || mood === 'greeting') {
              setCatReaction('hover');
            }
          }}
          onMouseLeave={() => {
            if (mood === 'hover') {
              setCatReaction('idle');
            }
          }}
          aria-label={isOpen ? 'Close campus cat assistant' : 'Open campus cat assistant'}
          aria-expanded={isOpen}
          title="Drag to move or click for help"
          className="group relative rounded-full p-1.5 bg-white/90 backdrop-blur-sm border border-emerald-200/80 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-grab active:cursor-grabbing touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          <CatCharacter mood={mood} />
        </button>
      </div>
    </div>
  );
}
