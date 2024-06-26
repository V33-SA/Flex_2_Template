import * as Flex from '@twilio/flex-ui';

import { NotificationIds } from '../notifications/MultiCall';
import { FlexEvent } from '../../../../types/feature-loader';
import logger from '../../../../utils/logger';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = () => {
  // Test to make sure the sdkOptions property has been
  // configured correctly. If it has not, throw errors and notifications.
  const { allowIncomingWhileBusy } = Flex.Manager.getInstance().configuration.sdkOptions?.voice ?? {};

  if (allowIncomingWhileBusy) {
    Flex.Notifications.showNotification(NotificationIds.MultiCallBroken);
    logger.error(
      '[multi-call] ERROR: allowIncomingWhileBusy is enabled, so the multi-call feature will not work properly.',
    );
  }
};
