"use client";
import { useEffect, useRef, useState, ReactNode, ChangeEvent, FormEvent } from "react";
import { Snowflake, Wrench, Cog, Gauge, Zap, Droplets, Phone, Clock, MapPin, MessageCircle, CheckCircle2, ShieldCheck, Car, Wallet } from "lucide-react";
type B = { name: string; tagline: string; phone: string; whatsapp: string; address: string; rating: number; count: number; hours: string; lat: number; lng: number; mapsUrl: string; services: { t: string; d: string }[]; reviews: { n: string; t: string; ago: string }[] };
const REVIEW_MS = 4000; // change this to speed up / slow down the review slider
const IC: Record<string, typeof Wrench> = { "AC Service": Snowflake, Suspension: Wrench, "Engine Tuning": Cog, Diagnostics: Gauge, "Turbo Install": Zap, "Oil Change": Droplets };
const WHY = [
  { I: ShieldCheck, t: "Honest guidance", d: "We tell you what your car needs, and nothing extra." },
  { I: Car, t: "JDM and EFI specialists", d: "Accurate diagnosis for Japanese imports and western cars." },
  { I: Wallet, t: "Fair, economical rates", d: "Customers say our prices are very economical." },
  { I: MessageCircle, t: "Clear updates", d: "You are kept informed at every step of the repair." },
];
const tel = (p: string) => "tel:" + p.replace(/\s/g, "");
function R({ children }: { children: ReactNode }) {
  const r = useRef<HTMLDivElement>(null); const [v, s] = useState(false);
  useEffect(() => { const o = new IntersectionObserver(([e]) => e.isIntersecting && s(true), { threshold: 0.15 }); if (r.current) o.observe(r.current); return () => o.disconnect(); }, []);
  return <div ref={r} className={"rv" + (v ? " in" : "")}>{children}</div>;
}
function Logo({ name }: { name: string }) { return <a href="#" className="logo"><span className="lm" role="img" aria-label="Eco Car Workshop logo" />{name}</a>; }
function Reviews({ items }: { items: B["reviews"] }) {
  const [i, setI] = useState(0); const [p, setP] = useState(false);
  useEffect(() => { if (p) return; const t = setInterval(() => setI((x) => (x + 1) % items.length), REVIEW_MS); return () => clearInterval(t); }, [p, items.length]);
  const r = items[i];
  return (<div className="rc" onMouseEnter={() => setP(true)} onMouseLeave={() => setP(false)}>
    <div key={i} className="rslide"><div className="st" aria-label="5 stars">★★★★★</div><blockquote>“{r.t}”</blockquote>
      <div className="who"><span className="av">{r.n[0].toUpperCase()}</span><div><b>{r.n}</b><small>{r.ago}</small></div></div></div>
    <div className="dots">{items.map((_, k) => <button key={k} aria-label={`Show review ${k + 1}`} className={k === i ? "on" : ""} onClick={() => setI(k)} />)}</div></div>);
}
function Booking({ b }: { b: B }) {
  const empty = { name: "", phone: "", car: "", service: "", date: "", time: "", note: "" };
  const [f, setF] = useState(empty); const [er, setEr] = useState<Record<string, string>>({}); const [done, setDone] = useState(false);
  const set = (k: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const today = new Date().toISOString().split("T")[0];
  const submit = (e: FormEvent) => {
    e.preventDefault(); const x: Record<string, string> = {};
    if (f.name.trim().length < 2) x.name = "Enter your name";
    if (!/^(\+92|92|0)?3\d{9}$/.test(f.phone.replace(/[\s-]/g, ""))) x.phone = "Enter a valid mobile number, e.g. 0322 9028321";
    if (!f.car.trim()) x.car = "Enter your car make and model";
    if (!f.service) x.service = "Choose a service";
    if (!f.date) x.date = "Pick a date"; else if (f.date < today) x.date = "Date cannot be in the past"; else if (new Date(f.date + "T00:00").getDay() === 5) x.date = "We are closed on Fridays";
    if (!f.time) x.time = "Pick a time"; else if (f.time < "10:00" || f.time > "21:00") x.time = "We are open 10:00 AM – 9:30 PM";
    setEr(x); if (Object.keys(x).length) return;
    const msg = `Booking request\nName: ${f.name}\nPhone: ${f.phone}\nCar: ${f.car}\nService: ${f.service}\nDate: ${f.date}\nTime: ${f.time}${f.note ? `\nNote: ${f.note}` : ""}`;
    window.open(`https://wa.me/${b.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank"); setDone(true);
  };
  const F = ({ k, label, children }: { k: string; label: string; children: ReactNode }) => <div className="fld"><label htmlFor={k}>{label}</label>{children}{er[k] && <span className="er" role="alert">{er[k]}</span>}</div>;
  return (<div className="bk">
    <div><h2>Booking a visit</h2><p>Problem with your car? Tell us what it needs and pick a time. We confirm on WhatsApp.</p>
      <p className="ro"><Clock size={18} />{b.hours}</p><p className="ro"><Phone size={18} /><a href={tel(b.phone)}>{b.phone}</a></p>
      <p className="ro"><MessageCircle size={18} /><a href={`https://wa.me/${b.whatsapp}`} target="_blank" rel="noreferrer">Chat on WhatsApp</a></p></div>
    {done ? (<div className="ok"><CheckCircle2 size={44} /><h3>Request ready</h3><p>WhatsApp has opened with your details for {f.date} at {f.time}. Press send there to confirm your booking.</p>
      <button className="btn l" onClick={() => { setF(empty); setDone(false); }}>Book another visit</button></div>) : (
      <form onSubmit={submit} noValidate><div className="fg">
        <F k="name" label="Your name"><input id="name" value={f.name} onChange={set("name")} autoComplete="name" /></F>
        <F k="phone" label="Phone number"><input id="phone" type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" placeholder="0322 9028321" /></F>
        <F k="car" label="Car make & model"><input id="car" value={f.car} onChange={set("car")} placeholder="Toyota Vitz 2017" /></F>
        <F k="service" label="Service"><select id="service" value={f.service} onChange={set("service")}><option value="">Select a service</option>{b.services.map((s) => <option key={s.t}>{s.t}</option>)}<option>Other / not sure</option></select></F>
        <F k="date" label="Date"><input id="date" type="date" min={today} value={f.date} onChange={set("date")} /></F>
        <F k="time" label="Time"><input id="time" type="time" min="10:00" max="21:00" value={f.time} onChange={set("time")} /></F>
      </div><div className="fld"><label htmlFor="note">Describe the problem (optional)</label><textarea id="note" rows={3} value={f.note} onChange={set("note")} /></div>
      <button className="btn" type="submit">Send booking on WhatsApp</button></form>)}
  </div>);
}
export default function Home() {
  const [b, setB] = useState<B | null>(null);
  useEffect(() => { fetch("/api/business").then((r) => r.json()).then(setB); }, []);
  if (!b) return <main className="w" style={{ padding: 120 }}>Loading…</main>;
  const d = 0.006, e = 0.004;
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${b.lng - d}%2C${b.lat - e}%2C${b.lng + d}%2C${b.lat + e}&layer=mapnik&marker=${b.lat}%2C${b.lng}`;
  const tick = [...b.services, ...b.services].map((x) => x.t);
  return (<main>
    <nav><div className="w"><Logo name={b.name} /><div>{["services", "team", "booking", "gallery", "reviews", "location"].map((x) => <a key={x} className="x" href={"#" + x}>{x}</a>)}<a className="btn call" href={tel(b.phone)}>Call</a></div></div></nav>
    <header className="hero"><div className="w"><h1>Professional repair of your car.</h1><p>{b.tagline}. Clear updates and fair prices on every job.</p>
      <a className="btn" href="#services">Check our services</a><a className="btn l" href={tel(b.phone)}>Call {b.phone}</a></div>
      <div className="badge"><b>{b.rating} ★</b>{b.count} Google reviews</div></header>
    <div className="mq" aria-hidden="true"><div>{tick.map((t, i) => <span key={i}>{t} •</span>)}</div></div>
    <section><div className="w why2"><R><h2>Why trust Eco Car Workshop?</h2><p className="s">Real reviews, real results</p><div className="stats"><div><b>{b.rating} ★</b><span>Google rating</span></div><div><b>{b.count}</b><span>Customer reviews</span></div></div></R>
      <div className="fl">{WHY.map(({ I, t, d }) => <R key={t}><div className="fi"><div className="ic"><I size={24} strokeWidth={1.75} /></div><div><h3>{t}</h3><p>{d}</p></div></div></R>)}</div></div></section>
    <section id="services" className="alt"><div className="w"><R><h2>Our services</h2><p className="s">Everything your car needs under one roof</p></R>
      <div className="g">{b.services.map((x) => { const I = IC[x.t] || Wrench; return <R key={x.t}><div className="card"><div className="ic"><I size={26} strokeWidth={1.75} /></div><h3>{x.t}</h3><p>{x.d}</p></div></R>; })}</div></div></section>
    <section id="team"><div className="w"><R><div className="team"><img src="/images/owner.jpg" alt="Junaid, owner of Eco Car Workshop" /><div><h2>Meet Junaid</h2><p className="s">Owner &amp; lead mechanic</p><p style={{ marginBottom: 28 }}>Customers praise his honest advice and accurate diagnosis. He even goes with you to buy the right spare parts.</p><a className="btn" href={tel(b.phone)}>Contact us</a></div></div></R></div></section>
    <section id="booking" className="book"><div className="w"><R><Booking b={b} /></R></div></section>
    <section id="gallery"><div className="w"><R><h2>Gallery</h2><p className="s">Work in progress at our workshop</p></R>
      <div className="gal">{[1, 2, 3, 4].map((n) => <R key={n}><div><img src={`/images/gallery-${n}.jpg`} alt={`Workshop ${n}`} /></div></R>)}</div></div></section>
    <section id="reviews" className="revs"><div className="w"><R><h2 style={{ textAlign: "center" }}>What customers say</h2><p className="s" style={{ textAlign: "center" }}>{b.rating} ★ from {b.count} Google reviews</p><Reviews items={b.reviews} /></R></div></section>
    <section id="location" style={{ padding: 0 }}><div className="loc"><div className="info"><h2 style={{ fontSize: 30 }}>Visit us</h2>
      <p className="ro"><MapPin size={18} /><a href={b.mapsUrl} target="_blank" rel="noreferrer">{b.address}</a></p><p className="ro"><Clock size={18} />{b.hours}</p><p className="ro"><Phone size={18} /><a href={tel(b.phone)}>{b.phone}</a></p>
      <a className="btn" href={b.mapsUrl} target="_blank" rel="noreferrer">Get directions</a></div>
      <iframe src={map} title="Eco Car Workshop location" loading="lazy" /></div></section>
    <footer><div className="w"><div><Logo name={b.name} /><p className="ro" style={{ marginTop: 10 }}><MapPin size={18} />{b.address}</p></div><div><p className="ro"><Phone size={18} /><a href={tel(b.phone)}>{b.phone}</a></p><p className="ro"><Clock size={18} />{b.hours}</p></div></div><div className="w cr"><span>© {new Date().getFullYear()} {b.name}</span><span>Built by Asma Shahzadi</span></div></footer>
  </main>);
}