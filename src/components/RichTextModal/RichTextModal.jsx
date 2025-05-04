import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import ReactQuill from 'react-quill-new';
import Quill from 'quill';
import styled from 'styled-components';
import 'react-quill-new/dist/quill.snow.css';

const StyledReactQuill = styled(ReactQuill)`
  & .ql-editor {
    max-height: calc(90vh - 120px);
    overflow-y: auto;
  }
`;

const StyledModal = styled(Modal)`
  width: 900px !important;

  @media screen and (max-width: 660px) {
    max-width: 96vw;
  }

  & .rich-text-modal-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

const htmlToDelta = (html) => {
  const div = document.createElement('div');
  div.setAttribute('id', 'htmlToDelta');
  div.innerHTML = `<div id="quillEditor" style="display:none">${html}</div>`;
  document.body.appendChild(div);
  const quill = new Quill('#quillEditor', {
    theme: 'snow',
  });
  const delta = quill.getContents();
  document.getElementById('htmlToDelta').remove();
  return delta;
};

const RichTextModal = ({ text = '', handleSubmit, buttonText = 'Edit' }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [value, setValue] = useState(htmlToDelta(text));

  const handleSave = () => {
    handleSubmit(value);
    setModalIsOpen(false);
  };

  return (
    <div>
      <Button style={{ width: '80px' }} onClick={() => setModalIsOpen(true)}>
        {buttonText}
      </Button>
      <StyledModal
        title='Edit background'
        open={modalIsOpen}
        onCancel={() => setModalIsOpen(false)}
        footer={null}
        centered
      >
        <div className='rich-text-modal-content'>
          <StyledReactQuill theme='snow' value={value} onChange={setValue} />

          <Button
            type='default'
            htmlType='button'
            onClick={handleSave}
            style={{ width: '120px', alignSelf: 'flex-end' }}
          >
            Save
          </Button>
        </div>
      </StyledModal>
    </div>
  );
};

export default RichTextModal;
