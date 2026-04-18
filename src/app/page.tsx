import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="site-shell min-h-[calc(100vh-78px)] relative overflow-hidden px-4 py-8 sm:px-5 sm:py-10 md:px-10 md:py-14">
      <div className="absolute -left-20 top-24 h-52 w-52 rounded-full bg-red-500/15 blur-3xl animate-drift" />
      <div className="absolute -right-16 bottom-14 h-60 w-60 rounded-full bg-amber-300/15 blur-3xl animate-drift" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="animate-rise">
          <p className="mono text-[0.56rem] tracking-[0.3em] uppercase text-white/60">A two-world exhibition</p>
          <h1 className="mt-4 text-[clamp(2.4rem,7vw,6.8rem)] leading-[0.9] font-black tracking-tight text-white">
            Signal of justice.
            <br />
            Smoke of underground.
          </h1>
          <p className="mt-5 max-w-2xl text-white/75 text-sm md:text-base">
            One site, two opposite mythologies. Enter the courtroom noir of Daredevil or the grainy cloud-rap universe of smokedope2016.
          </p>
        </header>

        <section className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-fade-delayed">
          <Link
            href="/daredevil"
            className="group relative min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] overflow-hidden rounded-sm border border-white/15"
          >
            <Image
              src="/Suit press.webp"
              alt="Daredevil portal"
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-black/20" />
            <div className="absolute inset-0 p-5 sm:p-6 md:p-8 flex flex-col justify-end">
              <p className="mono text-[0.56rem] tracking-[0.3em] uppercase text-red-300/90">Enter archive 01</p>
              <h2 className="text-[clamp(2rem,5vw,4rem)] leading-[0.9] font-black mt-3 text-white">Daredevil</h2>
              <p className="max-w-md mt-3 text-sm text-white/75">
                Catholic guilt, legal warfare, and rooftop brutality across comics, Netflix, and Born Again.
              </p>
            </div>
          </Link>

          <Link
            href="/smokedope2016"
            className="group relative min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] overflow-hidden rounded-sm border border-white/15"
          >
            <Image
              src="/concert warehouse.jpg"
              alt="smokedope2016 portal"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-black/20" />
            <div className="absolute inset-0 p-5 sm:p-6 md:p-8 flex flex-col justify-end">
              <p className="mono text-[0.56rem] tracking-[0.3em] uppercase text-amber-300/90">Enter archive 02</p>
              <h2 className="text-[clamp(2rem,5vw,4rem)] leading-[0.9] font-black mt-3 text-white">smokedope2016</h2>
              <p className="max-w-md mt-3 text-sm text-white/75">
                Anonymous Virginia cloud rap, the SMOKESHOP era, and the rise through THE COMEUP, THE PEAK, and THE COMEDOWN.
              </p>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
