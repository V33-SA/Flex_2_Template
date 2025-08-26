/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
import * as Flex from '@twilio/flex-ui';
import { AvailableWorkers } from '../../custom-components/';

import { FlexComponent } from '../../../../types/feature-loader';


export const componentName = FlexComponent.MainHeader;
export const componentHook = function addWorkersAvailablesToMainHeader(flex: typeof Flex) { 
  flex.MainHeader.Content.add(<AvailableWorkers key="AvailableWorkers"/>, {
    sortOrder: -1,
    align: 'end',
  });
};
