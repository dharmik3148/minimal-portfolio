"use client";
import { useEffect, useRef } from "react";

const GRID_SIZE = 8;
const HOVER_RADIUS = 27;

export default function CreepyGrid() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();

      for (let x = 0; x < canvas.width; x += GRID_SIZE) {
        for (let y = 0; y < canvas.height; y += GRID_SIZE) {
          const dx = mouse.current.x - x;
          const dy = mouse.current.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let alpha = 0.05;
          let lineWidth = 0.3;
          if (dist < HOVER_RADIUS) {
            alpha = 0.9 - dist / HOVER_RADIUS;
            lineWidth = Math.max(
              0.3,
              0.5 + Math.sin(now / 100 + (x + y) / 100) * 1
            );
          }

          ctx.save();
          ctx.strokeStyle = `rgba(100,100,100, ${alpha})`;
          ctx.lineWidth = lineWidth;
          ctx.strokeRect(
            Math.round(x) + 0.5,
            Math.round(y) + 0.5,
            GRID_SIZE,
            GRID_SIZE
          );
          ctx.restore();
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
