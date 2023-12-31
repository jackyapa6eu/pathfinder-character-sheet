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
`;

const CharSheetRowLabel = ({ label, desc }) => {
  return (
    <Tooltip title={desc}>
      <StyledContainer>{label.toUpperCase()}</StyledContainer>
    </Tooltip>
  );
};

export default memo(CharSheetRowLabel);
