import { observer } from 'mobx-react';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import authStore from '../../store/authStore';
import { initialUserData } from '../../store/charactersStore';
import styled from 'styled-components';
import { Button, Checkbox, Form, Input, InputNumber, Modal, Progress, Select, Tabs } from 'antd';
import { alignmentSelectOptions } from '../../utils/consts';
import FormItem from '../FormItem';
import Abilities from '../Abilities';
import { useForm } from 'antd/es/form/Form';
import HitPointsInitiativeArmor from '../HitPointsInitiativeArmor';
import SavingThrows from '../SavingThrows';
import Attack from '../Attack';
import Skills from '../Skills';
import CharacterFeats from '../CharacterFeats';
import AddClassModal from '../AddClassModal';
import CharacterSpells from '../CharacterSpells';
import CampIcon from '../../icons/CampIcon';
import Weapons from '../Weapons';
import CharacterInventory from '../CharacterInventory';
import knownItemsStore from '../../store/knownItemsStore';
import CharacterEquippedGear from '../CharacterEquippedGear';
import ChangesHistory from '../ChangesHistory';
import CharacterBackground from '../CharacterBackground';
import EditAvatarModal from '../EditAvatarModal';
import CroppedImage from '../CroppedImage';
import Teammates from '../Teammates';
import ProgressBar from '../ProgressBar';
import { toJS } from 'mobx';

const StyledTabs = styled(Tabs)`
  width: 100%;
  color: black;!important;
    
  //& .ant-tabs-content-holder {
  //  max-height: calc(100vh - 360px);
  //  overflow-y: auto;
  //}  
    
  & .ant-tabs-nav {
    margin: 0;
  }
  
  & .ant-tabs-nav-list {
    flex-wrap: wrap;
  }
  
  & .ant-tabs-tab-btn {
    color: black!important;
    
  }
  
  & .ant-tabs-tab  {
    padding-top: 0!important;
  }

  //@media screen and (max-width: 1080px) {
  //  & .ant-tabs-content-holder {
  //    max-height: calc(100vh - 380px);
  //  }
  //}
  //
  //@media screen and (max-width: 700px) {
  //  & .ant-tabs-content-holder {
  //    max-height: calc(100vh - 450px);
  //  }
  //}
  //
  //@media screen and (max-width: 600px) {
  //    & .ant-tabs-content-holder {
  //        max-height: max-content;
  //    }
  //}
`;

const FormInstance = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;

  & .char-name-container {
    grid-area: title;
    display: flex;
    align-items: flex-end;
    padding: 5px;
    gap: 5px;
  }

  & .char-avatar-container {
    position: relative;
  }

  & h3 {
    margin: 0;
    font-size: 26px;
    line-height: 26px;
  }
`;

const EditAvatarButton = styled(Button)`
  position: absolute;
  top: 0;
  left: 100%;
  opacity: 0;
  pointer-events: none;
  transition: all ease 0.3s;

  .char-name-container:hover &,
  &:hover {
    opacity: 1;
    pointer-events: auto;
  }

  @media screen and (max-width: 660px) {
    opacity: 1;
    pointer-events: auto;
  }
`;

const CharacterPageContainer = styled.div`
  display: grid;
  width: 100%;
  align-content: start;
  grid-template-columns: 260px 1fr 1fr;
  grid-template-rows: repeat(auto-fit, max-content);
  grid-template-areas:
    'abilities HitPointsInitiativeArmor feats'
    'abilities savingThrows feats'
    'attack savingThrows feats'
    '. savingThrows feats'
    'weapons weapons feats'
    '. . feats';
  box-shadow: 0 0 3px rgba(128, 128, 128, 0.5);
  padding: 0 5px;
  gap: 10px;
  overflow-x: hidden;

  @media screen and (max-width: 1080px) {
    grid-template-columns: 260px 1fr;
    grid-template-areas:
      'abilities HitPointsInitiativeArmor'
      'attack savingThrows'
      'attack savingThrows'
      'attack .'
      'weapons weapons'
      'feats feats';
  }

  @media screen and (max-width: 690px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      'abilities abilities attack'
      'HitPointsInitiativeArmor HitPointsInitiativeArmor HitPointsInitiativeArmor'
      'savingThrows savingThrows savingThrows'
      'weapons weapons weapons'
      'feats feats feats';
  }

  @media screen and (max-width: 510px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'abilities'
      'HitPointsInitiativeArmor'
      'savingThrows'
      'attack'
      'weapons'
      'feats';
  }
