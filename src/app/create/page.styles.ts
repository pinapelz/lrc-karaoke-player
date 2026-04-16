import styled from "styled-components";

export const Content = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 0 24px 60px;
`;

export const Heading = styled.h1`
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 4px;
`;

export const Subheading = styled.p`
  font-size: 13px;
  color: #909090;
  margin: 0 0 32px;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #606060;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Input = styled.input`
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

export const Divider = styled.div`
  height: 1px;
  background-color: #e5e5e5;
  margin: 6px 0;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const GenerateButton = styled.button`
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

export const OutputSection = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const OutputLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #606060;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
`;

export const CodeBox = styled.div`
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

export const CopyButton = styled.button<{ $copied: boolean }>`
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

export const OpenLink = styled.a`
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
