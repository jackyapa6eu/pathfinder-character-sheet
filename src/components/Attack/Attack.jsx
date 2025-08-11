import { observer } from 'mobx-react';
import { memo } from 'react';
import styled from 'styled-components';
import CharSheetRowLabel from '../CharlSheetRowLabel/CharSheetRowLabel';
import FormItem from '../FormItem';
import { InputNumber } from 'antd';
import authStore from '../../store/authStore';

const AttackContainer = styled.div`
  grid-area: attack;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  height: max-content;
  gap: 5px;
`;

const BaseAttackBonus = styled.div`
  display: grid;
  grid-template-columns: 170px 44px;
  justify-items: center;
  align-items: center;
`;

const AttacksPerRound = styled.div`
  display: grid;
  grid-template-columns: 170px 44px;
  justify-items: center;
  align-items: center;
`;

const Cmb = styled.div`
  display: grid;
  grid-template-columns: 38px 44px 44px;
  justify-items: center;
  align-items: center;
`;

const Cmd = styled.div`
  display: grid;
  grid-template-columns: 38px 44px 44px;
  justify-items: center;
  align-items: center;
`;

const Attack = observer(({ store, charId, userId, canEdit }) => {
  const { changeAttack, changeAttackPerRound, changeAttackMisc, attack } = store;
  const { user } = authStore;

  return (
    <AttackContainer>
      <BaseAttackBonus>
        <CharSheetRowLabel label='base attack bonus' />
        <FormItem textAlign='center' noBgLabel name={['attack', 'bab']}>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAttack(userId || user.uid, charId, value)}
            disabled={canEdit}
          />
        </FormItem>
      </BaseAttackBonus>
      <AttacksPerRound>
        <CharSheetRowLabel label='attack per round' />
        <FormItem textAlign='center' noBgLabel name={['attack', 'perRound']}>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAttackPerRound(userId || user.uid, charId, value)}
            disabled={canEdit}
          />
        </FormItem>
      </AttacksPerRound>
      <Cmb>
        <CharSheetRowLabel label='cmb' />
        <FormItem textAlign='center' noBgLabel>
          <InputNumber
            value={attack?.cmb}
            controls={false}
            style={{ width: '100%', color: 'black' }}
            disabled
          />
        </FormItem>
        <FormItem textAlign='center' label='misc' noBgLabel name={['attack', 'cmbMisc']}>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAttackMisc(userId || user.uid, charId, 'cmbMisc', value)}
          />
        </FormItem>
      </Cmb>
      <Cmd>
        <CharSheetRowLabel label='cmd' />
        <FormItem textAlign='center' noBgLabel>
          <InputNumber
            value={attack?.cmd}
            controls={false}
            style={{ width: '100%', color: 'black' }}
            disabled
          />
        </FormItem>
        <FormItem textAlign='center' label='misc' noBgLabel name={['attack', 'cmdMisc']}>
          <InputNumber
            controls={false}
            style={{ width: '100%', color: 'black' }}
            onChange={(value) => changeAttackMisc(userId || user.uid, charId, 'cmdMisc', value)}
          />
        </FormItem>
      </Cmd>
    </AttackContainer>
  );
});

export default memo(Attack);
