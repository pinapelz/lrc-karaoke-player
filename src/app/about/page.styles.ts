import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  padding: 20px;
  background-color: #f9f9f9;
  color: #333;
`;

export const Title = styled.h1`
  font-size: 2.5em;
  margin-bottom: 0.5em;
  font-weight: 700;
`;

export const Subtitle = styled.h2`
  font-size: 1.5em;
  margin-bottom: 1em;
  font-weight: 600;
`;

export const Paragraph = styled.p`
  font-size: 1.2em;
  line-height: 1.6;
  margin-bottom: 2em;
  text-align: left;
  font-weight: 450;
`;

export const Preformatted = styled.pre`
  font-size: 1em;
  background-color: #eaeaea;
  padding: 10px;
  border-radius: 5px;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export const BackLink = styled.a`
  font-size: 1em;
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export const Video = styled.video`
  width: 100%;
  max-width: 600px;
  margin: 20px 0;
  border-radius: 10px;
`;
