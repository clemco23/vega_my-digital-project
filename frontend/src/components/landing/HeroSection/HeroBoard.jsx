'use client';

import { createSwapy } from "swapy";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "./HeroBoard.css";

const HINT_INTERVAL_MS = 3000;
const HINT_STEP_DELAY_MS = 230;
const HINT_DURATION_MS = 220;

const tiles = [
  {
    slotId: "slot-lock",
    itemId: "lock",
    slotClass: "hero-board__slot--top-left",
    itemClass: "hero-board__item--burnt",
    iconClass: "hero-board__icon--small",
    icon: "\u{1F512}",
    label: "Module cadenas",
  },
  {
    slotId: "slot-gear",
    itemId: "gear",
    slotClass: "hero-board__slot--top-center",
    itemClass: "hero-board__item--gold",
    iconClass: "hero-board__icon--small",
    icon: "\u2699\uFE0F",
    label: "Module engrenage",
  },
  {
    slotId: "slot-key",
    itemId: "key",
    slotClass: "hero-board__slot--top-right",
    itemClass: "hero-board__item--sand",
    iconClass: "hero-board__icon--small",
    icon: "\u{1F511}",
    label: "Module cle",
  },
  {
    slotId: "slot-magnet",
    itemId: "magnet",
    slotClass: "hero-board__slot--middle-left",
    itemClass: "hero-board__item--rose",
    iconClass: "hero-board__icon--medium",
    icon: "\u{1F9F2}",
    label: "Module aimant",
  },
  {
    slotId: "slot-lens",
    itemId: "lens",
    slotClass: "hero-board__slot--middle-wide",
    itemClass: "hero-board__item--moss",
    iconClass: "hero-board__icon--tiny",
    icon: "\u{1F50D}",
    label: "Module loupe",
  },
  {
    slotId: "slot-spiral",
    itemId: "spiral",
    slotClass: "hero-board__slot--lower-left",
    itemClass: "hero-board__item--burnt",
    iconClass: "hero-board__icon--medium",
    icon: "\u{1F300}",
    label: "Module spirale",
  },
  {
    slotId: "slot-timer",
    itemId: "timer",
    slotClass: "hero-board__slot--center-tall",
    itemClass: "hero-board__item--gold",
    iconClass: "hero-board__icon--medium",
    icon: "\u23F1\uFE0F",
    label: "Module minuterie",
  },
  {
    slotId: "slot-hook",
    itemId: "hook",
    slotClass: "hero-board__slot--right-middle",
    itemClass: "hero-board__item--olive",
    iconClass: "hero-board__icon--medium",
    icon: "\u{1FA9D}",
    label: "Module crochet",
  },
  {
    slotId: "slot-dials",
    itemId: "dials",
    slotClass: "hero-board__slot--bottom-left",
    itemClass: "hero-board__item--beige",
    iconClass: "hero-board__icon--large",
    icon: "\u{1F39B}\uFE0F",
    label: "Module boutons",
  },
  {
    slotId: "slot-puzzle",
    itemId: "puzzle",
    slotClass: "hero-board__slot--bottom-right",
    itemClass: "hero-board__item--salmon",
    iconClass: "hero-board__icon--medium",
    icon: "\u{1F9E9}",
    label: "Module puzzle",
  },
  {
    slotId: "slot-refresh",
    itemId: "refresh",
    slotClass: "hero-board__slot--bottom-bar",
    itemClass: "hero-board__item--leaf",
    iconClass: "hero-board__icon--medium",
    icon: "\u{1F504}",
    label: "Module rotation",
  },
];

function HeroBoard() {
  const containerRef = useRef(null);
  const swapyRef = useRef(null);
  const lastHintItemIdRef = useRef(null);
  const hintTimeoutsRef = useRef([]);
  const [hintedItemId, setHintedItemId] = useState(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    swapyRef.current = createSwapy(containerRef.current, {
      animation: "spring",
    });

    return () => {
      swapyRef.current?.destroy();
      swapyRef.current = null;
    };
  }, []);

  useEffect(() => {
    const clearHintTimers = () => {
      hintTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      hintTimeoutsRef.current = [];
    };

    const getHintSequence = () => {
      const shuffledTiles = [...tiles];

      for (let index = shuffledTiles.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledTiles[index], shuffledTiles[randomIndex]] = [
          shuffledTiles[randomIndex],
          shuffledTiles[index],
        ];
      }

      if (
        shuffledTiles.length > 1 &&
        shuffledTiles[0].itemId === lastHintItemIdRef.current
      ) {
        [shuffledTiles[0], shuffledTiles[1]] = [shuffledTiles[1], shuffledTiles[0]];
      }

      return shuffledTiles
        .slice(0, Math.min(3, shuffledTiles.length))
        .map((tile) => tile.itemId);
    };

    const triggerHint = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      clearHintTimers();
      setHintedItemId(null);

      const hintSequence = getHintSequence();

      hintSequence.forEach((itemId, index) => {
        const startDelay = index * HINT_STEP_DELAY_MS;
        const stopDelay = startDelay + HINT_DURATION_MS;

        hintTimeoutsRef.current.push(
          window.setTimeout(() => {
            setHintedItemId(itemId);
          }, startDelay)
        );

        hintTimeoutsRef.current.push(
          window.setTimeout(() => {
            setHintedItemId((currentItemId) =>
              currentItemId === itemId ? null : currentItemId
            );
          }, stopDelay)
        );
      });

      lastHintItemIdRef.current = hintSequence[hintSequence.length - 1] ?? null;
    };

    triggerHint();

    const intervalId = window.setInterval(triggerHint, HINT_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      clearHintTimers();
    };
  }, []);

  return (
    <div className="hero-board__group">
      <div
        ref={containerRef}
        className="hero-board"
        aria-label="Modules interchangeables"
      >
        {tiles.map(({ slotId, itemId, slotClass, itemClass, iconClass, icon, label }) => (
          <div
            key={slotId}
            data-swapy-slot={slotId}
            className={`hero-board__slot ${slotClass}`}
          >
            <div
              data-swapy-item={itemId}
              className={`hero-board__item ${itemClass} ${hintedItemId === itemId ? "hero-board__item--hint" : ""}`}
              aria-label={label}
              title={label}
            >
              <span className={`hero-board__icon ${iconClass}`} aria-hidden="true">
                {icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Link to="/la-planche" className="hero-board__cta">
        Composer ma planche
      </Link>
    </div>
  );
}

export default HeroBoard;
