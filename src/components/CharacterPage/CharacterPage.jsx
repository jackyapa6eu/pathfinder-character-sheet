import { observer } from 'mobx-react';
import { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import authStore from '../../store/authStore';
import charactersStore, { initialUserData } from '../../store/charactersStore';
import { toJS } from 'mobx';
import styled from 'styled-components';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { alignmentSelectOptions } from '../../utils/consts';
import FormItem from '../FormItem';
import Abilities from '../Abilities';
import { useForm } from 'antd/es/form/Form';
import HitPointsInitiativeArmor from '../HitPointsInitiativeArmor';
import SavingThrows from '../SavingThrows';

const CharacterPageContainer = styled(Form)`
  display: grid;
  width: 100%;
  align-content: start;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: repeat(auto-fit, max-content);
  grid-template-areas:
    'title baseInfo baseInfo baseInfo baseInfo baseInfo'
    'abilities HitPointsInitiativeArmor HitPointsInitiativeArmor HitPointsInitiativeArmor . .'
    'abilities savingThrows savingThrows . . .';
  box-shadow: 0 0 3px rgba(128, 128, 128, 0.5);
  padding: 0 5px;
  gap: 10px;

  & h3 {
    grid-area: title;
    margin: 0;
  }

  @media screen and (max-width: 605px) {
    align-content: start;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      'title baseInfo baseInfo'
      'abilities abilities abilities '
      'HitPointsInitiativeArmor HitPointsInitiativeArmor HitPointsInitiativeArmor'
      'savingThrows savingThrows savingThrows';
  }

  @media screen and (max-width: 510px) {
    align-content: start;
    grid-template-columns: 1fr;
    grid-template-areas:
      'title'
      'baseInfo'
      'abilities'
      'HitPointsInitiativeArmor'
      'savingThrows';
  }
`;

const BaseInfo = styled.div`
  display: grid;
  grid-template-columns: 120px 40px 140px;
  grid-template-areas: 'race level alignment';
  grid-area: baseInfo;
  width: 100%;
  gap: 5px;
  margin: 0;
  height: max-content;
`;

const CharacterPage = observer(() => {
  const { user } = authStore;
  const { subscribeCharacter, openedCharacter, clearOpenedCharacter } = charactersStore;

  const { charId, userId } = useParams();
  const [form] = useForm();

  useEffect(() => {
    console.log('Данные обновлены:', toJS(openedCharacter));
    if (openedCharacter) {
      form.setFieldsValue({ ...initialUserData });
      form.setFieldsValue({ ...openedCharacter });
    }
  }, [openedCharacter]);

  useEffect(() => {
    const unsubscribe = subscribeCharacter(userId || user.uid, charId);

    return () => {
      unsubscribe();
      clearOpenedCharacter();
    };
  }, []);

  useEffect(() => {
    if (openedCharacter.name) {
      document.title = openedCharacter.name;
    }

    return () => {
      document.title = 'Olegators is Pathfinder';
    };
  }, [openedCharacter]);

  return (
    <CharacterPageContainer form={form} onFinish={(values) => console.log(values)}>
      <h3>{openedCharacter.name}</h3>
      <Abilities gridArea='abilities' charId={charId} userId={userId} />
      <HitPointsInitiativeArmor charId={charId} userId={userId} />
      <SavingThrows charId={charId} userId={userId} />
      <BaseInfo>
        <FormItem name='race' label='race' gridArea='race'>
          <Input style={{ width: '100%' }} />
        </FormItem>
        <FormItem gridArea='level' label='lvl' name='level'>
          <InputNumber controls={false} style={{ width: '100%' }} />
        </FormItem>
        <FormItem gridArea='alignment' label='alignment' name='alignment'>
          <Select options={alignmentSelectOptions} style={{ width: '100%' }} />
        </FormItem>
      </BaseInfo>

      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <FormItem>
          <Button type='default' htmlType='submit'>
            Create
          </Button>
        </FormItem>
      </div>
    </CharacterPageContainer>
  );
});

export default memo(CharacterPage);
