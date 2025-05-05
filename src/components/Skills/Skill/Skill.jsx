import { memo, useCallback, useEffect, useState } from 'react';
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
  grid-template-columns: 16px 130px 44px 44px 44px 44px 44px;
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

  @media screen and (max-width: 400px) {
    & {
      grid-template-columns: 16px 105px 44px 44px 44px 44px 44px;
      font-size: 13px;
    }
  }
`;

const FeatLabel = styled.span`
  font-weight: 500;
  width: 100%;
`;

const Skill = observer(
  ({ name, title, ability, charId, userId, showLabels, trainedOnly, canEdit }) => {
    const { openedCharacter, changeSkills, handleCopyToClickBoard, loadCheckPenalty } =
      charactersStore;
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
          (openedCharacter.skills?.[name]?.bonusClassSkill && ranks > 0 ? 3 : 0) +
          (['str', 'dex'].includes(ability)
            ? -Math.max(openedCharacter.equipBonuses?.checkPenalty || 0, loadCheckPenalty)
            : 0) +
          -(openedCharacter.equipBonuses?.shieldCheckPenalty || 0);
        setTotal(trainedOnly && ranks === undefined ? null : featTotal);
      }
    }, [openedCharacter, openedCharacter.equipBonuses, loadCheckPenalty]);

    const copyToClickBoard = useCallback(
      (event) => {
        event.stopPropagation();
        handleCopyToClickBoard(`1d20${total > 0 ? '+' : ''}${total}`);
      },
      [total]
    );

    return (
      <FeatContainer>
        <FormItem label={showLabels && 'class skill'} textAlign='center' noBgLabel>
          <Checkbox
            onChange={(value) =>
              changeSkills(userId || user.uid, charId, name, 'classSkill', value.target.checked)
            }
            checked={openedCharacter.skills?.[name]?.classSkill}
            disabled={canEdit}
          />
        </FormItem>

        <Tooltip title={ability.toUpperCase()}>
          <FeatLabel onClick={copyToClickBoard}>
            {capitalizedFirstLetter(title ?? name)}
            {trainedOnly && '*'}
          </FeatLabel>
        </Tooltip>
        <FormItem label={showLabels && 'total'} textAlign='center' noBgLabel>
          <InputNumber controls={false} style={{ width: '100%' }} disabled value={total} />
        </FormItem>

        <FormItem label={showLabels && 'ability modifier'} textAlign='center' noBgLabel>
          <InputNumber
            value={
              openedCharacter.abilities?.[ability]?.tempModifier !== null
                ? openedCharacter.abilities?.[ability]?.tempModifier
                : openedCharacter.abilities?.[ability]?.modifier
            }
            controls={false}
            style={{ width: '100%', color: 'black' }}
            disabled
          />
        </FormItem>

        <FormItem label={showLabels && 'check penalty'} textAlign='center' noBgLabel>
          <InputNumber
            controls={false}
            value={
              ['str', 'dex'].includes(ability)
                ? -Math.max(openedCharacter.equipBonuses?.checkPenalty || 0, loadCheckPenalty) -
                    openedCharacter.equipBonuses?.shieldCheckPenalty || 0
                : null
            }
            style={{ width: '100%' }}
            disabled
          />
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
            disabled={canEdit}
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
            disabled={canEdit}
          />
        </FormItem>
      </FeatContainer>
    );
  }
);

export default memo(Skill);
