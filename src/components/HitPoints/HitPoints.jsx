import { memo } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const HitPointsContainer = styled.div`
  grid-area: hitPoints;
  display: flex;
  padding-top: 15px;
  flex-direction: column;
  width: 100%;
  margin: 0;
  height: max-content;
  gap: 3px;
  outline: 1px solid red;
`;

const HitPoints = observer(() => {
  return <HitPointsContainer>HitPoints</HitPointsContainer>;
});

export default memo(HitPoints);
