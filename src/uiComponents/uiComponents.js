import styled from 'styled-components';
import { Form } from 'antd';

const StyledFormItem = styled(Form.Item)`
  margin: 0;
  width: 100%;
  grid-area: ${(p) => p.gridarea ?? ''};
`;

const ButtonBox = styled.div`
  display: flex;
  padding-top: 15px;
  justify-content: end;
  grid-area: submit;
`;

export { StyledFormItem, ButtonBox };
