import React from "react";
import { NavLink as RSNavLink } from "reactstrap";
import {
  NavLink as RRNavLink,
  NavLinkProps as RRNavLinkProps,
} from "react-router-dom";

export type Props = RRNavLinkProps;

export const NavLink: React.FC<Props> = (props) => {
  return (
    <RSNavLink tag={RRNavLink} {...props}>
      {props.children}
    </RSNavLink>
  );
};
