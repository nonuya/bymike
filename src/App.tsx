import hero from '@/assets/hero.mp4';

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

function App() {
  return (
    <>
      <Hero/>
    </>
  )
}

export default App
