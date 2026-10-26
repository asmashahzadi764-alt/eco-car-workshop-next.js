"use client";
import { useEffect, useRef, useState, ReactNode } from "react";
type B = { name: string; tagline: string; phone: string; whatsapp: string; address: string; rating: number; count: number; hours: string; lat: number; lng: number; mapsUrl: string; services: { t: string; d: string; i: string }[]; reviews: { n: string; t: string; ago: string }[] };
function R({ children }: { children: ReactNode }) {
  const r = useRef<HTMLDivElement>(null); const [v, s] = useState(false);
  useEffect(() => { const o = new IntersectionObserver(([e]) => e.isIntersecting && s(true), { threshold: 0.15 }); if (r.current) o.observe(r.current); return () => o.disconnect(); }, []);
  return <div ref={r} className={"rv" + (v ? " in" : "")}>{children}</div>;
}
export default function Home() {
  const [b, setB] = useState<B | null>(null); const [date, setDate] = useState(""); const [ph, setPh] = useState("");
  useEffect(() => { fetch("/api/business").then((r) => r.json()).then(setB); }, []);
  if (!b) return <main className="w" style={{ padding: 120 }}>Loading…</main>;
  const book = () => window.open(`https://wa.me/${b.whatsapp}?text=${encodeURIComponent(`Booking request for ${date}. My number: ${ph}`)}`);
  const d = 0.006, e = 0.004;
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${b.lng - d}%2C${b.lat - e}%2C${b.lng + d}%2C${b.lat + e}&layer=mapnik&marker=${b.lat}%2C${b.lng}`;
  const tick = [...b.services, ...b.services].map((x) => x.t);
  return (<main>
    <nav><b>🔧 {b.name}</b><div>{["services", "team", "booking", "gallery", "reviews", "location"].map((x) => <a key={x} className="x" href={"#" + x}>{x}</a>)}</div></nav>
    <header className="hero"><div className="w"><h1>Professional repair of your car.</h1><p>{b.tagline}. Honest diagnosis, fair prices.</p>
      <a className="btn" href="#services">Check our services</a><a className="btn l" href={"tel:" + b.phone}>Call {b.phone}</a></div>
      <div className="badge"><b>{b.rating} ★</b>{b.count} Google reviews</div></header>
    <div className="mq"><div>{tick.map((t, i) => <span key={i}>{t} •</span>)}</div></div>
    <section><div className="w g"><R><h2>Why trust Eco Car Workshop?</h2></R><R><ul className="why"><li>Honest guidance, no unnecessary work</li><li>JDM and all EFI cars</li><li>Fair, economical rates</li><li>{b.rating} stars from {b.count} reviews</li></ul></R></div></section>
    <section id="services" style={{ background: "#0d0d0d" }}><div className="w"><R><h2>Our services</h2><p className="s">Everything your car needs under one roof</p></R>
      <div className="g">{b.services.map((x) => <R key={x.t}><div className="card"><div className="ic">{x.i}</div><h3>{x.t}</h3><p>{x.d}</p></div></R>)}</div></div></section>
    <section id="team"><div className="w"><R><div className="team"><img src="/images/owner.jpg" alt="Junaid, Eco Car Workshop" /><div><h2>Meet Junaid</h2><p className="s">Owner &amp; lead mechanic</p><p>Customers praise his honest advice and accurate diagnosis. He even goes with you to buy the right spare parts.</p><br /><a className="btn" href={"tel:" + b.phone}>Contact us</a></div></div></R></div></section>
    <section id="booking" className="book"><div className="w"><R><h2>Booking a visit</h2><p>Problem with your car? Book on WhatsApp.</p>
      <div className="f"><input type="date" value={date} onChange={(x) => setDate(x.target.value)} /><input placeholder="Phone number" value={ph} onChange={(x) => setPh(x.target.value)} /><button className="btn l" onClick={book}>Booking</button></div></R></div></section>
    <section id="gallery"><div className="w"><R><h2>Gallery</h2><p className="s">Work in progress at our workshop</p></R>
      <div className="gal">{[1, 2, 3, 4].map((n) => <R key={n}><div><img src={`/images/gallery-${n}.jpg`} alt={`Workshop ${n}`} /></div></R>)}</div></div></section>
    <section id="reviews" style={{ background: "#0d0d0d" }}><div className="w"><R><h2>What customers say</h2><p className="s">{b.rating} ★ from {b.count} Google reviews</p></R>
      <div className="g">{b.reviews.map((r) => <R key={r.n}><div className="card"><p>“{r.t}”</p><br /><b>{r.n}</b> <small style={{ color: "#999" }}>· ★★★★★ · {r.ago}</small></div></R>)}</div></div></section>
    <section id="location" style={{ padding: 0 }}><div className="map"><iframe src={map} title="Eco Car Workshop location" loading="lazy" />
      <div className="info"><b>{b.name}</b><p>{b.address}</p><p>{b.hours}</p><br /><a className="btn" href={b.mapsUrl} target="_blank">Get directions</a></div></div></section>
    <footer><div className="w"><div><b>🔧 {b.name}</b><p>{b.address}</p></div><div><p>📞 {b.phone}</p><p>🕒 {b.hours}</p></div></div></footer>
  </main>);
}
