import { useState } from 'react';

function TheorySection({ title, icon, children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="theory-section">
      <div className="theory-section-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="theory-section-toggle">{isOpen ? '▼' : '▶'}</span>
        {icon && <span className="theory-section-icon">{icon}</span>}
        <span>{title}</span>
      </div>
      {isOpen && (
        <div className="theory-section-content">
          {children}
        </div>
      )}
    </div>
  );
}

export default TheorySection;
