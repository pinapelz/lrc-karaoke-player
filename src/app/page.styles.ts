import styled from "styled-components";
import Link from "next/link";

export const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const NavCenter = styled.div`
  display: flex;
  align-items: center;
  flex: 0 1 560px;
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  height: 38px;
  border: 1px solid #d4d4d4;
  border-radius: 10px;
  overflow: hidden;
  background-color: #f0f0f0;
  transition: border-color 0.2s;
  &:focus-within {
    border-color: #1a1a1a;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  height: 100%;
  padding: 0 14px;
  background: transparent;
  border: none;
  outline: none;
  color: #1a1a1a;
  font-size: 14px;
  &::placeholder {
    color: #909090;
  }
`;

export const SearchButton = styled.button`
  width: 52px;
  height: 100%;
  background-color: #e8e8e8;
  border: none;
  border-left: 1px solid #d4d4d4;
  color: #606060;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #d4d4d4;
    color: #1a1a1a;
  }
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;



export const ChipsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  overflow-x: auto;
  background-color: #f9f9f9;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Chip = styled.button<{ $active?: boolean }>`
  white-space: nowrap;
  padding: 7px 16px;
  border-radius: 10px;
  border: 1px solid ${(p) => (p.$active ? "transparent" : "#d4d4d4")};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  background-color: ${(p) => (p.$active ? "#1a1a1a" : "transparent")};
  color: ${(p) => (p.$active ? "#fff" : "#606060")};
  &:hover {
    background-color: ${(p) => (p.$active ? "#333" : "#f0f0f0")};
    color: ${(p) => (p.$active ? "#fff" : "#1a1a1a")};
  }
`;

export const GridContainer = styled.div`
  padding: 8px 24px 24px;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

export const Card = styled(Link)`
  cursor: pointer;
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
`;

export const ThumbnailWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #e4e4e4;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c0c0;
  font-size: 36px;
  overflow: hidden;
  position: relative;
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PlayOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0);
  border-radius: 12px;
  transition: background 0.2s;
  ${Card}:hover & {
    background: rgba(0, 0, 0, 0.25);
  }
`;

export const PlayCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.2s, transform 0.2s;
  ${Card}:hover & {
    opacity: 1;
    transform: scale(1);
  }
`;

export const BadgeRow = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
`;

export const Badge = styled.span<{ $color: string }>`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${(p) => p.$color};
  color: #fff;
  text-transform: uppercase;
`;

export const CardMeta = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
  padding: 0 4px 12px;
`;

export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

export const CardTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardSub = styled.span`
  font-size: 12px;
  color: #909090;
  line-height: 1.3;
`;

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  padding: 48px 0;
  text-align: center;
  font-size: 14px;
  color: #909090;
`;

export const CtaSection = styled.div`
  padding: 32px 24px;
  border-top: 1px solid #e5e5e5;
  margin-top: 8px;
`;

export const SectionHeading = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 14px;
`;

export const OpenPlayerLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 10px;
  background-color: #1a1a1a;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.15s;
  &:hover {
    background-color: #333;
  }
`;

export const PlayerDescription = styled.p`
  font-size: 13px;
  color: #909090;
  margin: 14px 0 0;
  line-height: 1.6;
  max-width: 480px;
`;
