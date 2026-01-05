import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation/Navigation';
import Experience from '../components/Experience/Experience';
import Footer from '../components/Footer/Footer';
import Background from '../components/Background/Background';

const ExperiencePage = () => {
  return (
    <div className="App">
      <Helmet>
        <title>Professional Experience | Yogin Parmar - AI Developer & Full Stack Engineer</title>
        <meta name="description" content="Professional journey and work experience of Yogin Parmar, including roles at The Line Tech Solutions Limited and various AI/ML and full-stack development projects." />
        <meta name="keywords" content="Experience, Work History, Professional Journey, Career, AI Developer Experience, Full Stack Developer Experience, Yogin Parmar" />
        <link rel="canonical" href="https://yoginparmar.dev/experience" />
      </Helmet>
      <Background />
      <Navigation />
      <main id="main-content" style={{ paddingTop: '95px' }}>
        <Experience />
      </main>
      <Footer />
    </div>
  );
};

export default ExperiencePage;

