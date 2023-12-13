import styled from 'styled-components';
import { observer } from 'mobx-react';
import { memo, useEffect, useState } from 'react';
import charactersStore, { initialUserData } from '../../store/charactersStore';
import authStore from '../../store/authStore';
import { Button, Collapse, Form, InputNumber, Tooltip } from 'antd';
import AddItemModal from './AddItemModal';
import { itemTypes } from '../../utils/consts';
import GroupedInventoryItems from '../GroupedInventarItems/GroupedInventoryItems';
import Search from 'antd/es/input/Search';
import CoinIcon from '../../icons/CoinIcon';
import FormItem from '../FormItem';

export const itemTemplate = '1fr 44px 44px 44px';

const StyledCollapse = styled(Collapse)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  & .ant-collapse-content-box {
    padding: 5px !important;
  }

  & .ant-collapse-header {
    padding: 0 !important;
    padding-right: 5px !important;
  }
`;

const CollapseLabel = styled.p`
  margin: 0;
  display: grid;
  grid-template-columns: ${(p) => p.template ?? ''};
  align-items: end;
  padding-right: 3px;
  & > span {
    text-align: center;
    font-size: 10px;
    border-left: 1px solid rgba(0, 0, 0, 0);
    line-height: 10px;
  }
`;

const CharacterInventoryContainer = styled.div`
  display: grid;
  width: 100%;
  align-content: start;
  grid-template-rows: repeat(auto-fit, max-content);
  box-shadow: 0 0 3px rgba(128, 128, 128, 0.5);
  padding: 0 5px;
  gap: 10px;
`;

const InventoryPanelContainer = styled.div`
  display: flex;
  gap: 5px;

  & .inventory-panel-search-input {
    width: 120px;
  }
`;

const MoneyForm = styled.div`
  display: grid;
  grid-template-columns: 64px 64px 64px 64px;
  gap: 5px;
  align-items: center;
`;

const CoinContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const CoinIconContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 50%;
  background: black;
  position: relative;
  left: -5px;
`;

const CharacterInventory = observer(({ charId, userId }) => {
  const [addItemModalIsOpen, setAddItemModalIsOpen] = useState(false);
  const [searchItemText, setSearchItemText] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const { openedCharacter, editMoney } = charactersStore;
  const { user } = authStore;

  const handleSearch = (value) => {
    setSearchItemText(value.target.value);
  };

  const handleChangeMoney = async (type, amount) => {
    await editMoney(userId || user.uid, charId, type, amount);
  };

  return (
    <CharacterInventoryContainer>
      <AddItemModal
        charId={charId}
        userId={userId}
        addItemModalIsOpen={addItemModalIsOpen}
        setAddItemModalIsOpen={setAddItemModalIsOpen}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
      />
      <InventoryPanelContainer>
        <Button style={{ width: '80px' }} onClick={() => setAddItemModalIsOpen(true)}>
          Add +
        </Button>
        <Search
          allowClear
          className='inventory-panel-search-input'
          value={searchItemText}
          onChange={handleSearch}
        />

        <MoneyForm>
          <CoinContainer>
            <FormItem name={['money', 'platinum']} label={'platinum'} textAlign='center' noBgLabel>
              <InputNumber
                controls={false}
                style={{ width: '100%' }}
                onChange={(value) => handleChangeMoney('platinum', value)}
              />
            </FormItem>
            <Tooltip title='Platinum coins'>
              <CoinIconContainer>
                <CoinIcon size='20px' color='#E5E4E2' /> {/* платина */}
              </CoinIconContainer>
            </Tooltip>
          </CoinContainer>

          <CoinContainer>
            <FormItem name={['money', 'gold']} label='gold' textAlign='center' noBgLabel>
              <InputNumber
                controls={false}
                style={{ width: '100%' }}
                onChange={(value) => handleChangeMoney('gold', value)}
              />
            </FormItem>
            <Tooltip title='Gold coins'>
              <CoinIconContainer>
                <CoinIcon size='20px' color='#FFD700' /> {/* золото  */}
              </CoinIconContainer>
            </Tooltip>
          </CoinContainer>

          <CoinContainer>
            <FormItem name={['money', 'silver']} label='silver' textAlign='center' noBgLabel>
              <InputNumber
                controls={false}
                style={{ width: '100%' }}
                onChange={(value) => handleChangeMoney('silver', value)}
              />
            </FormItem>
            <Tooltip title='Silver coins'>
              <CoinIconContainer>
                <CoinIcon size='20px' color='#C0C0C0' /> {/* серебро  */}
              </CoinIconContainer>
            </Tooltip>
          </CoinContainer>

          <CoinContainer>
            <FormItem name={['money', 'copper']} label='copper' textAlign='center' noBgLabel>
              <InputNumber
                controls={false}
                style={{ width: '100%' }}
                onChange={(value) => handleChangeMoney('copper', value)}
              />
            </FormItem>
            <Tooltip title='Copper coins'>
              <CoinIconContainer>
                <CoinIcon size='20px' color='#B87333' /> {/* медь  */}
              </CoinIconContainer>
            </Tooltip>
          </CoinContainer>
        </MoneyForm>
      </InventoryPanelContainer>

      {openedCharacter.inventory && (
        <StyledCollapse
          defaultActiveKey={itemTypes.map((type) => type.value)}
          ghost
          size='small'
          items={itemTypes.map(({ label, value }) => ({
            key: value,
            label: <CollapseLabel template={itemTemplate}>{label}</CollapseLabel>,
            children: (
              <GroupedInventoryItems
                charId={charId}
                userId={userId}
                groupName={value}
                searchItemText={searchItemText}
                setEditingItem={setEditingItem}
                setAddItemModalIsOpen={setAddItemModalIsOpen}
              />
            ),
          }))}
        />
      )}
    </CharacterInventoryContainer>
  );
});

export default memo(CharacterInventory);
