"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function AIRubik({ size = 100, isAnalyzing = false }: { size?: number, isAnalyzing?: boolean }) {
  return (
    <div className="relative" style={{ width: size, height: size, perspective: '1000px' }}>
      <style>{`
        @keyframes spin-cube {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }
        @keyframes spin-cube-fast {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(720deg) rotateY(720deg) rotateZ(720deg); }
        }
        .cube-container {
          width: 100%;
          height: 100%;
          position: absolute;
          transform-style: preserve-3d;
          animation: ${isAnalyzing ? 'spin-cube-fast 2s linear infinite' : 'spin-cube 15s linear infinite'};
        }
        .cube-face {
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: rgba(0, 242, 254, 0.1);
          border: 2px solid rgba(0, 242, 254, 0.8);
          box-shadow: 0 0 15px rgba(0, 242, 254, 0.5), inset 0 0 15px rgba(0, 242, 254, 0.5);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 2px;
          padding: 2px;
        }
        .cube-face > div {
          background: rgba(0, 242, 254, 0.2);
          border: 1px solid rgba(0, 242, 254, 0.5);
        }
        .front  { transform: translateZ(${size/2}px); }
        .back   { transform: rotateY(180deg) translateZ(${size/2}px); }
        .right  { transform: rotateY(90deg) translateZ(${size/2}px); }
        .left   { transform: rotateY(-90deg) translateZ(${size/2}px); }
        .top    { transform: rotateX(90deg) translateZ(${size/2}px); }
        .bottom { transform: rotateX(-90deg) translateZ(${size/2}px); }
      `}</style>
      
      <div className="cube-container">
        {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face) => (
          <div key={face} className={`cube-face ${face}`}>
            {[...Array(9)].map((_, i) => (
              <motion.div 
                key={i}
                animate={isAnalyzing ? {
                  opacity: [0.2, 1, 0.2],
                  backgroundColor: ['rgba(0, 242, 254, 0.2)', 'rgba(254, 9, 121, 0.5)', 'rgba(0, 242, 254, 0.2)'],
                } : {
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: isAnalyzing ? 0.5 : 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
