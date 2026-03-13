import React, { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════
// VIEW TRANSITION — wraps content with fade/slide animation on key change
// Fixed: safety net prevents stuck invisible states
// ═══════════════════════════════════════════
const ViewTransition = ({ viewKey, children, className = "" }) => {
  const [displayedKey, setDisplayedKey] = useState(viewKey);
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [phase, setPhase] = useState("visible");
  const timeoutRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (viewKey === displayedKey) {
      // Same view — just update children in place
      setDisplayedChildren(children);
      return;
    }

    // New view — animate exit then enter
    setPhase("exiting");
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (!isMounted.current) return;
      setDisplayedKey(viewKey);
      setDisplayedChildren(children);
      setPhase("entering");

      // Use rAF to guarantee the entering frame renders before going visible
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (isMounted.current) {
            setPhase("visible");
          }
        });
      });
    }, 150);

    return () => clearTimeout(timeoutRef.current);
  }, [viewKey, children, displayedKey]);

  // Safety net — if stuck in a non-visible phase for > 500ms, force visible
  useEffect(() => {
    if (phase !== "visible") {
      const safety = setTimeout(() => {
        if (isMounted.current) setPhase("visible");
      }, 500);
      return () => clearTimeout(safety);
    }
  }, [phase]);

  const style = {
    exiting: {
      opacity: 0,
      transform: "translateY(6px)",
      transition: "all 0.15s ease-in",
    },
    entering: {
      opacity: 0,
      transform: "translateY(6px)",
      transition: "none",
    },
    visible: {
      opacity: 1,
      transform: "translateY(0)",
      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    },
  };

  return (
    <div
      className={className}
      style={{
        ...style[phase],
        willChange: "opacity, transform",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {displayedChildren}
    </div>
  );
};

export default ViewTransition;