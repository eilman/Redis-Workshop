function CodeBlock({ title, children }) {
  return (
    <div className="code-block">
      <div className="code-block-header">
        <div className="code-block-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        {title && <span className="code-block-title">{title}</span>}
      </div>
      <div className="code-block-body">
        <pre><code>{children}</code></pre>
      </div>
    </div>
  );
}

export default CodeBlock;
