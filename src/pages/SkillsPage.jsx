import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation/Navigation';
import Skills from '../components/Skills/Skills';
import Footer from '../components/Footer/Footer';
import Background from '../components/Background/Background';

const SkillsPage = () => {
  return (
    <div className="App">
      <Helmet>
        <title>Skills & Technologies | Yogin Parmar - AI Developer & Full Stack Engineer</title>
        <meta name="description" content="Technical skills and technologies mastered by Yogin Parmar including Python, React, Flask, Machine Learning, AI, Computer Vision, NLP, and more." />
        <meta name="keywords" content="Skills, Technologies, Python, React, Flask, Machine Learning, AI, Computer Vision, NLP, Full Stack Development, Yogin Parmar" />
        <link rel="canonical" href="https://yoginparmar.dev/skills" />
      </Helmet>
      <Background />
      <Navigation />
      <main id="main-content" style={{ paddingTop: '95px' }}>
        <Skills />
      </main>
      <Footer />
    </div>
  );
};

export default SkillsPage;

