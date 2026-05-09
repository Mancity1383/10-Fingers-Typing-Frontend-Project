import { useEffect, useRef, useState } from "react";
import styles from "./TypingBox.module.css";
import keyPressSound from "/sounds/keysound.wav"
import {
  addCharResult,
  removeCharResult,
  addWrongKey,
  removeWrongKey,
  setTotalChars,
  setIsRunning,
  setCurrentIndex,
} from "../../features/keyboardSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { MdKeyboardReturn } from "react-icons/md";

export default function TypingBox() {
  const dispatch = useDispatch();
  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    ctxRef.current = new AudioContext();

    fetch(keyPressSound)
      .then(res => res.arrayBuffer())
      .then(data => ctxRef.current?.decodeAudioData(data))
      .then(decoded => {
        bufferRef.current = decoded;
      });
  }, []);

  const playSound = () => {
    if (!ctxRef.current || !bufferRef.current) return;

    const source = ctxRef.current.createBufferSource();
    source.buffer = bufferRef.current;
    source.connect(ctxRef.current.destination);
    source.start(0);
  };



  const { restartKey, isRunning, currentIndex, elapsedTime, mainText } = useSelector((state: RootState) => state.keyboard);
  const textBoxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = textBoxRef.current?.querySelector(`.${styles.activeChar}`);
    if (el) {
      el.scrollIntoView({
        block: "center",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  const text = mainText;
  const chars = text.split("");
  const words = buildWords(text);

  const [typed, setTyped] = useState<string[]>([]);

  useEffect(() => {
    dispatch(setTotalChars(chars.length));
    dispatch(setCurrentIndex(0));
  }, [dispatch, chars.length]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isRunning, restartKey, mainText]);

  useEffect(() => {
    if (currentIndex === 0 && elapsedTime === 0) {
      setTyped([]);
    }
  }, [currentIndex, elapsedTime]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!isRunning) {
      dispatch(setIsRunning(true));
    }

    if (e.key !== "Shift") playSound();

    if (e.key === "Backspace") {
      if (currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        const expected = chars[prevIndex];
        const typedChar = typed[prevIndex];

        if (typedChar !== undefined) {
          dispatch(
            removeCharResult({
              expected,
              typed: typedChar,
            })
          );
        }

        setTyped((prev) => {
          const copy = [...prev];
          copy.pop();
          return copy;
        });

        dispatch(setCurrentIndex(prevIndex));
      }
      return;
    }

    if (e.key === "Enter" && currentIndex < chars.length) {
      const expected = chars[currentIndex];

      if (expected === "\n") {
        setTyped((prev) => [...prev, "\n"]);

        dispatch(
          addCharResult({
            expected: "\n",
            typed: "\n",
          })
        );

        dispatch(setCurrentIndex(currentIndex + 1));
      } else {
        dispatch(addWrongKey("Enter"));
        setTimeout(() => dispatch(removeWrongKey()), 350);
      }

      return;
    }

    // ----- NORMAL CHAR TYPING -----
    if (e.key.length === 1 && currentIndex < chars.length) {
      const char = e.key;
      const expected = chars[currentIndex];

      setTyped((prev) => [...prev, char]);

      dispatch(
        addCharResult({
          expected,
          typed: char,
        })
      );

      if (expected !== char) {
        dispatch(addWrongKey(char));
        setTimeout(() => dispatch(removeWrongKey()), 350);
      }

      dispatch(setCurrentIndex(currentIndex + 1));
    }
  };

  return (
    <div className={styles.wrapper} onClick={() => inputRef.current?.focus()}>
      <div className={styles.header}>
        <div className={styles.title}>Typing trainer</div>
        <div className={styles.subtitle}>Type exactly what you see below</div>
      </div>

      <div ref={textBoxRef} className={styles.textBox}>
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className={styles.word}>
            {word.text.split("").map((char, indexInWord) => {
              const globalIndex = word.start + indexInWord;
              const typedChar = typed[globalIndex];

              const isSpace = char === " ";
              const isNewLine = char === "\n";

              let className = styles.char;

              if (typedChar != null) {
                if (typedChar === char) className += ` ${styles.correct}`;
                else className += ` ${styles.wrong}`;
              }

              const isActive = globalIndex === currentIndex;

              return (
                <span
                  key={globalIndex}
                  className={
                    className +
                    (isActive ? ` ${styles.activeChar}` : "") +
                    (isSpace ? ` ${styles.spaceChar}` : "") +
                    (isNewLine ? ` ${styles.newLineChar}` : "")
                  }
                >
                  {isActive && <span className={styles.caret} />}

                  <span className={styles.charInner}>
                    {isNewLine ? <MdKeyboardReturn size={12} /> : isSpace ? " " : char}
                  </span>
                  {isNewLine && <br />}
                </span>
              );
            })}
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        className={styles.hiddenInput}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

function buildWords(text: string) {
  const parts = text.match(/\S+\s*|\n/g) || [];
  let index = 0;

  return parts.map((part) => {
    const start = index;
    const end = start + part.length;
    index = end;
    return { text: part, start, end };
  });
}
