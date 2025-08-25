function DashboardLayout({ title, onAddProject, children }) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
      <button onClick={onAddProject}>Add Project</button>
    </div>
  );
}

export default DashboardLayout;
