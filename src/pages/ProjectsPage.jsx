import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation/Navigation';
import Projects from '../components/Projects/Projects';
import Footer from '../components/Footer/Footer';
import Background from '../components/Background/Background';

const ProjectsPage = () => {
  return (
    <div className="App">
      <Helmet>
        <title>Projects | Yogin Parmar - AI Developer & Full Stack Engineer</title>
        <meta name="description" content="Explore 37+ innovative projects by Yogin Parmar including IntelliHire Platform, Fake News Detection System, healthcare ML systems, and more AI/ML and full-stack applications." />
        <meta name="keywords" content="Projects, Portfolio, AI Projects, Machine Learning Projects, Full Stack Projects, Web Development, Yogin Parmar" />
        <link rel="canonical" href="https://yoginparmar.dev/projects" />
      </Helmet>
      <Background />
      <Navigation />
      <main id="main-content" style={{ paddingTop: '95px' }}>
        <Projects />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;

