import Image from "next/image";
import { profile } from "@/data/profile";
import { LinkButton } from "./LinkButton";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0">
        <Image
          src="/engineering-systems.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-52"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,10,18,0.98)_0%,rgba(7,10,18,0.9)_34%,rgba(7,10,18,0.56)_68%,rgba(7,10,18,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(59,130,246,0.2),transparent_34%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-5 py-24 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
          {profile.role}
        </p>
        <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">
          {profile.name}
        </h1>
        <p className="mt-5 max-w-3xl text-xl font-medium text-slate-100 sm:text-2xl">
          {profile.specialization}
        </p>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
          {profile.summary}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <LinkButton href="#featured-engineering" variant="primary">
            View Engineering Work
          </LinkButton>
          <LinkButton href={profile.github}>View GitHub</LinkButton>
          <LinkButton href={profile.linkedin}>LinkedIn</LinkButton>
          <LinkButton href={profile.resume} newTab>
            Resume
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
