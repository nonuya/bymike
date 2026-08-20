import hero from './assets/hero.mp4';
import logo from './assets/logo.jpeg';
import project from './assets/project.mp4';
import { SiFacebook, SiTiktok, SiInstagram } from '@icons-pack/react-simple-icons';
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from './components/ui/accordion';
import { Section } from './Section';
import { Form } from './Form';
import { ButtonGroup } from './components/ui/button-group';
import { Button, buttonVariants } from './components/ui/button';
import { AnimatePresence, motion } from 'motion/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';

function HeaderInternal({ className }: {
  className?: string
}) {
  return <>
    <ButtonGroup className={`border font-geist ${className}`}>
      <a data-slot="button" className={buttonVariants()} href='#'>Projects</a>
      <a data-slot="button" className={buttonVariants()}>FAQs</a>
      <a data-slot="button" className={buttonVariants()}>Request a project</a>
    </ButtonGroup>

    <div className={`flex gap-5 ${className}`}>
      <SiTiktok className='w-4' />
      <SiInstagram className='w-4' />
      <SiFacebook className='w-4' />
    </div>
  </>;
}

const variants = {
  open: {
    height: "auto",
    opacity: 1,
  },
  closed: {
    height: 0,
    opacity: 0,
  }
}

function Header() {
  const [open, setOpen] = useState(false);
  return <motion.header className="relative bg-black sticky top-0 z-50">
    <div className="flex items-center justify-between px-5 md:px-20 h-16">
      <img src={logo} className="rounded-full w-14" />

      <HeaderInternal className="hidden sm:flex" />

      <Button
        className="sm:hidden"
        onClick={() => setOpen(prev => !prev)}
      >
        <Menu />
      </Button>
    </div>
    <motion.div
      initial={false}
      animate={{
        height: open ? "auto" : 0,
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
      }}
      transition={{
        height: { duration: 0.25 },
        opacity: { duration: 0.15 },
      }}
      className="absolute overflow-hidden bg-black w-full"
    >
      <div className="sm:hidden p-2 flex justify-between">
        <HeaderInternal />
      </div>
    </motion.div>
  </motion.header>;
}

function Hero() {
  return <div className="relative flex h-[calc(100svh-4rem)] min-h-0 px-3 py-2">
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

function CardProject({ src, title }: {
  src: string,
  title: string
}) {
  return (
    <div className='
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
    </div>
  );
}


const FAQ_ITEMS = [
  {
    title: 'Experience',
    content: 'Full-stack development',
  }
];

function Works() {
  return (
    <Section title='Recent Work' subtitle='A curated selection of our latest design and development projects, showcasing our expertise in modern digital experiences.'>
      <div className='flex flex-wrap justify-center gap-5 md:-mx-50'>
        <CardProject src={project} title='Project Name 1' />
        <CardProject src={project} title='Project Name 1' />
        <CardProject src={project} title='Project Name 1' />
        <CardProject src={project} title='Project Name 1' />
        <CardProject src={project} title='Project Name 1' />
        <CardProject src={project} title='Project Name 1' />
      </div>
    </Section>
  );
}

function FAQs() {
  return (
    <Section title='Preguntas Frecuentes' subtitle="Ready to discuss your next project? Fill out the form below and we'll get back to you within 24 hours.">
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
      <Works />
      <FAQs />
      <Form />
    </>
  )
}

export default App
