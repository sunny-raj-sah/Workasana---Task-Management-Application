 const TaskSearch = ({ value, onChange }) => {
  return (
    <div className="position-relative" style={{ width: "100%", maxWidth: 420 }}>
      <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>

      <input
        type="text"
        className="form-control rounded-pill ps-5 py-2 border-0 bg-light"
        placeholder="Search tasks or projects..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {value && (
        <button
          className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 text-muted border-0 bg-transparent"
          onClick={() => onChange("")}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      )}
    </div>
  );
};

export default TaskSearch;