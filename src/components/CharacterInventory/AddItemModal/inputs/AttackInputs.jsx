import { memo } from 'react';
import { StyledFormItem } from '../../../../uiComponents/uiComponents';
import { Button, Input, InputNumber, Select } from 'antd';
import styled from 'styled-components';
import TextArea from 'antd/es/input/TextArea';
import { requiredRule } from '../const';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 32px;
  grid-auto-flow: row;
  column-gap: 5px;
  @media screen and (max-width: 660px) {
    & {
      grid-template-columns: 1fr 1fr;
    }
  }
`;

const AttackInputs = ({ inputKey, deleteField }) => {
  return (
    <Container>
      <StyledFormItem
        name={['attack', inputKey, 'attackBonus']}
        label='ability attack mod'
        rules={[requiredRule]}
      >
        <Select allowClear options={[{ value: 'dex' }, { value: 'str' }, { value: 'wis' }]} />
      </StyledFormItem>

      <StyledFormItem
        name={['attack', inputKey, 'weaponAttackBonus']}
        label='weapon attack bonus'
        rules={[requiredRule]}
      >
        <InputNumber controls={false} style={{ width: '100%' }} />
      </StyledFormItem>

      <StyledFormItem
        name={['attack', inputKey, 'damageBonus']}
        label='ability damage mod'
        rules={[requiredRule]}
      >
        <Select allowClear options={[{ value: 'str' }, { value: false, label: 'none' }]} />
      </StyledFormItem>

      <Button
        htmlType='button'
        style={{ width: '100%', padding: 0, alignSelf: 'end' }}
        onClick={() => deleteField(inputKey)}
      >
        -
      </Button>

      <StyledFormItem name={['attack', inputKey, 'maxDamageBonus']} label='max ability damage mod'>
        <InputNumber controls={false} style={{ width: '100%' }} />
      </StyledFormItem>

      <StyledFormItem
        name={['attack', inputKey, 'weaponDamageBonus']}
        label='weapon damage bonus'
        rules={[requiredRule]}
      >
        <InputNumber controls={false} style={{ width: '100%' }} />
      </StyledFormItem>
    </Container>
  );
};

export default memo(AttackInputs);
