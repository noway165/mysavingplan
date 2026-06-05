"use client"

import React from "react"
import Tilt from "react-parallax-tilt"

interface TiltWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltWrapper({ children, className }: TiltWrapperProps) {
  return (
    <Tilt
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      perspective={1000}
      transitionSpeed={1000}
      scale={1.02}
      gyroscope={true}
      className={className}
      glareEnable={true}
      glareMaxOpacity={0.2}
      glareColor="rgba(var(--color-primary), 0.5)"
      glarePosition="all"
      glareBorderRadius="2rem"
    >
      {children}
    </Tilt>
  )
}
