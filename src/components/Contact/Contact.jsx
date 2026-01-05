import { useState } from 'react';
import { Mail, Github, Linkedin, Instagram, Send, CheckCircle, AlertCircle } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null); // 'success', 'error', or null
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (formData.message.trim().length > 2000) {
      newErrors.message = 'Maximum 2000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Simulate form submission
    setFormStatus('loading');
    
    // In production, you would send this to your backend or Formspree
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus(null), 5000);
    }, 1000);
  };

  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="contact-content">
          <h2 className="section-title">
            Let's Connect
            <span className="section-underline"></span>
          </h2>
          <p className="contact-subtitle">
            Always interested in new projects and opportunities
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            {formStatus === 'success' && (
              <div className="form-message success">
                <CheckCircle size={20} />
                <span>Thanks for reaching out! I'll get back to you within 24 hours.</span>
              </div>
            )}

            {formStatus === 'error' && (
              <div className="form-message error">
                <AlertCircle size={20} />
                <span>Failed to send. Please try again.</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="input"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => {
                  if (!formData.name.trim()) {
                    setErrors(prev => ({ ...prev, name: 'Name is required' }));
                  }
                }}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="input"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => {
                  if (!formData.email.trim()) {
                    setErrors(prev => ({ ...prev, email: 'Email is required' }));
                  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
                  }
                }}
                required
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="input"
                placeholder="What's this about?"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                className="input"
                rows="5"
                placeholder="Tell me about your project or opportunity"
                value={formData.message}
                onChange={handleChange}
                maxLength={2000}
              />
              <div className="char-count">
                {formData.message.length} / 2000
              </div>
              {errors.message && <span className="error-text">{errors.message}</span>}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-submit"
              disabled={formStatus === 'loading'}
            >
              {formStatus === 'loading' ? (
                <>Sending...</>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </form>

          <div className="contact-alternative">
            <p>OR REACH OUT DIRECTLY:</p>
            <div className="contact-links">
              <a href="mailto:parmaryogin04@gmail.com">
                <Mail size={20} />
                parmaryogin04@gmail.com
              </a>
              <a href="https://linkedin.com/in/yogin-parmar-15b7aa1a8" target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} />
                LinkedIn
              </a>
              <a href="https://github.com/123yogin" target="_blank" rel="noopener noreferrer">
                <Github size={20} />
                GitHub
              </a>
              <a href="https://instagram.com/yogin_04" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

