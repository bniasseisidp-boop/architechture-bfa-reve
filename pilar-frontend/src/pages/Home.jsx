import { Toaster } from 'react-hot-toast';
import Navbar        from '../components/public/Navbar';
import Hero          from '../components/public/Hero';
import About         from '../components/public/About';
import Services      from '../components/public/Services';
import Realizations  from '../components/public/Realizations';
import Founder       from '../components/public/Founder';
import Team          from '../components/public/Team';
import Devis         from '../components/public/Devis';
import Contact       from '../components/public/Contact';
import Footer        from '../components/public/Footer';

export default function Home() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'var(--font-body)', fontSize: '0.9rem' } }} />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Realizations />
        <Founder />
        <Team />
        <Devis />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
