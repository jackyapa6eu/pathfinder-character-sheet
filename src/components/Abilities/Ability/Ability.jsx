import { memo } from 'react';
import styled from 'styled-components';
import FormItem from '../../FormItem';
import { InputNumber } from 'antd';

const AbilityContainer = styled.div`
  display: grid;
  grid-template-columns: 32px 44px 44px 44px 44px;
  justify-items: center;
  align-items: center;
`;

const Ability = ({ name = '', showLabel = false }) => {
  return (
    <AbilityContainer>
      <span>{name.toUpperCase()}</span>

      <FormItem
        name={`${name}Score`}
        label={showLabel && 'ability score'}
        textAlign='center'
        noBgLabel
      >
        <InputNumber controls={false} style={{ width: '100%' }} />
      </FormItem>
      <FormItem
        name={`${name}Modifier`}
        label={showLabel && 'ability modifier'}
        textAlign='center'
        noBgLabel
      >
        <InputNumber controls={false} style={{ width: '100%' }} />
      </FormItem>
      <FormItem
        name={`${name}Adjustment`}
        label={showLabel && 'temp adjustment'}
        textAlign='center'
        noBgLabel
      >
        <InputNumber controls={false} style={{ width: '100%' }} />
      </FormItem>
      <FormItem
        name={`${name}TempModifier`}
        label={showLabel && 'temp modifier'}
        textAlign='center'
        noBgLabel
      >
        <InputNumber controls={false} style={{ width: '100%' }} />
      </FormItem>
    </AbilityContainer>
  );
};

export default memo(Ability);
