import { observer } from 'mobx-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import styled from 'styled-components';
import { ButtonBox, StyledFormItem } from '../../../uiComponents/uiComponents';
import TextArea from 'antd/es/input/TextArea';
import authStore from '../../../store/authStore';
import { equippedItem, itemTypes } from '../../../utils/consts';
import { useForm } from 'antd/es/form/Form';
import knownItemsStore from '../../../store/knownItemsStore';
import ChargesInputs from './inputs/ChargesInputs';
import AcBonusInputs from './inputs/AcBonusInputs';
import AttackInputs from './inputs/AttackInputs';
import AbilityBonusInputs from './inputs/AbilityBonusInputs';
import SavingThrowsInputs from './inputs/SavingThrowsInputs';
import SkillsInputs from './inputs/SkillsInputs';
import { filterUndefinedToNull, makeName } from '../../../utils/helpers';

const StyledForm = styled(Form)`
  display: grid;
  max-height: 85vh;
  overflow-y: auto;
  grid-template-columns: 20px 1fr 1fr 1fr 1fr 1fr 1fr 32px;
  column-gap: 5px;
  grid-template-areas:
    '. type equipSlot cost cost weight count. '
    '. name name name description description description. '
    '. acBonusType acBonus checkPenalty checkPenalty maxDex . .'
    '. attackBonus attackBonus weaponAttackBonus weaponAttackBonus damageBonus damageBonus.'
    '. maxDamageBonus maxDamageBonus weaponDamageBonus weaponDamageBonus . . .'
    '. chargesName chargesName chargesName charges chargesType chargesType .'
    '. additionalFields additionalFields additionalFields additionalFields additionalFields additionalFields additionalFields'
    '. . . . . selectAddField selectAddField addFieldButton'
    '. . . . .  . submit .';

  @media screen and (max-width: 660px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'type equipSlot'
      'cost weight'
      '. count'
      'name description'
      'acBonus checkPenalty'
      'maxDex attackBonus'
      'weaponAttackBonus damageBonus'
      'maxDamageBonus weaponDamageBonus'
      'charges charges'
      'additionalFields additionalFields'
      'selectAddField addFieldButton'
      '. submit';
  }
`;

const StyledModal = styled(Modal)`
  width: 900px !important;

  @media screen and (max-width: 660px) {
    max-width: 96vw;
    & .ant-modal-content {
      padding: 10px;
    }
  }
`;

const componentDictionary = {
  charges: ChargesInputs,
  acBonus: AcBonusInputs,
  attack: AttackInputs,
  ability: AbilityBonusInputs,
  savingThrow: SavingThrowsInputs,
  skill: SkillsInputs,
};

const AddItemModal = observer(
  ({
    store,
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
    const [additionalInputs, setAdditionalInputs] = useState({});
    const [newFieldType, setNewFieldType] = useState(null);
    const { createInventoryItem } = store;
    const { createKnownItem } = knownItemsStore;
    const { user } = authStore;

    const [form] = useForm();

    useEffect(() => {
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

    const renderComponent = (type, props) => {
      const Component = componentDictionary[type];

      if (!Component) {
        console.error(`Unknown component type: ${type}`);
        return null;
      }

      return <Component {...props} />;
    };

    const addField = useCallback(() => {
      if (newFieldType) {
        setAdditionalInputs((prevInputs) => ({
          ...prevInputs,
          [new Date().getTime()]: newFieldType,
        }));
      }
    }, [newFieldType]);

    const deleteField = useCallback(
      (fieldKey) => {
        const copy = JSON.parse(JSON.stringify(additionalInputs));
        delete copy[fieldKey];
        setAdditionalInputs(copy);
      },
      [additionalInputs]
    );

    const handleInputs = (name) => {
      setAdditionalInputs({ [new Date().getTime()]: name });
    };

    const handleChangeType = (value) => {
      setAdditionalInputs({});
      if (value === 'armor') handleInputs('acBonus');
      if (value === 'magicItem' || value === 'magicStick') handleInputs('charges');
      if (value === 'weapon') handleInputs('attack');
    };

    const onFinish = useCallback(
      async (values) => {
        const result = Object.entries(values).reduce((acc, [fieldName, fieldData]) => {
          if (['charges', 'skill', 'savingThrows', 'abilityBonus'].includes(fieldName)) {
            acc[fieldName] = filterUndefinedToNull(
              Object.values(fieldData).reduce((res, curr) => {
                if (fieldName === 'charges') {
                  if (curr.restorable) {
                    curr.maxCharges = curr.count;
                  } else {
                    curr.maxCharges = 50;
                  }
                }
                res[makeName(curr.name)] = filterUndefinedToNull(curr);
                return res;
              }, {})
            );
          } else if (['acBonus'].includes(fieldName)) {
            acc[fieldName] = Object.values(fieldData).reduce((res, curr) => {
              res[curr.acBonusType] = curr;
              return res;
            }, {});
          } else if (['attack'].includes(fieldName)) {
            acc[fieldName] = filterUndefinedToNull(Object.values(fieldData)[0]);
          } else {
            acc[fieldName] = fieldData;
          }
          return acc;
        }, {});
        console.log(result);

        await createInventoryItem(
          userId || user.uid,
          charId,
          result,
          editingItem?.itemName,
          addKnownItemModalIsOpen
        );
        await createKnownItem(result, editingItem?.itemName);
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
            <Select options={itemTypes} onChange={handleChangeType} />
          </StyledFormItem>

          <StyledFormItem
            gridarea='equipSlot'
            name='equipSlot'
            label='equip slot'
            rules={[{ required: true }]}
          >
            <Select options={Object.keys(equippedItem).map((el) => ({ value: el }))} />
          </StyledFormItem>

          <StyledFormItem gridarea='name' name='name' label='name' rules={[{ required: true }]}>
            <Input />
          </StyledFormItem>

          <StyledFormItem
            gridarea='weight'
            name='weight'
            label='weight'
            rules={[{ required: true }]}
          >
            <InputNumber controls={false} style={{ width: '100%' }} />
          </StyledFormItem>
          <div style={{ display: 'flex', gridArea: 'cost' }}>
            <StyledFormItem name='cost' label='cost' style={{ width: cost ? '50%' : '100%' }}>
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

          <StyledFormItem name='count' label='count' gridarea='count'>
            <InputNumber controls={false} style={{ width: '100%' }} />
          </StyledFormItem>

          <div style={{ gridArea: 'additionalFields' }}>
            {Object.entries(additionalInputs).map(([key, type]) => (
              <div key={key}>{renderComponent(type, { inputKey: key, deleteField })}</div>
            ))}
          </div>

          <StyledFormItem gridarea='selectAddField' label='add item property'>
            <Select
              options={Object.keys(componentDictionary).map((el) => ({ value: el }))}
              value={newFieldType}
              onChange={setNewFieldType}
            />
          </StyledFormItem>
          <Button
            htmlType='button'
            style={{ gridArea: 'addFieldButton', width: '100%', padding: 0, alignSelf: 'end' }}
            onClick={addField}
            disabled={!newFieldType}
          >
            +
          </Button>

          {/* weapon */}

          <ButtonBox>
            <StyledFormItem>
              <Button type='default' htmlType='submit' style={{ width: '100%' }}>
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
