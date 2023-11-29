import { memo, useCallback, useState } from 'react';
import { Button, Checkbox, Form, Input, Modal, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { alignmentSelectOptions, availableClasses } from '../../utils/consts';
import charactersStore from '../../store/charactersStore';
import { toJS } from 'mobx';
import authStore from '../../store/authStore';

const StyledFormItem = styled(Form.Item)`
  margin: 0;
  grid-area: ${(p) => p.gridarea ?? ''};
`;

const ButtonBox = styled.div`
  display: flex;
  padding-top: 15px;
  justify-content: end;
  grid-area: submit;
`;

const AddClassModal = observer(
  ({ addClassModalIsOpen, setAddClassModalIsOpen, userId, charId }) => {
    const { openedCharacter, addClass } = charactersStore;
    const { user } = authStore;

    const onFinish = useCallback(
      async (values) => {
        const classesCopy = JSON.parse(JSON.stringify(openedCharacter.classes));
        if (classesCopy[values.classes]) {
          classesCopy[values.classes].levels += 1;
        } else {
          classesCopy[values.classes] = { levels: 1 };
        }
        await addClass(userId || user.uid, charId, classesCopy, values.classes);
        setAddClassModalIsOpen(false);
      },
      [openedCharacter]
    );

    return (
      <Modal
        title='Add class'
        open={addClassModalIsOpen}
        onCancel={() => setAddClassModalIsOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout='vertical' labelAlign='left' onFinish={onFinish}>
          <StyledFormItem
            gridarea='class'
            name='classes'
            label='class'
            rules={[{ required: true }]}
          >
            <Select
              options={Object.keys(availableClasses).map((el) => ({ value: el }))}
              allowClear
              showSearch
            />
          </StyledFormItem>
          <ButtonBox>
            <StyledFormItem>
              <Button type='default' htmlType='submit'>
                Create
              </Button>
            </StyledFormItem>
          </ButtonBox>
        </Form>
      </Modal>
    );
  }
);

export default memo(AddClassModal);
