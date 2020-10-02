import React from "react";
import styled from "styled-components";

type Props = {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrike: boolean;
  fontSize: number;
  font: string;
  attributes: any;
};

const Container = styled.span<Props>`
  font-weight: ${(props) => (props.isBold ? "bold" : "normal")};
  text-decoration: ${(props) =>
    ` ${props.isStrike ? "line-through" : ""} ${
      props.isUnderline ? "underline" : ""
    }`};
  font-style: ${(props) => (props.isItalic ? "italic" : "normal")};

  font-size: ${(props) => props.fontSize}px;
  font-family: ${(props) => props.font}, sans-serif;
`;

export const StyledText: React.FC<Props> = (props) => {
  return (
    <Container {...props} {...props.attributes}>
      {props.children}
    </Container>
  );
};
