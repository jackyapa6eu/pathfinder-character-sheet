import { observer } from 'mobx-react';
import { memo } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

const StyledButton = styled(Button)`
  width: 24px;
  height: 24px;
  border-radius: 3px;
  background: white;
  border: 1px solid black;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const AddFreeSpellSlotButton = observer(({ handleClick }) => {
  return (
    <StyledButton onClick={handleClick}>
      <span>+</span>
    </StyledButton>
  );
});

export default memo(AddFreeSpellSlotButton);
