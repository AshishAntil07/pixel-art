import { BrushContext, CanavsContext, DensityContext } from "@/contexts";
import limit from "@/utils/limit";
import { useContext, useEffect, useRef, useState } from "react";
import Button from "@/comp/button";

export default function Canvas(): React.ReactElement {

  const { height: canvasHeight, width: canvasWidth } = useContext(CanavsContext);

  const density = useContext(DensityContext);
  const { brushSize, brushColor } = useContext(BrushContext);

  const [pixels, setPixels] = useState<Array<Array<string>>>([]);

  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPixels(state => {
      if (!state[0]) {
        return new Array(density * canvasHeight / 100).fill(new Array(density * canvasWidth / 100).fill('transparent'))
      } else if (density * canvasHeight / 100 <= state.length && density * canvasWidth / 100 <= state[0].length) {
        return state.slice(0, density * canvasHeight / 100).map((row) => row.slice(0, density * canvasWidth / 100))
      } else if (density * canvasHeight / 100 >= state.length && density * canvasWidth / 100 >= state[0].length) {
        return state.concat(Array.from({ length: density * canvasHeight / 100 - state.length }).fill(Array.from({ length: state[0].length }).fill('transparent') as string[]) as string[][]).map((row) => row.concat(Array.from({ length: density * canvasWidth / 100 - row.length }).fill('transparent') as string[]))
      } else if (density * canvasHeight / 100 <= state.length && density * canvasWidth / 100 >= state[0].length) {
        return state.slice(0, density * canvasHeight / 100).map(row => row.concat(Array.from({ length: density * canvasWidth / 100 - row.length }).fill('transparent') as string[]))
      } else if (density * canvasHeight / 100 >= state.length && density * canvasWidth / 100 <= state[0].length) {
        return state.concat(Array.from({ length: density * canvasHeight / 100 - state.length }).fill(Array.from({ length: state[0].length }).fill('transparent') as string[]) as string[][]).map(row => row.slice(0, density * canvasWidth / 100));
      }
      return new Array(density * canvasHeight / 100).fill(new Array(density * canvasWidth / 100).fill('transparent'))
    })
  }, [canvasHeight, canvasWidth, density]);

  useEffect(() => {
    if (!cursorRef.current || !canvasRef.current) return;

    const cursor = cursorRef.current;
    const canvas = canvasRef.current;


    const cursorDisplay = (e: MouseEvent) => {
      const cs = canvas.getBoundingClientRect();

      if (limit(e.clientX, cs.left, cs.left + cs.width) === e.clientX && limit(e.clientY, cs.top, cs.top + cs.height) === e.clientY) {
        cursor.style.display = 'block';
      } else {
        remPaintListener();
        cursor.style.display = 'none';
      }
    };


    const cursorMoveListener = (e: MouseEvent) => {
      const cs = canvas.getBoundingClientRect();

      cursor.style.top = e.clientY - cs.top + 'px';
      cursor.style.left = e.clientX - cs.left + 'px';
    };


    const paint = (e: Event) => {
      e.preventDefault();

      const crs = cursor.getBoundingClientRect();
      const cs = canvas.getBoundingClientRect();

      setPixels((state) => {
        const modifiedPixels: Set<string> = new Set();
        const pixelMap: Map<number, { min: number, max: number }> = new Map();

        const r = crs.width / 2;

        for (let a = 360; a > 0; a -= 3) {
          const x = Math.floor((crs.left + r + (r * Math.cos(a * Math.PI / 180)) - cs.left) * density / 100);
          const y = Math.floor((crs.top + r + (r * Math.sin(a * Math.PI / 180)) - cs.top) * density / 100);

          if (!pixelMap.has(y)) {
            pixelMap.set(y, {
              min: x, max: x
            });
          } else {
            pixelMap.set(y, { min: pixelMap.get(y)!.min < x ? pixelMap.get(y)!.min : x, max: pixelMap.get(y)!.max > x ? pixelMap.get(y)!.max : x });
          }

          modifiedPixels.add(y + ' ' + x);
        }

        for (let [y, { min, max }] of pixelMap) {
          for (let i = min + 1; i < max; i++) {
            modifiedPixels.add(y + ' ' + i);
          }
        }

        return state.map((row, i) => row.map((_, j) => modifiedPixels.has(i + ' ' + j) ? brushColor : _));
      })
    }

    const paintListener = (e: MouseEvent) => {
      paint(e);

      e.currentTarget?.addEventListener('mousemove', paint);
    }

    const remPaintListener = () => cursor.removeEventListener('mousemove', paint);

    document.addEventListener('mousemove', cursorDisplay);
    canvas.addEventListener('mousemove', cursorMoveListener);
    cursor.addEventListener('mousedown', paintListener);
    cursor.addEventListener('mouseup', remPaintListener);

    return () => {
      cursor.removeEventListener('mousedown', paintListener);
      canvas.removeEventListener('mousemove', cursorMoveListener);
      document.removeEventListener('mousemove', cursorDisplay);
      cursor.removeEventListener('mouseup', remPaintListener);
    }
  }, [density, brushColor])

  return (
    <div className='flex gap-2'>
      <div className='rounded-xl border border-black/50 overflow-hidden'>
        <div ref={canvasRef} className="cursor-none relative bg-white">
          {
            pixels.map((row, i) => {
              return (
                <div className='flex' key={i}>
                  {
                    row.map((color, j) => {
                      return (
                        <div
                          key={j}
                          className={`border-l border-l-gray-500 border-b border-b-gray-500 box-border`}
                          style={{
                            borderTop: i === 0 ? '1px solid gray' : 'none',
                            borderRight: j === row.length - 1 ? '1px solid gray' : 'none',
                            width: 100 / density + 'px',
                            height: 100 / density + 'px',
                            backgroundColor: color
                          }}
                        >
                        </div>
                      )
                    })
                  }
                </div>
              )
            }
            )
          }

          {/* custom cursor */}
          <div
            ref={cursorRef}
            className='rounded-full border border-white outline outline-1 hidden -translate-x-1/2  -translate-y-1/2 absolute'
            style={{
              height: brushSize + 'px',
              width: brushSize + 'px',
            }}
          ></div>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <Button
          onClick={() => 
            setPixels(
              new Array(density * canvasHeight / 100)
                .fill(new Array(density * canvasWidth / 100)
                .fill('transparent'))
              )
            } style={{ height: '54px', width: '54px', display: 'grid', placeItems: 'center' }}>
          <img src='deleteIcon.svg' alt='Reset' className='h-8 w-8' />
        </Button>
        <Button onClick={() => {
          let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasWidth / density / 100} ${canvasHeight / density / 100}" width="${canvasWidth / density / 100}" height="${canvasHeight / density / 100}">`;
          pixels.forEach((row, i) => {
            row.forEach((px, j) => {
              if (px === 'transparent' || px === '#0000') return;
              svg += `<rect x="${j}" y="${i}" width="${1}" height="${1}" fill="${px}" />`
            })
          });

          svg += '</svg>';

          const a = document.createElement('a');
          a.setAttribute('download', `pixel-art${Math.floor(Math.random() * 10000)}.svg`);
          a.setAttribute('href', 'data:image/svg+xml,' + encodeURIComponent(svg));
          a.click();
        }} style={{ height: '54px', width: '54px', display: 'grid', placeItems: 'center' }}>
          <img src="exportIcon.svg" alt="Export" className='h-8 w-8' />
        </Button>
      </div>

    </div>
  )
}