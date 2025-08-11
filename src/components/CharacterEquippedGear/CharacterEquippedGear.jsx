import { memo } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Select } from 'antd';
import { StyledFormItem } from '../../uiComponents/uiComponents';
import { initialUserData } from '../../store/charactersStore';
import authStore from '../../store/authStore';

const EquippedGearContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  box-shadow: 0 0 3px rgba(128, 128, 128, 0.5);
  padding: 0 5px;
  gap: 10px;

  @media screen and (max-width: 1000px) {
    & {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  @media screen and (max-width: 700px) {
    & {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media screen and (max-width: 450px) {
    & {
      grid-template-columns: 1fr;
    }
  }
`;

const CharacterEquippedGear = observer(({ store, charId, userId, canEdit }) => {
  const { openedCharacter, equipItem } = store;
  const { user } = authStore;
  const { empty, ...itemsTypes } = initialUserData.equippedItems;
  return (
    <EquippedGearContainer>
      {Object.keys(itemsTypes).map((equipKey) => (
        <StyledFormItem key={equipKey} name={['equippedItems', equipKey]} label={equipKey}>
          <Select
            disabled={canEdit}
            allowClear
            onChange={(value) => equipItem(userId || user.uid, charId, equipKey, value)}
            options={Object.entries(openedCharacter.inventory || {})
              .map(([itemKey, { equipSlot, name }]) => ({
                equipSlot,
                label: name || 'NO_NAME_ITEM',
                value: itemKey,
              }))
              .filter(
                (el) =>
                  (el.equipSlot === 'ring' && (equipKey === 'ringOne' || equipKey === 'ringTwo')) ||
                  el.equipSlot === equipKey
              )}
          />
        </StyledFormItem>
      ))}
    </EquippedGearContainer>
  );
});

export default memo(CharacterEquippedGear);