`;

const BaseInfo = styled.div`
  display: grid;
  grid-template-columns: 20px 120px 140px 1fr 1fr;
  grid-template-areas: 'private race alignment classes languages';
  grid-area: baseInfo;
  width: 100%;
  gap: 5px;
  margin: 0;
  height: max-content;
  padding-bottom: 5px;

  @media screen and (max-width: 700px) {
    grid-template-columns: 20px 1fr 1fr;
    grid-template-areas:
      'private race alignment'
      '. classes languages';
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 20px 1fr 1fr;
    grid-template-areas:
      'private race alignment'
      'classes classes classes'
      'languages languages languages';
  }
`;

const CharClassesContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  grid-area: classes;
`;

const DEFAULT_IMAGE_LINK = 'https://i.postimg.cc/bNHNQwtg/0926d090-dd70-4242-926e-5cea3c486c48.png';

const LEVELS_EXP_MAP = {
  1: 0,
  2: 2000,
  3: 5000,
  4: 9000,
  5: 15000,
  6: 23000,
  7: 35000,
  8: 51000,
  9: 75000,
  10: 105000,
  11: 155000,
  12: 220000,
  13: 315000,
  14: 445000,
  15: 635000,
  16: 890000,
  17: 1300000,
  18: 1800000,
  19: 2550000,
  20: 3600000,
};

