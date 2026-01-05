import { useState, useEffect } from 'react';
import { ArrowRight, Download, Github, Linkedin, Mail, Instagram } from 'lucide-react';
import resumeFile from '../../assets/YOGIN-PARMAR-Java Resume-20251125.pdf';
import HeroVisual from './HeroVisual';
import './Hero.css';

const Hero = () => {
  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
    <section id="home" className="hero" itemScope itemType="https://schema.org/Person">
      <meta itemProp="name" content="Yogin Parmar" />
      <meta itemProp="jobTitle" content="Junior AI Developer" />
      <div className="hero-tech-pattern" aria-hidden="true"></div>
      <div className="hero-shapes" aria-hidden="true">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="hero-shape hero-shape-3"></div>
        <div className="hero-shape hero-shape-4"></div>
        <div className="hero-shape hero-shape-5"></div>
      </div>
      <div className="hero-particles" aria-hidden="true">
        <div className="hero-particle"></div>
        <div className="hero-particle"></div>
        <div className="hero-particle"></div>
        <div className="hero-particle"></div>
        <div className="hero-particle"></div>
        <div className="hero-particle"></div>
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title" itemProp="description">
            I build <span className="hero-highlight">AI-driven</span> applications that scale
          </h1>
          <p className="hero-subtitle" itemProp="knowsAbout">
            Full Stack Developer | AI/ML Engineer | Open to Opportunities
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={scrollToProjects}>
              View My Projects
              <ArrowRight size={20} />
            </button>
            <button className="btn btn-secondary" onClick={downloadResume}>
              <Download size={20} />
              Download Resume
            </button>
          </div>
          <div className="hero-social">
            <a href="https://github.com/123yogin" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github size={24} />
            </a>
            <a href="https://linkedin.com/in/yogin-parmar-15b7aa1a8" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={24} />
            </a>
            <a href="mailto:parmaryogin04@gmail.com" aria-label="Email">
              <Mail size={24} />
            </a>
            <a href="https://instagram.com/yogin_04" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={24} />
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
};

export default Hero;

