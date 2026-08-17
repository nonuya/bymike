import hero from '@/assets/hero.mp4';
import logo from '@/assets/logo.jpeg';
import project from '@/assets/project.mp4';
import { SiFacebook, SiTiktok, SiInstagram } from '@icons-pack/react-simple-icons';
import type { ReactNode } from 'react';
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/components/ui/accordion';

function Header() {
  return <>
    <header className='flex items-center justify-between px-20 py-2 border-b'>
      <img src={logo} width={66} height={66} className='rounded-full' />
      <nav className='flex gap-6 rounded-full border px-4 py-1 bg-white/3'>
        <a>Projects</a>
        <a>FAQs</a>
        <a>Request a project</a>
      </nav>
      <div className='flex gap-5'>
        <SiTiktok />
        <SiInstagram />
        <SiFacebook />
      </div>
    </header>
  </>;
}

function Hero() {
  return <>
    <div className="relative h-screen p-3">
      <video
        src={hero}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full rounded-[1rem] object-cover brightness-60"
      />

      <div className="absolute inset-20 flex items-center grid grid-cols-2">
        <div className="flex flex-col gap-2">
          <h1>
            Video & Motion Designer
          </h1>
          <h4>
            Crafting premium motion experiences for brands and studios. From concept to delivery - clean, modern, and polished.
          </h4>
          <h3>
            <span className="font-geist">—</span> BYMIKE
          </h3>
        </div>
      </div>
    </div>
  </>;
}

function CardProject({ src, title }: {
  src: string,
  title: string
}) {
  return (
    <div className='
            card-project-size
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
        className='w-full h-full object-cover'
      />
    </div>
  );
}

function Section({ title, subtitle, children }: {
  title: string,
  subtitle: string,
  children: ReactNode
}) {
  return (
    <div className='mx-70 flex flex-col items-center gap-8 my-20'>
      <div className='flex flex-col gap-2 text-center'>
        <p className='font-bold text-3xl'>{title}</p>
        <p className='text-neutral-400 text-sm max-w-150'>
          {subtitle}
        </p>
      </div>
      {children}
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
      <div className='grid grid-cols-2 gap-5'>
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
    </>
  )
}

export default App
