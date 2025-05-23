import styled from 'styled-components';
import { observer } from 'mobx-react';
import { memo, useEffect, useMemo, useState } from 'react';
import charactersStore, { initialUserData } from '../../store/charactersStore';
import authStore from '../../store/authStore';
import { Button, Collapse, Form, Input, InputNumber, Tooltip } from 'antd';
import AddItemModal from './AddItemModal';
import { carryingCapacityTable, itemTypes } from '../../utils/consts';
import GroupedInventoryItems from '../GroupedInventarItems/GroupedInventoryItems';
import Search from 'antd/es/input/Search';
import CoinIcon from '../../icons/CoinIcon';
import FormItem from '../FormItem';
import AddKnownItemModal from './AddKnownItemModal';
import { toJS } from 'mobx';
import { calcLoad } from '../../utils/helpers';

export const itemTemplate = '1fr 26px 50px 50px 66px';

export const StyledCollapse = styled(Collapse)`
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

  @media screen and (max-width: 1279px) {
    & {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media screen and (max-width: 860px) {
    & {
      grid-template-columns: 1fr;
    }
  }
`;

export const CollapseLabel = styled.p`
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
  flex-wrap: wrap;

  & .inventory-panel-search-input {
    width: 120px;
  }
`;

const MoneyForm = styled.div`
  display: grid;
  grid-template-columns: 64px 64px 64px 64px 64px 96px;
  gap: 5px;
  align-items: center;

  @media screen and (max-width: 470px) {
    grid-template-columns: 64px 64px 64px 64px;
  }
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

const CharacterInventory = observer(({ charId, userId, canEdit }) => {
  const [addItemModalIsOpen, setAddItemModalIsOpen] = useState(false);
  const [addKnownItemModalIsOpen, setAddKnownItemModalIsOpen] = useState(false);
  const [searchItemText, setSearchItemText] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const { openedCharacter, editMoney, totalWeight, currentLoad } = charactersStore;
  const { user } = authStore;

  const handleSearch = (value) => {
    setSearchItemText(value.target.value);
  };

  const handleChangeMoney = async (type, amount) => {
    await editMoney(userId || user.uid, charId, type, amount);
  };

  // const loaded = useMemo(
  //   () =>
  //     calcLoad(
  //       carryingCapacityTable[
  //         (openedCharacter?.abilities?.str?.score || 1) +
  //           (openedCharacter?.equipBonuses?.abilityBonus?.str || 0) +
  //           (openedCharacter?.abilities?.str?.adjustment || 0)
  //       ],
  //       totalWeight
  //     ),
  //   [openedCharacter, totalWeight]
  // );

  return (
    <CharacterInventoryContainer>
      <AddItemModal
        charId={charId}
        userId={userId}
        addItemModalIsOpen={addItemModalIsOpen}
        setAddItemModalIsOpen={setAddItemModalIsOpen}
        addKnownItemModalIsOpen={addKnownItemModalIsOpen}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
      />
      <AddKnownItemModal
        charId={charId}
        userId={userId}
        addItemModalIsOpen={addItemModalIsOpen}
        addKnownItemModalIsOpen={addKnownItemModalIsOpen}
        setAddKnownItemModalIsOpen={setAddKnownItemModalIsOpen}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        setAddItemModalIsOpen={setAddItemModalIsOpen}
      />
      <InventoryPanelContainer>
        <Button
          style={{ width: '80px' }}
          disabled={canEdit}
          onClick={() => setAddItemModalIsOpen(true)}
        >
          Add +
        </Button>
        <Button
          style={{ width: '120px' }}
          disabled={canEdit}
          onClick={() => setAddKnownItemModalIsOpen(true)}
        >
          Add known +
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
                disabled={canEdit}
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
                disabled={canEdit}
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
                disabled={canEdit}
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
                disabled={canEdit}
              />
            </FormItem>
            <Tooltip title='Copper coins'>
              <CoinIconContainer>
                <CoinIcon size='20px' color='#B87333' /> {/* медь  */}
              </CoinIconContainer>
            </Tooltip>
          </CoinContainer>

          <CoinContainer>
            <FormItem label='weight' textAlign='center' noBgLabel>
              <InputNumber
                value={totalWeight}
                controls={false}
                style={{ width: '100%' }}
                disabled
              />
            </FormItem>
            <Tooltip title=''>
              <CoinIconContainer>
                {/*<CoinIcon size='20px' color='#B87333' /> /!* медь  *!/*/}
              </CoinIconContainer>
            </Tooltip>
          </CoinContainer>

          <CoinContainer>
            <FormItem label='load' textAlign='center' noBgLabel>
              <Input value={currentLoad} controls={false} style={{ width: '100%' }} disabled />
            </FormItem>
            <Tooltip title=''>
              <CoinIconContainer>
                {/*<CoinIcon size='20px' color='#B87333' /> /!* медь  *!/*/}
              </CoinIconContainer>
            </Tooltip>
          </CoinContainer>
        </MoneyForm>
      </InventoryPanelContainer>

      {openedCharacter?.inventory && (
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
                canEdit={canEdit}
              />
            ),
          }))}
        />
      )}
    </CharacterInventoryContainer>
  );
});

export default memo(CharacterInventory);
