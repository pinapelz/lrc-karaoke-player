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
  OutputSection,
  OutputLabel,
  CodeBox,
  CopyButton,
  OpenLink,
} from "./page.styles";

interface Payload {
  lrc?: string;
  srv3?: string;
  file1?: string;
  file2?: string;
  offset?: number;
  offset2?: number;
}

export default function CreatePage() {
  const [lrc, setLrc] = useState("");
  const [srv3, setSrv3] = useState("");
  const [file1, setFile1] = useState("");
  const [file2, setFile2] = useState("");
  const [offset, setOffset] = useState("");
  const [offset2, setOffset2] = useState("");

  const [code, setCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const generate = () => {
    const payload: Payload = {};
    if (lrc.trim()) payload.lrc = lrc.trim();
    if (srv3.trim()) payload.srv3 = srv3.trim();
    if (file1.trim()) payload.file1 = file1.trim();
    if (file2.trim()) payload.file2 = file2.trim();
    if (offset.trim() !== "") payload.offset = Number(offset);
    if (offset2.trim() !== "") payload.offset2 = Number(offset2);
    setCode(btoa(JSON.stringify(payload)));
    setCopiedCode(false);
    setCopiedUrl(false);
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

  const shareUrl = code
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/player?code=${code}`
    : "";

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
        <Heading>Create a Karaoke Code</Heading>
        <Subheading>
          Fill in the URLs and offsets for your session, then generate a
          shareable code.
        </Subheading>

        <Form>
          <FieldGroup>
            <Label>Media (file1)</Label>
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
            <Label>SRV3 Subtitles</Label>
            <Input
              type="url"
              placeholder="https://example.com/song.srv3"
              value={srv3}
              onChange={(e) => setSrv3(e.target.value)}
            />
          </FieldGroup>

          <Divider />

          <FieldGroup>
            <Label>Audio #2</Label>
            <Input
              type="url"
              placeholder="https://example.com/instrumental.mp3"
              value={file2}
              onChange={(e) => setFile2(e.target.value)}
            />
          </FieldGroup>

          <Row>
            <FieldGroup>
              <Label>LRC Offset (ms)</Label>
              <Input
                type="number"
                placeholder="0"
                value={offset}
                onChange={(e) => setOffset(e.target.value)}
                step="25"
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Audio #2 Offset (ms)</Label>
              <Input
                type="number"
                placeholder="0"
                value={offset2}
                onChange={(e) => setOffset2(e.target.value)}
                step="25"
              />
            </FieldGroup>
          </Row>

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
              <FaExternalLinkAlt /> Open in Player
            </OpenLink>
          </OutputSection>
        )}
      </Content>
    </Root>
  );
}
