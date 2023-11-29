import { memo, useEffect, useState } from 'react';
import { capitalizedFirstLetter } from '../../../utils/helpers';
import styled from 'styled-components';
import FormItem from '../../FormItem';
import { Checkbox, InputNumber, Tooltip } from 'antd';
import charactersStore from '../../../store/charactersStore';
import authStore from '../../../store/authStore';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

const FeatContainer = styled.div`
  display: grid;
  width: fit-content;
  grid-template-columns: 16px 130px 44px 44px 44px 44px;
  justify-items: center;
  align-items: center;
  box-shadow: 0 0 3px #dcdcdc;
  padding: 3px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: white;
  }
`;

const FeatLabel = styled.span`
  font-weight: 500;
  width: 100%;
`;

const Skill = observer(({ name, title, ability, charId, userId, showLabels, trainedOnly }) => {
  const { openedCharacter, changeSkills } = charactersStore;
  const { user } = authStore;
  const [total, setTotal] = useState(null);

  useEffect(() => {
    if (!openedCharacter.abilities?.[ability]) {
      setTotal(null);
    } else {
      const tempAbilityMod = openedCharacter.abilities?.[ability]?.tempModifier;
      const abilityMod = openedCharacter.abilities?.[ability]?.modifier;
      const ranks = openedCharacter.skills?.[name]?.ranks;
      const miscMod = openedCharacter.skills?.[name]?.miscMod;
      const featTotal =
        (tempAbilityMod ?? abilityMod) +
        (ranks || 0) +
        (miscMod || 0) +
        (openedCharacter.skills?.[name]?.classSkill && ranks > 0 ? 3 : 0);
      setTotal(trainedOnly && ranks === undefined ? null : featTotal);
    }
  }, [openedCharacter]);
  return (
    <FeatContainer>
      <FormItem label={showLabels && 'class skill'} textAlign='center' noBgLabel>
        <Checkbox
          onChange={(value) =>
            changeSkills(userId || user.uid, charId, name, 'classSkill', value.target.checked)
          }
          checked={openedCharacter.skills?.[name]?.classSkill}
        />
      </FormItem>

      <Tooltip title={ability.toUpperCase()}>
        <FeatLabel>
          {capitalizedFirstLetter(title ?? name)}
          {trainedOnly && '*'}
        </FeatLabel>
      </Tooltip>
      <FormItem label={showLabels && 'total'} textAlign='center' noBgLabel>
        <InputNumber controls={false} style={{ width: '100%' }} disabled value={total} />
      </FormItem>

      <FormItem
        name={
          openedCharacter.abilities?.[ability]?.tempModifier !== undefined
            ? ['abilities', ability, 'tempModifier']
            : ['abilities', ability, 'modifier']
        }
        label={showLabels && 'ability modifier'}
        textAlign='center'
        noBgLabel
      >
        <InputNumber controls={false} style={{ width: '100%', color: 'black' }} disabled />
      </FormItem>

      <FormItem
        name={['skills', name, 'ranks']}
        label={showLabels && 'ranks'}
        textAlign='center'
        noBgLabel
      >
        <InputNumber
          controls={false}
          style={{ width: '100%' }}
          onChange={(value) => changeSkills(userId || user.uid, charId, name, 'ranks', value)}
        />
      </FormItem>

      <FormItem
        name={['skills', name, 'miscMod']}
        label={showLabels && 'misc modifier'}
        textAlign='center'
        noBgLabel
      >
        <InputNumber
          controls={false}
          style={{ width: '100%' }}
          onChange={(value) => changeSkills(userId || user.uid, charId, name, 'miscMod', value)}
        />
      </FormItem>
    </FeatContainer>
  );
});

export default memo(Skill);
