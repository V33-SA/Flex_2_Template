import React from 'react'
import { SideLink } from '@twilio/flex-ui';

const {REACT_APP_CALLBACK_MANAGER_VIEW_NAME}=process.env

export function CallbackLink(props)  {
    
    const gotoCallbackManager = () => {
        props.flex.Actions.invokeAction('NavigateToView', { viewName: REACT_APP_CALLBACK_MANAGER_VIEW_NAME});
      };
  return (
    <SideLink
      {...props}
      icon="Whatsapp"
      iconActive="Whatsapp"
      isActive={props.activeView === REACT_APP_CALLBACK_MANAGER_VIEW_NAME}
      showLabel={props.showLabel}
      onClick={gotoCallbackManager}
      key="callback-manager-sidelink-item"
    >
      Callback Manager
    </SideLink>
  )
}
