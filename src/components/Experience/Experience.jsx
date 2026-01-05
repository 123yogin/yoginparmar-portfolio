import { useState, useEffect, useRef } from 'react';
import experienceData from '../../data/experience.json';
import './Experience.css';

const Experience = () => {
  const [expandedItems, setExpandedItems] = useState({});
  const [visibleItems, setVisibleItems] = useState({});
  const timelineRef = useRef(null);
  const itemRefs = useRef([]);

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => ({
              ...prev,
              [entry.target.dataset.id]: true
            }));
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      itemRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const getTypeIcon = (type) => {
    if (type === 'work') return '💼';
    if (type === 'education') return '🎓';
    return '📋';
  };

  const getSkillCategory = (skill) => {
    const frontend = ['React', 'JavaScript', 'HTML', 'CSS', 'Vite'];
    const backend = ['Python', 'Flask', 'Node.js', 'API'];
    const ai = ['AI Agents', 'Machine Learning', 'ML', 'AI'];
    const tools = ['Git', 'Deployment', 'Automation'];
    
    if (frontend.some(f => skill.toLowerCase().includes(f.toLowerCase()))) return 'frontend';
    if (backend.some(b => skill.toLowerCase().includes(b.toLowerCase()))) return 'backend';
    if (ai.some(a => skill.toLowerCase().includes(a.toLowerCase()))) return 'ai';
    if (tools.some(t => skill.toLowerCase().includes(t.toLowerCase()))) return 'tools';
    return 'other';
  };

  return (
    <section id="experience" className="experience section">
      <div className="container">
        <h2 className="section-title">
          Professional Journey
          <span className="section-underline"></span>
        </h2>

        <div className="timeline" ref={timelineRef}>
          {experienceData.map((item, index) => {
            const isExpanded = expandedItems[item.id];
            const isVisible = visibleItems[item.id];
            const isCurrent = item.status?.includes('Present') || item.status?.includes('Currently');
            
            return (
              <div
                key={item.id}
                ref={(el) => (itemRefs.current[index] = el)}
                data-id={item.id}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'} ${isVisible ? 'visible' : ''} ${item.type}`}
              >
                <div className={`timeline-dot ${isCurrent ? 'current' : ''}`}>
                  <span className="timeline-icon">{getTypeIcon(item.type)}</span>
                </div>
              <div className="timeline-card">
                  {isCurrent && (
                    <span className="timeline-badge current-badge">Current</span>
                  )}
                  
                <div className="timeline-header">
                    <div className="timeline-title-wrapper">
                  <h3 className="timeline-title">{item.title}</h3>
                      {item.mentor && (
                        <span className="timeline-mentor">Mentor: {item.mentor}</span>
                      )}
                    </div>
                  <span className="timeline-date">{item.duration}</span>
                </div>
                  
                <h4 className="timeline-company">{item.company}</h4>
                  <p className="timeline-location">📍 {item.location}</p>
                  
                  {item.status && (
                    <p className="timeline-status">{item.status}</p>
                  )}
                  
                <p className="timeline-description">{item.description}</p>
                  
                  {item.achievements && item.achievements.length > 0 && (
                    <div className="timeline-achievements">
                      <strong className="section-label">Key Achievements:</strong>
                      <ul className="achievements-list">
                        {item.achievements.map((achievement, idx) => (
                          <li key={idx}>
                            <span className="achievement-icon">✨</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {item.responsibilities && item.responsibilities.length > 0 && (
                    <div className="timeline-section">
                      <button
                        className="section-toggle"
                        onClick={() => toggleExpand(`${item.id}-responsibilities`)}
                        aria-expanded={expandedItems[`${item.id}-responsibilities`]}
                      >
                        <strong className="section-label">Responsibilities</strong>
                        <span className="toggle-icon">
                          {expandedItems[`${item.id}-responsibilities`] ? '▼' : '▶'}
                        </span>
                      </button>
                      {expandedItems[`${item.id}-responsibilities`] && (
                  <ul className="timeline-responsibilities">
                    {item.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                )}
                    </div>
                  )}
                  
                  {item.coursework && item.coursework.length > 0 && (
                    <div className="timeline-section">
                      <button
                        className="section-toggle"
                        onClick={() => toggleExpand(`${item.id}-coursework`)}
                        aria-expanded={expandedItems[`${item.id}-coursework`]}
                      >
                        <strong className="section-label">Coursework</strong>
                        <span className="toggle-icon">
                          {expandedItems[`${item.id}-coursework`] ? '▼' : '▶'}
                        </span>
                      </button>
                      {expandedItems[`${item.id}-coursework`] && (
                        <ul className="timeline-coursework-list">
                      {item.coursework.map((course, idx) => (
                        <li key={idx}>{course}</li>
                      ))}
                    </ul>
                      )}
                  </div>
                )}
                  
                  {item.skills && item.skills.length > 0 && (
                    <div className="timeline-skills-section">
                      <strong className="section-label">Technologies & Skills:</strong>
                  <div className="timeline-skills">
                        {item.skills.map((skill, idx) => {
                          const category = getSkillCategory(skill);
                          return (
                            <span
                              key={idx}
                              className={`skill-badge skill-${category}`}
                              title={skill}
                            >
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {item.relatedProjects && item.relatedProjects.length > 0 && (
                    <div className="timeline-projects">
                      <strong className="section-label">Related Projects:</strong>
                      <div className="projects-tags">
                        {item.relatedProjects.map((project, idx) => (
                          <a
                            key={idx}
                            href={`#projects`}
                            className="project-link"
                            onClick={(e) => {
                              e.preventDefault();
                              const projectsSection = document.getElementById('projects');
                              if (projectsSection) {
                                projectsSection.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                          >
                            {project}
                          </a>
                        ))}
                      </div>
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;

