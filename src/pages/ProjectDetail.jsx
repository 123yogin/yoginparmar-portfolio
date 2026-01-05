import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Github, ExternalLink, Calendar, Code, Target, Zap, Shield, TrendingUp } from 'lucide-react';
import projectsData from '../data/projects.json';
import Navigation from '../components/Navigation/Navigation';
import Footer from '../components/Footer/Footer';
import Background from '../components/Background/Background';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = projectsData.find(p => p.id === slug);

  if (!project) {
    return (
      <div className="App">
        <Navigation />
        <main className="project-not-found">
          <div className="container">
            <h1>Project Not Found</h1>
            <p>The project you're looking for doesn't exist.</p>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'production': return '#10b981';
      case 'complete': return '#3b82f6';
      case 'in-progress': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const metaDescription = `${project.description} Built with ${project.technologies.slice(0, 3).join(', ')}. ${project.problemStatement ? project.problemStatement.substring(0, 100) + '...' : ''}`;
  const metaKeywords = `${project.title}, ${project.categories.join(', ')}, ${project.technologies.join(', ')}, Portfolio, Yogin Parmar`;

  return (
    <div className="App">
      <Helmet>
        <title>{project.title} | Yogin Parmar - Portfolio</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta property="og:title" content={`${project.title} | Yogin Parmar`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://yoginparmar.dev/projects/${project.id}`} />
        <meta property="og:image" content="https://yoginparmar.dev/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={project.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://yoginparmar.dev/og-image.png" />
        <meta name="twitter:title" content={project.title} />
        <meta name="twitter:description" content={metaDescription} />
        <link rel="canonical" href={`https://yoginparmar.dev/projects/${project.id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": project.title,
            "description": project.description,
            "applicationCategory": "WebApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Person",
              "name": "Yogin Parmar",
              "url": "https://yoginparmar.dev"
            },
            "datePublished": project.dateCreated,
            "dateModified": project.lastUpdated,
            "url": project.links?.demo || project.links?.github || `https://yoginparmar.dev/projects/${project.id}`,
            "codeRepository": project.links?.github,
            "programmingLanguage": project.technologies,
            "keywords": project.categories.join(", "),
            "inLanguage": "en-US"
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://yoginparmar.dev"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Projects",
                "item": "https://yoginparmar.dev/#projects"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": project.title,
                "item": `https://yoginparmar.dev/projects/${project.id}`
              }
            ]
          })}
        </script>
      </Helmet>
      <Background />
      <Navigation />
      <main className="project-detail-page">
        <article className="project-article">
          <div className="container">
            <Link to="/#projects" className="back-link">
              <ArrowLeft size={20} />
              Back to Projects
            </Link>

            <header className="project-header">
              <div className="project-meta">
                <span className="project-tier">{project.tier === 'tier1' ? '⭐ Featured' : project.tier === 'tier2' ? '💪 Specialized' : '🌱 Learning'}</span>
                <span 
                  className="project-status"
                  style={{ backgroundColor: getStatusColor(project.status) }}
                >
                  {project.status === 'production' ? 'Production Ready' : 
                   project.status === 'complete' ? 'Complete' : project.status}
                </span>
              </div>
              <h1 className="project-title">{project.title}</h1>
              <p className="project-subtitle">{project.description}</p>
              
              <div className="project-actions-header">
                {project.links.github && (
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <Github size={18} />
                    View on GitHub
                  </a>
                )}
                {project.links.demo && (
                  <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    <ExternalLink size={18} />
                    Live Demo
                  </a>
                )}
              </div>
            </header>

            <div className="project-content">
              <section className="project-section">
                <h2>
                  <Target size={20} />
                  Problem Statement
                </h2>
                <p className="problem-statement">
                  {project.problemStatement || `This project addresses the challenge of ${project.description.toLowerCase()}. The solution leverages ${project.technologies.slice(0, 3).join(', ')} to deliver a production-ready application that solves real-world problems.`}
                </p>
              </section>

              <section className="project-section">
                <h2>
                  <Code size={20} />
                  Technical Architecture
                </h2>
                <div className="tech-details">
                  <div className="tech-stack-detailed">
                    <h3>Tech Stack</h3>
                    <div className="tech-pills">
                      {project.technologies.map(tech => (
                        <span key={tech} className="tech-pill">{tech}</span>
                      ))}
                    </div>
                  </div>
                  
                  {project.architecture && (
                    <div className="architecture-info">
                      <h3>Architecture Decisions</h3>
                      <p>{project.architecture}</p>
                    </div>
                  )}

                  {project.tradeOffs && (
                    <div className="trade-offs">
                      <h3>Trade-offs & Decisions</h3>
                      <ul>
                        {project.tradeOffs.map((tradeoff, idx) => (
                          <li key={idx}>{tradeoff}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              {project.achievements && project.achievements.length > 0 && (
                <section className="project-section">
                  <h2>
                    <Zap size={20} />
                    Key Achievements
                  </h2>
                  <div className="achievements-grid">
                    {project.achievements.map((achievement, idx) => (
                      <div key={idx} className="achievement-card">
                        <div className="achievement-metric">{achievement.metric}</div>
                        <div className="achievement-description">{achievement.description}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {project.longDescription && (
                <section className="project-section">
                  <h2>
                    <TrendingUp size={20} />
                    Detailed Overview
                  </h2>
                  <p className="long-description">{project.longDescription}</p>
                </section>
              )}

              {project.keySkillsDemonstrated && project.keySkillsDemonstrated.length > 0 && (
                <section className="project-section">
                  <h2>
                    <Shield size={20} />
                    Skills Demonstrated
                  </h2>
                  <ul className="skills-list">
                    {project.keySkillsDemonstrated.map((skill, idx) => (
                      <li key={idx}>{skill}</li>
                    ))}
                  </ul>
                </section>
              )}

              {project.improvements && project.improvements.length > 0 && (
                <section className="project-section">
                  <h2>Future Improvements</h2>
                  <ul className="improvements-list">
                    {project.improvements.map((improvement, idx) => (
                      <li key={idx}>{improvement}</li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="project-section">
                <h2>
                  <Calendar size={20} />
                  Project Timeline
                </h2>
                <div className="timeline-info">
                  <p><strong>Created:</strong> {new Date(project.dateCreated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  {project.lastUpdated && (
                    <p><strong>Last Updated:</strong> {new Date(project.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;

