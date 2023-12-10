import { memo } from 'react';
import { observer } from 'mobx-react';
import charactersStore from '../../store/charactersStore';
import { fieldsAndStrFilter } from '../../utils/helpers';
import styled from 'styled-components';
import { itemTemplate } from '../CharacterInventory/CharacterInventory';
import { Button } from 'antd';
import authStore from '../../store/authStore';

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Item = styled.p`
  margin: 0;
  display: grid;
  grid-template-columns: ${(p) => p.template ?? ''};
  background: white;
  padding: 3px;
  cursor: pointer;
  & .sell-button {
    display: none;
    position: absolute;
    right: -10px;
    background: black;
    color: white;
    top: calc(50% - 10px);
    padding: 0;
    width: 20px;
    height: 20px;
    font-size: 15px;
    line-height: 15px;
    align-items: center;
    justify-content: center;
  }

  &:hover .sell-button {
    display: flex;
  }

  & > span {
    position: relative;
    text-align: center;
    padding: 0 3px;
    border-left: 1px solid rgba(0, 0, 0, 0.2);
  }
`;

const GroupedInventoryItems = observer(({ groupName, searchItemText, charId, userId }) => {
  const { openedCharacter, deleteInventoryItem } = charactersStore;
  const { user } = authStore;

  const handleSellItem = async (itemData) => {
    await deleteInventoryItem(userId || user.uid, charId, itemData, true);
  };

  const handleDeleteItem = async (itemData) => {
    await deleteInventoryItem(userId || user.uid, charId, itemData);
  };

  return (
    <ItemsContainer>
      {openedCharacter.inventory &&
        fieldsAndStrFilter(
          Object.values(openedCharacter.inventory),
          'type',
          groupName,
          ['name', 'description'],
          searchItemText
        ).map((el) => (
          <Item key={el.ref} template={itemTemplate}>
            {el.name}
            <span>
              <Button onClick={() => handleDeleteItem(el)} className='sell-button'>
                <span>X</span>
              </Button>
              {el.weight}
            </span>
            <span>
              <Button onClick={() => handleSellItem(el)} className='sell-button'>
                <span>$</span>
              </Button>
              {el.cost}
            </span>
          </Item>
        ))}
    </ItemsContainer>
  );
});

export default memo(GroupedInventoryItems);
