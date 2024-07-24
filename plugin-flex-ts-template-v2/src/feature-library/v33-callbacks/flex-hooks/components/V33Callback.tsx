import * as Flex from '@twilio/flex-ui';
import { FlexComponent } from '../../../../types/feature-loader';
import CallbackView from '../../custom-components/CallbackView';

export const componentName = FlexComponent.NoTasksCanvas;
export const componentHook = function addCallbackToAgentDesktop(flex: typeof Flex){
    flex.NoTasksCanvas.Content.add(<CallbackView key="Callback-view"/>,{
        sortOrder: 0,
        align: 'end',
    })
}