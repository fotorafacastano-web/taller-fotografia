import { useEffect, useRef, useState } from "react";
import "./HeroEditorial.css";

const WORDS = ["Con Contenido", "Creatividad", "Ideas"];
const WORD_DURATION = 1500;
const CROSSFADE = 300;
const HOLD_PHRASE = 1000;
const ENTRANCE_DONE = 150 * 3 + 200 + 700;
const FINAL_HOLD = 2000;

interface HeroEditorialProps {
  onSequenceComplete?: () => void;
}

export default function HeroEditorial({ onSequenceComplete }: HeroEditorialProps) {
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const bigWordTextRef = useRef<HTMLSpanElement>(null);
  const [phraseOut, setPhraseOut] = useState(false);
  const [word, setWord] = useState<string | null>(null);
  const [wordVisible, setWordVisible] = useState(false);

  const ref = (i: number) => (el: HTMLSpanElement | null) => {
    if (el) wordsRef.current[i] = el;
  };

  useEffect(() => {
    const textEl = bigWordTextRef.current;
    const stageEl = stageRef.current;
    if (!textEl || !stageEl || !word) return;
    if (window.innerWidth > 600) return;

    textEl.style.fontSize = "";
    const naturalWidth = textEl.getBoundingClientRect().width;
    const availableWidth = stageEl.getBoundingClientRect().width;
    if (naturalWidth > 0) {
      const currentSize = parseFloat(getComputedStyle(textEl).fontSize);
      textEl.style.fontSize = `${(currentSize * availableWidth) / naturalWidth}px`;
    }
  }, [word]);

  useEffect(() => {
    const timers: number[] = [];

    wordsRef.current.forEach((el, i) => {
      if (!el) return;
      timers.push(window.setTimeout(() => el.classList.add("he-w--vis"), 150 * i + 200));
    });

    const T0 = ENTRANCE_DONE + HOLD_PHRASE;

    timers.push(
      window.setTimeout(() => {
        setPhraseOut(true);
        setWord(WORDS[0]);
        setWordVisible(true);
      }, T0)
    );

    const T1 = T0 + WORD_DURATION;
    timers.push(window.setTimeout(() => setWordVisible(false), T1));
    timers.push(
      window.setTimeout(() => {
        setWord(WORDS[1]);
        setWordVisible(true);
      }, T1 + CROSSFADE)
    );

    const T2 = T1 + CROSSFADE + WORD_DURATION;
    timers.push(window.setTimeout(() => setWordVisible(false), T2));
    timers.push(
      window.setTimeout(() => {
        setWord(WORDS[2]);
        setWordVisible(true);
      }, T2 + CROSSFADE)
    );

    const T3 = T2 + CROSSFADE + FINAL_HOLD;
    timers.push(window.setTimeout(() => onSequenceComplete?.(), T3));

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [onSequenceComplete]);

  return (
    <section className="he-hero">
      <nav className="he-nav">
        <a href="/" className="he-nav-logo">UNM</a>
        <div className="he-nav-links">
          <a href="#metodo">Método</a>
          <a href="#testimonios">Testimonios</a>
          <a href="#reservar">Reservar</a>
        </div>
      </nav>

      <div className="he-body">
        <span className="he-side">Scroll · 001</span>
        <div className="he-main">
          <p className="he-label">( servicios )</p>

          <div className="he-stage" ref={stageRef}>
            <h1 className={`he-title${phraseOut ? " he-title--out" : ""}`}>
              <span className="he-line1">
                <span className="he-w" ref={ref(0)}>Tu</span>
                <span className="he-w he-bold" ref={ref(1)}>contenido,</span>
              </span>
              <span className="he-line2">
                <span className="he-w" ref={ref(2)}>tu historia,</span>
                <span className="he-sale-wrap">
                  <span className="he-w he-bold he-italic he-red" ref={ref(3)}>
                    tu marca
                  </span>
                </span>
              </span>
            </h1>

            <div className={`he-bigword${wordVisible ? " he-bigword--visible" : ""}`}>
              <span className="he-bigword-text" ref={bigWordTextRef}>{word}</span>
            </div>
          </div>

          <div className="he-manifesto">
            <h2 className="he-manifesto-title">Declaración de intenciones</h2>
            <p className="he-manifesto-text">"Rafa Castaño" no es solo un nombre. Es un Grito. Lo que dices cuando te venden humo. Cuando te prometen estrategia y te entregan postureo. Cuando ves marcas tan vacías como sus Feeds.</p>
          </div>

          <a href="#contacto" className="he-cta">Cuéntanos tu proyecto</a>
        </div>
      </div>

      <div className="he-footer">
        <p className="he-desc">
          Creatividad, foto, vídeo y diseño<br />
          para marcas que quieren dejar huella.
        </p>
      </div>
    </section>
  );
}
