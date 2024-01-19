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

  @media screen and (max-width: 660px) {
    & {
      grid-template-columns: 1fr 1fr;
    }
  }
`;

const SavingThrowsInputs = ({ inputKey, deleteField }) => {
  return (
    <Container>
      <StyledFormItem
        label='saving throw'
        name={['savingThrows', inputKey, 'name']}
        rules={[requiredRule]}
      >
        <Select options={[{ value: 'fortitude' }, { value: 'reflex' }, { value: 'will' }]} />
      </StyledFormItem>

      <StyledFormItem
        name={['savingThrows', inputKey, 'count']}
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

export default memo(SavingThrowsInputs);
