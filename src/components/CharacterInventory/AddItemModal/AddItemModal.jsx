import { observer } from 'mobx-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import styled from 'styled-components';
import { ButtonBox, StyledFormItem } from '../../../uiComponents/uiComponents';
import TextArea from 'antd/es/input/TextArea';
import charactersStore from '../../../store/charactersStore';
import authStore from '../../../store/authStore';
import { itemTypes } from '../../../utils/consts';
import { toJS } from 'mobx';
import { useForm } from 'antd/es/form/Form';
import knownItemsStore from '../../../store/knownItemsStore';

const StyledForm = styled(Form)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 5px;
  grid-template-areas:
    'type type type'
    'name weight cost'
    'description description afterDesc'
    'acBonus checkPenalty maxDex'
    'attackBonus weaponAttackBonus damageBonus'
    'maxDamageBonus weaponDamageBonus .'
    '. . submit';

  @media screen and (max-width: 560px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'type type'
      'name weight'
      'description cost'
      'afterDesc .'
      'acBonus checkPenalty '
      'maxDex attackBonus'
      'weaponAttackBonus damageBonus'
      'maxDamageBonus weaponDamageBonus'
      '.  submit';
  }
`;

const StyledModal = styled(Modal)`
  width: 600px !important;
`;

const AddItemModal = observer(
  ({
    charId,
    userId,
    addItemModalIsOpen,
    setAddItemModalIsOpen,
    editingItem,
    setEditingItem,
    addKnownItemModalIsOpen,
  }) => {
    const [selectedType, setSelectedType] = useState(null);
    const [cost, setCost] = useState(null);
    const { createInventoryItem } = charactersStore;
    const { createKnownItem } = knownItemsStore;
    const { user } = authStore;

    const [form] = useForm();

    useEffect(() => {
      console.log(toJS(editingItem));
      if (addItemModalIsOpen) {
        if (editingItem) {
          form.setFieldsValue({ ...editingItem });
          setSelectedType(editingItem.type);
        }
      } else {
        setEditingItem(null);
        setSelectedType(null);
        form.resetFields();
      }
    }, [addItemModalIsOpen]);

    const onFinish = useCallback(
      async (values) => {
        await createInventoryItem(
          userId || user.uid,
          charId,
          values,
          editingItem?.itemName,
          addKnownItemModalIsOpen
        );
        await createKnownItem(values, editingItem?.itemName);
        setAddItemModalIsOpen(false);
      },
      [editingItem]
    );

    return (
      <StyledModal
        title={editingItem ? 'Edit item' : 'Add item to your inventory'}
        open={addItemModalIsOpen}
        onCancel={() => setAddItemModalIsOpen(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <StyledForm layout='vertical' labelAlign='left' onFinish={onFinish} form={form}>
          <StyledFormItem gridarea='type' name='type' label='type' rules={[{ required: true }]}>
            <Radio.Group
              buttonStyle='solid'
              optionType='button'
              options={itemTypes}
              onChange={(event) => setSelectedType(event.target.value)}
            />
          </StyledFormItem>

          <StyledFormItem gridarea='name' name='name' label='name' rules={[{ required: true }]}>
            <Input />
          </StyledFormItem>

          <StyledFormItem name='weight' label='weight' rules={[{ required: true }]}>
            <InputNumber controls={false} style={{ width: '100%' }} />
          </StyledFormItem>
          <div style={{ display: 'flex' }}>
            <StyledFormItem name='cost' label='cost' style={{ width: cost ? '40%' : '100%' }}>
              <InputNumber controls={false} style={{ width: '100%' }} onChange={setCost} />
            </StyledFormItem>
            {cost && (
              <StyledFormItem
                name='currency'
                label='currency'
                rules={[{ required: true }]}
                style={{ width: '60%' }}
              >
                <Select
                  allowClear
                  options={[
                    { value: 'gold' },
                    { value: 'silver' },
                    { value: 'copper' },
                    { value: 'platinum' },
                  ]}
                />
              </StyledFormItem>
            )}
          </div>

          <StyledFormItem gridarea='description' name='description' label='description'>
            <TextArea autoSize />
          </StyledFormItem>

          {['consumables'].includes(selectedType) && (
            <StyledFormItem name='count' label='count' gridarea='afterDesc'>
              <InputNumber controls={false} style={{ width: '100%' }} />
            </StyledFormItem>
          )}

          {/* Armor */}

          {selectedType === 'armor' && (
            <>
              <StyledFormItem name='acBonus' label='ac bonus' rules={[{ required: true }]}>
                <InputNumber controls={false} style={{ width: '100%' }} />
              </StyledFormItem>
              <StyledFormItem
                name='checkPenalty'
                label='check penalty'
                rules={[{ required: true }]}
              >
                <InputNumber controls={false} style={{ width: '100%' }} />
              </StyledFormItem>
              <StyledFormItem name='maxDex' label='max dex' rules={[{ required: true }]}>
                <InputNumber controls={false} style={{ width: '100%' }} />
              </StyledFormItem>
            </>
          )}

          {/* Armor */}

          {/* magicStick magicItem */}

          {(selectedType === 'magicStick' || selectedType === 'magicItem') && (
            <StyledFormItem
              name='chargesMax'
              label='charges'
              gridarea='afterDesc'
              rules={[{ required: true }]}
            >
              <InputNumber controls={false} style={{ width: '100%' }} />
            </StyledFormItem>
          )}

          {/* magicStick magicItem*/}

          <div style={{ gridArea: 'afterDesc' }}></div>

          {/* weapon */}

          {selectedType === 'weapon' && (
            <>
              <StyledFormItem
                gridarea='attackBonus'
                name='attackBonus'
                label='ability attack mod'
                rules={[{ required: true }]}
              >
                <Select
                  allowClear
                  options={[{ value: 'dex' }, { value: 'str' }, { value: 'wis' }]}
                />
              </StyledFormItem>

              <StyledFormItem
                gridarea='weaponAttackBonus'
                name='weaponAttackBonus'
                label='weapon attack bonus'
                rules={[{ required: true }]}
              >
                <InputNumber controls={false} style={{ width: '100%' }} />
              </StyledFormItem>

              <StyledFormItem
                gridarea='damageBonus'
                name='damageBonus'
                label='ability damage mod'
                rules={[{ required: true }]}
              >
                <Select allowClear options={[{ value: 'str' }, { value: false, label: 'none' }]} />
              </StyledFormItem>

              <StyledFormItem
                gridarea='maxDamageBonus'
                name='maxDamageBonus'
                label='max ability damage mod'
              >
                <InputNumber controls={false} style={{ width: '100%' }} />
              </StyledFormItem>

              <StyledFormItem
                gridarea='weaponDamageBonus'
                name='weaponDamageBonus'
                label='weapon damage bonus'
                rules={[{ required: true }]}
              >
                <InputNumber controls={false} style={{ width: '100%' }} />
              </StyledFormItem>
            </>
          )}

          {/* weapon */}

          <ButtonBox>
            <StyledFormItem>
              <Button type='default' htmlType='submit'>
                {editingItem ? 'Edit item' : 'Add item'}
              </Button>
            </StyledFormItem>
          </ButtonBox>
        </StyledForm>
      </StyledModal>
    );
  }
);

export default memo(AddItemModal);
