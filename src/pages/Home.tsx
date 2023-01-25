import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/auth/login", { replace: true });
  });

  return <div className="home">Home Component</div>;
}

export default Home;
