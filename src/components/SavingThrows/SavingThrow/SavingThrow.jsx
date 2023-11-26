import { memo, useEffect } from 'react';
import CharSheetRowLabel from '../../CharlSheetRowLabel/CharSheetRowLabel';
import FormItem from '../../FormItem';
import { InputNumber } from 'antd';
import { observer } from 'mobx-react';
import charactersStore from '../../../store/charactersStore';
import styled from 'styled-components';
import authStore from '../../../store/authStore';

const SavingThrowContainer = styled.div`
  display: grid;
  grid-template-columns: 82px 44px 44px 44px 44px 44px 44px;
  justify-items: center;
  align-items: center;
`;

const SavingThrow = observer(({ name, abilityName, charId, userId, showLabels = false }) => {
  const { openedCharacter, changeSavingThrows } = charactersStore;
  const { user } = authStore;

  return (
    <SavingThrowContainer>
      <CharSheetRowLabel label={name} />
      <FormItem
        name={['savingThrows', name, 'total']}
        label={showLabels && 'total'}
        textAlign='center'
        noBgLabel
      >
        <InputNumber controls={false} style={{ width: '100%' }} disabled />
      </FormItem>

      <FormItem
        name={['savingThrows', name, 'base']}
        label={showLabels && 'base'}
        textAlign='center'
        noBgLabel
      >
        <InputNumber
          controls={false}
          style={{ width: '100%' }}
          onChange={(value) =>
            changeSavingThrows(userId || user.uid, charId, name, 'base', value, abilityName)
          }
        />
      </FormItem>

      <FormItem
        name={
          openedCharacter.abilities?.[abilityName]?.tempModifier !== undefined
            ? ['abilities', abilityName, 'tempModifier']
            : ['abilities', abilityName, 'modifier']
        }
        label={showLabels && 'ability modifier'}
        textAlign='center'
        noBgLabel
        labelDesc={
          <div>
            <p style={{ margin: 0 }}>FORTITUDE: CON</p>
            <p style={{ margin: 0 }}>REFLEX: DEX</p>
            <p style={{ margin: 0 }}>WILL: WIS</p>
          </div>
        }
      >
        <InputNumber controls={false} style={{ width: '100%', color: 'black' }} disabled />
      </FormItem>

      <FormItem
        name={['savingThrows', name, 'magicMod']}
        label={showLabels && 'magic modifier'}
        textAlign='center'
        noBgLabel
      >
        <InputNumber
          controls={false}
          style={{ width: '100%' }}
          onChange={(value) =>
            changeSavingThrows(userId || user.uid, charId, name, 'magicMod', value, abilityName)
          }
        />
      </FormItem>

      <FormItem
        name={['savingThrows', name, 'miscMod']}
        label={showLabels && 'misc modifier'}
        textAlign='center'
        noBgLabel
      >
        <InputNumber
          controls={false}
          style={{ width: '100%' }}
          onChange={(value) =>
            changeSavingThrows(userId || user.uid, charId, name, 'miscMod', value, abilityName)
          }
        />
      </FormItem>

      <FormItem
        name={['savingThrows', name, 'tempMod']}
        label={showLabels && 'temporary modifier'}
        textAlign='center'
        noBgLabel
      >
        <InputNumber
          controls={false}
          style={{ width: '100%' }}
          onChange={(value) =>
            changeSavingThrows(userId || user.uid, charId, name, 'tempMod', value, abilityName)
          }
        />
      </FormItem>
    </SavingThrowContainer>
  );
});

export default memo(SavingThrow);
