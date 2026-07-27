import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation/Navigation';
import Experience from '../components/Experience/Experience';
import Footer from '../components/Footer/Footer';
import Background from '../components/Background/Background';

const ExperiencePage = () => {
  return (
    <div className="App">
      <Helmet>
        <title>Professional Experience | Yogin Parmar - Backend Engineer</title>
        <meta name="description" content="Professional journey of Yogin Parmar — Associate Software Engineer at UpVision Software Services, with prior internships at The Line Tech Solutions and iTechBrains." />
        <meta name="keywords" content="Experience, Work History, Professional Journey, Career, Backend Engineer Experience, DevOps Experience, Yogin Parmar" />
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

