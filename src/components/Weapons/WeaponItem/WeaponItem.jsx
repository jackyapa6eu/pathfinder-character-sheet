import { observer } from 'mobx-react';
import { memo, useEffect, useState } from 'react';
import FormItem from '../../FormItem';
import { Button, Input, InputNumber, Select, Tooltip } from 'antd';
import styled from 'styled-components';
import CharSheetRowLabel from '../../CharlSheetRowLabel/CharSheetRowLabel';
import charactersStore from '../../../store/charactersStore';
import authStore from '../../../store/authStore';

const generateAttackString = (attacksPerRound, isMonk = false, attackBonus = 0) => {
  if (attacksPerRound <= 0) {
    return '';
  }
  const difference = isMonk ? 2 : 5;
  let result = `${attackBonus >= 0 ? '+' : ''}${attackBonus}`;
  for (let i = 1; i < attacksPerRound; i++) {
    const currentAttackBonus = attackBonus - i * difference;
    result += `/${currentAttackBonus >= 0 ? '+' : ''}${currentAttackBonus}`;
  }
  return result;
};

const Weapon = styled.div`
  display: grid;
  position: relative;
  grid-template-columns: 215px 345px;
  grid-template-areas:
    'name attackBonus'
    'typeAndRange damageBonus'
    '. critical';
  gap: 10px;
  padding: 15px 0;
  box-shadow: 0px 0px 1px rgba(128, 128, 128, 1);
  cursor: pointer;
  &:hover {
    .delete-weapon-button {
      display: flex;
    }
    .add-on-hit-property {
      display: flex;
    }
  }

  @media screen and (max-width: 595px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'name name'
      'attackBonus attackBonus'
      'damageBonus damageBonus'
      'typeAndRange critical';
  }

  @media screen and (max-width: 595px) {
    grid-template-areas:
      'name name'
      'attackBonus attackBonus'
      'damageBonus damageBonus'
      'typeAndRange .'
      'critical .';
  }
`;

const AttackBonusContainer = styled.div`
  display: grid;
  grid-area: attackBonus;
  grid-template-columns: 126px 132px 44px 44px;
  justify-items: center;
  align-items: center;
`;

const DamageBonusContainer = styled.div`
  display: grid;
  grid-area: damageBonus;
  grid-template-columns: 126px 88px 44px 44px 44px;
  justify-items: center;
  align-items: center;
`;

const TypeAndRange = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 126px 88px;
  grid-area: typeAndRange;
  grid-template-areas: 'type range';
`;

const Critical = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 88px 87px;
  justify-content: end;
  grid-area: critical;
  grid-template-areas: 'criticalRange criticalMultiplier';

  @media screen and (max-width: 510px) {
    justify-content: start;
  }
`;

const DeleteWeaponButton = styled(Button)`
  position: absolute;
  display: none;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  top: -10px;
  right: -10px;
  background: white;
  color: black;
  padding: 0;
  border-radius: 0px;
  font-size: 12px;
  line-height: 12px;
`;

const AddOnHitButton = styled(Button)`
  display: flex;
  display: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: white;
  color: black;
  padding: 0;
  border-radius: 0px;
  font-size: 20px;
  line-height: 16px;
`;

