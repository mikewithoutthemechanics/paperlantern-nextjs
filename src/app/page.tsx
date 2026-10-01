import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Work from "@/components/Work";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Scrim from "@/components/Scrim";

/**
 * Page composition.
 *
 * Layer order, bottom to top:
 *   0    WebGL lantern (fixed, behind everything)
 *   5    legibility scrim
 *   10   page content
 *   50   light spill   60  film grain
 *   100  nav   110  scroll progress   120  cursor   130  preloader
 */
export default function Page() {
  return (
    <>
      <Nav />
      <Scrim />

      <main className="relative z-10">
        <Hero />
        <Manifesto />
        <Work />
        <Process />
        <Contact />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
