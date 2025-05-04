import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Form, Input, Modal } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import ImageCropModal from '../ImageCropModal';
import CroppedImage from '../CroppedImage';
import charactersStore from '../../store/charactersStore';
import { observer } from 'mobx-react';
import authStore from '../../store/authStore';

const StyledModal = styled(Modal)`
  width: 360px !important;
  @media screen and (max-width: 660px) {
    max-width: 96vw;
  }
`;

const StyledForm = styled(Form)`
  display: grid;
  grid-template-columns: 1fr;
  height: fit-content;

  width: 100%;
  max-width: 360px;
  padding: 5px 10px;
  align-content: start;
  background-color: white;
  border-radius: 6px;
`;

const StyledFormItem = styled(Form.Item)`
  margin: 0;
`;

const ButtonBox = styled.div`
  display: flex;
  padding-top: 15px;
  justify-content: end;
`;

const DEFAULT_IMAGE_LINK = 'https://i.postimg.cc/bNHNQwtg/0926d090-dd70-4242-926e-5cea3c486c48.png';

const EditAvatarModal = observer(({ charId, userId, modalIsOpen, setModalIsOpen }) => {
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropData, setCropData] = useState(null);

  const [form] = useForm();

  const imageUrl = useWatch('imageLink', form);

  const { changeAvatar, openedCharacter } = charactersStore;
  const { user } = authStore;

  const handleFinish = async (values) => {
    const crop = cropData ?? {};
    await changeAvatar(userId || user?.uid, charId, { ...values, ...crop });
    setModalIsOpen(false);
  };

  const handleCropComplete = (values) => {
    if (values) {
      setCroppedImage(imageUrl);
      setCropData(values);
      setCropModalOpen(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue({ ...openedCharacter.avatar });
  }, [openedCharacter.avatar]);

  useEffect(() => {
    setCropData(null);
  }, [imageUrl]);

  return (
    <StyledModal
      title='Edit avatar'
      open={modalIsOpen}
      onCancel={() => setModalIsOpen(false)}
      footer={null}
      destroyOnClose
    >
      <StyledForm form={form} onFinish={handleFinish} layout='vertical' labelAlign='left'>
        <CroppedImage
          imageSrc={
            croppedImage || imageUrl || openedCharacter?.avatar?.imageLink || DEFAULT_IMAGE_LINK
          }
          croppedAreaPixels={
            cropData?.croppedAreaPixels ?? openedCharacter?.avatar?.croppedAreaPixels
          }
          displayWidth={200}
          displayHeight={200}
          alwaysLight
          borderRadius='50%'
        />

        <StyledFormItem
          name='imageLink'
          label='link'
          rules={[{ type: 'url', message: 'Enter a valid URL!' }]}
        >
          <Input allowClear />
        </StyledFormItem>

        <ButtonBox>
          <StyledFormItem>
            <Button type='dashed' onClick={() => setCropModalOpen(true)}>
              Crop Image
            </Button>

            <Button type='default' htmlType='submit' disabled={!imageUrl}>
              Edit avatar
            </Button>
          </StyledFormItem>
        </ButtonBox>
      </StyledForm>

      <ImageCropModal
        visible={cropModalOpen}
        onCancel={() => setCropModalOpen(false)}
        imageSrc={imageUrl}
        onCropComplete={handleCropComplete}
        cropData={cropData ?? openedCharacter?.avatar}
      />
    </StyledModal>
  );
});

export default memo(EditAvatarModal);
