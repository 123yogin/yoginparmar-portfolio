import { Helmet } from 'react-helmet-async';
import Background from '../components/Background/Background';
import Footer from '../components/Footer/Footer';
import Hero from '../components/Hero/Hero';
import Navigation from '../components/Navigation/Navigation';

const Home = () => {
  return (
    <div className="App">
      <Helmet>
        <title>Yogin Parmar - Backend Engineer</title>
        <meta name="description" content="Software Developer working across Java/Spring Boot, Python/Flask, and React. 37+ projects including IntelliHire Platform, Fake News Detection System, and healthcare ML systems. Based in Gandhinagar, Gujarat, India." />
        <meta name="keywords" content="Software Developer, Full Stack Developer, Java Developer, Python Developer, React Developer, Flask Developer, AI Agents, Computer Vision, NLP, Healthcare AI, Portfolio, Yogin Parmar, Gandhinagar, Gujarat, India" />
        <link rel="canonical" href="https://yoginparmar.dev" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            "mainEntity": {
              "@type": "Person",
              "name": "Yogin Parmar",
              "jobTitle": "Software Developer",
              "url": "https://yoginparmar.dev",
              "image": "https://yoginparmar.dev/og-image.png",
              "sameAs": [
                "https://github.com/123yogin",
                "https://linkedin.com/in/yogin-parmar-15b7aa1a8",
                "https://instagram.com/yogin_04"
              ],
              "email": "parmaryogin04@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Gandhinagar",
                "addressRegion": "Gujarat",
                "addressCountry": "IN"
              }
            }
          })}
        </script>
      </Helmet>
      <a href="#home" className="skip-to-main" aria-label="Skip to main content">
        Skip to main content
      </a>
      <Background />
      <Navigation />
      <main id="main-content">
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

