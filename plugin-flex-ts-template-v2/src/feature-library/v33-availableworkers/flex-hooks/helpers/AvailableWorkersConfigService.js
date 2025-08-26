import { Manager } from '@twilio/flex-ui';

import { request } from './request';

export const getAvailableWorkers = async () => {
  const manager = Manager.getInstance();

  return request('check-for-available-workers', manager, {});
};
