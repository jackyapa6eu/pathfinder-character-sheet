import { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  Checkbox,
  Collapse,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Switch,
  Tooltip,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import charactersStore from '../../store/charactersStore';
import authStore from '../../store/authStore';
import TextArea from 'antd/es/input/TextArea';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import {
  availableClasses,
  availableSchools,
  availableSpellLevels,
  availableSpellsSavingThrow,
} from '../../utils/consts';
import { filterUndefinedToNull } from '../../utils/helpers';
import PrepareSpellModal from '../PrepareSpellModal';
import IsUsedCheckbox from '../IsUsedCheckbox';
import AddFreeSpellSlotButton from '../AddFreeSpellSlotButton';
import CampIcon from '../../icons/CampIcon';

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

const SpellsContainer = styled.div`
  display: grid;
  width: 100%;
  align-content: start;
  grid-template-rows: repeat(auto-fit, max-content);
  box-shadow: 0 0 3px rgba(128, 128, 128, 0.5);
  padding: 0 5px;
  gap: 10px;
`;

const SpellListContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;

  @media screen and (max-width: 492px) {
    grid-template-columns: 1fr;
  }
`;

const SpellList = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledForm = styled(Form)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 5px;
  grid-template-areas:
    'name level'
    'class castingTime'
    'school range'
    'target duration'
    'savingThrow spellResistance'
    'description description'
    '. submit';
`;

const SpellsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: 5px;
  column-gap: 10px;
  align-items: center;
`;

const SpellsListItem = styled.p`
  margin: 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 3px;
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

    & .add-spell-button {
      display: flex;
    }
  }
`;

const SpellDescriptionHeader = styled.span`
  font-weight: 500;
`;

const DeleteSpellButton = styled(Button)`
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

const PrepareSpellButton = styled(Button)`
  position: absolute;
  display: none;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  top: calc(50% - 8px);
  left: -11px;
  background: white;
  color: black;
  padding: 0;
  border-radius: 0px;
  font-size: 10px;
`;

