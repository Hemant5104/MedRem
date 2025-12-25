import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardLayout = ({ title, children }) => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Topbar title={title} />

        <main className="p-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
