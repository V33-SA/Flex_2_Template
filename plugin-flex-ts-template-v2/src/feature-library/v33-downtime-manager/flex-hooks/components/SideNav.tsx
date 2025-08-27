import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import { hasAdminRights } from '../helpers/authorizationService';
import ScheduleSideLink from '../../custom-components/DowntimeManagerLink/';

export const componentName = FlexComponent.SideNav;
export const componentHook = function addScheduleManagerToSideNav(flex: typeof Flex, manager: Flex.Manager) {
  if (!hasAdminRights) {
    return;
  }

  // Add side nav button for the view
  flex.SideNav.Content.add(<ScheduleSideLink viewName="schedule-downtime-manager" key="schedule-manager-side-nav" />);
};