const CharacterSpells = observer(({ charId, userId }) => {
  const [addSpellModalIsOpen, setAddSpellModalIsOpen] = useState(false);
  const [showAllSpellsPerDay, setShowAllSpellsPerDay] = useState(false);
  const [prepareSpellModalIsOpen, setPrepareSpellModalIsOpen] = useState(false);
  const [preparingSpell, setPreparingSpell] = useState({});
  const {
    openedCharacter,
    addSpell,
    deleteSpell,
    spellUse,
    prepareSpell,
    deletePreparedSpell,
    changeFreeSlotsForLevel,
    changeMaxSpellsPerDay,
    makeFullRest,
  } = charactersStore;
  const { user } = authStore;
  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values) => {
    await addSpell(userId || user.uid, charId, filterUndefinedToNull(values));
    setAddSpellModalIsOpen(false);
  };

  const handleOpenSpell = ({
    name,
    description,
    castingTime,
    duration,
    target,
    range,
    savingThrow,
    school,
  }) => {
    const newDesc = (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {duration && (
          <div>
            <SpellDescriptionHeader>duration: </SpellDescriptionHeader>
            <span>{duration}</span>
          </div>
        )}
        {target && (
          <div>
            <SpellDescriptionHeader>target: </SpellDescriptionHeader>
            <span>{target}</span>
          </div>
        )}
        {range && (
          <div>
            <SpellDescriptionHeader>range: </SpellDescriptionHeader>
            <span>{range}</span>
          </div>
        )}
        {castingTime && (
          <div>
            <SpellDescriptionHeader>casting time: </SpellDescriptionHeader>
            <span>{castingTime}</span>
          </div>
        )}
        {school && (
          <div>
            <SpellDescriptionHeader>school: </SpellDescriptionHeader>
            <span>{school}</span>
          </div>
        )}
        <div>
          <SpellDescriptionHeader>saving throw: </SpellDescriptionHeader>
          <span>{savingThrow ? 'Yes' : 'No'}</span>
        </div>

        <div>{description}</div>
      </div>
    );
    api.open({
      message: name,
      description: newDesc,
      duration: 0,
    });
  };

  const handleDeleteSpell = async (event, spellRef, spellData) => {
    event.stopPropagation();
    await deleteSpell(userId || user.uid, charId, spellRef, spellData);
  };

  const handleAddSpell = async (event, spellData) => {
    event.stopPropagation();
    setPrepareSpellModalIsOpen(true);
    setPreparingSpell(spellData);
  };

  const handleUseSpell = async (event, spellData) => {
    event.stopPropagation();
    await spellUse(userId || user.uid, charId, spellData);
  };

  const handleAddFreeSpellSlot = async (spellValue) => {
    await prepareSpell(userId || user.uid, charId, spellValue, true);
  };

  const handleDeletedPreparedSpell = async (event, spellData) => {
    event.stopPropagation();
    await deletePreparedSpell(userId || user.uid, charId, spellData);
  };

  const handleFreeSpells = async (value, className, level) => {
    await changeFreeSlotsForLevel(userId || user.uid, charId, value, className, level);
  };

  const handleChangeMaxSpellsPerDay = async (newValue, className, level) => {
    await changeMaxSpellsPerDay(userId || user.uid, charId, newValue, className, level);
  };

  return (
    <SpellsContainer>
      {contextHolder}
      <PrepareSpellModal
        prepareSpellModalIsOpen={prepareSpellModalIsOpen}
        setPrepareSpellModalIsOpen={setPrepareSpellModalIsOpen}
        preparingSpell={preparingSpell}
        setPreparingSpell={setPreparingSpell}
        userId={userId}
        charId={charId}
      />
      <Modal
        title='Add spell'
        open={addSpellModalIsOpen}
        onCancel={() => setAddSpellModalIsOpen(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <StyledForm layout='vertical' labelAlign='left' onFinish={onFinish}>
          <StyledFormItem gridarea='name' name='name' label='name' rules={[{ required: true }]}>
            <Input allowClear />
          </StyledFormItem>
          <StyledFormItem gridarea='class' name='class' label='class' rules={[{ required: true }]}>
            <Select
              options={Object.keys(openedCharacter.classes).map((el) => ({ value: el }))}
              allowClear
              showSearch
            />
          </StyledFormItem>
          <StyledFormItem gridarea='level' name='level' label='level' rules={[{ required: true }]}>
            <Select
              options={Object.keys(availableSpellLevels).map((el) => ({
                value: el,
              }))}
              allowClear
              showSearch
            />
          </StyledFormItem>
          <StyledFormItem gridarea='school' name='school' label='school'>
            <Select
              options={Object.keys(availableSchools).map((el) => ({ value: el }))}
              allowClear
              showSearch
            />
          </StyledFormItem>
          <StyledFormItem gridarea='castingTime' name='castingTime' label='casting time'>
            <Input allowClear />
          </StyledFormItem>
          <StyledFormItem gridarea='range' name='range' label='range'>
            <Input allowClear />
          </StyledFormItem>
          <StyledFormItem gridarea='target' name='target' label='target'>
            <Input allowClear />
          </StyledFormItem>
          <StyledFormItem gridarea='duration' name='duration' label='duration'>
            <Input allowClear />
          </StyledFormItem>
          <StyledFormItem gridarea='savingThrow' name='savingThrow' label='saving throw'>
            <Select
              options={Object.keys(availableSpellsSavingThrow).map((el) => ({ value: el }))}
              allowClear
              showSearch
            />
          </StyledFormItem>
          <StyledFormItem
            gridarea='description'
            name='description'
            label='description'
            rules={[{ required: true }]}
          >
            <TextArea allowClear />
          </StyledFormItem>
          <StyledFormItem
            gridarea='spellResistance'
            label='spell resistance'
            name='spellResistance'
            valuePropName='checked'
          >
            <Checkbox></Checkbox>
          </StyledFormItem>
          <ButtonBox>
            <StyledFormItem>
              <Button type='default' htmlType='submit'>
                Add
              </Button>
            </StyledFormItem>
          </ButtonBox>
        </StyledForm>
      </Modal>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button size='small' style={{ width: '80px' }} onClick={() => setAddSpellModalIsOpen(true)}>
          Add +
        </Button>
        <div style={{ display: 'flex', gap: '5px', width: 'max-content', alignItems: 'center' }}>
          <Switch
            checkedChildren='all'
            size='small'
            checked={showAllSpellsPerDay}
            onChange={setShowAllSpellsPerDay}
          />
        </div>
      </div>

      <SpellListContainer>
        <SpellList>
          <h4 style={{ margin: 0 }}>Learned</h4>
          {openedCharacter.spells &&
            Object.keys(openedCharacter.spells).map((className) => (
              <Collapse
                key={className}
                items={[
                  {
                    key: className,
                    label: className,
                    children: Object.keys(openedCharacter.spells[className]).map((level) => (
                      <Collapse
                        key={level}
                        items={[
                          {
                            key: level,
                            label: level,
                            children: (
                              <SpellsList>
                                {openedCharacter.spells[className][level] &&
                                  Object.entries(openedCharacter.spells[className][level]).map(
                                    ([spellName, spellData]) => (
                                      <SpellsListItem
                                        key={spellName}
                                        onClick={() => handleOpenSpell(spellData)}
                                      >
                                        {level === 'supernatural ability' ||
                                        (openedCharacter.spellsPerDay[className][level]
                                          .maxCountPerDay > 0 &&
                                          (!openedCharacter.spellsPerDay[className][level].spells ||
                                            Object.keys(
                                              openedCharacter.spellsPerDay[className][level].spells
                                            ).length <
                                              openedCharacter.spellsPerDay[className][level]
                                                .maxCountPerDay)) ? (
                                          <PrepareSpellButton
                                            onClick={(event) => handleAddSpell(event, spellData)}
                                            className='add-spell-button'
                                          >
                                            +
                                          </PrepareSpellButton>
                                        ) : null}

                                        <DeleteSpellButton
                                          className='delete-feat-button'
                                          onClick={(event) =>
                                            handleDeleteSpell(event, spellName, spellData)
                                          }
                                        >
                                          X
                                        </DeleteSpellButton>
                                        {spellData.name}
                                      </SpellsListItem>
                                    )
                                  )}
                              </SpellsList>
                            ),
                          },
                        ]}
                        bordered={false}
                        size='small'
                      />
                    )),
                  },
                ]}
                bordered={false}
                size='small'
              />
            ))}
        </SpellList>
        <SpellList>
          <h4 style={{ margin: 0 }}>Prepared</h4>
          <SpellList>
            {openedCharacter.classes &&
              Object.keys(openedCharacter.classes).map((className) => (
                <Collapse
                  key={className}
                  style={{
                    display: `${
                      !Object.values(openedCharacter.spellsPerDay[className]).some(
                        (el) => el.maxCountPerDay > 0
                      ) && !showAllSpellsPerDay
                        ? 'none'
                        : ''
                    }`,
                  }}
                  items={[
                    {
                      key: className,
                      label: className,
                      children:
                        openedCharacter.spellsPerDay &&
                        openedCharacter.spellsPerDay[className] &&
                        Object.entries(openedCharacter.spellsPerDay[className]).map(
                          ([level, levelData]) => (
                            <Collapse
                              key={level}
                              style={{
                                display: `${
                                  !showAllSpellsPerDay && !levelData.maxCountPerDay > 0
                                    ? 'none'
                                    : ''
                                }`,
                              }}
                              items={[
                                {
                                  key: level,
                                  label: (
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <span>
                                        {`${level} ${
                                          level === 'supernatural ability'
                                            ? ''
                                            : `${
                                                levelData.spells
                                                  ? Object.keys(levelData.spells).length
                                                  : 0
                                              }/${levelData.maxCountPerDay}`
                                        }`}
                                      </span>
                                      {user.dm && level !== 'supernatural ability' && (
                                        <div
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                          }}
                                          onClick={(event) => event.stopPropagation()}
                                        >
                                          <Tooltip title='New max spells per day'>
                                            <InputNumber
                                              controls={false}
                                              style={{ width: '40px' }}
                                              onChange={(value) =>
                                                handleChangeMaxSpellsPerDay(value, className, level)
                                              }
                                              size='small'
                                            />
                                          </Tooltip>

                                          <Switch
                                            checkedChildren='free slots'
                                            unCheckedChildren='free slots'
                                            size='small'
                                            checked={levelData.freeSpells}
                                            onChange={(value) =>
                                              handleFreeSpells(value, className, level)
                                            }
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ),
                                  children: (
                                    <SpellsList>
                                      {openedCharacter.spellsPerDay[className][level].spells &&
                                        Object.entries(
                                          openedCharacter.spellsPerDay[className][level].spells
                                        ).map(([spellName, spellData]) => (
                                          <SpellsListItem
                                            key={spellName}
                                            // onClick={() => handleOpenSpell(spellData)}
                                          >
                                            <DeleteSpellButton
                                              className='delete-feat-button'
                                              onClick={(event) =>
                                                handleDeletedPreparedSpell(event, spellData)
                                              }
                                            >
                                              X
                                            </DeleteSpellButton>
                                            {!spellData.freeSlot && spellData.name}
                                            <IsUsedCheckbox
                                              checked={spellData.isUsed}
                                              handleClick={(event) =>
                                                handleUseSpell(event, spellData)
                                              }
                                            />
                                          </SpellsListItem>
                                        ))}
                                      {level !== 'supernatural ability' && levelData.freeSpells && (
                                        <AddFreeSpellSlotButton
                                          className={className}
                                          level={level}
                                          handleClick={() =>
                                            handleAddFreeSpellSlot({
                                              class: className,
                                              level,
                                              name: 'freeSlot',
                                            })
                                          }
                                        />
                                      )}
                                    </SpellsList>
                                  ),
                                },
                              ]}
                              bordered={false}
                              size='small'
                            />
                          )
                        ),
                    },
                  ]}
                  bordered={false}
                  size='small'
                />
              ))}
          </SpellList>
        </SpellList>
      </SpellListContainer>
    </SpellsContainer>
  );
});

export default memo(CharacterSpells);
