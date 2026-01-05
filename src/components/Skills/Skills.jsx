import { useState } from 'react';
import skillsData from '../../data/skills.json';
import './Skills.css';

const Skills = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const allCategories = ['All', ...skillsData.categories.map(cat => cat.name)];

  const getProficiencyColor = (level) => {
    switch (level) {
      case 'Expert':
        return 'var(--color-accent-cyan)';
      case 'Advanced':
        return 'var(--color-accent-amber)';
      case 'Intermediate':
        return 'var(--color-accent-purple)';
      case 'Beginner':
        return 'var(--color-text-tertiary)';
      default:
        return 'var(--color-text-tertiary)';
    }
  };

  const filteredCategories = activeFilter === 'All' 
    ? skillsData.categories 
    : skillsData.categories.filter(cat => cat.name === activeFilter);

  return (
    <section id="skills" className="skills section">
      <div className="container">
        <h2 className="section-title">
          Technical Expertise
          <span className="section-underline"></span>
        </h2>
        <p className="skills-subtitle">
          Tools and technologies I work with daily
        </p>

        <div className="skills-filters">
          {allCategories.map(category => (
            <button
              key={category}
              className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="skills-grid">
          {filteredCategories.map((category, catIndex) => (
            <div key={catIndex} className="skill-category">
              <h3 className="category-title">{category.name}</h3>
              <div className="skills-list">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-card">
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span 
                        className="skill-badge"
                        style={{ color: getProficiencyColor(skill.level) }}
                      >
                        {skill.level}
                      </span>
                    </div>
                    <div className="skill-bar-container">
                      <div 
                        className="skill-bar"
                        style={{
                          width: `${skill.proficiency}%`,
                          backgroundColor: getProficiencyColor(skill.level)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

