import { observer } from 'mobx-react';
import { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import authStore from '../../store/authStore';
import charactersStore from '../../store/charactersStore';
import { toJS } from 'mobx';
import styled from 'styled-components';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { alignmentSelectOptions } from '../../utils/consts';
import FormItem from '../FormItem';
import Abilities from '../Abilities';
import { useForm } from 'antd/es/form/Form';

const CharacterPageContainer = styled(Form)`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: max-content;
  grid-template-areas:
    'title title title title title title'
    'abilities abilities abilities baseInfo baseInfo baseInfo';
  box-shadow: 0 0 3px rgba(128, 128, 128, 0.5);
  padding: 0 5px;
  gap: 5px;

  & h3 {
    grid-area: title;
    margin: 0;
  }

  @media screen and (max-width: 550px) {
    align-content: start;
    grid-template-areas:
      'title title title title title title'
      'baseInfo baseInfo baseInfo baseInfo baseInfo baseInfo'
      'abilities abilities abilities abilities abilities abilities';
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
  justify-content: end;
  padding-top: 15px;
`;

const CharacterPage = observer(() => {
  const { user } = authStore;
  const { subscribeCharacter, openedCharacter, clearOpenedCharacter } = charactersStore;

  const { charId } = useParams();
  const [form] = useForm();

  useEffect(() => {
    console.log('Данные обновлены:', toJS(openedCharacter));
    if (openedCharacter) {
      form.setFieldsValue({ ...openedCharacter });
    }
  }, [openedCharacter]);

  useEffect(() => {
    const unsubscribe = subscribeCharacter(user.uid, charId);

    return () => {
      unsubscribe();
      clearOpenedCharacter();
    };
  }, []);

  return (
    <CharacterPageContainer form={form} onFinish={(values) => console.log(values)}>
      <h3>{openedCharacter.name}</h3>
      <Abilities gridArea='abilities' />
      <BaseInfo>
        <FormItem name='race' label='race' gridArea='race'>
          <Input size='small' style={{ width: '100%' }} />
        </FormItem>
        <FormItem gridArea='level' label='lvl' name='level'>
          <InputNumber size='small' controls={false} style={{ width: '100%' }} />
        </FormItem>
        <FormItem gridArea='alignment' label='alignment' name='alignment'>
          <Select options={alignmentSelectOptions} size='small' style={{ width: '100%' }} />
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
