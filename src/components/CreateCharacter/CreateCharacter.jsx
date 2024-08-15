import { Button, Checkbox, Form, Input, Select } from 'antd';
import { memo, useState } from 'react';
import styled from 'styled-components';
import authStore from '../../store/authStore';
import { observer } from 'mobx-react';
import charactersStore from '../../store/charactersStore';
import { useNavigate } from 'react-router-dom';
import { alignmentSelectOptions, availableClasses } from '../../utils/consts';

const StyledForm = styled(Form)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: fit-content;
  grid-template-areas:
    'title title title'
    'name name name'
    'alignment alignment alignment'
    'classes classes classes'
    'level level level'
    'race race race'
    'private . .'
    '. . submit';
  width: 100%;
  max-width: 360px;
  padding: 5px 10px;
  align-content: start;
  background-color: white;
  border-radius: 6px;
`;

const StyledFormItem = styled(Form.Item)`
  margin: 0;
  grid-area: ${(p) => p.gridarea ?? ''};
`;

const ButtonBox = styled.div`
  display: flex;
  padding-top: 15px;
  justify-content: end;
  grid-area: submit;
`;

const StyledHeader = styled.h3`
  grid-area: title;
  margin: 0;
`;

const CreateCharacter = observer(() => {
  const [hasSpells, setHasSpells] = useState(false);
  const { user } = authStore;
  const { createCharacter } = charactersStore;

  const navigate = useNavigate();

  const handleFinish = async (values) => {
    await createCharacter(
      user.uid,
      { ...values, private: values.private ?? false },
      hasSpells,
      () => navigate('/')
    );
  };

  return (
    <StyledForm
      onFinish={handleFinish}
      layout='vertical'
      labelAlign='left'
      disabled={false /* authLoadingState === 'loading' */}
    >
      <StyledHeader>Create character</StyledHeader>

      <StyledFormItem
        gridarea='name'
        name='name'
        label='name'
        rules={[{ required: true }, { max: 30 }]}
      >
        <Input allowClear />
      </StyledFormItem>

      <StyledFormItem
        gridarea='alignment'
        name='alignment'
        label='alignment'
        rules={[{ required: true }]}
      >
        <Select options={alignmentSelectOptions} allowClear />
      </StyledFormItem>

      <StyledFormItem gridarea='classes' name='classes' label='class' rules={[{ required: true }]}>
        <Select
          showSearch
          options={Object.keys(availableClasses).map((el) => ({ value: el }))}
          allowClear
        />
      </StyledFormItem>

      <StyledFormItem gridarea='race' name='race' label='race' rules={[{ required: true }]}>
        <Input allowClear />
      </StyledFormItem>

      <StyledFormItem gridarea='private' name='private' label='private' valuePropName='checked'>
        <Checkbox />
      </StyledFormItem>

      <ButtonBox>
        <StyledFormItem>
          <Button type='default' htmlType='submit'>
            Create
          </Button>
        </StyledFormItem>
      </ButtonBox>
    </StyledForm>
  );
});

export default memo(CreateCharacter);
