import React, { memo, useState, useEffect, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { Modal, Slider, Button } from 'antd';
import styled from 'styled-components';

const CropContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  background: #333;
`;

const ButtonBox = styled.div`
  display: flex;
  padding-top: 15px;
  justify-content: end;
`;

const ImageCropModal = ({
  visible,
  onCancel,
  imageSrc,
  onCropComplete,
  cropData = null,
  aspect = 1,
}) => {
  const [crop, setCrop] = useState(cropData?.crop || { x: 0, y: 0 });
  const [zoom, setZoom] = useState(cropData?.zoom || 1);

  const cropDataRef = useRef(cropData);

  const onCropChange = (croppedArea, croppedAreaPixels) => {
    cropDataRef.current = {
      croppedArea,
      croppedAreaPixels,
      zoom,
      crop,
    };
  };

  const handleSave = () => {
    if (cropDataRef.current) {
      onCropComplete(cropDataRef.current);
    }
    onCancel();
  };

  useEffect(() => {
    if (visible && cropData) {
      setCrop(cropData?.crop || { x: 0, y: 0 });
    }
  }, [visible, cropData]);

  return (
    <Modal
      title='Crop Image'
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      maskClosable={false}
    >
      <CropContainer>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropChange}
          onZoomChange={setZoom}
        />
      </CropContainer>
      <div style={{ marginTop: 20 }}>
        <span>Zoom:</span>
        <Slider
          min={1}
          max={6}
          step={0.1}
          value={zoom}
          onChange={setZoom}
          style={{ marginBottom: 20 }}
        />
        <ButtonBox>
          <Button type='primary' onClick={handleSave}>
            Save
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={onCancel}>
            Cancel
          </Button>
        </ButtonBox>
      </div>
    </Modal>
  );
};

export default memo(ImageCropModal);
