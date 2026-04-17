"use client";
import { useEffect, useState } from "react";
import { FaPlay, FaMusic, FaSearch, FaUserCircle } from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";
import {
  Root,
  Navbar,
  Logo,
  LogoIcon,
  NavCtaLink,
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
  CardMeta,
  CardInfo,
  CardTitle,
  CardSub,
  EmptyState,
  CtaSection,
  SectionHeading,
  OpenPlayerLink,
  PlayerDescription,
  TypingGlobalStyle,
} from "./page.styles";

interface TypingEntry {
  title: string;
  artist: string;
  thumbnail: string;
  code: string;
}

type TypingData = Record<string, TypingEntry[]>;

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function TypingPage() {
  const [data, setData] = useState<TypingData>({});
  const [activeChip, setActiveChip] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/typing.json")
      .then((r) => r.json())
      .then((json: TypingData) => setData(json))
      .catch(() => {});
  }, []);

  const categories = Object.keys(data);
  const chips = [
    { key: "all", label: "All" },
    ...categories.map((category) => ({
      key: category,
      label: capitalize(category),
    })),
  ];

  const visibleItems: TypingEntry[] =
    activeChip === "all" ? Object.values(data).flat() : data[activeChip] ?? [];

  const normalizedSearch = search.trim().toLowerCase();
  const searchableItems = normalizedSearch ? Object.values(data).flat() : visibleItems;

  const filtered = normalizedSearch
    ? searchableItems.filter(
        (item) =>
          item.title.toLowerCase().includes(normalizedSearch) ||
          item.artist.toLowerCase().includes(normalizedSearch),
      )
    : searchableItems;

  return (
    <>
      <TypingGlobalStyle />
      <Root>
      <Navbar>
        <NavLeft>
          <Logo href="/">
            <LogoIcon>
              <MdLibraryMusic />
            </LogoIcon>
            LRC-Type
          </Logo>
        </NavLeft>

        <NavCenter>
          <SearchBox>
            <SearchInput
              placeholder="Search typing charts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <SearchButton aria-label="Search">
              <FaSearch />
            </SearchButton>
          </SearchBox>
        </NavCenter>

        <NavRight>
          <NavCtaLink href="/">LRC-Karaoke</NavCtaLink>
          <NavCtaLink href="/create">Create</NavCtaLink>
          <Avatar>
            <FaUserCircle />
          </Avatar>
        </NavRight>
      </Navbar>

      <ChipsBar>
        {chips.map((chip) => (
          <Chip
            key={chip.key}
            $active={chip.key === activeChip}
            onClick={() => setActiveChip(chip.key)}
          >
            {chip.label}
          </Chip>
        ))}
      </ChipsBar>

      <GridContainer>
        <CardGrid>
          {filtered.length === 0 ? (
            <EmptyState>No results found.</EmptyState>
          ) : (
            filtered.map((item) => (
              <Card key={item.code} href={`/game?code=${item.code}`}>
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
      </Root>
    </>
  );
}
