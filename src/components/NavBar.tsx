import React, { FC, useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faBox } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "./NavLink";
import { OrgSelect } from "./OrgSelect";

export const NavBar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Acorns</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink to="/places">
                <FontAwesomeIcon icon={faGlobe} /> Places
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/things">
                <FontAwesomeIcon icon={faBox} /> Things
              </NavLink>
            </NavItem>
          </Nav>
          <OrgSelect />
        </Collapse>
      </Navbar>
    </div>
  );
};
