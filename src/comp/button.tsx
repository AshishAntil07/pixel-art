import { StyleHTMLAttributes, useState } from "react";

interface ButtonProps {
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
  content?: string;
  children?: React.ReactNode;
  delayRatio?: number;
}

export const colors = [
  'red',
  'blue',
  'black',
  'green',
  'yellow',
  'purple',
  'orange',
  'pink',
  'cyan',
  'magenta',
  'lime',
  'indigo'
]

export default function Button({ onClick, type, content, children, delayRatio, ...props }: ButtonProps & StyleHTMLAttributes<HTMLButtonElement>): React.ReactElement {
  const [, rerender] = useState(0);
  return (
    <>
      <button type={type} className="p-2 outline outline-1 outline-gray-400 rounded relative w-[234px] box-border hover:outline-gray-600 group" onClick={e => {
        rerender(Math.random());
        onClick?.();
      }} {...props}> 
        <div className='relative z-10'>{children || content}</div>
        <div className='absolute top-0 left-0 w-full h-full flex flex-wrap items-start overflow-hidden opacity-20'>
          {
            Array.from({ length: 300 }).map((_, i) => {
              return (
                <div key={i}
                  className={`transition-all opacity-0 group-hover:opacity-100 inline-block h-1.5 w-1.5`}
                  style={{
                    background: colors[Math.floor(Math.random()*colors.length)],
                    transitionDelay: i*(delayRatio || 2)+'ms'
                  }}
                ></div>
              )
            })
          }
        </div>
      </button>
    </>
  )
}