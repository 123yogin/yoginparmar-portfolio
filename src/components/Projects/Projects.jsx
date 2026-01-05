import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Github, ExternalLink } from 'lucide-react';
import projectsData from '../../data/projects.json';
import './Projects.css';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const allCategories = [...new Set(projectsData.flatMap(p => p.categories))];

  const filteredProjects = useMemo(() => {
    let results = projectsData;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(project =>
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.technologies.some(tech => tech.toLowerCase().includes(term))
      );
    }

    // Tier filter
    if (selectedTier !== 'All') {
      results = results.filter(project => project.tier === selectedTier);
    }

    // Category filter
    if (selectedCategories.length > 0) {
      results = results.filter(project =>
        project.categories.some(cat => selectedCategories.includes(cat))
      );
    }

    return results;
  }, [searchTerm, selectedTier, selectedCategories]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTier('All');
    setSelectedCategories([]);
  };

  const tier1Projects = filteredProjects.filter(p => p.tier === 'tier1');
  const tier2Projects = filteredProjects.filter(p => p.tier === 'tier2');
  const tier3Projects = filteredProjects.filter(p => p.tier === 'tier3');

  return (
    <section id="projects" className="projects section">
      <div className="container">
        <h2 className="section-title">
          Projects & Portfolio
          <span className="section-underline"></span>
        </h2>
        <p className="projects-subtitle">
          37+ projects showcasing my journey from learning to production
        </p>

        <div className="projects-filters">
          <div className="search-container">
            <Search size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search projects... (name, tech, description)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-buttons">
          <div className="tier-filters">
            <span className="filter-label">Tier:</span>
            {['All', 'tier1', 'tier2', 'tier3'].map(tier => (
              <button
                key={tier}
                className={`filter-btn ${selectedTier === tier ? 'active' : ''}`}
                onClick={() => setSelectedTier(tier)}
              >
                {tier === 'All' ? 'All' : tier === 'tier1' ? 'Tier 1: Featured' : tier === 'tier2' ? 'Tier 2: Specialized' : 'Tier 3: Learning'}
              </button>
            ))}
          </div>

          <div className="category-filters">
            <span className="filter-label">Categories:</span>
            {allCategories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategories.includes(category) ? 'active' : ''}`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {(searchTerm || selectedTier !== 'All' || selectedCategories.length > 0) && (
            <button className="btn btn-tertiary clear-filters" onClick={clearFilters}>
              Clear All Filters
            </button>
          )}
        </div>

        <div className="results-count">
          Showing {filteredProjects.length} of {projectsData.length} projects
        </div>

        {tier1Projects.length > 0 && (
          <div className="tier-section">
            <h3 className="tier-title">⭐ Featured Projects ({tier1Projects.length})</h3>
            <p className="tier-subtitle">My most impactful work</p>
            <div className="projects-grid tier1-grid">
              {tier1Projects.map(project => (
                <ProjectCard key={project.id} project={project} tier="tier1" />
              ))}
            </div>
          </div>
        )}

        {tier2Projects.length > 0 && (
          <div className="tier-section">
            <h3 className="tier-title">💪 Specialized Projects ({tier2Projects.length})</h3>
            <p className="tier-subtitle">In-depth implementations</p>
            <div className="projects-grid tier2-grid">
              {tier2Projects.map(project => (
                <ProjectCard key={project.id} project={project} tier="tier2" />
              ))}
            </div>
          </div>
        )}

        {tier3Projects.length > 0 && (
          <div className="tier-section">
            <h3 className="tier-title">🌱 Learning Projects ({tier3Projects.length})</h3>
            <p className="tier-subtitle">Exploration and skill development</p>
            <div className="projects-grid tier3-grid">
              {tier3Projects.map(project => (
                <ProjectCard key={project.id} project={project} tier="tier3" />
              ))}
            </div>
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="no-results">
            <p>No projects found matching your filters.</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const ProjectCard = ({ project, tier }) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'production':
      case 'complete':
        return 'var(--color-accent-success)';
      case 'active':
        return '#007bff';
      default:
        return 'var(--color-text-tertiary)';
    }
  };

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

  if (tier === 'tier1') {
    return (
      <div className="project-card tier1-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
        <div className="card-header">
          <span className="featured-badge">🌟 FEATURED</span>
          <div className="category-tags">
            {project.categories.slice(0, 2).map(cat => (
              <span key={cat} className="category-tag">{cat}</span>
            ))}
          </div>
        </div>
        <h4 className="project-title">{project.title}</h4>
        <div className="card-divider"></div>
        <p className="project-description">{project.description}</p>
        {project.achievements && (
          <div className="achievements">
            <strong>Key Achievements:</strong>
            <ul>
              {project.achievements.map((achievement, idx) => (
                <li key={idx}>
                  ✓ {achievement.metric} {achievement.description}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="tech-stack">
          <strong>Tech Stack:</strong>
          <div className="tech-pills">
            {project.technologies.slice(0, 6).map(tech => (
              <span key={tech} className="tech-pill">{tech}</span>
            ))}
          </div>
        </div>
        <div className="project-status">
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(project.status) }}
          >
            {project.status === 'production' ? 'Production Ready' : 
             project.status === 'complete' ? 'Complete' : project.status}
          </span>
        </div>
        <div className="project-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={handleCardClick} 
            className="btn btn-primary"
          >
            View Details
          </button>
          {project.links.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <Github size={18} />
              GitHub
            </a>
          )}
          {project.links.demo && (
            <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <ExternalLink size={18} />
              Demo
            </a>
          )}
        </div>
      </div>
    );
  }

  if (tier === 'tier2') {
    return (
      <div className="project-card tier2-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
        <div className="card-header">
          <span className="category-tag">{project.categories[0]}</span>
          <span className="difficulty-badge">{project.difficulty}</span>
        </div>
        <h4 className="project-title">{project.title}</h4>
        <div className="card-divider"></div>
        <p className="project-description">{project.description}</p>
        <div className="tech-stack">
          <div className="tech-pills">
            {project.technologies.slice(0, 4).map(tech => (
              <span key={tech} className="tech-pill">{tech}</span>
            ))}
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); handleCardClick(); }} 
          className="btn btn-tertiary"
        >
          View Details
        </button>
        {project.links.github && (
          <a 
            href={project.links.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-tertiary"
            onClick={(e) => e.stopPropagation()}
          >
            → GitHub
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="project-card tier3-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <span className="category-tag">{project.categories[0]}</span>
      <h4 className="project-title">{project.title}</h4>
      <div className="card-divider"></div>
      <p className="project-description">{project.description}</p>
      <div className="tech-pills">
        {project.technologies.slice(0, 3).map(tech => (
          <span key={tech} className="tech-pill">{tech}</span>
        ))}
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); handleCardClick(); }} 
        className="btn btn-tertiary"
      >
        View Details
      </button>
      {project.links.github && (
        <a 
          href={project.links.github} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-tertiary"
          onClick={(e) => e.stopPropagation()}
        >
          → GitHub
        </a>
      )}
    </div>
  );
};

export default Projects;

