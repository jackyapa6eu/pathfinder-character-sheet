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
  grid-template-columns: 38px 44px 44px 44px 44px 44px 44px;
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
  const { changeHitPoints, openedCharacter, changeMiscInitiative, changeAc, maxDexByLoad } =
    charactersStore;
  const { user } = authStore;
  const [totalInitiative, setTotalInitiative] = useState(null);
  const [totalAc, setTotalAc] = useState(null);
  const [touch, setTouch] = useState(null);
  const [flat, setFlat] = useState(null);

  const tempDexMod = openedCharacter.abilities?.dex?.tempModifier;
  const dexMod = openedCharacter.abilities?.dex?.modifier;
  const maxDex = Math.min(openedCharacter.equipBonuses?.maxDex || 99, maxDexByLoad);

  const resultDex = Math.min(tempDexMod ?? dexMod, maxDex);
  useEffect(() => {
    const initiative = openedCharacter.abilities?.dex
      ? (openedCharacter.initiative?.miscModifier || 0) + (tempDexMod ?? dexMod)
      : null;

    const getAcBonuses = (name) => {
      return [openedCharacter.equipBonuses?.acBonus?.[name] || 0, openedCharacter.ac?.[name] || 0];
    };
    const getSum = (arr) => arr.reduce((acc, val) => acc + val, 0);

    const armor = Math.max(...getAcBonuses('armor'));
    const deflection = Math.max(...getAcBonuses('deflection'));
    const dodge = getSum(getAcBonuses('dodge'));
    const enhancement = Math.max(...getAcBonuses('enhancement'));
    const insight = Math.max(...getAcBonuses('insight'));
    const luck = Math.max(...getAcBonuses('luck'));
    const natural = Math.max(...getAcBonuses('natural'));
    const profane = Math.max(...getAcBonuses('profane'));
    const sacred = Math.max(...getAcBonuses('sacred'));
    const shield = Math.max(...getAcBonuses('shield'));
    const size = openedCharacter.ac?.size || 0;

    const ac = openedCharacter.abilities?.dex
      ? 10 +
        armor +
        deflection +
        dodge +
        enhancement +
        insight +
        luck +
        natural +
        profane +
        sacred +
        shield +
        size +
        resultDex
      : null;

    const touchArmor = openedCharacter.abilities?.dex
      ? 10 + deflection + dodge + insight + luck + profane + sacred + size + resultDex
      : null;

    const flatArmor =
      10 +
      armor +
      deflection +
      enhancement +
      insight +
      luck +
      natural +
      profane +
      sacred +
      shield +
      size;

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

        {Object.entries(openedCharacter.equipBonuses?.acBonus || {})
          .filter(([, value]) => !!value)
          .map(([key, value]) => {
            return (
              <FormItem key={key} label={key} textAlign='center' noBgLabel>
                <InputNumber
                  controls={false}
                  value={value || null}
                  disabled
                  style={{ width: '100%', color: 'black' }}
                />
              </FormItem>
            );
          })}

        <FormItem label='dex' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            value={resultDex}
            style={{ width: '100%', color: 'black' }}
            disabled
          />
        </FormItem>

        <FormItem name={['ac', 'armor']} label='armor' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAc(userId || user.uid, charId, 'armor', value)}
            disabled={canEdit}
          />
        </FormItem>

        <FormItem name={['ac', 'shield']} label='shield' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAc(userId || user.uid, charId, 'shield', value)}
            disabled={canEdit}
          />
        </FormItem>

        <FormItem name={['ac', 'dodge']} label='dodge' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAc(userId || user.uid, charId, 'dodge', value)}
            disabled={canEdit}
          />
        </FormItem>
        <FormItem name={['ac', 'natural']} label='natural' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAc(userId || user.uid, charId, 'natural', value)}
            disabled={canEdit}
          />
        </FormItem>
        <FormItem name={['ac', 'deflection']} label='deflection' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAc(userId || user.uid, charId, 'deflection', value)}
            disabled={canEdit}
          />
        </FormItem>

        <FormItem name={['ac', 'insight']} label='insight' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAc(userId || user.uid, charId, 'insight', value)}
            disabled={canEdit}
          />
        </FormItem>

        <FormItem name={['ac', 'luck']} label='luck' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAc(userId || user.uid, charId, 'luck', value)}
            disabled={canEdit}
          />
        </FormItem>
        <FormItem name={['ac', 'enhancement']} label='enhancement' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAc(userId || user.uid, charId, 'enhancement', value)}
            disabled={canEdit}
          />
        </FormItem>
        <FormItem name={['ac', 'profane']} label='profane' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAc(userId || user.uid, charId, 'profane', value)}
            disabled={canEdit}
          />
        </FormItem>
        <FormItem name={['ac', 'sacred']} label='sacred' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAc(userId || user.uid, charId, 'sacred', value)}
            disabled={canEdit}
          />
        </FormItem>

        <FormItem name={['ac', 'size']} label='size' textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAc(userId || user.uid, charId, 'size', value)}
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
