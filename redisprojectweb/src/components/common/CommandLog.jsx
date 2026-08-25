import { useEffect, useRef } from 'react';
import { TbTerminal2 } from 'react-icons/tb';

function CommandLog({ commands, onClear }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [commands]);

  return (
    <div className="command-log">
      <div className="command-log-header">
        <div className="command-log-header-title">
          <TbTerminal2 className="terminal-icon" />
          Command Log ({commands.length})
        </div>
        {commands.length > 0 && (
          <button className="command-log-clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      <div className="command-log-body" ref={bodyRef}>
        {commands.length === 0 ? (
          <div className="command-log-empty">
            No commands executed yet. Try an operation above.
          </div>
        ) : (
          commands.map((entry, index) => (
            <div key={index} className="command-entry">
              <div>
                <span className="command-prompt">redis&gt; </span>
                <span className="command-text">{entry.command || 'N/A'}</span>
              </div>
              <div className="command-result">
                {formatResult(entry.result)}
              </div>
              {entry.executionTimeMs !== undefined && (
                <div className="command-time">
                  ({entry.executionTimeMs}ms)
                </div>
              )}
              {entry.explanation && (
                <div className="command-explanation">
                  {entry.explanation}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatResult(result) {
  if (result === null || result === undefined) {
    return '(nil)';
  }
  if (typeof result === 'boolean') {
    return result ? '(integer) 1' : '(integer) 0';
  }
  if (Array.isArray(result)) {
    if (result.length === 0) return '(empty array)';
    return result.map((item, i) => {
      if (typeof item === 'object' && item !== null) {
        const val = item.value || item.member || '';
        return item.score !== undefined
          ? `${i + 1}) "${val}" -> ${item.score}`
          : `${i + 1}) "${val}"`;
      }
      return `${i + 1}) "${item}"`;
    }).join('\n');
  }
  if (typeof result === 'object') {
    return JSON.stringify(result, null, 2);
  }
  return String(result);
}

export default CommandLog;
