import React, { memo, useEffect, useMemo, useState } from 'react';
import { Button, Modal, Select } from 'antd';
import CharacterPageContextWrapper from '../CharacterPageContextWrapper';
import Teammate from '../Teammate';
import styled from 'styled-components';
import usersStore from '../../store/usersStore';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { alignmentSelectOptions } from '../../utils/consts';
import authStore from '../../store/authStore';

const TeammatesContainer = styled.div`
  display: flex;
  gap: 4px;
  padding: 4px 0;
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

const Teammates = observer(({ userId, cantEdit, charId, store, isDarkTheme }) => {
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const { getUsers, usersCharacters } = usersStore;
  const { user } = authStore;

  const { addTeammate, openedCharacter } = store;

  const chars = useMemo(() => {
    return usersCharacters
      ? Object.values(usersCharacters)
          .sort((a, b) => Number(!!a.isDead) - Number(!!b.isDead))
          .map((el) => ({ label: el.name, value: el.charName }))
          .filter(
            (el) =>
              (openedCharacter?.teammates || []).find((item) => item.charName === el.value) ===
              undefined
          )
      : [];
  }, [usersCharacters]);

  useEffect(() => {
    if (Object.keys(usersCharacters).length === 0) {
      getUsers();
    }
  }, []);

  useEffect(() => {
    console.log(
      'chars: ',
      chars.map((el) => toJS(el))
    );
  }, [chars]);

  const handleAdd = () => {
    const { owner, charName, name } = usersCharacters[selectedCharacter];
    const newChar = {
      owner,
      charName,
      name,
    };
    addTeammate(userId || user?.uid, charId, newChar);
    setAddModalIsOpen(false);
    setSelectedCharacter(null);
  };

  return (
    <TeammatesContainer>
      {openedCharacter?.teammates?.length > 0 &&
        openedCharacter?.teammates.map((item) => (
          <Teammate key={item.name} item={item} isDarkTheme={isDarkTheme} />
        ))}
      {!cantEdit && <AddWeaponButton onClick={() => setAddModalIsOpen(true)}>+</AddWeaponButton>}

      <Modal
        title='Add teammate'
        open={addModalIsOpen}
        onCancel={() => setAddModalIsOpen(false)}
        onOk={handleAdd}
        centered
      >
        <Select
          style={{ width: '100%' }}
          options={chars}
          allowClear
          value={selectedCharacter}
          onChange={setSelectedCharacter}
        />
      </Modal>
    </TeammatesContainer>
  );
});

export default memo(Teammates);
