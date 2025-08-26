import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { hasAdminRights } from '../helpers/authorizationService';
import ScheduleView from '../../custom-components/DowntimeManagerView';

export const componentName = FlexComponent.ViewCollection;
export const componentHook = function addScheduleManagerView(flex: typeof Flex, manager: Flex.Manager) {
  if (!hasAdminRights) {
    return;
  }

  // Add view
  flex.ViewCollection.Content.add(
    <flex.View name="schedule-downtime-manager" key="schedule-manager-view">
      <ScheduleView key="schedule-manager-view-content" />
    </flex.View>,
  );
};
