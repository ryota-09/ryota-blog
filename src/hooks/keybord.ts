import { useEffect, useRef } from "react";

type Key = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "Enter" | "Escape";

export const useKey = (code: Key, callback: (event: KeyboardEvent) => void) => {
  const cbRef = useRef(callback);
  // レンダー中のref書き換えは並行レンダリングで不整合を起こしうるため、effectで同期する
  useEffect(() => {
    cbRef.current = callback;
  });
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === code) {
        cbRef.current(event);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [code]);
}