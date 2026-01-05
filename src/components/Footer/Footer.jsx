import { Download, Github, Instagram, Linkedin, Mail } from 'lucide-react';
import resumeFile from '../../assets/YOGIN-PARMAR-Java Resume-20251125.pdf';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section footer-about">
            <h3 className="footer-title">Yogin Parmar</h3>
            <p className="footer-description">
              Junior AI Developer building intelligent applications with AI agents, 
              full-stack development, and machine learning.
            </p>
            <p className="footer-location">📍 Gandhinagar, Gujarat, India</p>
          </div>
          
          <div className="footer-section footer-links-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <nav className="footer-links" aria-label="Footer navigation">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
              <a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}>Skills</a>
            <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>Projects</a>
              <a href="#experience" onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}>Experience</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
            </nav>
          </div>
          
          <div className="footer-section footer-resume">
            <h4 className="footer-subtitle">Resume</h4>
            <button 
              className="footer-resume-btn" 
              onClick={downloadResume}
              aria-label="Download Resume PDF"
            >
              <Download size={18} />
              Download Resume
            </button>
          </div>
          
          <div className="footer-section footer-social-section">
            <h4 className="footer-subtitle">Connect</h4>
            <div className="footer-social" aria-label="Social media links">
              <a 
                href="https://github.com/123yogin" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Visit GitHub profile"
                title="GitHub"
              >
              <Github size={20} />
                <span>GitHub</span>
            </a>
              <a 
                href="https://linkedin.com/in/yogin-parmar-15b7aa1a8" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Visit LinkedIn profile"
                title="LinkedIn"
              >
              <Linkedin size={20} />
                <span>LinkedIn</span>
            </a>
              <a 
                href="mailto:parmaryogin04@gmail.com" 
                aria-label="Send email"
                title="Email"
              >
              <Mail size={20} />
                <span>Email</span>
              </a>
              <a 
                href="https://instagram.com/yogin_04" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Visit Instagram profile"
                title="Instagram"
              >
                <Instagram size={20} />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>
              © {currentYear} Yogin Parmar. All rights reserved.
            </p>
          </div>
          <div className="footer-meta">
            <p className="footer-stats">37+ Projects | 6 Months Experience | Open to Opportunities</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

