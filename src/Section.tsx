export function Section({ title, subtitle, children }: {
  title: string,
  subtitle: string,
  children: React.ReactNode
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