const WeaponItem = observer(({ weaponData, userId, charId }) => {
  const [totalAttackBonus, setTotalAttackBonus] = useState('');
  const { openedCharacter, changeWeaponData, deleteWeapon } = charactersStore;
  const { user } = authStore;

  const handleDeleteWeapon = async (event) => {
    event.stopPropagation();
    await deleteWeapon(userId || user.uid, charId, weaponData.name);
  };

  useEffect(() => {
    const tempMod = openedCharacter.abilities?.[weaponData.attackBonus]?.tempModifier;
    const mod = openedCharacter.abilities?.[weaponData.attackBonus]?.modifier;
    const firstAttackBonus =
      (openedCharacter.attack.bab || 0) +
      (tempMod ?? mod) +
      weaponData.weaponAttackBonus +
      (weaponData.attackMisc || 0);

    const totalAttBonus = generateAttackString(
      openedCharacter.attack.perRound,
      Object.keys(openedCharacter.classes).includes('Monk'),
      firstAttackBonus
    );
    setTotalAttackBonus(totalAttBonus);
  }, [openedCharacter]);

  return (
    <Weapon>
      <DeleteWeaponButton className='delete-weapon-button' onClick={handleDeleteWeapon}>
        X
      </DeleteWeaponButton>
      <FormItem name={['weapons', weaponData.name, 'name']} label='weapon' gridArea='name'>
        <Input style={{ width: '100%', color: 'black' }} disabled />
      </FormItem>
      <AttackBonusContainer>
        <CharSheetRowLabel label='attack bonus' />
        <FormItem textAlign='center' noBgLabel label='total' labelDesc='Включая бонус от оружия'>
          <Input disabled value={totalAttackBonus} />
        </FormItem>
        <FormItem
          name={
            openedCharacter.abilities?.[weaponData.attackBonus]?.tempModifier !== undefined
              ? ['abilities', weaponData.attackBonus, 'tempModifier']
              : ['abilities', weaponData.attackBonus, 'modifier']
          }
          label={`${weaponData.attackBonus} modifier`}
          textAlign='center'
          noBgLabel
        >
          <InputNumber controls={false} style={{ width: '100%', color: 'black' }} disabled />
        </FormItem>
        <FormItem
          name={['weapons', weaponData.name, 'attackMisc']}
          label='misc'
          textAlign='center'
          noBgLabel
        >
          <InputNumber
            controls={false}
            style={{ width: '100%' }}
            onChange={(value) =>
              changeWeaponData(userId || user.uid, charId, weaponData.name, 'attackMisc', value)
            }
          />
        </FormItem>
      </AttackBonusContainer>
      <DamageBonusContainer>
        <CharSheetRowLabel label='damage bonus' />
        <FormItem
          name={['weapons', weaponData.name, 'weaponDamage']}
          label='weapon damage'
          textAlign='center'
          noBgLabel
        >
          <Input
            onChange={(value) =>
              changeWeaponData(
                userId || user.uid,
                charId,
                weaponData.name,
                'weaponDamage',
                value.target.value
              )
            }
          />
        </FormItem>
        <FormItem
          name={
            openedCharacter.abilities?.[weaponData.damageBonus]?.tempModifier !== undefined
              ? ['abilities', weaponData.damageBonus, 'tempModifier']
              : ['abilities', weaponData.damageBonus, 'modifier']
          }
          label={weaponData.damageBonus ? `${weaponData.damageBonus} modifier` : ''}
          textAlign='center'
          noBgLabel
        >
          <InputNumber controls={false} style={{ width: '100%', color: 'black' }} disabled />
        </FormItem>
        <FormItem
          name={['weapons', weaponData.name, 'weaponDamageBonus']}
          label='weapon bonus'
          textAlign='center'
          noBgLabel
        >
          <InputNumber
            controls={false}
            style={{ width: '100%' }}
            onChange={(value) =>
              changeWeaponData(
                userId || user.uid,
                charId,
                weaponData.name,
                'weaponDamageBonus',
                value
              )
            }
          />
        </FormItem>
        <FormItem
          name={['weapons', weaponData.name, 'damageMisc']}
          label='misc'
          textAlign='center'
          noBgLabel
        >
          <InputNumber
            controls={false}
            style={{ width: '100%' }}
            onChange={(value) =>
              changeWeaponData(userId || user.uid, charId, weaponData.name, 'damageMisc', value)
            }
          />
        </FormItem>
      </DamageBonusContainer>
      <TypeAndRange>
        <FormItem name={['weapons', weaponData.name, 'type']} label='type' gridArea='type'>
          <Select
            style={{ width: '100%' }}
            options={[
              { value: 'Piercing' },
              { value: 'Slashing' },
              { value: 'Bludgeoning' },
              { value: 'Magic' },
              { value: 'Reach' },
            ]}
            onChange={(event) =>
              changeWeaponData(userId || user.uid, charId, weaponData.name, 'type', event)
            }
          />
        </FormItem>
        <FormItem
          name={['weapons', weaponData.name, 'range']}
          label='range'
          textAlign='center'
          gridArea='range'
          noBgLabel
        >
          <InputNumber
            controls={false}
            style={{ width: '100%' }}
            onChange={(value) =>
              changeWeaponData(userId || user.uid, charId, weaponData.name, 'range', value)
            }
          />
        </FormItem>
      </TypeAndRange>
      <Tooltip title='Добавить свойство при попадании'>
        <AddOnHitButton
          // onClick={() => setAddWeaponModalIsOpen(true)}
          className='add-on-hit-property'
        >
          +
        </AddOnHitButton>
      </Tooltip>
      <Critical>
        <FormItem
          name={['weapons', weaponData.name, 'criticalRange']}
          label='critical range'
          textAlign='center'
          noBgLabel
        >
          <Input
            onChange={(value) =>
              changeWeaponData(
                userId || user.uid,
                charId,
                weaponData.name,
                'criticalRange',
                value.target.value
              )
            }
          />
        </FormItem>
        <FormItem
          name={['weapons', weaponData.name, 'criticalMultiplier']}
          label='critical multiplier'
          textAlign='center'
          noBgLabel
        >
          <InputNumber
            controls={false}
            addonBefore='x'
            style={{ width: '100%', color: 'black' }}
            onChange={(value) =>
              changeWeaponData(
                userId || user.uid,
                charId,
                weaponData.name,
                'criticalMultiplier',
                value
              )
            }
          />
        </FormItem>
      </Critical>
    </Weapon>
  );
});

export default memo(WeaponItem);
