import { createContext } from "react";

export const DensityContext = createContext<number>(10);   // describes boxes per 100px

export const BrushContext = createContext<{
  brushSize: number;
  brushColor: string
}>({
  brushSize: 30,
  brushColor: 'black'
});    // brush size in pixels

export const CanavsContext = createContext<{
  height: number;
  width: number
}>({
  height: 700,
  width: 1000
});    // canvas dimensions in pixels