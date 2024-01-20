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

const NightIcon = ({ size, color = 'white', handleClick }) => {
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
        fill='#000000'
        d='M13.1 23h-2.6l.5-.312q.5-.313 1.088-.7t1.087-.7l.5-.313q2.025-.15 3.738-1.225t2.712-2.875q-2.15-.2-4.075-1.088t-3.45-2.412q-1.525-1.525-2.425-3.45T9.1 5.85Q7.175 6.925 6.088 8.813T5 12.9v.3l-.3.138q-.3.137-.663.287t-.662.288l-.3.137q-.05-.275-.062-.575T3 12.9q0-3.65 2.325-6.437T11.25 3q-.45 2.475.275 4.838t2.5 4.137q1.775 1.775 4.138 2.5T23 14.75q-.65 3.6-3.45 5.925T13.1 23M6 21h4.5q.625 0 1.063-.437T12 19.5q0-.625-.425-1.062T10.55 18h-1.3l-.5-1.2q-.35-.825-1.1-1.312T6 15q-1.25 0-2.125.863T3 18q0 1.25.875 2.125T6 21m0 2q-2.075 0-3.537-1.463T1 18q0-2.075 1.463-3.537T6 13q1.5 0 2.738.813T10.575 16Q12 16.05 13 17.063t1 2.437q0 1.45-1.025 2.475T10.5 23z'
      ></path>
    </StyledSvg>
  );
};

export default memo(NightIcon);
