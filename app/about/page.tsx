import { LunoShell } from "@/components/luno-shell";

const values = [
  ["Wide Product Selection", "Explore fashion, technology and lifestyle essentials in one place."],
  ["Quality-Focused Shopping", "We select products with quality, value and everyday use in mind."],
  ["Customer Satisfaction", "Helpful support and a reliable shopping experience remain our priority."],
  ["Convenient Shopping", "Discover products you love from the comfort of your home."],
  ["Clear Product Information", "Useful details help you make confident and informed choices."],
];

export default function AboutPage() {
  return <LunoShell eyebrow="ABOUT LUNO" title="Your style. Your choice. Your LUNO.">
    <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
      <div className="max-w-2xl text-[#40506b]">
        <p className="text-lg leading-8">Welcome to <strong className="text-[#09172e]">LUNO</strong> — your destination for style, quality and everyday essentials.</p>
        <p className="mt-5 leading-8">We bring together perfumes, electronics and gadgets, men&apos;s and women&apos;s fashion, sunglasses, watches, bags, shoes and accessories in one convenient place. Our goal is simple: help you find products that match your style, suit your needs and make everyday life better.</p>
        <p className="mt-5 leading-8">Whether you are looking for a stylish outfit, a thoughtful gift, the latest gadget or the finishing touch for your look, LUNO makes it easier to explore your options.</p>
      </div>
      <aside className="border-l-4 border-[#b38b45] bg-[#fffdf8] p-7"><p className="text-xs font-bold tracking-[.16em] text-[#b38b45]">OUR COMMITMENT</p><p className="mt-4 leading-8 text-[#40506b]">We want every customer to shop with confidence through a smooth experience, clear communication and support whenever it is needed. Your trust matters, and we work to earn it through honest service and a customer-first approach.</p></aside>
    </div>
    <section className="mt-16 border-t border-[#0b1830]/10 pt-12"><p className="text-xs font-bold tracking-[.18em] text-[#b38b45]">WHY SHOP WITH LUNO</p><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{values.map(([title, text], index) => <article key={title} className="border border-[#0b1830]/10 bg-[#fffdf8] p-6"><p className="text-xs font-bold text-[#b38b45]">0{index + 1}</p><h2 className="mt-4 text-lg font-bold text-[#09172e]">{title}</h2><p className="mt-3 text-sm leading-6 text-[#40506b]">{text}</p></article>)}</div></section>
    <p className="mt-16 border-t border-[#0b1830]/10 pt-9 text-center font-serif text-3xl text-[#09172e]">Shop smart. Look good. Live better.</p>
  </LunoShell>;
}
