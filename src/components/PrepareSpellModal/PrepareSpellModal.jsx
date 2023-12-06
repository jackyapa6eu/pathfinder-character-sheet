import { memo, useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Modal, Select } from 'antd';
import {
  availableClasses,
  availableSchools,
  availableSpellLevels,
  availableSpellsSavingThrow,
} from '../../utils/consts';
import TextArea from 'antd/es/input/TextArea';
import { ButtonBox, StyledFormItem } from '../../uiComponents/uiComponents';
import styled from 'styled-components';
import charactersStore, { initialUserData as openedCharacter } from '../../store/charactersStore';
import { toJS } from 'mobx';
import { useForm } from 'antd/es/form/Form';
import authStore from '../../store/authStore';
import { observer } from 'mobx-react';

const StyledForm = styled(Form)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 5px;
  grid-template-areas:
    'name class'
    'checkBoxes level'
    '. submit';
`;

const PrepareSpellModal = observer(
  ({
    prepareSpellModalIsOpen,
    setPrepareSpellModalIsOpen,
    userId,
    charId,
    preparingSpell,
    setPreparingSpell,
  }) => {
    const [isMetamagic, setIsMetamagic] = useState(false);
    const [form] = useForm();

    const { prepareSpell } = charactersStore;
    const { user } = authStore;

    const onFinish = async (values) => {
      await prepareSpell(userId || user.uid, charId, values, false, preparingSpell);
      setPrepareSpellModalIsOpen(false);
    };

    const onCancel = () => {
      setPreparingSpell({});
      setPrepareSpellModalIsOpen(false);
    };

    useEffect(() => {
      if (preparingSpell) {
        form.setFieldsValue(preparingSpell);
      }

      return () => {};
    }, [preparingSpell]);

    return (
      <Modal
        title='Prepare spell'
        open={prepareSpellModalIsOpen}
        onCancel={onCancel}
        footer={null}
        destroyOnClose
        centered
      >
        <StyledForm layout='vertical' labelAlign='left' onFinish={onFinish} form={form}>
          <StyledFormItem gridarea='name' name='name' label='name'>
            <Input allowClear disabled />
          </StyledFormItem>
          <StyledFormItem gridarea='class' name='class' label='class' rules={[{ required: true }]}>
            <Select disabled options={Object.keys(availableClasses).map((el) => ({ value: el }))} />
          </StyledFormItem>
          <StyledFormItem
            gridarea='level'
            name='level'
            disabled
            label='level'
            rules={[{ required: true }]}
          >
            <Select
              options={Object.keys(availableSpellLevels).map((el) => ({
                value: el,
              }))}
              allowClear
              showSearch
              disabled={!isMetamagic}
            />
          </StyledFormItem>
          <div style={{ display: 'flex', justifyContent: 'space-between', gridArea: 'checkBoxes' }}>
            <StyledFormItem
              gridarea='metamagic'
              label='is metamagic'
              name='metamagic'
              valuePropName='checked'
              onChange={(event) => setIsMetamagic(event.target.checked)}
            >
              <Checkbox></Checkbox>
            </StyledFormItem>
            {/*<StyledFormItem*/}
            {/*  gridarea='asDomain'*/}
            {/*  label='as domain'*/}
            {/*  name='asDomain'*/}
            {/*  valuePropName='checked'*/}
            {/*  // onChange={(event) => setIsMetamagic(event.target.checked)}*/}
            {/*>*/}
            {/*  <Checkbox disabled={preparingSpell.isDomain}></Checkbox>*/}
            {/*</StyledFormItem>*/}
          </div>

          <ButtonBox>
            <StyledFormItem>
              <Button type='default' htmlType='submit'>
                Add
              </Button>
            </StyledFormItem>
          </ButtonBox>
        </StyledForm>
      </Modal>
    );
  }
);

export default memo(PrepareSpellModal);
