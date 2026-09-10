import { Outlet } from "react-router-dom";
import VisitorNavbar from "../components/VisitorNavbar";
import Footer from "../components/Footer";

const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <VisitorNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;