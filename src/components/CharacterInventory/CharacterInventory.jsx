import styled from 'styled-components';
import { observer } from 'mobx-react';
import { memo, useState } from 'react';
import charactersStore from '../../store/charactersStore';
import authStore from '../../store/authStore';
import { Button, Collapse } from 'antd';
import AddItemModal from './AddItemModal';
import { itemTypes } from '../../utils/consts';
import GroupedInventoryItems from '../GroupedInventarItems/GroupedInventoryItems';
import Search from 'antd/es/input/Search';

export const itemTemplate = '1fr 50px 50px';

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
  & > span {
    text-align: center;
    font-size: 10px;
    border-left: 1px solid rgba(0, 0, 0, 0);
    line-height: 10px;
  }
`;

const SpellsContainer = styled.div`
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

const CharacterInventory = observer(({ charId, userId }) => {
  const [addItemModalIsOpen, setAddItemModalIsOpen] = useState(false);
  const [searchItemText, setSearchItemText] = useState('');
  const { openedCharacter } = charactersStore;
  const { user } = authStore;

  const handleSearch = (value) => {
    setSearchItemText(value.target.value);
  };

  return (
    <SpellsContainer>
      <AddItemModal
        charId={charId}
        userId={userId}
        addItemModalIsOpen={addItemModalIsOpen}
        setAddItemModalIsOpen={setAddItemModalIsOpen}
      />
      <InventoryPanelContainer>
        <Button size='small' style={{ width: '80px' }} onClick={() => setAddItemModalIsOpen(true)}>
          Add +
        </Button>
        <Search
          allowClear
          size='small'
          className='inventory-panel-search-input'
          value={searchItemText}
          onChange={handleSearch}
        />
      </InventoryPanelContainer>

      {openedCharacter.inventory && (
        <StyledCollapse
          defaultActiveKey={itemTypes.map((type) => type.value)}
          ghost
          size='small'
          items={itemTypes.map(({ label, value }) => ({
            key: value,
            label: (
              <CollapseLabel template={itemTemplate}>
                {label}
                <span>wt.</span>
                <span>cost</span>
              </CollapseLabel>
            ),
            children: (
              <GroupedInventoryItems
                charId={charId}
                userId={userId}
                groupName={value}
                searchItemText={searchItemText}
              />
            ),
          }))}
        />
      )}
    </SpellsContainer>
  );
});

export default memo(CharacterInventory);
