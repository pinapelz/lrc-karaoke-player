"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { FaPlay, FaMusic, FaSearch, FaUserCircle } from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";

interface KaraokeEntry {
  title: string;
  artist: string;
  thumbnail: string;
  has_srv: boolean;
  has_instrumental: boolean;
  code: string;
}

type KaraokeData = Record<string, KaraokeEntry[]>;

const Root = styled.div`
  min-height: 100vh;
  background-color: #f9f9f9;
  color: #1a1a1a;
  font-family: "Roboto", "Segoe UI", Arial, sans-serif;
`;

const Navbar = styled.nav`
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

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Logo = styled(Link)`
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

const LogoIcon = styled.span`
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

const NavCenter = styled.div`
  display: flex;
  align-items: center;
  flex: 0 1 560px;
`;

const SearchBox = styled.div`
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

const SearchInput = styled.input`
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

const SearchButton = styled.button`
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

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const NavLink = styled(Link)`
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

const Avatar = styled.div`
  font-size: 28px;
  color: #909090;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  &:hover {
    color: #606060;
  }
`;

const ChipsBar = styled.div`
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

const Chip = styled.button<{ $active?: boolean }>`
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

const GridContainer = styled.div`
  padding: 8px 24px 24px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const Card = styled(Link)`
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

const ThumbnailWrapper = styled.div`
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

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayOverlay = styled.div`
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

const PlayCircle = styled.div`
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

const BadgeRow = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
`;

const Badge = styled.span<{ $color: string }>`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${(p) => p.$color};
  color: #fff;
  text-transform: uppercase;
`;

const CardMeta = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
  padding: 0 4px 12px;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

const CardTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardSub = styled.span`
  font-size: 12px;
  color: #909090;
  line-height: 1.3;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  padding: 48px 0;
  text-align: center;
  font-size: 14px;
  color: #909090;
`;

const CtaSection = styled.div`
  padding: 32px 24px;
  border-top: 1px solid #e5e5e5;
  margin-top: 8px;
`;

const SectionHeading = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 14px;
`;

const OpenPlayerLink = styled(Link)`
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

const PlayerDescription = styled.p`
  font-size: 13px;
  color: #909090;
  margin: 14px 0 0;
  line-height: 1.6;
  max-width: 480px;
`;

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function HomePage() {
  const [data, setData] = useState<KaraokeData>({});
  const [activeChip, setActiveChip] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/karaoke.json")
      .then((r) => r.json())
      .then((json: KaraokeData) => setData(json))
      .catch(() => {});
  }, []);

  const categories = Object.keys(data);
  const chips = ["All", ...categories.map(capitalize)];

  const visibleItems: KaraokeEntry[] = activeChip === "All"
    ? Object.values(data).flat()
    : data[activeChip.toLowerCase()] ?? [];

  const filtered = search.trim()
    ? visibleItems.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.artist.toLowerCase().includes(search.toLowerCase()),
      )
    : visibleItems;

  return (
    <Root>
      <Navbar>
        <NavLeft>
          <Logo href="/">
            <LogoIcon>
              <MdLibraryMusic />
            </LogoIcon>
            LRC-Karaoke-Player
          </Logo>
        </NavLeft>

        <NavCenter>
          <SearchBox>
            <SearchInput
              placeholder="Search songs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <SearchButton aria-label="Search">
              <FaSearch />
            </SearchButton>
          </SearchBox>
        </NavCenter>

        <NavRight>
          <NavLink href="/create">Create Karaoke Code</NavLink>
          <Avatar>
            <FaUserCircle />
          </Avatar>
        </NavRight>
      </Navbar>

      <ChipsBar>
        {chips.map((chip) => (
          <Chip
            key={chip}
            $active={chip === activeChip}
            onClick={() => setActiveChip(chip)}
          >
            {chip}
          </Chip>
        ))}
      </ChipsBar>

      <GridContainer>
        <CardGrid>
          {filtered.length === 0 ? (
            <EmptyState>No results found.</EmptyState>
          ) : (
            filtered.map((item) => (
              <Card key={item.code} href={`/player?code=${item.code}`}>
                <ThumbnailWrapper>
                  {item.thumbnail ? (
                    <Thumbnail src={item.thumbnail} alt={item.title} />
                  ) : (
                    <FaMusic />
                  )}
                  <PlayOverlay>
                    <PlayCircle>
                      <FaPlay />
                    </PlayCircle>
                  </PlayOverlay>
                  {(item.has_srv || item.has_instrumental) && (
                    <BadgeRow>
                      {item.has_srv && <Badge $color="#7c3aed">SRV</Badge>}
                      {item.has_instrumental && <Badge $color="#0369a1">Inst.</Badge>}
                    </BadgeRow>
                  )}
                </ThumbnailWrapper>
                <CardMeta>
                  <CardInfo>
                    <CardTitle>{item.title}</CardTitle>
                    <CardSub>{item.artist}</CardSub>
                  </CardInfo>
                </CardMeta>
              </Card>
            ))
          )}
        </CardGrid>
      </GridContainer>

      <CtaSection>
        <SectionHeading>Custom Player</SectionHeading>
        <OpenPlayerLink href="/player">
          <FaPlay /> Open Player
        </OpenPlayerLink>
        <PlayerDescription>
          Load your own video, audio, LRC lyrics
        </PlayerDescription>
      </CtaSection>
    </Root>
  );
}
