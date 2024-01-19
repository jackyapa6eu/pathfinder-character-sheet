import { memo } from 'react';
import { StyledFormItem } from '../../../../uiComponents/uiComponents';
import { Button, Input, InputNumber, Select } from 'antd';
import styled from 'styled-components';
import TextArea from 'antd/es/input/TextArea';
import { requiredRule } from '../const';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 2fr 32px;
  column-gap: 5px;

  @media screen and (max-width: 660px) {
    & {
      grid-template-columns: 1fr 1fr;
    }
  }
`;

const ChargesInputs = ({ inputKey, deleteField }) => {
  return (
    <Container>
      <StyledFormItem
        name={['charges', inputKey, 'name']}
        label='charges name'
        rules={[requiredRule]}
      >
        <Input />
      </StyledFormItem>

      <StyledFormItem name={['charges', inputKey, 'description']} label='charges description'>
        <TextArea autoSize />
      </StyledFormItem>
      <StyledFormItem
        name={['charges', inputKey, 'count']}
        label='charges count'
        rules={[requiredRule]}
      >
        <InputNumber controls={false} style={{ width: '100%' }} />
      </StyledFormItem>
      <StyledFormItem
        label='charges type'
        name={['charges', inputKey, 'restorable']}
        rules={[requiredRule]}
      >
        <Select
          options={[
            { value: true, label: 'Restorable' },
            { value: false, label: 'Non restorable' },
          ]}
        />
      </StyledFormItem>
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

export default memo(ChargesInputs);
