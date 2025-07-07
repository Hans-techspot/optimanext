"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export const ChatIntro: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <div className="" id='intro'>

      {/* Hero Content */}
      <motion.div 
        id="intro" 
        className="relative z-10 mt-[15vh] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-paytone tracking-tighter mb-6 bg-gradient-to-r from-primary via-accent to-secondary text-transparent bg-clip-text"
          variants={itemVariants}
        >
          Build Full Stack Web Apps 10x Faster
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-gray-600 dark:text-muted mb-10 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          Chat with AI to build web apps. No coding required.
        </motion.p>

        <motion.div 
          className="my-10 text-sm text-muted flex justify-center items-center space-x-2"
          variants={itemVariants}
        >
          <Zap className="h-4 w-4 text-blue-500" />
          <span>
            Built using <a href="https://github.com/stackblitz/bolt.new" target="_blank" rel="noopener noreferrer" className="underline text-blue-500 hover:text-blue-600">Bolt OSS</a>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChatIntro;