import { memo } from 'react';
import styled from 'styled-components';
import { Tooltip } from 'antd';

const StyledContainer = styled.span`
  background-color: black;
  color: white;
  padding: 3px 0;
  width: 100%;
  text-align: center;
  font-size: 13px;
  cursor: pointer;
`;

const CharSheetRowLabel = ({ label, desc, handleOnClick }) => {
  return (
    <Tooltip title={desc}>
      <StyledContainer onClick={handleOnClick}>{label.toUpperCase()}</StyledContainer>
    </Tooltip>
  );
};

export default memo(CharSheetRowLabel);
