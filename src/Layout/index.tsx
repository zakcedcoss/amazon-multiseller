import {
  Topbar,
  Button,
  FlexLayout,
  NewSidebar,
  Popover,
  Avatar,
} from "@cedcommerce/ounce-ui";

import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Activity, DollarSign, Home, Lock, RefreshCcw, User } from "react-feather";

function Layout() {
  const navigate = useNavigate();
  // user action list
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [path, setPath] = useState("/panel/dashboard")

  const handleUserClick = () => {
    navigate("/auth/login", { replace: true });
  };

  return (
    <>
      <Topbar
        connectRight={
          <FlexLayout spacing="tight">

            <Popover
              open={popoverOpen}
              activator={<Button type="Plain" icon={<Avatar />} onClick={() => setPopoverOpen(prev => !prev)}>Admin</Button>}
              onClose={() => setPopoverOpen(false)}
              popoverContainer="body"
              popoverWidth={100}
            >
              <Button type="Plain" onClick={handleUserClick}>Logout</Button>
            </Popover>
          </FlexLayout>
        }
      />
      <NewSidebar
        path={path}
        onChange={(e: {
          content: string;
          icon: symbol;
          id: string;
          path: string;
        }) => {
          setPath(e.path)
          navigate(e.path);
        }}
        menu={[
          {
            content: "Dashboard",
            icon: <Home />,
            id: "dashboard",
            path: "/panel/dashboard",
          },
          {
            content: "Activity",
            icon: <Activity />,
            id: "dashboard",
            path: "/panel/activity",
          },
          {
            content: "Manage User Access",
            icon: <Lock />,
            id: "userAccess",
            path: "/panel/userAccess",
          },
          {
            content: "Migration Status",
            icon: <User />,
            id: "migrationStatus",
            path: "/panel/migrationStatus",
          },
          {
            content: "Sync User",
            icon: <RefreshCcw />,
            id: "syncUser",
            path: "/panel/syncUser",
          },
          {
            content: "User",
            icon: <User />,
            id: "user",
            path: "/panel/user",
          },
          {
            content: "Plan",
            icon: <DollarSign />,
            id: "plan",
            path: "/panel/plan",
          },
        ]}
      />
      <Outlet />
    </>
  );
}

export default Layout;
