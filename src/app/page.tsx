"use client";
import { useState, useEffect } from "react";
import { FaPlay, FaMusic, FaSearch, FaUserCircle } from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";
import { Root, Navbar, Logo, LogoIcon, NavLink } from "./styles/shared";
import {
  NavLeft,
  NavCenter,
  SearchBox,
  SearchInput,
  SearchButton,
  NavRight,
  Avatar,
  ChipsBar,
  Chip,
  GridContainer,
  CardGrid,
  Card,
  ThumbnailWrapper,
  Thumbnail,
  PlayOverlay,
  PlayCircle,
  BadgeRow,
  Badge,
  CardMeta,
  CardInfo,
  CardTitle,
  CardSub,
  EmptyState,
  CtaSection,
  SectionHeading,
  OpenPlayerLink,
  PlayerDescription,
} from "./page.styles";

interface KaraokeEntry {
  title: string;
  artist: string;
  thumbnail: string;
  has_srv: boolean;
  has_instrumental: boolean;
  code: string;
}

type KaraokeData = Record<string, KaraokeEntry[]>;

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
