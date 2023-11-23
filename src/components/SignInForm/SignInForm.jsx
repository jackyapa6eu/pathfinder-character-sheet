import { Button, Form, Input } from 'antd';
import { memo } from 'react';
import styled from 'styled-components';
import authStore from '../../store/authStore';
import { observer } from 'mobx-react';

const StyledForm = styled(Form)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: fit-content;
  grid-template-areas:
    'title title title'
    'email email email'
    'password password password'
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

const SignInForm = observer(() => {
  const { signIn, authLoadingState } = authStore;

  const handleFinish = async (values) => {
    await signIn(values);
  };

  return (
    <StyledForm
      onFinish={handleFinish}
      layout='vertical'
      labelAlign='left'
      disabled={authLoadingState === 'loading'}
    >
      <StyledHeader>Login</StyledHeader>
      <StyledFormItem
        gridarea='email'
        name='email'
        label='email'
        rules={[{ required: true, type: 'email' }]}
      >
        <Input allowClear />
      </StyledFormItem>

      <StyledFormItem
        gridarea='password'
        name='password'
        label='password'
        rules={[{ required: true, min: 6 }]}
      >
        <Input.Password type='password' allowClear />
      </StyledFormItem>

      <ButtonBox>
        <StyledFormItem>
          <Button type='default' htmlType='submit'>
            Войти
          </Button>
        </StyledFormItem>
      </ButtonBox>
    </StyledForm>
  );
});

export default memo(SignInForm);
