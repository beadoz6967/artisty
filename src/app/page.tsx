import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="site-shell min-h-[calc(100vh-52px)] relative overflow-hidden px-4 py-8 sm:px-5 sm:py-10 md:px-10 md:py-14">
      <div className="absolute -left-20 top-24 h-52 w-52 rounded-full bg-amber-300/10 blur-3xl animate-drift" />
      <div className="absolute -right-16 bottom-14 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl animate-drift" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="animate-rise">
          <p className="mono text-[0.56rem] tracking-[0.3em] uppercase text-white/60">Signal &amp; Smoke</p>
          <h1 className="mt-4 text-[clamp(2.4rem,7vw,6.8rem)] leading-[0.9] font-black tracking-tight text-white">
            The blur.
            <br />
            The signal.
          </h1>
          <p className="mt-5 max-w-2xl text-white/75 text-sm md:text-base">
            Anonymous Virginia cloud rap. The SMOKESHOP era, the trilogy, and everything after.
          </p>
        </header>

        <section className="mt-8 sm:mt-10 animate-fade-delayed">
          <Link
            href="/smokedope2016"
            className="group relative flex min-h-[420px] sm:min-h-[520px] overflow-hidden rounded-sm border border-white/15"
          >
            <Image
              src="/concert warehouse.jpg"
              alt="smokedope2016"
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/40 to-black/15" />
            <div className="absolute inset-0 p-6 sm:p-8 md:p-12 flex flex-col justify-end">
              <p className="mono text-[0.56rem] tracking-[0.3em] uppercase text-amber-300/90">Enter archive</p>
              <h2 className="text-[clamp(2.4rem,6vw,5rem)] leading-[0.9] font-black mt-3 text-white">smokedope2016</h2>
              <p className="max-w-lg mt-4 text-sm sm:text-base text-white/75">
                Masked. Anonymous. Virginia. From welding to a sold-out LA show in six months — the cloud rap signal that came out of nowhere.
              </p>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
