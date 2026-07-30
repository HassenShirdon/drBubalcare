'use client'

import { motion, useReducedMotion, type Transition } from 'motion/react'

const defaultTransition: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
}

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-64px' }}
      transition={{ ...defaultTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
