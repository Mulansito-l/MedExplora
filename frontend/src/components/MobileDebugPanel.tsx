import { useState, useEffect, useRef } from "react";

interface LogEntry {
  time: string;
  message: string;
  type: "info" | "error" | "warning" | "success";
}

export default function MobileDebugPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [touchInfo, setTouchInfo] = useState({
    lastTouch: "Ninguno",
    touchX: 0,
    touchY: 0,
    isDragging: false,
  });
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Función para agregar logs
  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    const newLog: LogEntry = {
      time: new Date().toLocaleTimeString(),
      message,
      type,
    };
    setLogs((prev) => [...prev.slice(-20), newLog]); // Mantener solo últimos 20 logs
  };

  // Exponer función globalmente para que puedas usarla desde cualquier parte
  useEffect(() => {
    (window as any).debugLog = (
      message: string,
      type: LogEntry["type"] = "info"
    ) => {
      addLog(message, type);
    };

    // Capturar errores de consola
    const originalError = console.error;
    const originalLog = console.log;
    const originalWarn = console.warn;

    console.error = (...args) => {
      addLog(args.join(" "), "error");
      originalError.apply(console, args);
    };

    console.log = (...args) => {
      addLog(args.join(" "), "info");
      originalLog.apply(console, args);
    };

    console.warn = (...args) => {
      addLog(args.join(" "), "warning");
      originalWarn.apply(console, args);
    };

    return () => {
      console.error = originalError;
      console.log = originalLog;
      console.warn = originalWarn;
      delete (window as any).debugLog;
    };
  }, []);

  // Monitorear eventos touch
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      setTouchInfo((prev) => ({
        ...prev,
        lastTouch: "touchstart",
        touchX: startX,
        touchY: startY,
        isDragging: false,
      }));
      addLog(
        `TouchStart: (${startX.toFixed(0)}, ${startY.toFixed(0)})`,
        "info"
      );
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = Math.abs(currentX - startX);
      const deltaY = Math.abs(currentY - startY);

      if (deltaX > 5 || deltaY > 5) {
        setTouchInfo((prev) => ({
          ...prev,
          lastTouch: "touchmove",
          touchX: currentX,
          touchY: currentY,
          isDragging: true,
        }));
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = Math.abs(endX - startX);
      const deltaY = Math.abs(endY - startY);

      setTouchInfo((prev) => ({
        ...prev,
        lastTouch: "touchend",
        touchX: endX,
        touchY: endY,
      }));

      addLog(
        `TouchEnd: (${endX.toFixed(0)}, ${endY.toFixed(
          0
        )}) - Delta: (${deltaX.toFixed(0)}, ${deltaY.toFixed(0)})`,
        deltaX < 5 && deltaY < 5 ? "success" : "warning"
      );
    };

    const handleClick = (e: MouseEvent) => {
      addLog(`Click: (${e.clientX}, ${e.clientY})`, "success");
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // Auto-scroll a los últimos logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Solo mostrar en móviles
  if (typeof window !== "undefined" && window.innerWidth > 768) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999999,
        fontFamily: "monospace",
        fontSize: "11px",
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        color: "#00ff00",
        borderTop: "2px solid #00ff00",
        transition: "transform 0.3s ease",
        transform: isMinimized
          ? "translateY(calc(100% - 40px))"
          : "translateY(0)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "8px 12px",
          backgroundColor: "rgba(0, 255, 0, 0.1)",
          borderBottom: "1px solid #00ff00",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div style={{ fontWeight: "bold" }}>
          🐛 DEBUG PANEL {isMinimized ? "▲" : "▼"}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLogs([]);
            addLog("Logs limpiados", "info");
          }}
          style={{
            background: "#ff0000",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "3px",
            fontSize: "10px",
            cursor: "pointer",
          }}
        >
          Limpiar
        </button>
      </div>

      {/* Touch Info */}
      <div
        style={{
          padding: "8px 12px",
          backgroundColor: "rgba(0, 100, 255, 0.1)",
          borderBottom: "1px solid #0066ff",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
        }}
      >
        <div>
          <strong>Último evento:</strong> {touchInfo.lastTouch}
        </div>
        <div>
          <strong>Posición:</strong> ({touchInfo.touchX.toFixed(0)},{" "}
          {touchInfo.touchY.toFixed(0)})
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <strong>Estado:</strong>{" "}
          <span style={{ color: touchInfo.isDragging ? "#ff6600" : "#00ff00" }}>
            {touchInfo.isDragging ? "🔄 Arrastrando" : "✓ Listo para click"}
          </span>
        </div>
      </div>

      {/* Logs */}
      <div
        style={{
          maxHeight: "200px",
          overflowY: "auto",
          padding: "8px 12px",
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: "#666", textAlign: "center", padding: "20px" }}>
            Esperando eventos...
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              style={{
                marginBottom: "4px",
                padding: "4px",
                backgroundColor:
                  log.type === "error"
                    ? "rgba(255, 0, 0, 0.1)"
                    : log.type === "warning"
                    ? "rgba(255, 165, 0, 0.1)"
                    : log.type === "success"
                    ? "rgba(0, 255, 0, 0.1)"
                    : "transparent",
                borderLeft:
                  log.type === "error"
                    ? "3px solid #ff0000"
                    : log.type === "warning"
                    ? "3px solid #ff9900"
                    : log.type === "success"
                    ? "3px solid #00ff00"
                    : "3px solid #0066ff",
                paddingLeft: "8px",
              }}
            >
              <span style={{ color: "#666" }}>[{log.time}]</span>{" "}
              <span
                style={{
                  color:
                    log.type === "error"
                      ? "#ff6666"
                      : log.type === "warning"
                      ? "#ffaa66"
                      : log.type === "success"
                      ? "#66ff66"
                      : "#00ff00",
                }}
              >
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}
