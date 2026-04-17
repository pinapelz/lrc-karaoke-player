import styled, { createGlobalStyle } from "styled-components";
import {
  Root as BaseRoot,
  Navbar as BaseNavbar,
  Logo as BaseLogo,
  LogoIcon as BaseLogoIcon,
  NavLink as BaseNavLink,
  NavCtaLink as BaseNavCtaLink,
} from "../styles/shared";
import {
  NavLeft,
  NavCenter,
  SearchBox as BaseSearchBox,
  SearchInput as BaseSearchInput,
  SearchButton as BaseSearchButton,
  NavRight,
  ChipsBar as BaseChipsBar,
  Chip as BaseChip,
  GridContainer,
  CardGrid,
  Card as BaseCard,
  ThumbnailWrapper as BaseThumbnailWrapper,
  Thumbnail,
  PlayOverlay,
  PlayCircle,
  CardMeta,
  CardInfo,
  CardTitle as BaseCardTitle,
  CardSub as BaseCardSub,
  EmptyState as BaseEmptyState,
  CtaSection as BaseCtaSection,
  SectionHeading as BaseSectionHeading,
  OpenPlayerLink as BaseOpenPlayerLink,
  PlayerDescription as BasePlayerDescription,
} from "../page.styles";

export { NavLeft, NavCenter, NavRight, GridContainer, CardGrid, Thumbnail, PlayOverlay, PlayCircle, CardMeta, CardInfo };

export const TypingGlobalStyle = createGlobalStyle`
  html,
  body {
    background-color: #0b0b10;
  }
`;

export const Root = styled(BaseRoot)`
  background-color: #0b0b10;
  color: #f5f5f5;
`;

export const Navbar = styled(BaseNavbar)`
  background-color: rgba(11, 11, 16, 0.9);
  border-bottom: 1px solid #1f1f2a;
`;

export const Logo = styled(BaseLogo)`
  color: #f5f5f5;
`;

export const LogoIcon = styled(BaseLogoIcon)`
  background-color: #f5f5f5;
  color: #0b0b10;
`;

export const NavLink = styled(BaseNavLink)`
  color: #b0b3bd;
  &:hover {
    background-color: #1a1d29;
    color: #fff;
  }
`;

export const NavCtaLink = styled(BaseNavCtaLink)`
  background-color: #1a1d29;
  border-color: #2a2f3d;
  color: #fff;
  &:hover {
    background-color: #222838;
    border-color: #3a4154;
  }
`;

export const SearchBox = styled(BaseSearchBox)`
  border-color: #2a2f3d;
  background-color: #141824;
  &:focus-within {
    border-color: #4b5563;
  }
`;

export const SearchInput = styled(BaseSearchInput)`
  color: #f5f5f5;
  &::placeholder {
    color: #8b90a0;
  }
`;

export const SearchButton = styled(BaseSearchButton)`
  background-color: #1a1d29;
  border-left-color: #2a2f3d;
  color: #c0c4d0;
  &:hover {
    background-color: #222838;
    color: #fff;
  }
`;



export const ChipsBar = styled(BaseChipsBar)`
  background-color: #0f111a;
`;

export const Chip = styled(BaseChip)`
  border-color: #2a2f3d;
  color: #b8bcc7;
  background-color: transparent;
  &:hover {
    background-color: #1a1d29;
    color: #fff;
  }
`;

export const Card = styled(BaseCard)`
  border: 1px solid #1f1f2a;
  background-color: #0f111a;
  &:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
    border-color: #2a2f3d;
  }
`;

export const ThumbnailWrapper = styled(BaseThumbnailWrapper)`
  background-color: #1a1d29;
  color: #4b5563;
`;

export const CardTitle = styled(BaseCardTitle)`
  color: #f5f5f5;
`;

export const CardSub = styled(BaseCardSub)`
  color: #9aa0ad;
`;

export const EmptyState = styled(BaseEmptyState)`
  color: #9aa0ad;
`;

export const CtaSection = styled(BaseCtaSection)`
  border-top-color: #1f1f2a;
`;

export const SectionHeading = styled(BaseSectionHeading)`
  color: #f5f5f5;
`;

export const OpenPlayerLink = styled(BaseOpenPlayerLink)`
  background-color: #f5f5f5;
  color: #0b0b10;
  &:hover {
    background-color: #e5e7eb;
  }
`;

export const PlayerDescription = styled(BasePlayerDescription)`
  color: #9aa0ad;
`;