import "./App.css";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, } from "react";
import Auth from "./pages/Auth";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./components/panel/Dashboard/Dashboard";
import 'rsuite/dist/rsuite.min.css';
import Activity from "./components/panel/Activity/Activity";
import ManageUser from "./components/panel/ManageUser/ManageUser";
import MigrationStatus from "./components/panel/MigrationStatus/MigrationStatus";
import User from "./components/panel/User/User";
import Plan from "./components/panel/Plan/Plan";
import SyncUser from "./components/panel/SyncUser/SyncUser";

const Home = lazy(() => import("./pages/Home"));
const Layout = lazy(() => import("./Layout/index"));

function App() {
  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Auth />} />
        <Route path="/panel" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="activity" element={<Activity />} />
          <Route path="userAccess" element={<ManageUser />} />
          <Route path="migrationStatus" element={<MigrationStatus />} />
          <Route path="syncUser" element={<SyncUser />} />
          <Route path="user" element={<User />} />
          <Route path="plan" element={<Plan />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;