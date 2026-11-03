import { LunoShell } from "@/components/luno-shell";

export default function ContactPage() {
  return <LunoShell eyebrow="WE'RE HERE TO HELP" title="Contact LUNO.">
    <div className="mt-10 max-w-2xl border border-[#0b1830]/10 bg-[#fffdf8] p-8">
      <p className="leading-7 text-[#40506b]">For product, order and delivery support, message us directly on WhatsApp.</p>
      <a href="https://wa.me/8801868589120" target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-3 bg-[#25D366] px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#1eae55]">
        <svg aria-hidden="true" viewBox="0 0 32 32" className="h-6 w-6 fill-current"><path d="M16 3a13 13 0 0 0-11.1 19.8L3 29l6.4-1.7A13 13 0 1 0 16 3Zm0 23.7c-2 0-4-.6-5.7-1.7l-.4-.2-3.8 1 1-3.7-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.1-1.8-.9-2.1-1s-.5-.1-.7.2-.8 1-.9 1.2-.3.2-.6.1a8.7 8.7 0 0 1-2.5-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-1-2.3c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4s-1 1-1 1.8 1 1.8 1.1 1.9c.1.3 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4Z" /></svg>
        CHAT ON WHATSAPP
      </a>
      <p className="mt-5 text-sm font-semibold text-[#40506b]">WhatsApp: 01868589120</p>
      <p className="mt-6 text-sm font-bold tracking-[.12em] text-[#b38b45]">DHAKA, BANGLADESH</p>
    </div>
  </LunoShell>;
}
