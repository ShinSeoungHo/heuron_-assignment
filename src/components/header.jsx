import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  align-items: center;
  background-color: #338AF5;
  padding: 2px;
`;

const StyledLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;

  &.active {
    color: #143FFF;
  }

  &:hover {
    color: #29C2FF;
  }
`;

const H1 = styled.h1`
  margin-left: 24px;
`;

const Ul = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin-left: 60px;

  li {
    margin-left: 80px;
  }
`;

const Header = ( {menuActive} ) => {
  const menu = [
    {
      name: "Picsum List",
      link: "/list"
    },
    {
      name: "Picsum Detail",
      link: "/detail"
    }
  ];

  return (
    <Nav>
      <StyledLink to="/list">
        <H1>Heuron Assignments</H1>
      </StyledLink>
      <Ul>
        {menu.map((item, index) => (
          <li key={index}>
            <StyledLink to={item.link}
              className={menuActive === index ? "active" : ""}
            >
              {item.name}
            </StyledLink>
          </li>
        ))}
      </Ul>
      <div>
      </div>
    </Nav>
  )
};

export default Header;