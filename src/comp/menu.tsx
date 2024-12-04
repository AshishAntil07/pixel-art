import { BrushContext, CanavsContext, DensityContext } from "@/contexts";
import { FormEvent, useContext, useRef } from "react";
import Button from "@/comp/button";
import limit from "@/utils/limit";


interface MenuProps {
  setDensity: (density: number) => void;
  setBrushSize: (size: number)  =>  void;
  setBrushColor: (color: string) => void;
  setCanvasHeight: (height: number) => void;
  setCanvasWidth: (width: number) => void;
}

export default function Menu({ setDensity, setBrushSize, setBrushColor, setCanvasHeight, setCanvasWidth }: MenuProps): React.ReactElement {

  const curDensity = useRef<number>(useContext(DensityContext));
  const curBrushSize = useRef<number>(useContext(BrushContext).brushSize);
  const curBrushColor = useRef<string>(useContext(BrushContext).brushColor);
  const curCanvasHeight = useRef<number>(useContext(CanavsContext).height);
  const curCanvasWidth = useRef<number>(useContext(CanavsContext).width);

  const previewRef = useRef<HTMLDivElement>(null);

  function onSubmit(e: FormEvent){
    e.preventDefault();

    setBrushSize(limit(curBrushSize.current, 5, 250));
    setBrushColor(curBrushColor.current);
    setDensity(limit(curDensity.current, 1, 10))
    setCanvasHeight(limit(curCanvasHeight.current, 100, 1000));
    setCanvasWidth(limit(curCanvasWidth.current, 100, 1000));
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-2'>

      <div className='flex flex-col relative'>
        <label htmlFor='brushColor'>Brush Color</label>
        <input 
          type='text'
          id="brushColor"
          className='border border-gray-400 py-1 px-2 pr-8 rounded hover:border-gray-600'
          onChange={(e) => {
            curBrushColor.current = e.target.value
            if(previewRef.current) previewRef.current.style.background = e.target.value;
          }}
          title="Brush Color (could be color name, rgb, or hex code)"
          defaultValue={curBrushColor.current}
        />

        <div ref={previewRef} className='h-4 w-4 absolute rounded right-2.5 bottom-2.5 box-border border border-black/30' style={{ background: curBrushColor.current }}></div>
      </div>

      <div className='flex flex-col'>
        <label htmlFor='brushSize'>Brush Size</label>
        <input 
          type="number"
          id="brushSize"
          className='border border-gray-400 py-1 px-2 rounded hover:border-gray-600'
          onChange={(e) => curBrushSize.current = e.target.valueAsNumber}
          title="Brush Size in Pixels"
          min={5} max={250}
          defaultValue={curBrushSize.current}
        />
      </div>

      <div className='flex flex-col'>
        <label htmlFor="density">Density (boxes per 100px)</label>
        <input
          type="number"
          id="density"
          className='border border-gray-400 py-1 px-2 rounded hover:border-gray-600'
          onChange={(e) => curDensity.current = e.target.valueAsNumber}
          title="Boxes per 100 pixels"
          min={1} max={10}
          defaultValue={curDensity.current}
        />
      </div>

      <div className='flex flex-col'>
        <p>Dimensions of canvas (in pixels)</p>
        <div className='flex justify-between'>
          <input
            type='number'
            className='border border-gray-400 py-1 px-2 rounded hover:border-gray-600'
            onChange={(e) => curCanvasWidth.current = e.target.valueAsNumber}
            title="Width of the canvas"
            min={100} max={1000}
            defaultValue={curCanvasWidth.current}
          /> x 
          <input
            type='number'
            className='border border-gray-400 py-1 px-2 rounded hover:border-gray-600'
            onChange={(e) => curCanvasHeight.current = e.target.valueAsNumber}
            title="Height of the canvas"
            min={100} max={1000}
            defaultValue={curCanvasHeight.current}
          />
        </div>
      </div>
      <Button type='submit' content="Update" delayRatio={1} />
    </form>
  )
}