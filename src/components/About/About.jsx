import skillsData from '../../data/skills.json';
import profileImage from '../../assets/yp.jpg';
import './About.css';

const About = () => {
  const stats = [
    { number: '37+', label: 'GitHub Repositories' },
    { number: '6 months', label: 'Professional Experience' },
    { number: '5+', label: 'AI/ML Projects' },
    { number: 'April 2026', label: 'Expected Graduation' }
  ];

  const techStack = ['Python', 'React', 'TensorFlow', 'Flask', 'JavaScript', 'OpenCV'];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="about section">
      <div className="container">
        <h2 className="section-title">
          About Me
          <span className="section-underline"></span>
        </h2>
        
        <div className="about-content">
          <div className="about-image">
            <div className="about-image-wrapper">
              <img 
                src={profileImage} 
                alt="Yogin Parmar - Backend engineer with DevOps focus, based in Ahmedabad, Gujarat, India."
                className="about-profile-image"
                loading="lazy"
                width="400"
                height="400"
              />
              <div className="about-image-overlay"></div>
              <div className="about-image-border"></div>
            </div>
          </div>
          
          <div className="about-text">
            <div className="about-bio">
              <p>
                I'm an Associate Software Engineer at UpVision Software Services, working across backend and
                DevOps: building REST APIs and microservices in Java and Spring Boot, then automating how they
                get tested, containerised and deployed with CI/CD pipelines, Docker and AWS/OCI.
              </p>
              <p>
                Before UpVision I got here the hands-on way — an AI development internship at The Line Tech
                Solutions and a Python/Django backend internship at iTechBrains. I'm finishing my Bachelor of
                Engineering in Computer Engineering at LDRP Institute of Technology & Research, class of 2026.
              </p>
              <p>
                Based in Ahmedabad, Gujarat, I'm passionate about problem-solving with technology and building 
                production-ready applications that make a real impact.
              </p>
            </div>
            
            <div className="about-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="about-tech">
              <h4>Technologies I Use Daily</h4>
              <div className="tech-pills">
                {techStack.map((tech, index) => (
                  <span key={index} className="tech-pill">{tech}</span>
                ))}
              </div>
            </div>
            
            <button className="btn btn-primary" onClick={scrollToContact}>
              Let's Collaborate
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

