import React, { useState } from 'react';
import Menu from '@/comp/menu';
import Canvas from '@/comp/canvas';
import { BrushContext, CanavsContext, DensityContext } from '@/contexts';
import { colors } from '@/comp/button';

function App() {

  const [density, setDensity] = useState(5);
  const [brushSize, setBrushSize] = useState(75);
  const [brushColor, setBrushColor] = useState('black');
  const [canvasHeight, setCanvasHeight] = useState(700);
  const [canvasWidth, setCanvasWidth] = useState(1000);

  return (
    <DensityContext.Provider value={density}>
      <BrushContext.Provider value={{ brushSize, brushColor }}>
        <CanavsContext.Provider value={{ height: canvasHeight, width: canvasWidth }}>
          <div className='relative overflow-hidden'>
            <div className='flex justify-between items-center p-4 px-16'>
              <div className="flex gap-4 items-center">
                <img src="logo.svg" alt='' className='h-20 w-20' />
                <h1 className='font-pixel text-5xl'>Pixel Art Studio</h1>
              </div>
            </div>

            <div className='flex justify-start gap-4 items-start mx-16 p-8 mb-16 rounded-3xl bg-white/10 backdrop-blur-lg shadow-2xl'>
              <Canvas />
              <div>
                <Menu setDensity={setDensity} setBrushSize={setBrushSize} setBrushColor={setBrushColor} setCanvasHeight={setCanvasHeight} setCanvasWidth={setCanvasWidth} />
              </div>
            </div>

            <div className='absolute top-0 left-0 brightness-50 w-full h-full grid grid-cols-[repeat(auto-fit,minmax(60px,1fr))] z-[-1] overflow-hidden opacity-20'>
            {
              Array.from({ length: 6000 }).map((_, i) => {
                return (
                  <div key={i}
                    className={`transition-all h-16 w-full`}
                    style={{
                      background: colors[Math.floor(Math.random()*colors.length)],
                      transitionDelay: i*10+'ms'
                    }}
                  ></div>
                )
              })
            }
          </div>
        </div>
        </CanavsContext.Provider>
      </BrushContext.Provider>
    </DensityContext.Provider>
  );
}

export default App;
