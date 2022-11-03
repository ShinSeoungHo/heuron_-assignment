import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const nvaigate = useNavigate();

  React.useEffect(() => {
    nvaigate("/list");
  }, [nvaigate]);

  return (
    <>
    </>
  );
};

export default Home;