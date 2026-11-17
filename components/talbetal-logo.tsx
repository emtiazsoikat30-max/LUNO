import Link from "next/link";

export function TalbetalLogo() {
  return <Link href="/" className="flex min-w-0 items-center gap-2" aria-label="TALBETAL home">
    <img src="/talbetal-logo.jpeg" alt="TALBETAL logo" className="h-11 w-11 rounded-full border border-[#0b1830]/10 bg-white object-cover" />
    <span className="text-xl font-extrabold tracking-[.12em] sm:text-2xl">TALBETAL</span>
  </Link>;
}
