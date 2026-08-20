import hero from './assets/hero.mp4';
import logo from './assets/logo.jpeg';
import project from './assets/project.mp4';
import { SiFacebook, SiTiktok, SiInstagram } from '@icons-pack/react-simple-icons';
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from './components/ui/accordion';
import { Section } from './Section';
import { Form } from './Form';
import { ButtonGroup } from './components/ui/button-group';
import { Button, buttonVariants } from './components/ui/button';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

function HeaderInternal({ className }: {
  className?: string,
}) {
  return <>
    <ButtonGroup className={`border font-geist ${className}`}>
      <a data-slot="button" className={buttonVariants()} href="#projects">Projects</a>
      <a data-slot="button" className={buttonVariants()} href="#faqs">FAQs</a>
      <a data-slot="button" className={buttonVariants()} href="#request-a-project">Request a project</a>
    </ButtonGroup>

    <div className={`flex gap-5 ${className}`}>
      <SiTiktok className='w-4' />
      <SiInstagram className='w-4' />
      <SiFacebook className='w-4' />
    </div>
  </>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="fixed w-full top-0 z-50">
    <div className="bg-black flex items-center justify-between px-2 md:px-20 h-16">
      <a href='#'>
        <img src={logo} className="rounded-full w-14" />
      </a>

      <HeaderInternal className="hidden sm:flex" />

      <Button
        className="sm:hidden"
        onClick={() => setOpen(prev => !prev)}
      >
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {open ? <X /> : <Menu />}
        </motion.div>
      </Button>
    </div>
    <AnimatePresence>
      {open &&
        <motion.div className="sm:hidden bg-black overflow-hidden" initial={{ height: 0 }} animate={{ height: "auto" }} transition={{ duration: 0.2 }} exit={{ height: 0 }}>
          <div className='flex p-2 items-center justify-between'>
            <HeaderInternal />
          </div>
        </motion.div>
      }
    </AnimatePresence>

  </header>;
}

function Hero() {
  return <div className="relative flex h-[calc(100svh-4rem)] min-h-0 px-3 py-2 mt-16">
    <video
      src={hero}
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full rounded-[1rem] object-cover brightness-60"
    />

    <div className="absolute inset-10 md:inset-20 flex items-center grid md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <h1 className='text-[80px]/[0.75] md:text-[128px]/[0.75]'>
          Video & Motion Designer
        </h1>
        <h4 className='font-geist'>
          Crafting premium motion experiences for brands and studios. From concept to delivery - clean, modern, and polished.
        </h4>
        <h3>
          <span className="font-geist">—</span> BYMIKE
        </h3>
      </div>
    </div>
  </div>;
}

function CardProject({ src, title, variants }: {
  src: string,
  title: string,
  variants: Variants,
}) {
  return (
    <motion.div
      variants={variants}
      className='
            max-w-[300px]
            max-h-[400px]
            overflow-hidden
            rounded-[1rem]
            shadow-[0_0_5px_2px_rgba(255,255,255,0.1)]'>
      <p className='font-semibold text-sm px-4 py-2'>
        {title}
      </p>
      <video src={src}
        autoPlay
        muted
        loop
        playsInline
        className='w-full h-full object-fit'
      />
    </motion.div>
  );
}


const FAQ_ITEMS = [
  {
    title: 'Experience',
    content: 'Full-stack development',
  }
];

function Projects() {
  const container = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3
      }
    }
  };

  const item = {
    hidden: {
      opacity: 0,
      x: -50
    },
    visible: {
      opacity: 1,
      x: 0,
    }
  };

  return (
    <Section id='projects' title='Recent Work' subtitle='A curated selection of our latest design and development projects, showcasing our expertise in modern digital experiences.'>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{once: true}}
        className='flex flex-wrap justify-center gap-5 md:-mx-50'>
        <CardProject variants={item} src={project} title='Project Name 1' />
        <CardProject variants={item} src={project} title='Project Name 1' />
        <CardProject variants={item} src={project} title='Project Name 1' />
        <CardProject variants={item} src={project} title='Project Name 1' />
        <CardProject variants={item} src={project} title='Project Name 1' />
        <CardProject variants={item} src={project} title='Project Name 1' />
      </motion.div>
    </Section>
  );
}

function FAQs() {
  return (
    <Section id='faqs' title='Preguntas Frecuentes' subtitle="Ready to discuss your next project? Fill out the form below and we'll get back to you within 24 hours.">
      <Accordion>
        {
          FAQ_ITEMS.map((item, i, _) => (
            <AccordionItem key={i} value={i}>
              <AccordionTrigger>
                {item.title}
              </AccordionTrigger>

              <AccordionContent>
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))
        }
      </Accordion>
    </Section>
  );
}

function App() {
  return (
    <>
      <Header />
      <Hero />
      <Projects />
      <FAQs />
      <Form />
    </>
  )
}

export default App
