import React from "react";
import { Link as RouterLink } from "react-router-dom";

// TODO: Link vs NavLink
// <NavLink to={`contacts/${contact.id}`} className={({ isActive, isPending }) => isActive ? "active" : isPending ? "pending" : "" } >

export const LinkBehavior = React.forwardRef((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});
