"use client";
import React from 'react';
import { motion, Variants } from 'framer-motion';

const BeautifulBackground: React.FC = () => {
  const blobVariants: Variants = {
    initial: {
      scale: 0.8,
      opacity: 0.4,
    },
    animate: {
      scale: [0.8, 1.2, 0.9],
      opacity: [0.4, 0.6, 0.5],
      x: [-20, 20, -15], // Float horizontally
      y: [-15, 25, -10], // Float vertically
      transition: {
        duration: 5,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Accent Blob */}
      <motion.div
        className="absolute top-[10%] left-[20%] w-40 h-40 rounded-full bg-accent/60 blur-3xl"
        variants={blobVariants}
        initial="initial"
        animate="animate"
        transition={{
          x: { duration: 7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
          y: { duration: 6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
        }}
      />

      {/* Primary Blob */}
      <motion.div
        className="absolute bottom-[12.5%] right-[16.666%] w-72 h-72 rounded-full bg-primary/50 blur-[64px]"
        variants={blobVariants}
        initial="initial"
        animate="animate"
        transition={{
          x: { duration: 12, ease: 'linear' },
          y: { duration: 7, ease: 'easeOut' },
          delay: 1,
        }}
      />

      {/* Secondary Blob */}
      <motion.div
        className="absolute top-[33.333%] left-[33.333%] w-56 h-56 rounded-full bg-secondary/40 blur-2xl"
        variants={blobVariants}
        initial="initial"
        animate="animate"
        transition={{
          x: { duration: 9, ease: 'easeIn' },
          y: { duration: 5 },
          delay: 2,
        }}
      />

      {/* Additional Decorative Blobs */}
      <motion.div
        className="absolute top-[20%] right-[12.5%] w-32 h-32 rounded-full bg-emerald-500/30 blur-xl"
        variants={blobVariants}
        initial="initial"
        animate="animate"
        transition={{
          x: { duration: 6, ease: 'anticipate' },
          y: { duration: 9, ease: 'circOut' },
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[12.5%] w-24 h-24 rounded-full bg-purple-500/20 blur-lg"
        variants={blobVariants}
        initial="initial"
        animate="animate"
        transition={{
          x: { duration: 11 },
          y: { duration: 4, ease: 'spring' },
          delay: 1.5,
        }}
      />
    </div>
  );
};

export default BeautifulBackground;