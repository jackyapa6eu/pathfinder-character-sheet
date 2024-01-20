import { memo } from 'react';
import styled from 'styled-components';

const StyledSvg = styled.svg`
  cursor: pointer;
  transform: scale(0.9);
  transition: all ease 0.5s;
  align-self: center;
  justify-self: center;
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

const DayIcon = ({ size, color = 'white', handleClick }) => {
  return (
    <StyledSvg
      color={color}
      width={size}
      height={size}
      onClick={handleClick}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
    >
      <path
        fill='#ffffff'
        d='M6 20q-1.65 0-2.825-1.175T2 16q0-1.65 1.175-2.825T6 12q1.2 0 2.213.65t1.462 1.775l.25.575h.6q1.05 0 1.763.725T13 17.5q0 1.05-.725 1.775T10.5 20zm8.975-2.8q-.1-1.575-1.137-2.725t-2.613-1.425q-.775-1.35-2.087-2.137T6.25 10q.65-1.825 2.225-2.912T12 6q2.5 0 4.25 1.75T18 12q0 1.625-.8 3.013T14.975 17.2M11 5V1h2v4zm6.65 2.75l-1.4-1.4l2.8-2.85l1.425 1.425zM19 13v-2h4v2zm.05 7.5l-2.8-2.85l1.4-1.4l2.85 2.8zM6.35 7.75L3.525 4.925L4.95 3.5l2.8 2.85z'
      ></path>
    </StyledSvg>
  );
};

export default memo(DayIcon);
