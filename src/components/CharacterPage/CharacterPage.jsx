import { observer } from 'mobx-react';
import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import authStore from '../../store/authStore';
import charactersStore, { initialUserData } from '../../store/charactersStore';
import { toJS } from 'mobx';
import styled from 'styled-components';
import { Button, Form, Input, InputNumber, Modal, Select, Tabs } from 'antd';
import { alignmentSelectOptions } from '../../utils/consts';
import FormItem from '../FormItem';
import Abilities from '../Abilities';
import { useForm } from 'antd/es/form/Form';
import HitPointsInitiativeArmor from '../HitPointsInitiativeArmor';
import SavingThrows from '../SavingThrows';
import Attack from '../Attack';
import Skills from '../Skills';
import CharacterFeats from '../CharacterFeats';
import TextArea from 'antd/es/input/TextArea';
import AddClassModal from '../AddClassModal';
import CharacterSpells from '../CharacterSpells';
import CampIcon from '../../icons/CampIcon';
import Weapons from '../Weapons';
import CharacterInventory from '../CharacterInventory';
import knownItemsStore from '../../store/knownItemsStore';
import CharacterEquippedGear from '../CharacterEquippedGear';

const StyledTabs = styled(Tabs)`
  width: 100%;
  color: black;!important;

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
`;

const FormInstance = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;

  & .char-name-container {
    grid-area: title;
    display: flex;
    gap: 5px;
  }

  & h3 {
    margin: 0;
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

  @media screen and (max-width: 950px) {
    grid-template-columns: 260px 1fr;
    grid-template-areas:
      'abilities HitPointsInitiativeArmor'
      'abilities savingThrows'
      'attack savingThrows'
      'attack .'
      'weapons weapons'
      '.  feats';
  }

  @media screen and (max-width: 605px) {
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
  grid-template-columns: 120px 140px 1fr;
  grid-template-areas: 'race alignment classes';
  grid-area: baseInfo;
  width: 100%;
  gap: 5px;
  margin: 0;
  height: max-content;

  @media screen and (max-width: 400px) {
    grid-template-columns: 120px 140px;
    grid-template-areas:
      'race alignment'
      'classes classes';
  }
  padding-bottom: 5px;
`;

const CharClassesContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  grid-area: classes;
`;

const CharacterPage = observer(() => {
  const [addClassModalIsOpen, setAddClassModalIsOpen] = useState(false);

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
    calcAttack,
  } = charactersStore;
  const { subscribeKnownItems } = knownItemsStore;

  const { charId, userId } = useParams();
  const [form] = useForm();

  useEffect(() => {
    if (openedCharacter) {
      form.setFieldsValue({ ...initialUserData });
      form.setFieldsValue({ ...openedCharacter });
      calcEquippedBonuses();
      calcAbilitiesModifiers();
      calcTotalSavingThrows();
      calcAttack();
    }
  }, [openedCharacter]);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeCharacter(userId || user?.uid, charId);
      const unsubscribeKnownItems = subscribeKnownItems();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
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

  const handleMakeFullRest = async () => {
    await makeFullRest(userId || user?.uid, charId);
  };

  const handleChangeBaseInfo = async (dataName, newValue) => {
    await changeBaseInfo(userId || user?.uid, charId, dataName, newValue.target?.value || newValue);
  };

  return (
    <>
      <AddClassModal
        addClassModalIsOpen={addClassModalIsOpen}
        setAddClassModalIsOpen={setAddClassModalIsOpen}
        charId={charId}
        userId={userId}
      />
      <FormInstance form={form} layout='vertical'>
        <div className='char-name-container'>
          <h3>{openedCharacter.name}</h3>
          <CampIcon size='20px' handleClick={handleMakeFullRest} />
        </div>

        <BaseInfo>
          <FormItem name='race' label='race' gridArea='race'>
            <Input
              onChange={(value) => handleChangeBaseInfo('race', value)}
              style={{ width: '100%' }}
            />
          </FormItem>
          <FormItem gridArea='alignment' label='alignment' name='alignment'>
            <Select
              onChange={(value) => handleChangeBaseInfo('alignment', value)}
              options={alignmentSelectOptions}
              style={{ width: '100%' }}
            />
          </FormItem>
          <CharClassesContainer>
            <span>
              {openedCharacter.classes &&
                Object.entries(openedCharacter.classes).map(([className, { levels }]) => (
                  <span key={className}>{`${className} ${levels} / `}</span>
                ))}
              {openedCharacter.classes &&
                `[${Object.values(openedCharacter.classes).reduce(
                  (acc, curr) => acc + curr.levels,
                  0
                )}]`}
            </span>
            <Button
              onClick={() => setAddClassModalIsOpen(true)}
              style={{ width: '25px', height: '25px', padding: 0 }}
            >
              +
            </Button>
          </CharClassesContainer>
        </BaseInfo>
        <StyledTabs
          size='small'
          type='card'
          items={[
            {
              label: `Stats`,
              key: 1,
              children: (
                <CharacterPageContainer>
                  <Abilities gridArea='abilities' charId={charId} userId={userId} />
                  <HitPointsInitiativeArmor charId={charId} userId={userId} />
                  <SavingThrows charId={charId} userId={userId} />
                  <Attack charId={charId} userId={userId} />
                  <Skills charId={charId} userId={userId} />
                  <Weapons charId={charId} userId={userId} />

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
              children: <CharacterFeats charId={charId} userId={userId} />,
            },
            {
              label: `Spells`,
              key: 'Spells',
              children: <CharacterSpells charId={charId} userId={userId} />,
            },
            {
              label: `Inventory`,
              key: 'Inventory',
              children: <CharacterInventory charId={charId} userId={userId} />,
            },
            {
              label: `Equipped gear`,
              key: 'equippedItems',
              children: <CharacterEquippedGear charId={charId} userId={userId} />,
            },
          ]}
        />
      </FormInstance>
    </>
  );
});

export default memo(CharacterPage);
