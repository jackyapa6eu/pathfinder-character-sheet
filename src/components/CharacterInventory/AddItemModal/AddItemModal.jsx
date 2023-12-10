import { observer } from 'mobx-react';
import { memo, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import styled from 'styled-components';
import { ButtonBox, StyledFormItem } from '../../../uiComponents/uiComponents';
import TextArea from 'antd/es/input/TextArea';
import charactersStore from '../../../store/charactersStore';
import authStore from '../../../store/authStore';
import { itemTypes } from '../../../utils/consts';

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

const initialFormValues = {
  cost: null,
  description: null,
  count: null,
};

const AddItemModal = observer(({ charId, userId, addItemModalIsOpen, setAddItemModalIsOpen }) => {
  const [selectedType, setSelectedType] = useState(null);

  const { createInventoryItem } = charactersStore;
  const { user } = authStore;
  const data = {
    armor: {
      type: '',
      name: '',
      weight: 0,
      description: '',
      cost: 0,

      acBonus: 0,
      checkPenalty: 0,
      maxDex: 0,
    },
    magicItem: {
      type: '',
      name: '',
      weight: 0,
      description: '',
      cost: 0,

      chargesMax: 99,
      chargesLeft: 0,
    },
    consumables: {
      type: '',
      name: '',
      weight: 0,
      description: '',
      cost: 0,
      count: 0,
    },
    items: {
      type: '',
      name: '',
      weight: 0,
      description: '',
    },
  };

  const onFinish = async (values) => {
    await createInventoryItem(userId || user.uid, charId, values);
    setAddItemModalIsOpen(false);
  };

  return (
    <StyledModal
      title='Add item to your inventory'
      open={addItemModalIsOpen}
      onCancel={() => setAddItemModalIsOpen(false)}
      initialValues={initialFormValues}
      footer={null}
      destroyOnClose
      centered
    >
      <StyledForm layout='vertical' labelAlign='left' onFinish={onFinish}>
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
        <StyledFormItem name='cost' label='cost'>
          <InputNumber controls={false} style={{ width: '100%' }} />
        </StyledFormItem>

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
            <StyledFormItem name='checkPenalty' label='check penalty' rules={[{ required: true }]}>
              <InputNumber controls={false} style={{ width: '100%' }} />
            </StyledFormItem>
            <StyledFormItem name='maxDex' label='max dex' rules={[{ required: true }]}>
              <InputNumber controls={false} style={{ width: '100%' }} />
            </StyledFormItem>
          </>
        )}

        {/* Armor */}

        {/* magicItem */}

        {selectedType === 'magicItem' && (
          <StyledFormItem
            name='chargesMax'
            label='charges'
            gridarea='afterDesc'
            rules={[{ required: true }]}
          >
            <InputNumber controls={false} style={{ width: '100%' }} />
          </StyledFormItem>
        )}

        {/* magicItem */}

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
              <Select allowClear options={[{ value: 'dex' }, { value: 'str' }, { value: 'wis' }]} />
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
              Add item
            </Button>
          </StyledFormItem>
        </ButtonBox>
      </StyledForm>
    </StyledModal>
  );
});

export default memo(AddItemModal);
