import { memo } from 'react';
import styled from 'styled-components';

const StyledSvg = styled.svg`
  cursor: pointer;
  transform: scale(0.9);
  transition: all ease 0.5s;

  & path {
    fill: ${(p) => {
      p.color;
    }};
  }

  &:hover {
    fill: purple;
    transform: scale(1);
  }
`;

const CampIcon = ({ size, color = 'black', handleClick }) => {
  return (
    <StyledSvg
      xmlns='http://www.w3.org/2000/svg'
      color={color}
      width={size}
      height={size}
      onClick={handleClick}
      viewBox='0 0 24 24'
    >
      <path d='m15.9 18.5l6 1.6l-.4 1.9l-9.4-2.5L2.7 22l-.5-1.9l6-1.6l-6.1-1.6l.5-1.9l9.4 2.5l9.4-2.5l.5 1.9l-6 1.6m.17-10.58c-.16-.22-.36-.42-.57-.59c-.45-.43-1-.74-1.44-1.2C13 5.08 12.79 3.34 13.44 2c-.65.17-1.26.54-1.77.95C9.84 4.46 9.11 7.1 10 9.38c0 .07.04.15.04.24c0 .16-.11.3-.25.38a.512.512 0 0 1-.57-.23c-.8-1.03-.93-2.51-.38-3.7c-1.19.99-1.84 2.65-1.73 4.22c.02.36.07.71.19 1.07c.11.44.29.87.52 1.25c.75 1.25 2.08 2.15 3.5 2.33c1.52.2 3.14-.09 4.31-1.15c1.3-1.2 1.77-3.12 1.08-4.79l-.1-.17c-.14-.33-.33-.63-.57-.9l.03-.01m-2.24 4.55c-.2.18-.52.36-.78.44c-.79.28-1.59-.12-2.05-.6c.84-.2 1.34-.84 1.5-1.48c.11-.58-.11-1.05-.21-1.61c-.08-.53-.07-.99.13-1.49c.13.27.27.55.44.77c.55.72 1.41 1.04 1.59 2c.02.13.05.22.05.33c0 .6-.24 1.24-.68 1.64'></path>
    </StyledSvg>
  );
};

export default memo(CampIcon);
