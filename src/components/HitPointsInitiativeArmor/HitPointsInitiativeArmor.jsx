import { memo, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import CharSheetRowLabel from '../CharlSheetRowLabel/CharSheetRowLabel';
import FormItem from '../FormItem';
import { InputNumber } from 'antd';
import charactersStore from '../../store/charactersStore';
import authStore from '../../store/authStore';
import { toJS } from 'mobx';

const HitPointsContainer = styled.div`
  grid-area: HitPointsInitiativeArmor;
  display: flex;
  padding-top: 15px;
  flex-direction: column;
  width: 100%;
  margin: 0;
  height: max-content;
  gap: 3px;
`;

const TotalHitPoints = styled.div`
  display: grid;
  grid-template-columns: 38px 44px;
  justify-items: center;
  align-items: center;
`;

const Initiative = styled.div`
  display: grid;
  grid-template-columns: 82px 44px 44px 44px;
  justify-items: center;
  align-items: center;
`;

const HitPointsInitiativeArmor = observer(({ charId, userId }) => {
  const { changeHitPoints, openedCharacter, changeMiscInitiative } = charactersStore;
  const { user } = authStore;
  const [totalInitiative, setTotalInitiative] = useState(null);

  useEffect(() => {
    const tempDexMod = openedCharacter.abilities?.dex?.tempModifier;
    const dexMod = openedCharacter.abilities?.dex?.modifier;

    const total = (openedCharacter.initiative?.miscModifier || 0) + (tempDexMod || dexMod);
    console.log(tempDexMod);
    setTotalInitiative(total);
  }, [openedCharacter]);

  return (
    <HitPointsContainer>
      <TotalHitPoints>
        <CharSheetRowLabel label='hp' />
        <FormItem name={['hitPoints', 'total']} label='total' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%' }}
            onChange={(hpValue) => changeHitPoints(userId || user.uid, charId, 'total', hpValue)}
          />
        </FormItem>
      </TotalHitPoints>
      <div style={{ width: '82px' }}>
        <FormItem
          name={['hitPoints', 'wounds']}
          label='wounds'
          textAlign='center'
          labelDesc='Нанесенный урон / текущее количество хп'
          noBgLabel
        >
          <InputNumber
            controls={false}
            style={{ width: '100%' }}
            onChange={(hpValue) => changeHitPoints(userId || user.uid, charId, 'wounds', hpValue)}
          />
        </FormItem>
      </div>

      <div style={{ width: '82px' }}>
        <FormItem
          name={['hitPoints', 'nonLethal']}
          label='nonlethal'
          textAlign='center'
          labelDesc='Нелетальный урон'
          noBgLabel
        >
          <InputNumber
            controls={false}
            style={{ width: '100%' }}
            onChange={(hpValue) =>
              changeHitPoints(userId || user.uid, charId, 'nonLethal', hpValue)
            }
          />
        </FormItem>
      </div>

      <Initiative>
        <CharSheetRowLabel label='initiative' />
        <FormItem label='total' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            value={totalInitiative}
            disabled
          />
        </FormItem>
        <FormItem
          name={
            openedCharacter.abilities?.dex?.tempModifier
              ? ['abilities', 'dex', 'tempModifier']
              : ['abilities', 'dex', 'modifier']
          }
          label='dex modifier'
          textAlign='center'
          noBgLabel
        >
          <InputNumber controls={false} style={{ width: '100%', color: 'black' }} disabled />
        </FormItem>
        <FormItem
          name={['initiative', 'miscModifier']}
          label='misc modifier'
          textAlign='center'
          noBgLabel
        >
          <InputNumber
            controls={false}
            style={{ width: '100%' }}
            onChange={(value) => changeMiscInitiative(userId || user.uid, charId, value)}
          />
        </FormItem>
      </Initiative>
    </HitPointsContainer>
  );
});

export default memo(HitPointsInitiativeArmor);
