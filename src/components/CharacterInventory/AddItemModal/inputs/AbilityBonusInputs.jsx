import { memo } from 'react';
import { StyledFormItem } from '../../../../uiComponents/uiComponents';
import { Button, Input, InputNumber, Select } from 'antd';
import styled from 'styled-components';
import TextArea from 'antd/es/input/TextArea';
import { requiredRule } from '../const';
import { availableAbilitiesForSelect } from '../../../../utils/consts';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 5fr 32px;
  column-gap: 5px;
`;

const AbilityBonusInputs = ({ inputKey, deleteField }) => {
  return (
    <Container>
      <StyledFormItem
        label='ability'
        name={['abilityBonus', inputKey, 'name']}
        rules={[requiredRule]}
      >
        <Select options={availableAbilitiesForSelect} />
      </StyledFormItem>

      <StyledFormItem
        name={['abilityBonus', inputKey, 'count']}
        label='count'
        rules={[requiredRule]}
      >
        <InputNumber controls={false} style={{ width: '100%' }} />
      </StyledFormItem>

      <div />

      <Button
        htmlType='button'
        style={{ width: '100%', padding: 0, alignSelf: 'end' }}
        onClick={() => deleteField(inputKey)}
      >
        -
      </Button>
    </Container>
  );
};

export default memo(AbilityBonusInputs);
