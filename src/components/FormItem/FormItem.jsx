import styled from 'styled-components';
import { Form, Tooltip } from 'antd';
import { memo } from 'react';

const StyledFormItem = styled(Form.Item)`
  margin: 0;
  & input {
    text-align: ${(p) => p.textalign ?? 'start'}!important;
  }
`;

const FormItemContainer = styled.div`
  position: relative;
  width: 100%;
  grid-area: ${(p) => p.gridarea ?? ''};
`;

const LabelContainer = styled.div`
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  height: 16px;
  z-index: 5;
  display: flex;
  align-items: end;
  justify-content: center;
  cursor: pointer;
`;

const Label = styled.p`
  margin: 0;
  max-width: 115%;
  width: fit-content;
  background-color: ${(p) => (p.nobg ? 'transparent' : 'white')};
  box-shadow: 0 0 1px gray;
  border-radius: 3px;
  padding: 0 3px;
  font-size: 7px;
  text-align: center;
  line-height: 8px;
  font-weight: 500;
`;

const FormItem = ({
  name,
  gridArea,
  children,
  label = false,
  noBgLabel = false,
  labelDesc,
  textAlign,
}) => {
  return (
    <FormItemContainer gridarea={gridArea}>
      {label && (
        <Tooltip title={labelDesc}>
          <LabelContainer>
            <Label nobg={noBgLabel}>{label}</Label>
          </LabelContainer>
        </Tooltip>
      )}
      <StyledFormItem name={name} textalign={textAlign}>
        {children}
      </StyledFormItem>
    </FormItemContainer>
  );
};

export default memo(FormItem);
