function ActionButton({ children, onClick, variant = 'primary', disabled = false }) {
  const classMap = {
    primary: 'btn-primary',
    success: 'btn-success',
    info: 'btn-info',
    danger: 'btn-danger',
    warning: 'btn-warning',
  };

  return (
    <button
      className={classMap[variant] || 'btn-primary'}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default ActionButton;
