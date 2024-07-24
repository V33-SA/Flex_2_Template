import React from 'react';
import * as Flex from '@twilio/flex-ui';
import Button from '@material-ui/core/Button';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import './callbackstyle.css';





export default class CallbackComponent extends React.Component {
 
 

  startCall = async () => {
   
    const {task,to,from,callline, acceptCallback}=this.props;
    acceptCallback(task)
   
    
    const attr = {
      type: 'callback',
      name: `Contact: ${to}`,
      phone: from,
      type_task:'voice',
      conversation:{conversation_id: task},
      call_line:callline
    };
    await Flex.Actions.invokeAction('StartOutboundCall', {
      destination: to,
      callerId: from,
      taskAttributes: attr,
    });
  };


  render() {
       
    

    return (
  
        <Button 
          variant="contained" 
          color="primary" 
          size="medium"
          onClick={async () => this.startCall()}
          disabled={!this.props.availableWorker}
        >
          <KeyboardVoiceIcon/>
          <p className='buttonText'>Rappeler maintenant</p>
        </Button>
  
    );
  }
}
