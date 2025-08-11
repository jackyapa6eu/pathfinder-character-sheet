import { memo, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Tooltip } from 'antd';

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid gray;
  border-radius: 4px;
  overflow: hidden;
  font-size: 12px;
  font-weight: bold;
  filter: ${({ isDarkTheme }) => (isDarkTheme ? 'invert(1)' : 'invert(0)')};
  color: ${({ $color }) => $color};

  && span {
    filter: ${({ isDarkTheme }) => (isDarkTheme ? 'invert(1)' : 'invert(0)')};
  }
`;

const Current = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: ${({ BGColor }) => BGColor};
  transform: scaleX(${({ $width }) => $width}%);
  transform-origin: left;
  transition: all ease 1s 0.5s;
  z-index: -1;
`;

export const ProgressBar = ({
  BGColor = 'red',
  color = 'black',
  current = 0,
  max = 0,
  isDarkTheme,
  description = 'Нечего здесь смотреть',
}) => {
  const percent = (current / max) * 100 || 0;

  return (
    <Tooltip title={description}>
      <MainContainer isDarkTheme={isDarkTheme} $color={color}>
        <span>
          {current} / {max}
        </span>
        <Current BGColor={BGColor} $width={percent} />
      </MainContainer>
    </Tooltip>
  );
};

export default memo(ProgressBar);
