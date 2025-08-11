import { memo, useCallback, useEffect } from 'react';
import CharSheetRowLabel from '../../CharlSheetRowLabel/CharSheetRowLabel';
import FormItem from '../../FormItem';
import { InputNumber } from 'antd';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import authStore from '../../../store/authStore';
import { toJS } from 'mobx';

const SavingThrowContainer = styled.div`
  display: grid;
  grid-template-columns: 82px 44px 44px 44px 44px 44px 44px;
  justify-items: center;
  align-items: center;
`;

const SavingThrow = observer(
  ({ store, name, abilityName, charId, userId, showLabels = false, canEdit }) => {
    const { openedCharacter, changeSavingThrows, handleCopyToClickBoard } = store;
    const { user } = authStore;

    const copyToClickBoard = useCallback(() => {
      const total = openedCharacter?.savingThrows?.[name]?.total;
      handleCopyToClickBoard(
        `1d20${total > 0 ? '+' : ''}${openedCharacter?.savingThrows?.[name]?.total}`
      );
    }, [openedCharacter]);

    return (
      <SavingThrowContainer>
        <CharSheetRowLabel label={name} handleOnClick={copyToClickBoard} />
        <FormItem label={showLabels && 'total'} textAlign='center' noBgLabel>
          <InputNumber
            value={openedCharacter?.savingThrows?.[name]?.total || null}
            controls={false}
            style={{ width: '100%' }}
            disabled
          />
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
            disabled={canEdit}
          />
        </FormItem>

        <FormItem
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
          <InputNumber
            value={
              openedCharacter.abilities?.[abilityName]?.tempModifier !== null
                ? openedCharacter.abilities?.[abilityName]?.tempModifier
                : openedCharacter.abilities?.[abilityName]?.modifier
            }
            controls={false}
            style={{ width: '100%', color: 'black' }}
            disabled
          />
        </FormItem>

        <FormItem label={showLabels && 'magic modifier'} textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%' }}
            value={openedCharacter?.equipBonuses?.savingThrows?.[name] || null}
            disabled
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
            disabled={canEdit}
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
            disabled={canEdit}
          />
        </FormItem>
      </SavingThrowContainer>
    );
  }
);

export default memo(SavingThrow);
