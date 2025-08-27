import { SideLink, Actions } from '@twilio/flex-ui';

const { REACT_APP_DOWNTIME_MANAGER_VIEW_NAME } = process.env;

export function DowntimeManagerLinkComponent(props) {
  const gotoDowntimeManager = () => {
    Actions.invokeAction('NavigateToView', { viewName: props.viewName });
  };

  

  return (
    <SideLink
      {...props}
      icon="Clock"
      iconActive="Clock"
      isActive={props.activeView === REACT_APP_DOWNTIME_MANAGER_VIEW_NAME}
      showLabel={props.showLabel}
      onClick={gotoDowntimeManager}
      key="downtime-manager-sidelink-item"
    >
      Downtime Manager
    </SideLink>
  );
}
