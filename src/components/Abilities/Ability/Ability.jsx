import { memo } from 'react';
import styled from 'styled-components';
import FormItem from '../../FormItem';
import { InputNumber, Tooltip } from 'antd';
import charactersStore from '../../../store/charactersStore';
import { observer } from 'mobx-react';
import authStore from '../../../store/authStore';
import CharSheetRowLabel from '../../CharlSheetRowLabel/CharSheetRowLabel';

const AbilityContainer = styled.div`
  display: grid;
  grid-template-columns: 38px 44px 44px 44px 44px;
  justify-items: center;
  align-items: center;
`;

const Ability = observer(({ name = '', showLabel = false, abilityDesc, charId, userId }) => {
  const { changeAbilityDebounce } = charactersStore;
  const { user } = authStore;

  const handleScoreChange = async (value, name, type) => {
    await changeAbilityDebounce(userId || user.uid, charId, name, type, value);
  };

  return (
    <AbilityContainer>
      <CharSheetRowLabel label={name} desc={abilityDesc} />

      <FormItem
        name={['abilities', name, 'score']}
        label={showLabel && 'ability score'}
        textAlign='center'
        labelDesc='Базовое значение'
        noBgLabel
      >
        <InputNumber
          controls={false}
          style={{ width: '100%' }}
          onChange={(value) => handleScoreChange(value, name, 'score')}
        />
      </FormItem>
      <FormItem
        name={['abilities', name, 'modifier']}
        label={showLabel && 'ability modifier'}
        textAlign='center'
        labelDesc='Модификатор'
        noBgLabel
      >
        <InputNumber controls={false} style={{ width: '100%', color: 'black' }} disabled />
      </FormItem>
      <FormItem
        name={['abilities', name, 'adjustment']}
        label={showLabel && 'temp adjustment'}
        textAlign='center'
        labelDesc={'Временная корректировка.\n Может быть отрицательным.'}
        noBgLabel
      >
        <InputNumber
          controls={false}
          style={{ width: '100%' }}
          onChange={(value) => handleScoreChange(value, name, 'adjustment')}
        />
      </FormItem>
      <FormItem
        name={['abilities', name, 'tempModifier']}
        label={showLabel && 'temp modifier'}
        textAlign='center'
        noBgLabel
        labelDesc={'Временный модификатор.'}
      >
        <InputNumber controls={false} style={{ width: '100%', color: 'black' }} disabled />
      </FormItem>
    </AbilityContainer>
  );
});

export default memo(Ability);
