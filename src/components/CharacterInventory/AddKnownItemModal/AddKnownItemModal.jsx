import { memo, useState } from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import { observer } from 'mobx-react';
import { itemTypes } from '../../../utils/consts';
import GroupedInventoryItems from '../../GroupedInventarItems/GroupedInventoryItems';
import { CollapseLabel, itemTemplate, StyledCollapse } from '../CharacterInventory';
import charactersStore from '../../../store/charactersStore';

const StyledModal = styled(Modal)`
  width: 1920px !important;
  max-width: 92vw;
`;

const AddKnownItemModal = observer(
  ({
    charId,
    userId,
    addKnownItemModalIsOpen,
    setAddKnownItemModalIsOpen,
    setEditingItem,
    setAddItemModalIsOpen,
  }) => {
    const [searchItemText, setSearchItemText] = useState('');

    const { openedCharacter, editMoney } = charactersStore;

    return (
      <StyledModal
        title='Add item to your inventory'
        open={addKnownItemModalIsOpen}
        onCancel={() => setAddKnownItemModalIsOpen(false)}
        footer={null}
        destroyOnClose
        centered
      >
        {openedCharacter.knownItems && (
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
                  isKnown
                />
              ),
            }))}
          />
        )}
      </StyledModal>
    );
  }
);

export default memo(AddKnownItemModal);
