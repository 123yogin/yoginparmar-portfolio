import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Download } from 'lucide-react';
import resumeFile from '../../assets/YOGIN-PARMAR-Java Resume-20251125.pdf';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ['home', 'about', 'projects', 'skills', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 150;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
      setActiveSection(id);
    }
  };

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = resumeFile;
    link.download = 'Yogin-Parmar-Resume.pdf';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={() => { if (location.pathname === '/') scrollToSection('home'); }}>
          YP
        </Link>

        <div className="nav-links">
          <a 
            href="#home" 
            className={activeSection === 'home' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
            aria-label="Navigate to Home section"
          >
            Home
          </a>
          <a 
            href="#about" 
            className={activeSection === 'about' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
            aria-label="Navigate to About section"
          >
            About
          </a>
          <a 
            href="#projects" 
            className={activeSection === 'projects' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}
            aria-label="Navigate to Projects section"
          >
            Projects
          </a>
          <a 
            href="#skills" 
            className={activeSection === 'skills' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}
            aria-label="Navigate to Skills section"
          >
            Skills
          </a>
          <a 
            href="#experience" 
            className={activeSection === 'experience' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}
            aria-label="Navigate to Experience section"
          >
            Experience
          </a>
          <a 
            href="#contact" 
            className={activeSection === 'contact' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
            aria-label="Navigate to Contact section"
          >
            Contact
          </a>
          <Link 
            to="/blog"
            className={location.pathname === '/blog' ? 'active' : ''}
            aria-label="Navigate to Blog"
          >
            Blog
          </Link>
        </div>

        <div className="nav-actions">
          <button className="btn btn-primary nav-resume" onClick={downloadResume}>
            <Download size={18} />
            Resume
          </button>
          <button 
            className="nav-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <a 
          href="#home" 
          className={activeSection === 'home' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
        >
          Home
        </a>
        <a 
          href="#about" 
          className={activeSection === 'about' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
        >
          About
        </a>
        <a 
          href="#projects" 
          className={activeSection === 'projects' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}
        >
          Projects
        </a>
        <a 
          href="#skills" 
          className={activeSection === 'skills' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}
        >
          Skills
        </a>
        <a 
          href="#experience" 
          className={activeSection === 'experience' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}
        >
          Experience
        </a>
        <a 
          href="#contact" 
          className={activeSection === 'contact' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
        >
          Contact
        </a>
        <Link 
          to="/blog"
          className={location.pathname === '/blog' ? 'active' : ''}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Blog
        </Link>
          <div className="mobile-menu-divider"></div>
          <button className="btn btn-primary" onClick={downloadResume}>
            <Download size={18} />
            Download Resume
          </button>
        </div>
    </nav>
  );
};

export default Navigation;

