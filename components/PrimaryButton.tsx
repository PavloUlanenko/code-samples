import React, { forwardRef } from 'react';
import styled, { css, CSSObject } from 'styled-components';
import BaseButton, { Props } from './BaseButton';

const PrimaryButton = forwardRef<HTMLButtonElement, Props>(
  ({ leftIcon, rightIcon, testId, style, onClick, children, ...rest }, ref) => (
    <StyledButton
      ref={ref}
      styleOverride={style}
      data-testid={testId}
      onClick={onClick}
      {...rest}
    >
      {leftIcon && (
        <IconWrapper style={{ marginRight: '6px' }}>{leftIcon}</IconWrapper>
      )}
      {children}
      {rightIcon && (
        <IconWrapper style={{ marginLeft: '6px' }}>{rightIcon}</IconWrapper>
      )}
    </StyledButton>
  )
);

const StyledButton = styled(BaseButton)<{ styleOverride?: CSSObject }>`
  background: ${(props) => props.theme.colors.primary100};
  &:hover {
    background: ${(props) => props.theme.colors.primary400};
  }
  ${(props) =>
    css`
      ${props.styleOverride}
    `};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default PrimaryButton;
