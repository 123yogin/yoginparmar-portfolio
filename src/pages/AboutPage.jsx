import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation/Navigation';
import About from '../components/About/About';
import Footer from '../components/Footer/Footer';
import Background from '../components/Background/Background';

const AboutPage = () => {
  return (
    <div className="App">
      <Helmet>
        <title>About Me | Yogin Parmar - AI Developer & Full Stack Engineer</title>
        <meta name="description" content="Learn about Yogin Parmar, a Junior AI Developer and Full Stack Engineer based in Gandhinagar, Gujarat. Specializing in AI agents, machine learning, and full-stack development." />
        <meta name="keywords" content="About Yogin Parmar, AI Developer, Full Stack Developer, Machine Learning Engineer, Portfolio, Gandhinagar, Gujarat" />
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

