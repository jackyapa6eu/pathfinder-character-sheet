import { memo } from 'react';
import styled from 'styled-components';
import FormItem from '../FormItem';
import { InputNumber } from 'antd';
import CharSheetRowLabel from '../CharlSheetRowLabel/CharSheetRowLabel';
import { observer } from 'mobx-react';
import charactersStore from '../../store/charactersStore';
import SavingThrow from './SavingThrow';

const ThrowsContainer = styled.div`
  grid-area: savingThrows;
  display: flex;
  padding-top: 15px;
  flex-direction: column;
  width: 100%;
  margin: 0;
  height: max-content;
  gap: 5px;
`;

const SavingThrows = ({ charId, userId }) => {
  return (
    <ThrowsContainer>
      <SavingThrow name='fortitude' abilityName='con' charId={charId} userId={userId} showLabels />
      <SavingThrow name='reflex' abilityName='dex' charId={charId} userId={userId} />
      <SavingThrow name='will' abilityName='wis' charId={charId} userId={userId} />
    </ThrowsContainer>
  );
};

export default memo(SavingThrows);
