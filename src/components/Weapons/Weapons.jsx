import styled from 'styled-components';
import { observer } from 'mobx-react';
import { memo, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select, Tooltip } from 'antd';
import { ButtonBox, StyledFormItem } from '../../uiComponents/uiComponents';
import authStore from '../../store/authStore';
import WeaponItem from './WeaponItem';

const WeaponsContainer = styled.div`
  grid-area: weapons;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  height: max-content;
  gap: 5px;
`;

const WeaponsList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: 5px;
`;

const AddWeaponButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: white;
  color: black;
  padding: 0;
  border-radius: 0px;
  font-size: 20px;
  line-height: 16px;
`;

const StyledForm = styled(Form)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 5px;
  grid-template-areas:
    'name name maxDamageBonus maxDamageBonus'
    'attackBonus attackBonus weaponAttackBonus weaponAttackBonus'
    'damageBonus damageBonus weaponDamageBonus weaponDamageBonus'
    '. . . submit';
`;

const Weapons = observer(({ store, charId, userId, canEdit }) => {
  const [addWeaponModalIsOpen, setAddWeaponModalIsOpen] = useState(false);
  const { openedCharacter, createWeapon } = store;
  const { user } = authStore;

  const finishCreateWeapon = async (values) => {
    await createWeapon(userId || user.uid, charId, values);
    setAddWeaponModalIsOpen(false);
  };

  return (
    <WeaponsContainer>
      <Modal
        title='Add weapon'
        open={addWeaponModalIsOpen}
        onCancel={() => setAddWeaponModalIsOpen(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <StyledForm layout='vertical' labelAlign='left' onFinish={finishCreateWeapon}>
          <StyledFormItem gridarea='name' name='name' label='name' rules={[{ required: true }]}>
            <Input />
          </StyledFormItem>

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

          <ButtonBox>
            <StyledFormItem>
              <Button type='default' htmlType='submit'>
                Add weapon
              </Button>
            </StyledFormItem>
          </ButtonBox>
        </StyledForm>
      </Modal>
      <WeaponsList>
        {openedCharacter.weapons &&
          Object.entries(openedCharacter.weapons).map(([weaponName, weaponData]) => (
            <WeaponItem
              store={store}
              charId={charId}
              userId={userId}
              key={weaponName}
              weaponData={weaponData}
              canEdit={canEdit}
            />
          ))}
      </WeaponsList>
      <Tooltip title='Добавить оружие'>
        <AddWeaponButton disabled={canEdit} onClick={() => setAddWeaponModalIsOpen(true)}>
          +
        </AddWeaponButton>
      </Tooltip>
    </WeaponsContainer>
  );
});

export default memo(Weapons);
