import { memo } from 'react';
import { StyledFormItem } from '../../../../uiComponents/uiComponents';
import { Button, Input, InputNumber, Select } from 'antd';
import styled from 'styled-components';
import TextArea from 'antd/es/input/TextArea';
import { requiredRule } from '../const';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 32px;
  column-gap: 5px;

  @media screen and (max-width: 660px) {
    & {
      grid-template-columns: 1fr 1fr;
    }
  }
`;

export const AcBonusType = {
  armor: 'armor',
  deflection: 'deflection',
  dodge: 'dodge',
  enhancement: 'enhancement',
  insight: 'insight',
  luck: 'luck',
  natural: 'natural',
  profane: 'profane',
  sacred: 'sacred',
  shield: 'shield',
};

export const acBonusTypeOptions = Object.values(AcBonusType).map((value) => ({ value }));

const AcBonusInputs = ({ inputKey, deleteField }) => {
  return (
    <Container>
      <>
        <StyledFormItem
          name={['acBonus', inputKey, 'acBonusType']}
          label='ac bonus type'
          rules={[requiredRule]}
        >
          <Select options={acBonusTypeOptions} />
        </StyledFormItem>
        <StyledFormItem
          name={['acBonus', inputKey, 'acBonus']}
          label='ac bonus'
          rules={[requiredRule]}
        >
          <InputNumber controls={false} style={{ width: '100%' }} />
        </StyledFormItem>
        <StyledFormItem
          name={['acBonus', inputKey, 'checkPenalty']}
          label='check penalty'
          rules={[{ required: true }]}
        >
          <InputNumber controls={false} style={{ width: '100%' }} />
        </StyledFormItem>
        <StyledFormItem
          name={['acBonus', inputKey, 'maxDex']}
          label='max dex'
          rules={[requiredRule]}
        >
          <InputNumber controls={false} style={{ width: '100%' }} />
        </StyledFormItem>
      </>
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

export default memo(AcBonusInputs);
