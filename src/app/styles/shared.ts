import styled from "styled-components";
import Link from "next/link";

export const Root = styled.div`
  min-height: 100vh;
  background-color: #f9f9f9;
  color: #1a1a1a;
  font-family: "Roboto", "Segoe UI", Arial, sans-serif;
`;

export const Navbar = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  background-color: #ffffffee;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e5e5e5;
`;

export const Logo = styled(Link)`
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0.3px;
  color: #1a1a1a;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 7px;
  user-select: none;
`;

export const LogoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  color: #fff;
  border-radius: 6px;
  width: 30px;
  height: 22px;
  font-size: 10px;
`;

export const NavLink = styled(Link)`
  font-size: 13px;
  font-weight: 500;
  color: #606060;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background-color 0.15s, color 0.15s;
  &:hover {
    background-color: #f0f0f0;
    color: #1a1a1a;
  }
`;
