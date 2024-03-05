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
  gap: 5px;
`;

const TotalHitPoints = styled.div`
  display: grid;
  grid-template-columns: 38px 44px 88px 88px;
  justify-items: center;
  align-items: center;
`;

const Initiative = styled.div`
  display: grid;
  grid-template-columns: 82px 44px 44px 44px;
  justify-items: center;
  align-items: center;
`;

const Ac = styled.div`
  display: grid;
  grid-template-columns: 38px 44px 44px 44px 44px 44px 44px 44px;
  justify-items: center;
  align-items: center;
`;

const TouchFlat = styled.div`
  display: grid;
  grid-template-columns: 82px 44px 89px 44px;
  justify-items: center;
  align-items: center;
`;

const HitPointsInitiativeArmor = observer(({ charId, userId, canEdit }) => {
  const { changeHitPoints, openedCharacter, changeMiscInitiative, changeAc } = charactersStore;
  const { user } = authStore;
  const [totalInitiative, setTotalInitiative] = useState(null);
  const [totalAc, setTotalAc] = useState(null);
  const [touch, setTouch] = useState(null);
  const [flat, setFlat] = useState(null);

  const tempDexMod = openedCharacter.abilities?.dex?.tempModifier;
  const dexMod = openedCharacter.abilities?.dex?.modifier;

  const resultDex = Math.min(tempDexMod ?? dexMod, openedCharacter.equipBonuses?.maxDex || 99);
  useEffect(() => {
    const initiative = openedCharacter.abilities?.dex
      ? (openedCharacter.initiative?.miscModifier || 0) + (tempDexMod ?? dexMod)
      : null;
    const ac = openedCharacter.abilities?.dex
      ? 10 +
        (openedCharacter.equipBonuses?.acBonus?.armor || 0) +
        (openedCharacter.equipBonuses?.acBonus?.shield || 0) +
        (openedCharacter.equipBonuses?.acBonus?.natural || 0) +
        (openedCharacter.equipBonuses?.acBonus?.deflection || 0) +
        (openedCharacter.ac?.miscModifier || 0) +
        resultDex
      : null;
    const touchArmor = openedCharacter.abilities?.dex
      ? 10 +
        (openedCharacter.equipBonuses?.acBonus?.deflection || 0) +
        (openedCharacter.ac?.miscModifier || 0) +
        resultDex
      : null;
    const flatArmor =
      10 +
      (openedCharacter.equipBonuses?.acBonus?.armor || 0) +
      (openedCharacter.equipBonuses?.acBonus?.shield || 0) +
      (openedCharacter.equipBonuses?.acBonus?.natural || 0) +
      (openedCharacter.equipBonuses?.acBonus?.deflection || 0) +
      (openedCharacter.ac?.miscModifier || 0);

    setTotalInitiative(initiative);
    setTotalAc(ac);
    setTouch(touchArmor);
    setFlat(flatArmor);
  }, [openedCharacter, openedCharacter.equipBonuses]);

  return (
    <HitPointsContainer>
      <TotalHitPoints>
        <CharSheetRowLabel label='hp' />
        <FormItem name={['hitPoints', 'total']} label='total' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%' }}
            onChange={(hpValue) => changeHitPoints(userId || user.uid, charId, 'total', hpValue)}
            disabled={canEdit}
          />
        </FormItem>
        <FormItem
          name={['hitPoints', 'wounds']}
          label='current'
          textAlign='center'
          labelDesc='Текущее количество хп'
          noBgLabel
        >
          <InputNumber
            controls={false}
            style={{ width: '100%' }}
            onChange={(hpValue) => changeHitPoints(userId || user.uid, charId, 'wounds', hpValue)}
            disabled={canEdit}
          />
        </FormItem>

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
            disabled={canEdit}
          />
        </FormItem>
      </TotalHitPoints>

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
        <FormItem label='dex modifier' textAlign='center' noBgLabel>
          <InputNumber
            value={
              openedCharacter.abilities?.dex?.tempModifier !== null
                ? openedCharacter.abilities?.dex?.tempModifier
                : openedCharacter.abilities?.dex?.modifier
            }
            controls={false}
            style={{ width: '100%', color: 'black' }}
            disabled
          />
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
            disabled={canEdit}
          />
        </FormItem>
      </Initiative>
      <Ac>
        <CharSheetRowLabel label='ac' />
        <FormItem label='total' textAlign='center' noBgLabel>
          <InputNumber
            value={totalAc}
            controls={false}
            style={{ width: '100%', color: 'black' }}
            disabled
          />
        </FormItem>
        <FormItem label='armor' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            value={openedCharacter.equipBonuses?.acBonus?.armor || null}
            disabled
            style={{ width: '100%', color: 'black' }}
          />
        </FormItem>
        <FormItem label='shield' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            disabled
            value={openedCharacter.equipBonuses?.acBonus?.shield || null}
            style={{ width: '100%', color: 'black' }}
          />
        </FormItem>
        <FormItem label='dex' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            value={resultDex}
            style={{ width: '100%', color: 'black' }}
            disabled
          />
        </FormItem>
        <FormItem label='natural' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            disabled
            value={openedCharacter.equipBonuses?.acBonus?.natural || null}
          />
        </FormItem>
        <FormItem label='deflection' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            disabled
            value={openedCharacter.equipBonuses?.acBonus?.deflection || null}
          />
        </FormItem>
        <FormItem name={['ac', 'miscModifier']} label='misc' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAc(userId || user.uid, charId, 'miscModifier', value)}
            disabled={canEdit}
          />
        </FormItem>
      </Ac>
      <TouchFlat>
        <CharSheetRowLabel label='touch' />
        <FormItem textAlign='center' noBgLabel>
          <InputNumber
            value={touch}
            controls={false}
            style={{ width: '100%', color: 'black' }}
            disabled
          />
        </FormItem>
        <CharSheetRowLabel label='flat-footed' />
        <FormItem textAlign='center' noBgLabel>
          <InputNumber
            value={flat}
            controls={false}
            style={{ width: '100%', color: 'black' }}
            disabled
          />
        </FormItem>
      </TouchFlat>
    </HitPointsContainer>
  );
});

export default memo(HitPointsInitiativeArmor);
