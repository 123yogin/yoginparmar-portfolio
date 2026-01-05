import { useState, useEffect } from 'react';
import './HeroVisual.css';

const HeroVisual = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

  const codeLines = [
    '# portfolio.py',
    '',
    'from coffee import unlimited',
    'from sleep import None',
    '',
    'while True:',
    '    code()',
    '    deploy()',
    '',
    '# Still running...',
    '',
    '▌'
  ];

  useEffect(() => {
    if (currentLine >= codeLines.length) {
      // Reset after a delay
      const resetTimeout = setTimeout(() => {
        setCurrentLine(0);
        setDisplayedText('');
      }, 2000);
      return () => clearTimeout(resetTimeout);
    }

    const line = codeLines[currentLine];
    let timeoutId;

    if (line === '') {
      timeoutId = setTimeout(() => {
        setDisplayedText(prev => prev + '\n');
        setCurrentLine(prev => prev + 1);
      }, 100);
    } else {
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex < line.length) {
          setDisplayedText(prev => prev + line[charIndex]);
          charIndex++;
        } else {
          setDisplayedText(prev => prev + '\n');
          clearInterval(typeInterval);
          setCurrentLine(prev => prev + 1);
        }
      }, 40);
      return () => clearInterval(typeInterval);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentLine]);

  const highlightCode = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const isLastLine = index === lines.length - 1;
      const lineContent = isLastLine ? line : line + '\n';
      
      // Empty lines
      if (line.trim() === '') {
        return <span key={index}>{'\n'}</span>;
      }
      
      // Comments
      if (line.trim().startsWith('#')) {
        return <span key={index} className="code-comment">{lineContent}</span>;
      }
      
      // Keywords
      if (line.includes('from') || line.includes('import') || line.includes('def') || 
          line.includes('while') || line.includes('True') || line.includes('None')) {
        return <span key={index} className="code-keyword">{lineContent}</span>;
      }
      
      // Strings and values
      if (line.includes('"') || line.includes("'") || line.includes('unlimited') || 
          line.includes('coffee') || line.includes('sleep') || line.includes('Still running')) {
        return <span key={index} className="code-string">{lineContent}</span>;
      }
      
      // Functions and methods
      if (line.includes('()') || line.includes('.') || line.includes('code') || 
          line.includes('debug') || line.includes('deploy') || line.includes('build_ai_app')) {
        return <span key={index} className="code-function">{lineContent}</span>;
      }
      
      // Cursor
      if (line.includes('▌')) {
        return <span key={index} className="code-cursor">{lineContent}</span>;
      }
      
      return <span key={index}>{lineContent}</span>;
    });
  };

  return (
    <div className="code-snippet">
      <pre className="code-content">
        <code>{highlightCode(displayedText)}</code>
      </pre>
    </div>
  );
};

export default HeroVisual;

