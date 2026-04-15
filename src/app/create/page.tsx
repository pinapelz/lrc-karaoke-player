"use client";
import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { MdLibraryMusic } from "react-icons/md";
import { FaCopy, FaCheck, FaExternalLinkAlt } from "react-icons/fa";

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

const Logo = styled(Link)`
  font-size: 17px;
  font-weight: 800;
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

const Content = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 0 24px 60px;
`;

const Heading = styled.h1`
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 4px;
`;

const Subheading = styled.p`
  font-size: 13px;
  color: #909090;
  margin: 0 0 32px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #606060;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  height: 40px;
  padding: 0 12px;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  background-color: #fff;
  transition: border-color 0.15s;
  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
  &::placeholder {
    color: #b0b0b0;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e5e5e5;
  margin: 6px 0;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const GenerateButton = styled.button`
  height: 42px;
  padding: 0 24px;
  border-radius: 10px;
  border: none;
  background-color: #1a1a1a;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
  margin-top: 6px;
  &:hover {
    background-color: #333;
  }
`;

const OutputSection = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const OutputLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #606060;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
`;

const CodeBox = styled.div`
  position: relative;
  background-color: #f0f0f0;
  border: 1px solid #d4d4d4;
  border-radius: 10px;
  padding: 14px 48px 14px 14px;
  font-family: "Courier New", monospace;
  font-size: 13px;
  color: #1a1a1a;
  word-break: break-all;
  line-height: 1.5;
`;

const CopyButton = styled.button<{ $copied: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: none;
  background-color: ${(p) => (p.$copied ? "#22c55e" : "#d4d4d4")};
  color: ${(p) => (p.$copied ? "#fff" : "#606060")};
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s, color 0.15s;
  &:hover {
    background-color: ${(p) => (p.$copied ? "#16a34a" : "#c0c0c0")};
    color: #1a1a1a;
  }
`;

const OpenLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  text-decoration: none;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  padding: 8px 14px;
  background-color: #fff;
  transition: background-color 0.15s;
  &:hover {
    background-color: #f0f0f0;
  }
`;

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
