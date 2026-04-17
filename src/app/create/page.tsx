"use client";
import { useState } from "react";
import { MdLibraryMusic } from "react-icons/md";
import { FaCopy, FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import { Root, Navbar, Logo, LogoIcon, NavLink } from "../styles/shared";
import {
  Content,
  Heading,
  Subheading,
  Form,
  FieldGroup,
  Label,
  Input,
  Divider,
  Row,
  GenerateButton,
  ModeButton,
  OutputSection,
  OutputLabel,
  CodeBox,
  CopyButton,
  OpenLink,
} from "./page.styles";

type CreateMode = "karaoke" | "typing";

interface KaraokePayload {
  lrc?: string;
  srv3?: string;
  file1?: string;
  file2?: string;
  offset?: number;
  offset2?: number;
}

interface TypingPayload {
  file1?: string;
  lrc?: string;
  offset?: number;
  title?: string;
  artist?: string;
  skip_backing?: boolean;
}

export default function CreatePage() {
  const [mode, setMode] = useState<CreateMode>("karaoke");

  const [lrc, setLrc] = useState("");
  const [srv3, setSrv3] = useState("");
  const [file1, setFile1] = useState("");
  const [file2, setFile2] = useState("");
  const [offset, setOffset] = useState("");
  const [offset2, setOffset2] = useState("");

  const [typingTitle, setTypingTitle] = useState("");
  const [typingArtist, setTypingArtist] = useState("");
  const [skipBacking, setSkipBacking] = useState(true);

  const [code, setCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const resetCopyStates = () => {
    setCopiedCode(false);
    setCopiedUrl(false);
  };

  const generate = () => {
    if (mode === "karaoke") {
      const payload: KaraokePayload = {};
      if (lrc.trim()) payload.lrc = lrc.trim();
      if (srv3.trim()) payload.srv3 = srv3.trim();
      if (file1.trim()) payload.file1 = file1.trim();
      if (file2.trim()) payload.file2 = file2.trim();
      if (offset.trim() !== "") payload.offset = Number(offset);
      if (offset2.trim() !== "") payload.offset2 = Number(offset2);

      setCode(btoa(JSON.stringify(payload)));
      resetCopyStates();
      return;
    }

    const payload: TypingPayload = {};
    if (file1.trim()) payload.file1 = file1.trim();
    if (lrc.trim()) payload.lrc = lrc.trim();
    if (offset.trim() !== "") payload.offset = Number(offset);
    if (typingTitle.trim()) payload.title = typingTitle.trim();
    if (typingArtist.trim()) payload.artist = typingArtist.trim();
    payload.skip_backing = skipBacking;

    setCode(btoa(JSON.stringify(payload)));
    resetCopyStates();
  };

  const copy = (text: string, which: "code" | "url") => {
    navigator.clipboard.writeText(text);
    if (which === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const playerPath = mode === "typing" ? "/game" : "/player";
  const shareUrl = code ? `${window.location.origin}${playerPath}?code=${code}` : "";

  return (
    <Root>
      <Navbar>
        <Logo href="/">
          <LogoIcon>
            <MdLibraryMusic />
          </LogoIcon>
          LRC-Karaoke-Player
        </Logo>
        <NavLink href="/">← Back</NavLink>
      </Navbar>

      <Content>
        <Heading>Create a Code</Heading>
        <Subheading>
          Switch between Karaoke and Typing Game modes, then generate a shareable code for your session.
        </Subheading>

        <Form>
          <Row>
            <ModeButton
              $active={mode === "karaoke"}
              onClick={() => {
                setMode("karaoke");
                setCode(null);
                resetCopyStates();
              }}
            >
              MoekyunKaraoke
            </ModeButton>
            <ModeButton
              $active={mode === "typing"}
              onClick={() => {
                setMode("typing");
                setCode(null);
                resetCopyStates();
              }}
            >
              LRC-Type
            </ModeButton>
          </Row>

          <Divider />

          <FieldGroup>
            <Label>Primary Media</Label>
            <Input
              type="url"
              placeholder="https://example.com/song.mp4"
              value={file1}
              onChange={(e) => setFile1(e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>LRC Lyrics</Label>
            <Input
              type="url"
              placeholder="https://example.com/song.lrc"
              value={lrc}
              onChange={(e) => setLrc(e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <Label title="Offset in milliseconds. Increase this value if the main audio is ahead of the lyrics.">
              LRC Offset (ms)
            </Label>
            <Input
              type="number"
              placeholder="0"
              value={offset}
              onChange={(e) => setOffset(e.target.value)}
              step="25"
            />
          </FieldGroup>

          {mode === "karaoke" ? (
            <>
              <FieldGroup>
                <Label title="SRV3 is a YouTube-style timed text format used for subtitles. Provide a .srv3 URL to display timed subtitles in the player (optional).">
                  SRV3 Subtitles (Optional)
                </Label>
                <Input
                  type="url"
                  placeholder="https://example.com/song.srv3"
                  value={srv3}
                  onChange={(e) => setSrv3(e.target.value)}
                />
              </FieldGroup>

              <Divider />

              <FieldGroup>
                <Label>Backing Audio #2 (Optional)</Label>
                <Input
                  type="url"
                  placeholder="https://example.com/instrumental.mp3"
                  value={file2}
                  onChange={(e) => setFile2(e.target.value)}
                />
              </FieldGroup>

              <FieldGroup>
                <Label title="Offset in milliseconds. Increase this value if the main audio is ahead of the backing audio.">
                  Backing Audio #2 Offset (ms)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={offset2}
                  onChange={(e) => setOffset2(e.target.value)}
                  step="25"
                />
              </FieldGroup>
            </>
          ) : (
            <>
              <Divider />
              <Row>
                <FieldGroup>
                  <Label>Title</Label>
                  <Input
                    type="text"
                    placeholder="Song Title"
                    value={typingTitle}
                    onChange={(e) => setTypingTitle(e.target.value)}
                  />
                </FieldGroup>
                <FieldGroup>
                  <Label>Artist</Label>
                  <Input
                    type="text"
                    placeholder="Artist Name"
                    value={typingArtist}
                    onChange={(e) => setTypingArtist(e.target.value)}
                  />
                </FieldGroup>
              </Row>

              <Row>
                <FieldGroup>
                  <Label title="When enabled, lyrics inside parentheses are treated as backing lyrics and skipped.">
                    Skip Backing
                  </Label>
                  <Input
                    type="checkbox"
                    checked={skipBacking}
                    onChange={(e) => setSkipBacking(e.target.checked)}
                    style={{ width: "18px", height: "18px", marginTop: "10px" }}
                  />
                </FieldGroup>
              </Row>
            </>
          )}

          <GenerateButton onClick={generate}>Generate Code</GenerateButton>
        </Form>

        {code && (
          <OutputSection>
            <div>
              <OutputLabel>Code</OutputLabel>
              <CodeBox>
                {code}
                <CopyButton
                  $copied={copiedCode}
                  onClick={() => copy(code, "code")}
                  aria-label="Copy code"
                >
                  {copiedCode ? <FaCheck /> : <FaCopy />}
                </CopyButton>
              </CodeBox>
            </div>

            <div>
              <OutputLabel>Share URL</OutputLabel>
              <CodeBox>
                {shareUrl}
                <CopyButton
                  $copied={copiedUrl}
                  onClick={() => copy(shareUrl, "url")}
                  aria-label="Copy URL"
                >
                  {copiedUrl ? <FaCheck /> : <FaCopy />}
                </CopyButton>
              </CodeBox>
            </div>

            <OpenLink href={shareUrl} target="_blank" rel="noopener noreferrer">
              <FaExternalLinkAlt /> Open in {mode === "typing" ? "Typing Game" : "Player"}
            </OpenLink>
          </OutputSection>
        )}
      </Content>
    </Root>
  );
}
