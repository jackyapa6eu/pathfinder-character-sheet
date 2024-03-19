import { memo, useCallback } from 'react';
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
import { EyeOutlined } from '@ant-design/icons';
import ItemDescription from '../ItemDescription';

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Item = styled.div`
  margin: 0;
  display: grid;
  grid-template-columns: ${(p) => p.template ?? ''};
  opacity: ${(p) => (p.onhorse ? 0.3 : 1)};
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
  & > span:nth-child(3) {
    border-left: none;
  }

  & .eye {
    font-size: 20px;
    opacity: 0;
    transition: opacity ease 0.3s;
  }

  &:hover .eye {
    opacity: 1;
  }
`;

const GroupedInventoryItems = observer(
  ({ groupName, searchItemText, charId, userId, canEdit, isKnown }) => {
    const {
      openedCharacter,
      deleteInventoryItem,
      magicItemUse,
      changeItemData,
      createInventoryItem,
    } = charactersStore;
    const { user } = authStore;
    const { knownItems, changeItemData: changeKnown } = knownItemsStore;
    const [api, contextHolder] = notification.useNotification();

    const handleSellItem = async (itemData, event) => {
      event.stopPropagation();
      await deleteInventoryItem(userId || user.uid, charId, itemData, true);
    };

    const handleDeleteItem = async (itemData, event) => {
      event.stopPropagation();
      await deleteInventoryItem(userId || user.uid, charId, itemData);
    };

    const handleCreateKnownItem = async (event, itemData) => {
      event.stopPropagation();
      await createInventoryItem(userId || user.uid, charId, itemData);
    };

    const handleShowItemDescription = useCallback(
      (itemData) => {
        api.open({
          message: itemData.name,
          description: (
            <div>
              <ItemDescription
                itemName={itemData.itemName}
                isKnown={isKnown}
                userId={userId}
                charId={charId}
                canEdit={canEdit}
              />
            </div>
          ),
          duration: 0,
        });
      },
      [openedCharacter.inventory, canEdit]
    );

    const handleChangeItemData = async (itemData, type, value) => {
      if (isKnown) {
        await changeKnown(itemData, type, value?.target?.value || value);
      } else {
        await changeItemData(
          userId || user.uid,
          charId,
          itemData.itemName,
          type,
          value?.target?.value || value,
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
              onhorse={el.onHorse}
            >
              <span className='item-name-container'>
                {isKnown && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                    }}
                  >
                    <Tooltip placement='topLeft' title='add item to inventory'>
                      <Button
                        onClick={(event) => handleCreateKnownItem(event, el)}
                        className='sell-button'
                      >
                        <span>✚</span>
                      </Button>
                    </Tooltip>
                  </div>
                )}

                <FormItem
                  name={isKnown ? [el.itemName, 'name'] : ['inventory', el.itemName, 'name']}
                  textAlign='start'
                  noBgLabel
                >
                  <Input
                    onClick={(event) => event.stopPropagation()}
                    style={{ width: '100%' }}
                    onChange={(value) => handleChangeItemData(el, 'name', value)}
                    disabled={canEdit}
                  />
                </FormItem>
              </span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <EyeOutlined className='eye' />
              </div>

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
                    disabled={canEdit}
                  />
                </FormItem>
              </span>

              <span>
                <Tooltip title='delete item'>
                  <Button
                    disabled={canEdit}
                    onClick={(event) => handleDeleteItem(el, event)}
                    className='sell-button'
                  >
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
                    disabled={canEdit}
                  />
                </FormItem>
              </span>
              <span>
                {!!el.cost && !isKnown && (
                  <Tooltip
                    placement='topRight'
                    title={el.cost ? `sell item for ${el.cost ?? ''} ${el.currency ?? ''}` : ''}
                  >
                    <Button
                      disabled={canEdit}
                      onClick={(event) => handleSellItem(el, event)}
                      className='sell-button'
                    >
                      <span>💰</span>
                    </Button>
                  </Tooltip>
                )}

                <FormItem
                  name={isKnown ? [el.itemName, 'cost'] : ['inventory', el.itemName, 'cost']}
                  labelDesc={el.cost ? `total: ${el.cost * (el.count || 1)} ${el.currency}` : ''}
                  textAlign='center'
                  noBgLabel
                  label='cost'
                >
                  <InputNumber
                    onClick={(event) => event.stopPropagation()}
                    controls={false}
                    style={{ width: '100%' }}
                    onChange={(value) => handleChangeItemData(el, 'cost', value)}
                    disabled={canEdit}
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
