// import React, { createContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RotateCw } from 'lucide-react'

type Props = {
  // isLoading: boolean
}

export default function Spinner({}: Props) {
  return (
    <AnimatePresence>
      <motion.div
        className="spin flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        <RotateCw className="h-32 w-32 animate-spin text-sky-400" />
      </motion.div>
    </AnimatePresence>
  )
}
