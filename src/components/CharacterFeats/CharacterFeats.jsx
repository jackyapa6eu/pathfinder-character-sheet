import { observer } from 'mobx-react';
import { memo, useState } from 'react';
import { Button, Form, Input, Modal, notification } from 'antd';
import styled from 'styled-components';
import TextArea from 'antd/es/input/TextArea';
import charactersStore from '../../store/charactersStore';
import authStore from '../../store/authStore';

const FeatsContainer = styled.div`
  display: grid;
  width: 100%;
  align-content: start;
  grid-template-rows: repeat(auto-fit, max-content);
  box-shadow: 0 0 3px rgba(128, 128, 128, 0.5);
  padding: 0 5px;
  gap: 10px;
`;

const FeatsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: 5px;
  column-gap: 10px;
`;

const FeatsListItem = styled.p`
  margin: 0;
  font-weight: 500;
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: black;
    color: white;

    & .delete-feat-button {
      display: flex;
    }
  }
`;

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

const DeleteFeatButton = styled(Button)`
  position: absolute;
  display: none;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
  top: -3px;
  right: -3px;
  background: white;
  color: black;
  padding: 0;
  border-radius: 0px;
  font-size: 6px;
`;

const CharacterFeats = observer(({ charId, userId }) => {
  const [addFeatModalIsOpen, setAddFeatModalIsOpen] = useState(false);
  const { addFeat, deleteFeat, openedCharacter } = charactersStore;
  const { user } = authStore;

  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values) => {
    await addFeat(userId || user.uid, charId, values);
    setAddFeatModalIsOpen(false);
  };

  const handleOpenFeat = ({ name, description }) => {
    api.open({
      message: name,
      description: <div style={{ maxHeight: '45vh', overflowY: 'auto' }}>{description}</div>,
      duration: 0,
    });
  };

  const handleDeleteFeat = async (event, featRef) => {
    event.stopPropagation();
    await deleteFeat(userId || user.uid, charId, featRef);
  };

  return (
    <FeatsContainer>
      <Modal
        title='Add feat'
        open={addFeatModalIsOpen}
        onCancel={() => setAddFeatModalIsOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout='vertical' labelAlign='left' onFinish={onFinish}>
          <StyledFormItem gridarea='name' name='name' label='name' rules={[{ required: true }]}>
            <Input allowClear />
          </StyledFormItem>
          <StyledFormItem
            gridarea='description'
            name='description'
            label='description'
            rules={[{ required: true }]}
          >
            <TextArea allowClear />
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
      {contextHolder}
      <Button size='small' style={{ width: '80px' }} onClick={() => setAddFeatModalIsOpen(true)}>
        Add +
      </Button>
      <FeatsList>
        {openedCharacter.feats &&
          Object.entries(openedCharacter.feats).map(([featKey, data]) => (
            <FeatsListItem key={featKey} onClick={() => handleOpenFeat(data)}>
              <DeleteFeatButton
                className='delete-feat-button'
                onClick={(event) => handleDeleteFeat(event, featKey)}
              >
                X
              </DeleteFeatButton>
              {data.name}
            </FeatsListItem>
          ))}
      </FeatsList>
    </FeatsContainer>
  );
});

export default memo(CharacterFeats);
