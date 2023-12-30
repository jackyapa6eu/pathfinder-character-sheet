import { memo } from 'react';
import { observer } from 'mobx-react';
import charactersStore from '../../store/charactersStore';
import { fieldsAndStrFilter } from '../../utils/helpers';
import styled from 'styled-components';
import { itemTemplate } from '../CharacterInventory/CharacterInventory';
import { Button, Input, InputNumber, notification, Tooltip } from 'antd';
import authStore from '../../store/authStore';
import FormItem from '../FormItem';
import { toJS } from 'mobx';
import knownItemsStore from '../../store/knownItemsStore';

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Item = styled.div`
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
    z-index: 15;
  }

  & .item-charges {
    margin-left: auto;
    text-align: right;
  }

  & .item-name-container {
    display: flex;
  }

  &:hover .sell-button {
    display: flex;
  }

  & > span {
    position: relative;
    display: flex;
    align-items: center;
    text-align: center;
    padding: 0 3px;
    border-left: 1px solid rgba(0, 0, 0, 0.2);
  }

  & .magic-item {
    padding-right: 10px;
  }

  & > span:first-child,
  & > span:nth-child(2) {
    border-left: none;
  }
`;

const GroupedInventoryItems = observer(
  ({
    groupName,
    searchItemText,
    charId,
    userId,
    setEditingItem,
    setAddItemModalIsOpen,
    isKnown,
  }) => {
    const { openedCharacter, deleteInventoryItem, magicItemUse, changeItemData } = charactersStore;
    const { user } = authStore;
    const { knownItems, changeItemData: changeKnown } = knownItemsStore;
    const [api, contextHolder] = notification.useNotification();

    const handleSellItem = async (itemData) => {
      await deleteInventoryItem(userId || user.uid, charId, itemData, true);
    };

    const handleDeleteItem = async (itemData, event) => {
      event.stopPropagation();
      await deleteInventoryItem(userId || user.uid, charId, itemData);
    };

    const handleUseMagicItem = async (itemData, event) => {
      event.stopPropagation();
      await magicItemUse(userId || user.uid, charId, itemData);
    };

    const openEditItemData = async (event, itemData) => {
      event.stopPropagation();
      setEditingItem(itemData);
      setAddItemModalIsOpen(true);
    };

    const handleShowItemDescription = (itemData) => {
      const { name, ref, itemName, chargesMax, ...otherData } = itemData;
      if (itemData.description) {
        api.open({
          message: name,
          description: (
            <div style={{ maxHeight: '45vh', overflowY: 'auto' }}>
              {Object.entries(otherData).map(([dataName, data]) => (
                <p style={{ margin: 0 }} key={dataName}>
                  <span style={{ fontWeight: 500 }}>{dataName}: </span>
                  <span>{data}</span>
                </p>
              ))}
            </div>
          ),
          duration: 0,
        });
      }
    };

    const handleChangeItemData = async (itemData, type, value) => {
      if (isKnown) {
        await changeKnown(itemData, type, value);
      } else {
        await changeItemData(
          userId || user.uid,
          charId,
          itemData.itemName,
          type,
          value.target?.value || value,
          isKnown
        );
      }
    };
    return (
      <ItemsContainer>
        {contextHolder}
        {(isKnown ? knownItems : openedCharacter.inventory) &&
          fieldsAndStrFilter(
            Object.values(isKnown ? knownItems : openedCharacter.inventory),
            'type',
            groupName,
            ['name', 'description'],
            searchItemText
          ).map((el) => (
            <Item
              title={el.description ?? ''}
              key={el.ref}
              template={itemTemplate}
              onClick={() => handleShowItemDescription(el)}
            >
              <span className='item-name-container'>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                  }}
                >
                  <Tooltip placement='topLeft' title='edit item'>
                    <Button
                      onClick={(event) => openEditItemData(event, el)}
                      className='sell-button'
                    >
                      <span>⚙️</span>
                    </Button>
                  </Tooltip>
                </div>
                <FormItem
                  name={isKnown ? [el.itemName, 'name'] : ['inventory', el.itemName, 'name']}
                  textAlign='center'
                  noBgLabel
                >
                  <Input
                    onClick={(event) => event.stopPropagation()}
                    style={{ width: '100%' }}
                    onChange={(value) => handleChangeItemData(el, 'name', value)}
                  />
                </FormItem>
              </span>
              {el.count && (
                <span>
                  <FormItem
                    name={isKnown ? [el.itemName, 'count'] : ['inventory', el.itemName, 'count']}
                    textAlign='center'
                    noBgLabel
                    label='count'
                  >
                    <InputNumber
                      onClick={(event) => event.stopPropagation()}
                      controls={false}
                      style={{ width: '100%' }}
                      onChange={(value) => handleChangeItemData(el, 'count', value)}
                    />
                  </FormItem>
                </span>
              )}
              {(el.type === 'magicItem' || el.type === 'magicStick') && (
                <span className='magic-item'>
                  {!isKnown && (
                    <Tooltip title='use item'>
                      <Button
                        onClick={(event) => handleUseMagicItem(el, event)}
                        className='sell-button'
                      >
                        <span>🪄</span>
                      </Button>
                    </Tooltip>
                  )}
                  <span className='item-charges'>{`${el.chargesLeft}/${el.chargesMax}`}</span>
                </span>
              )}
              {el.type !== 'magicItem' && el.type !== 'magicStick' && !el.count && <span />}
              <span>
                <Tooltip title='delete item'>
                  <Button onClick={(event) => handleDeleteItem(el, event)} className='sell-button'>
                    <span>🗑️</span>
                  </Button>
                </Tooltip>
                <FormItem
                  name={isKnown ? [el.itemName, 'weight'] : ['inventory', el.itemName, 'weight']}
                  labelDesc={`total: ${el.weight * (el.count || 1)} `}
                  textAlign='center'
                  noBgLabel
                  label='weight'
                >
                  <InputNumber
                    onClick={(event) => event.stopPropagation()}
                    controls={false}
                    style={{ width: '100%' }}
                    onChange={(value) => handleChangeItemData(el, 'weight', value)}
                  />
                </FormItem>
              </span>
              <span>
                {el.cost && !isKnown && (
                  <Tooltip placement='topRight' title={`sell item for ${el.cost} ${el.currency}`}>
                    <Button onClick={() => handleSellItem(el)} className='sell-button'>
                      <span>💰</span>
                    </Button>
                  </Tooltip>
                )}

                <FormItem
                  name={isKnown ? [el.itemName, 'cost'] : ['inventory', el.itemName, 'cost']}
                  labelDesc={`total: ${el.cost * (el.count || 1)} ${el.currency}`}
                  textAlign='center'
                  noBgLabel
                  label='cost'
                >
                  <InputNumber
                    onClick={(event) => event.stopPropagation()}
                    controls={false}
                    style={{ width: '100%' }}
                    onChange={(value) => handleChangeItemData(el, 'cost', value)}
                  />
                </FormItem>
              </span>
            </Item>
          ))}
      </ItemsContainer>
    );
  }
);

export default memo(GroupedInventoryItems);
