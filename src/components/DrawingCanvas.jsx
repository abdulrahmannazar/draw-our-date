import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Pencil, Paintbrush, Eraser, RotateCcw, RotateCw, Trash2 } from 'lucide-react';

const COLORS = [
  '#1e293b', '#e11d48', '#ec4899', '#8b5cf6', '#3b82f6', 
  '#06b6d4', '#10b981', '#f59e0b', '#78350f', '#ffffff'
];

const BRUSH_SIZES = [
  { label: 'Fine', size: 3 },
  { label: 'Medium', size: 7 },
  { label: 'Chunky', size: 16 }
];

const DrawingCanvas = forwardRef(({ readOnly = false, initialData = null }, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('brush');
  const [currentColor, setCurrentColor] = useState('#e11d48');
  const [brushSize, setBrushSize] = useState(7);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  useImperativeHandle(ref, () => ({
    getDrawingData: () => {
      const canvas = canvasRef.current;
      return canvas ? canvas.toDataURL('image/png') : null;
    },
    clearCanvas: () => {
      clearBoard();
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;

    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);

    if (initialData) {
      const img = new Image();
      img.src = initialData;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        saveState();
      };
    } else {
      saveState();
    }
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL();
    setHistory(prev => {
      const upToCurrent = prev.slice(0, historyStep + 1);
      return [...upToCurrent, data];
    });
    setHistoryStep(prev => prev + 1);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    if (readOnly) return;
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);

    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : currentColor;
    ctx.lineWidth = tool === 'pencil' ? 3 : brushSize;
  };

  const draw = (e) => {
    if (!isDrawing || readOnly) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || readOnly) return;
    setIsDrawing(false);
    saveState();
  };

  const undo = () => {
    if (historyStep > 0) {
      const targetStep = historyStep - 1;
      restoreHistoryStep(targetStep);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const targetStep = historyStep + 1;
      restoreHistoryStep(targetStep);
    }
  };

  const restoreHistoryStep = (step) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const img = new Image();
    img.src = history[step];
    img.onload = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      setHistoryStep(step);
    };
  };

  const clearBoard = () => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    saveState();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(255,128,160,0.12)',
          border: '2px solid rgba(255, 255, 255, 0.9)',
          background: '#ffffff',
          touchAction: 'none'
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block', cursor: readOnly ? 'default' : 'crosshair' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {!readOnly && (
        <div className="glass-card-sm" style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.35rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '14px' }}>
              <button
                type="button"
                onClick={() => setTool('brush')}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: tool === 'brush' ? '#ffffff' : 'transparent',
                  boxShadow: tool === 'brush' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  color: tool === 'brush' ? '#ff527b' : '#64748b'
                }}
              >
                <Paintbrush size={18} />
              </button>
              <button
                type="button"
                onClick={() => setTool('pencil')}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: tool === 'pencil' ? '#ffffff' : 'transparent',
                  boxShadow: tool === 'pencil' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  color: tool === 'pencil' ? '#ff527b' : '#64748b'
                }}
              >
                <Pencil size={18} />
              </button>
              <button
                type="button"
                onClick={() => setTool('eraser')}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: tool === 'eraser' ? '#ffffff' : 'transparent',
                  boxShadow: tool === 'eraser' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  color: tool === 'eraser' ? '#ff527b' : '#64748b'
                }}
              >
                <Eraser size={18} />
              </button>
            </div>

            {tool !== 'eraser' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {BRUSH_SIZES.map(b => (
                  <button
                    key={b.size}
                    type="button"
                    onClick={() => setBrushSize(b.size)}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: brushSize === b.size ? '#fed7e2' : '#f1f5f9',
                      border: brushSize === b.size ? '2px solid #ff527b' : '1px solid transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ width: b.size * 0.75, height: b.size * 0.75, borderRadius: '50%', background: '#334155' }} />
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={undo}
                disabled={historyStep <= 0}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.4rem', opacity: historyStep <= 0 ? 0.3 : 1 }}
              >
                <RotateCcw size={18} color="#475569" />
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={historyStep >= history.length - 1}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.4rem', opacity: historyStep >= history.length - 1 ? 0.3 : 1 }}
              >
                <RotateCw size={18} color="#475569" />
              </button>
              <button
                type="button"
                onClick={clearBoard}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.4rem' }}
              >
                <Trash2 size={18} color="#ef4444" />
              </button>
            </div>
          </div>

          {tool !== 'eraser' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrentColor(c)}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: c,
                    border: currentColor === c ? '3px solid #1e293b' : '1.5px solid rgba(0,0,0,0.15)',
                    cursor: 'pointer',
                    transform: currentColor === c ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.15s ease'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';
export default DrawingCanvas;