import { useEffect, useState, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function App() {
  const gameRef = useRef(new Chess());
  const [position, setPosition] = useState(gameRef.current.fen());
  const [engineReady, setEngineReady] = useState(false);
  const [points, setPoints] = useState(0);
  const [invalidMove, setInvalidMove] = useState(false);
  const engineRef = useRef(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const stockfish = new Worker("/stockfish/stockfish.js");

    stockfish.onmessage = (e) => {
      const message = e.data;
      if (typeof message === "string" && message.includes("bestmove")) {
        const bestMove = message.split(" ")[1];
        if (bestMove && bestMove !== "(none)") {
          try {
            const move = gameRef.current.move({
              from: bestMove.slice(0, 2),
              to: bestMove.slice(2, 4),
              promotion: "q",
            });
            if (move) setPosition(gameRef.current.fen());
            else setInvalidMove(true);
          } catch {
            setInvalidMove(true);
          }
        }
      }

      if (message === "uciok") setEngineReady(true);
    };

    stockfish.postMessage("uci");
    engineRef.current = stockfish;
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function makeEngineMove() {
    if (!engineReady || gameRef.current.isGameOver()) return;
    engineRef.current.postMessage(`position fen ${gameRef.current.fen()}`);
    engineRef.current.postMessage("go depth 14");
  }

  function onDrop(sourceSquare, targetSquare) {
    try {
      const move = gameRef.current.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) {
        setInvalidMove(true);
        return false;
      }

      if (move.color === "w") {
        if (move.captured) setPoints((prev) => prev + 10);
        if (gameRef.current.inCheck()) {
          setPoints(100);
          alert("Check delivered! ✅ You're recruited!");
          window.open("/resume.pdf", "_blank");
        }
      }

      setPosition(gameRef.current.fen());

      if (gameRef.current.turn() === "b") {
        setTimeout(makeEngineMove, 500);
      }

      return true;
    } catch {
      setInvalidMove(true);
      return false;
    }
  }

  function resetGame() {
    gameRef.current = new Chess();
    setPosition(gameRef.current.fen());
    setPoints(0);
    setInvalidMove(false);
  }

  const boardSize = Math.min(windowSize.width, windowSize.height - 180);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <div style={{ marginTop: 10, textAlign: "center" }}>
        <h1 style={{ margin: 5 }}>♟️ Chess Recruiter</h1>
        <h2 style={{ margin: 5 }}>Points: {points} / 100</h2>
        <button
          onClick={resetGame}
          style={{
            marginTop: 10,
            marginBottom: 10,
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          🔁 Reset Board
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Chessboard
          position={position}
          onPieceDrop={onDrop}
          boardWidth={boardSize}
        />
      </div>

      {invalidMove && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <h1>❌ Invalid Move</h1>
          <button
            onClick={() => setInvalidMove(false)}
            style={{
              marginTop: "20px",
              padding: "10px 25px",
              fontSize: "18px",
              cursor: "pointer",
              backgroundColor: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Continue Game
          </button>
        </div>
      )}
    </div>
  );
}
