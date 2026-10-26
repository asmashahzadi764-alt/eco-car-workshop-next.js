import { Poppins } from "next/font/google";
import "./globals.css";
import { business as b } from "@/lib/data";
const f = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--f" });
export const metadata = { title: "Eco Car Workshop Multan | Car Repair, Tuning & AC Service", description: b.tagline };
export default function Layout({ children }: { children: React.ReactNode }) {
  const ld = {
    "@context": "https://schema.org", "@type": "AutoRepair", name: b.name, telephone: b.phone,
    address: { "@type": "PostalAddress", streetAddress: "Chowk Kumharanwala Level-1 Flyover, T Block, New Multan Colony", addressLocality: "Multan", postalCode: "60000", addressCountry: "PK" },
    geo: { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lng },
    aggregateRating: { "@type": "AggregateRating", ratingValue: b.rating, reviewCount: b.count },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"], opens: "10:00", closes: "21:30" }],
  };
  return (<html lang="en"><body className={f.variable}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    {children}</body></html>);
}
