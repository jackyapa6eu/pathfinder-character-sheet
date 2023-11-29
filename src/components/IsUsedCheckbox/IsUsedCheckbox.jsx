import { observer } from 'mobx-react';
import { memo } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const CheckBoxContainer = styled.span`
  cursor: pointer;
  width: 15px;
  height: 14px;
  border-radius: 3px;
  border: 1px solid black;
  background: white;
  display: flex;
`;

const IsUsedCheckbox = observer(({ checked, handleClick }) => {
  return (
    <CheckBoxContainer onClick={handleClick}>
      {checked ? <CloseOutlined style={{ color: 'black' }} /> : null}
    </CheckBoxContainer>
  );
});

export default memo(IsUsedCheckbox);
