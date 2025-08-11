import { memo, useCallback, useEffect, useMemo } from 'react';
import { InputNumber } from 'antd';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import CharSheetRowLabel from '../CharlSheetRowLabel/CharSheetRowLabel';
import authStore from '../../store/authStore';
import FormItem from '../FormItem';

const CharacterSpeedContainer = styled.div`
  display: grid;
  grid-template-columns: 82px 44px 44px 44px 44px 44px 44px;
  justify-items: center;
  align-items: center;
`;

const CharacterSpeed = observer(({ store, charId, userId, canEdit }) => {
  const { changeSpeed, totalSpeed } = store;
  const { user } = authStore;

  return (
    <CharacterSpeedContainer>
      <CharSheetRowLabel label='SPEED' />
      <FormItem label='total' textAlign='center' noBgLabel>
        <InputNumber value={totalSpeed} controls={false} style={{ width: '100%' }} disabled />
      </FormItem>

      <FormItem name={['speed', 'base']} label='base' textAlign='center' noBgLabel>
        <InputNumber
          controls={false}
          style={{ width: '100%' }}
          onChange={(value) => changeSpeed(userId || user.uid, charId, 'base', value)}
          disabled={canEdit}
        />
      </FormItem>

      <FormItem name={['speed', 'misc']} label='misc' textAlign='center' noBgLabel>
        <InputNumber
          controls={false}
          style={{ width: '100%' }}
          onChange={(value) => changeSpeed(userId || user.uid, charId, 'misc', value)}
          disabled={canEdit}
        />
      </FormItem>
    </CharacterSpeedContainer>
  );
});

export default memo(CharacterSpeed);