const CharacterPage = observer(
  ({ store, isModal, additionalCharId, additionalOwnerId, isDarkTheme }) => {
    const [addClassModalIsOpen, setAddClassModalIsOpen] = useState(false);
    const [editAvatarModalIsOpen, setEditAvatarModalIsOpen] = useState(false);

    const { user } = authStore;
    const {
      subscribeCharacter,
      openedCharacter,
      clearOpenedCharacter,
      makeFullRest,
      changeBaseInfo,
      calcEquippedBonuses,
      calcTotalSavingThrows,
      calcAbilitiesModifiers,
    } = store;
    const { subscribeKnownItems } = knownItemsStore;

    const { charId: characterId, userId: ownerId } = useParams();
    const charId = additionalCharId || characterId;
    const userId = additionalOwnerId || ownerId;
    const [form] = useForm();

    const cantEdit = useMemo(
      () => !(user?.dm || openedCharacter?.owner === user?.uid),
      [user, openedCharacter]
    );

    const handleMakeFullRest = async () => {
      await makeFullRest(userId || user?.uid, charId);
    };

    const handleChangeBaseInfo = async (dataName, newValue) => {
      await changeBaseInfo(
        userId || user?.uid,
        charId,
        dataName,
        newValue.target?.value || newValue
      );
    };

    const handlePrivate = async (event) => {
      await changeBaseInfo(userId || user?.uid, charId, 'private', event.target.checked);
    };

    const currentLvl = Object.values(openedCharacter?.classes || {}).reduce(
      (acc, curr) => acc + curr?.levels,
      0
    );

    useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, []);

    useEffect(() => {
      if (openedCharacter) {
        form.setFieldsValue({ ...initialUserData });
        form.setFieldsValue({ ...openedCharacter });
        calcEquippedBonuses();
        calcAbilitiesModifiers();
        calcTotalSavingThrows();
        // calcAttack();
      }
    }, [openedCharacter]);

    useEffect(() => {
      if (user) {
        const unsubscribe = subscribeCharacter(userId || user?.uid, charId);
        const unsubscribeKnownItems = subscribeKnownItems();
        return () => {
          unsubscribe();
          unsubscribeKnownItems();
          clearOpenedCharacter();
        };
      }
    }, [user]);

    useEffect(() => {
      if (openedCharacter && user) {
        if (openedCharacter.name) {
          document.title = openedCharacter.name;
        }

        return () => {
          document.title = 'Olegators is Pathfinder';
        };
      }
    }, [openedCharacter, user]);

    return (
      <>
        <AddClassModal
          addClassModalIsOpen={addClassModalIsOpen}
          setAddClassModalIsOpen={setAddClassModalIsOpen}
          charId={charId}
          userId={userId}
          store={store}
        />
        <EditAvatarModal
          charId={charId}
          userId={userId}
          modalIsOpen={editAvatarModalIsOpen}
          setModalIsOpen={setEditAvatarModalIsOpen}
          store={store}
        />
        <FormInstance form={form} layout='vertical'>
          <div className='char-name-container'>
            <div className='char-avatar-container'>
              <CroppedImage
                imageSrc={openedCharacter?.avatar?.imageLink || DEFAULT_IMAGE_LINK}
                croppedAreaPixels={openedCharacter?.avatar?.croppedAreaPixels || null}
                displayWidth={150}
                displayHeight={150}
                borderRadius='50%'
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <ProgressBar
                  current={openedCharacter?.hitPoints?.wounds || 0}
                  max={openedCharacter?.hitPoints?.total || 0}
                  isDarkTheme={isDarkTheme}
                  description='HP'
                />
                <ProgressBar
                  current={openedCharacter?.expPoints?.current || 0}
                  max={LEVELS_EXP_MAP[currentLvl + 1] || 0}
                  isDarkTheme={isDarkTheme}
                  description='XP'
                  BGColor='gray'
                />
              </div>
              {!cantEdit && (
                <EditAvatarButton htmlType='button' onClick={() => setEditAvatarModalIsOpen(true)}>
                  Edit avatar
                </EditAvatarButton>
              )}
            </div>

            <h3>{openedCharacter.name}</h3>
            <CampIcon size='26px' handleClick={handleMakeFullRest} />
          </div>

          <BaseInfo>
            <FormItem name='race' label='race' gridArea='race'>
              <Input
                onChange={(value) => handleChangeBaseInfo('race', value)}
                style={{ width: '100%' }}
                disabled={cantEdit}
              />
            </FormItem>
            <FormItem gridArea='alignment' label='alignment' name='alignment'>
              <Select
                onChange={(value) => handleChangeBaseInfo('alignment', value)}
                options={alignmentSelectOptions}
                style={{ width: '100%' }}
                disabled={cantEdit}
              />
            </FormItem>
            <CharClassesContainer>
              <span>
                {openedCharacter.classes &&
                  Object.entries(openedCharacter.classes).map(([className, { levels }]) => (
                    <span key={className}>{`${className} ${levels} / `}</span>
                  ))}
                {openedCharacter.classes && `[${currentLvl}]`}
              </span>
              <Button
                onClick={() => setAddClassModalIsOpen(true)}
                style={{ width: '25px', height: '25px', padding: 0 }}
                disabled={cantEdit}
              >
                +
              </Button>
            </CharClassesContainer>
            <FormItem gridarea='private' name='private' label='private' valuePropName='checked'>
              <Checkbox
                checked={openedCharacter.private}
                onChange={handlePrivate}
                disabled={cantEdit}
              />
            </FormItem>
            <FormItem gridArea='languages' label='languages' name='languages'>
              <Select
                mode='tags'
                onChange={(value) => handleChangeBaseInfo('languages', value)}
                style={{ width: '100%' }}
                disabled={cantEdit}
              />
            </FormItem>
          </BaseInfo>
          {!isModal && (
            <Teammates
              userId={userId}
              charId={charId}
              store={store}
              cantEdit={cantEdit}
              isDarkTheme={isDarkTheme}
            />
          )}
          <StyledTabs
            size='small'
            type='card'
            items={[
              {
                label: `Stats`,
                key: 1,
                children: (
                  <CharacterPageContainer>
                    <Abilities
                      gridArea='abilities'
                      charId={charId}
                      userId={userId}
                      canEdit={cantEdit}
                      store={store}
                    />
                    <HitPointsInitiativeArmor
                      store={store}
                      charId={charId}
                      userId={userId}
                      canEdit={cantEdit}
                    />
                    <SavingThrows
                      store={store}
                      charId={charId}
                      userId={userId}
                      canEdit={cantEdit}
                    />
                    <Attack store={store} charId={charId} userId={userId} canEdit={cantEdit} />
                    <Skills store={store} charId={charId} userId={userId} canEdit={cantEdit} />
                    <Weapons store={store} charId={charId} userId={userId} canEdit={cantEdit} />

                    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
                      <FormItem>
                        <Button type='default' htmlType='submit'>
                          Create
                        </Button>
                      </FormItem>
                    </div>
                  </CharacterPageContainer>
                ),
              },
              {
                label: `Feats`,
                key: 'Feats',
                children: (
                  <CharacterFeats
                    store={store}
                    charId={charId}
                    userId={userId}
                    canEdit={cantEdit}
                  />
                ),
              },
              {
                label: `Spells`,
                key: 'Spells',
                children: (
                  <CharacterSpells
                    store={store}
                    charId={charId}
                    userId={userId}
                    canEdit={cantEdit}
                  />
                ),
              },
              {
                label: `Inventory`,
                key: 'Inventory',
                children: (
                  <CharacterInventory
                    store={store}
                    charId={charId}
                    userId={userId}
                    canEdit={cantEdit}
                  />
                ),
              },
              {
                label: `Equipped gear`,
                key: 'equippedItems',
                children: (
                  <CharacterEquippedGear
                    store={store}
                    charId={charId}
                    userId={userId}
                    canEdit={cantEdit}
                  />
                ),
              },
              {
                label: `Changes history`,
                key: 'changes history',
                children: <ChangesHistory store={store} />,
              },
              {
                label: 'Background',
                key: 'Background',
                children: (
                  <CharacterBackground
                    store={store}
                    charId={charId}
                    userId={userId}
                    canEdit={cantEdit}
                  />
                ),
              },
            ]}
          />
        </FormInstance>
      </>
    );
  }
);

export default memo(CharacterPage);
