import { Download, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import resumeFile from '../../assets/YOGIN-PARMAR-Java Resume-20251125.pdf';
import Logo from '../../assets/logo.svg';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Update active section based on current route
    const pathToSection = {
      '/': 'home',
      '/about': 'about',
      '/projects': 'projects',
      '/skills': 'skills',
      '/experience': 'experience',
      '/contact': 'contact',
      '/blog': 'blog'
    };

    // Check if pathname matches a section or starts with a section path
    const currentPath = location.pathname;
    if (currentPath === '/') {
      setActiveSection('home');
    } else if (currentPath.startsWith('/projects')) {
      setActiveSection('projects');
    } else if (currentPath.startsWith('/blog')) {
      setActiveSection('blog');
    } else {
      setActiveSection(pathToSection[currentPath] || 'home');
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);


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
        <Link to="/" className="nav-logo" onClick={() => { setIsMobileMenuOpen(false); setActiveSection('home'); }}>
          <img src={Logo} alt="Yogin Parmar Logo" className="nav-logo-img" />
        </Link>

        <div className="nav-links">
          <Link 
            to="/"
            data-text="Home"
            className={location.pathname === '/' ? 'active' : ''}
            onClick={() => { setIsMobileMenuOpen(false); setActiveSection('home'); }}
            aria-label="Navigate to Home"
          >
            Home
          </Link>
          <Link 
            to="/about"
            data-text="About"
            className={location.pathname === '/about' ? 'active' : ''}
            onClick={() => { setIsMobileMenuOpen(false); setActiveSection('about'); }}
            aria-label="Navigate to About"
          >
            About
          </Link>
          <Link 
            to="/projects"
            data-text="Projects"
            className={location.pathname === '/projects' || location.pathname.startsWith('/projects/') ? 'active' : ''}
            onClick={() => { setIsMobileMenuOpen(false); setActiveSection('projects'); }}
            aria-label="Navigate to Projects"
          >
            Projects
          </Link>
          <Link 
            to="/skills"
            data-text="Skills"
            className={location.pathname === '/skills' ? 'active' : ''}
            onClick={() => { setIsMobileMenuOpen(false); setActiveSection('skills'); }}
            aria-label="Navigate to Skills"
          >
            Skills
          </Link>
          <Link 
            to="/experience"
            data-text="Experience"
            className={location.pathname === '/experience' ? 'active' : ''}
            onClick={() => { setIsMobileMenuOpen(false); setActiveSection('experience'); }}
            aria-label="Navigate to Experience"
          >
            Experience
          </Link>
          <Link 
            to="/contact"
            data-text="Contact"
            className={location.pathname === '/contact' ? 'active' : ''}
            onClick={() => { setIsMobileMenuOpen(false); setActiveSection('contact'); }}
            aria-label="Navigate to Contact"
          >
            Contact
          </Link>
          <Link 
            to="/blog"
            data-text="Blog"
            className={location.pathname === '/blog' || location.pathname.startsWith('/blog/') ? 'active' : ''}
            onClick={() => { setIsMobileMenuOpen(false); }}
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
        <Link 
          to="/"
          className={location.pathname === '/' ? 'active' : ''}
          onClick={() => { setIsMobileMenuOpen(false); setActiveSection('home'); }}
        >
          Home
        </Link>
        <Link 
          to="/about"
          className={location.pathname === '/about' ? 'active' : ''}
          onClick={() => { setIsMobileMenuOpen(false); setActiveSection('about'); }}
        >
          About
        </Link>
        <Link 
          to="/projects"
          className={location.pathname === '/projects' || location.pathname.startsWith('/projects/') ? 'active' : ''}
          onClick={() => { setIsMobileMenuOpen(false); setActiveSection('projects'); }}
        >
          Projects
        </Link>
        <Link 
          to="/skills"
          className={location.pathname === '/skills' ? 'active' : ''}
          onClick={() => { setIsMobileMenuOpen(false); setActiveSection('skills'); }}
        >
          Skills
        </Link>
        <Link 
          to="/experience"
          className={location.pathname === '/experience' ? 'active' : ''}
          onClick={() => { setIsMobileMenuOpen(false); setActiveSection('experience'); }}
        >
          Experience
        </Link>
        <Link 
          to="/contact"
          className={location.pathname === '/contact' ? 'active' : ''}
          onClick={() => { setIsMobileMenuOpen(false); setActiveSection('contact'); }}
        >
          Contact
        </Link>
        <Link 
          to="/blog"
          className={location.pathname === '/blog' || location.pathname.startsWith('/blog/') ? 'active' : ''}
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

