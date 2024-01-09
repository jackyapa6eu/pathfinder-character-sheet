import { memo, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import charactersStore from '../../store/charactersStore';
import knownItemsStore from '../../store/knownItemsStore';
import styled from 'styled-components';
import { capitalizedFirstLetter } from '../../utils/helpers';
import { Tooltip } from 'antd';
import authStore from '../../store/authStore';

const Container = styled.div`
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px;
  cursor: default;
  background: #f3f3f3;
`;

const PropertyContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 2px gray;
  padding: 2px;
  background: white;
`;

const PropertyLine = styled.p`
  display: flex;
  align-items: center;
  margin: 0;
`;

const UseItemIcon = styled.span`
  margin-left: auto;
  font-size: 20px;
  transform: scale(0.9);
  transition: all 0.5s ease;
  cursor: pointer;
  &:hover {
    transform: scale(1);
  }
`;

const ItemDescription = observer(({ itemName, charId, userId, isKnown }) => {
  const { openedCharacter, magicItemUse } = charactersStore;
  const { knownItems } = knownItemsStore;
  const { user } = authStore;

  const {
    cost,
    count,
    currency,
    equipSlot,
    type,
    weight,
    ref,
    name,
    itemName: x,
    ...itemProperties
  } = isKnown ? knownItems[itemName] : openedCharacter.inventory[itemName];

  const handleMagicItemUse = useCallback(
    async (chargesData) => {
      await magicItemUse(userId || user.id, charId, itemName, chargesData);
    },
    [itemName]
  );

  return (
    <Container>
      <PropertyLine>
        {equipSlot === 'empty' ? '' : capitalizedFirstLetter(equipSlot || '')}
      </PropertyLine>
      <PropertyLine>{`${weight ? `Weight: ${weight}.` : ''} ${
        cost ? `Cost: ${cost} ${currency}.` : ''
      } ${count ? `Count: ${count}.` : ''}`}</PropertyLine>
      {Object.entries(itemProperties).map(([propertyKey, propertyData]) => {
        if (['savingThrows', 'abilityBonus', 'skill'].includes(propertyKey)) {
          return (
            <PropertyContainer key={propertyKey}>
              {Object.values(propertyData).map((data) => (
                <PropertyLine key={data.name}>
                  {`${capitalizedFirstLetter(data.name)} ${data.count > 0 ? '+' : '-'}${
                    data.count
                  }`}
                </PropertyLine>
              ))}
            </PropertyContainer>
          );
        }
        if (propertyKey === 'acBonus') {
          return (
            <PropertyContainer key={propertyKey}>
              {Object.values(propertyData).map((data) => (
                <PropertyLine key={data.acBonusType}>
                  {`${capitalizedFirstLetter(data.acBonusType)} ac ${data.acBonus > 0 ? '+' : '-'}${
                    data.acBonus
                  }. Check penalty: ${data.checkPenalty}. ${
                    data.maxDex < 12 ? `Max dex: ${data.maxDex}.` : ''
                  } `}
                </PropertyLine>
              ))}
            </PropertyContainer>
          );
        }
        if (propertyKey === 'attack') {
          return (
            <PropertyContainer key={propertyKey}>
              <PropertyLine>{`${capitalizedFirstLetter(
                propertyData.attackBonus
              )} based`}</PropertyLine>
              {propertyData.weaponAttackBonus ? (
                <PropertyLine>{`Attack bonus: ${propertyData.weaponAttackBonus}`}</PropertyLine>
              ) : null}
              {propertyData.weaponDamageBonus ? (
                <PropertyLine>{`Damage bonus: ${propertyData.weaponDamageBonus}`}</PropertyLine>
              ) : null}
              {propertyData.maxDamageBonus ? (
                <PropertyLine>{`Max damage bonus: ${propertyData.maxDamageBonus}`}</PropertyLine>
              ) : null}
            </PropertyContainer>
          );
        }
        if (propertyKey === 'charges') {
          return (
            <PropertyContainer key={propertyKey}>
              {Object.values(propertyData).map((item) => (
                <PropertyLine key={item.name}>
                  <span>
                    <Tooltip title={item.description}>
                      <span>{item.name}</span>
                    </Tooltip>{' '}
                    {item.count} / {item.maxCharges}
                  </span>
                  <UseItemIcon onClick={() => handleMagicItemUse(item)}>🪄</UseItemIcon>
                </PropertyLine>
              ))}
            </PropertyContainer>
          );
        }
        if (propertyKey === 'description') {
          return (
            <PropertyContainer key={propertyKey}>
              <PropertyLine>{propertyData}</PropertyLine>
            </PropertyContainer>
          );
        } else return <PropertyLine key={propertyKey}>{propertyKey}</PropertyLine>;
      })}
    </Container>
  );
});

export default memo(ItemDescription);
