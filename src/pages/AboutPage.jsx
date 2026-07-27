import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation/Navigation';
import About from '../components/About/About';
import Footer from '../components/Footer/Footer';
import Background from '../components/Background/Background';

const AboutPage = () => {
  return (
    <div className="App">
      <Helmet>
        <title>About Me | Yogin Parmar - Backend Engineer</title>
        <meta name="description" content="Learn about Yogin Parmar, a Software Developer based in Gandhinagar, Gujarat. Working across Java/Spring Boot, Python/Flask, and React." />
        <meta name="keywords" content="About Yogin Parmar, Software Developer, Full Stack Developer, Java Developer, Portfolio, Gandhinagar, Gujarat" />
        <link rel="canonical" href="https://yoginparmar.dev/about" />
      </Helmet>
      <Background />
      <Navigation />
      <main id="main-content" style={{ paddingTop: '95px' }}>
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;

