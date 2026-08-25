function ResultDisplay({ title, value }) {
  const renderValue = () => {
    if (value === null || value === undefined) {
      return <span className="result-display-value null-value">(nil)</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="result-display-value null-value">(empty array)</span>;
      }
      return (
        <div className="result-display-value">
          {value.map((item, index) => (
            <div key={index} style={{ marginBottom: 2 }}>
              {index + 1}) {typeof item === 'object' ? JSON.stringify(item) : String(item)}
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === 'object') {
      return (
        <pre className="result-display-value" style={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    return <span className="result-display-value">{String(value)}</span>;
  };

  return (
    <div className="result-display fade-in">
      {title && <div className="result-display-title">{title}</div>}
      {renderValue()}
    </div>
  );
}

export default ResultDisplay;
