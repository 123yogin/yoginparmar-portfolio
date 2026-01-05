import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation/Navigation';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';
import Background from '../components/Background/Background';

const ContactPage = () => {
  return (
    <div className="App">
      <Helmet>
        <title>Contact Me | Yogin Parmar - AI Developer & Full Stack Engineer</title>
        <meta name="description" content="Get in touch with Yogin Parmar for AI/ML projects, full-stack development opportunities, collaborations, or inquiries. Based in Gandhinagar, Gujarat, India." />
        <meta name="keywords" content="Contact, Get in Touch, Hire AI Developer, Collaboration, Yogin Parmar, Email, LinkedIn, GitHub" />
        <link rel="canonical" href="https://yoginparmar.dev/contact" />
      </Helmet>
      <Background />
      <Navigation />
      <main id="main-content" style={{ paddingTop: '95px' }}>
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;

