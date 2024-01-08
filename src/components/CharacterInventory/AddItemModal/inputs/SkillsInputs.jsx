import { memo } from 'react';
import { StyledFormItem } from '../../../../uiComponents/uiComponents';
import { Button, Input, InputNumber, Select } from 'antd';
import styled from 'styled-components';
import TextArea from 'antd/es/input/TextArea';
import { requiredRule } from '../const';
import { availableAbilitiesForSelect, availableSkills } from '../../../../utils/consts';

const Container = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 4fr 32px;
  column-gap: 5px;
`;

const SkillsInputs = ({ inputKey, deleteField }) => {
  return (
    <Container>
      <StyledFormItem label='skill' name={['skill', inputKey, 'name']} rules={[requiredRule]}>
        <Select
          showSearch
          options={Object.values(availableSkills)}
          filterOption={(input, option) =>
            ((option?.label || option?.value) ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </StyledFormItem>

      <StyledFormItem name={['skill', inputKey, 'count']} label='count' rules={[requiredRule]}>
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

export default memo(SkillsInputs);
