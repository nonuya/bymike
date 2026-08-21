import { motion } from 'motion/react';

export function Section({ id, title, subtitle, children }: {
  id: string,
  title: string,
  subtitle: string,
  children: React.ReactNode
}) {
  const container = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
    }
  };

  return (
    <motion.div
      id={id}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className='scroll-mt-32 mx-10 md:mx-40 lg:mx-70 2xl:mx-100 flex flex-col items-center gap-8 my-20'>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className='flex flex-col gap-2 text-center'>
        <motion.p variants={item} className='font-bold text-3xl'>{title}</motion.p>
        <motion.p variants={item} className='text-neutral-400 text-sm max-w-150'>
          {subtitle}
        </motion.p>
      </motion.div>
      {children}
    </motion.div>
  );
}
