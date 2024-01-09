import { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Form, Modal } from 'antd';
import { observer } from 'mobx-react';
import { itemTypes } from '../../../utils/consts';
import GroupedInventoryItems from '../../GroupedInventarItems/GroupedInventoryItems';
import { CollapseLabel, itemTemplate, StyledCollapse } from '../CharacterInventory';
import charactersStore, { initialUserData } from '../../../store/charactersStore';
import knownItemsStore from '../../../store/knownItemsStore';
import { useForm } from 'antd/es/form/Form';

const StyledModal = styled(Modal)`
  width: 1920px !important;
  max-width: 92vw;
`;

const StyledForm = styled(Form)`
  max-height: 85vh;
  overflow-y: auto;
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

    const { knownItems } = knownItemsStore;
    const [form] = useForm();

    useEffect(() => {
      if (knownItems) {
        form.setFieldsValue({ ...{} });
        form.setFieldsValue({ ...knownItems });
      }
    }, [knownItems]);

    return (
      <StyledModal
        title='Add item to your inventory'
        open={addKnownItemModalIsOpen}
        onCancel={() => setAddKnownItemModalIsOpen(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <StyledForm form={form}>
          {knownItems && (
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
        </StyledForm>
      </StyledModal>
    );
  }
);

export default memo(AddKnownItemModal);
