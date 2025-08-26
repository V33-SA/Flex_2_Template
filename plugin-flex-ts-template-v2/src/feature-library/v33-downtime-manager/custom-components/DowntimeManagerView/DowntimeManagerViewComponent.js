import { Theme } from '@twilio-paste/core/theme';
import { Flex } from '@twilio-paste/core/flex';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@twilio-paste/core/tabs';
import { Heading } from '@twilio-paste/core/heading';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { Alert } from '@twilio-paste/core/alert';
import { Spinner } from '@twilio-paste/core/spinner';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { Text } from '@twilio-paste/core/text';
import { Stack } from '@twilio-paste/core/stack';

import { GeneralConfig } from '../GeneralConfig';
import { WeeklyConfig } from '../WeeklyConfig';
import { EmergencyConfig } from '../EmergencyConfig';
import { HolidayConfig } from '../HolidayConfig';
import { PartialDayConfig } from '../PartialDayConfig';
import { readDocumentData } from '../../flex-hooks/services';
import {
  createDowntimeConfigMutex,
  releaseDowntimeConfigMutex,
  updateDowntimeConfig,
  hasCreatedDowntimeConfigMutex,
} from '../../flex-hooks/helpers';

import './index.css';
// eslint-disable-next-line import/order
import { useState, useEffect } from 'react';

export function DowntimeManagerViewComponent(props) {
  const {
    REACT_APP_TEAM_SCHEDULE_SYNC_UNIQUE_NAME: syncDocUniqueName,
    REACT_APP_TEAM_SCHEDULE_MUTEX_SYNC_UNIQUE_NAME: mutexUniqueName,
  } = process.env;

  const [isReadOnly, setIsReadOnly] = useState(true);

  const [teamScheduleConfig, setTeamScheduleConfig] = useState({});
  const [unpublishedContent, setUnpublishedContent] = useState({});

  const [showInProgress, setShowInProgress] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);

  const loadExisitingData = async () => {
    setShowInProgress(true);
    const exisitingData = await readDocumentData(syncDocUniqueName);
    setTeamScheduleConfig(exisitingData || {});
    const hasCreatedMutex = await hasCreatedDowntimeConfigMutex();
    console.log('HAS CREATED MUTEX:');
    console.log(hasCreatedMutex);
    if("200"===hasCreatedMutex.statusCode && true == hasCreatedMutex.hasExistingMutex){
      setIsReadOnly(false);
    }
    setIsReadOnly(true);
    setShowInProgress(false);
  };

  useEffect(() => {
    loadExisitingData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  useEffect(() => {}, [teamScheduleConfig]);

  const handleAddToUnpublishedChanges = (groupName) => {
    return (v) => {
      setUnpublishedContent((d) => {
        return { ...d, [groupName]: v };
      });
    };
  };

  const clearAlerts = ()=>{
     setShowSuccessMessage(false);
     setShowErrorMessage(false);
     setDisplayMessage("");
  }

  const handleBeginEdit = async()=>{
    setShowInProgress(true);
    let lockStatus = await createDowntimeConfigMutex();
    console.log("LOCK STATUS: ",lockStatus.statusCode);
    if('200'===lockStatus.statusCode){
      await loadExisitingData();
      setIsReadOnly(false);
    }
    else{
      setShowErrorMessage(true);
      setDisplayMessage("Désolé, quelqu'un d'autre met à jour la configuration en ce moment");
    }
    setShowInProgress(false);

  
    
  }

  const handlePublishChanges = async()=>{
    setShowInProgress(true);
    const mergedData = {
      ...teamScheduleConfig,
      ...unpublishedContent,
    };
    const updateResponse = await updateDowntimeConfig(mergedData);
    if("200"===updateResponse.statusCode){
       setShowSuccessMessage(true);
       setDisplayMessage("La configuration a été mise à jour avec succès !");
      setUnpublishedContent({});
    }
    else{
      setShowErrorMessage(true);
      setDisplayMessage("Désolé, il y a eu un problème lors de la mise à jour de la configuration");
    }
   
    await loadExisitingData();
    setShowInProgress(false);
    setIsReadOnly(true);
  }

  const handleCancelChanges = async()=>{
    setShowInProgress(true);
    await releaseDowntimeConfigMutex();
    await loadExisitingData();
    setUnpublishedContent({});
    setIsReadOnly(true);
    setShowInProgress(false);
  }


  return (
    <Theme.Provider theme="flex">
      
      {showSuccessMessage &&
        <Alert onDismiss={clearAlerts} variant="neutral">
        <Text as="span">
          {displayMessage}
        </Text>
      </Alert>
      }
      {
        showErrorMessage &&
        <Alert onDismiss={clearAlerts} variant="error">
        <Text as="span">
        {displayMessage}
        </Text>
      </Alert>
      }
     
         
      


      <Box as="article" backgroundColor="colorBackgroundBody" padding="space60">
        <Flex hAlignContent="between">
          <Heading as="h1" variant="heading10">
            Gestion des horaires d'ouverture
          </Heading>

          {isReadOnly && (
            <Button variant="primary" onClick={handleBeginEdit}>
              Editer la Configuration
            </Button>
          )}
          {!isReadOnly && (
            <Stack orientation="horizontal" spacing="space40">
              <Button variant="primary" onClick={handlePublishChanges}>
                Publier les changements
              </Button>
              <Button variant="secondary" onClick={handleCancelChanges}>
                Annuler les changements
              </Button>
            </Stack>
          )}
        </Flex>

        <Tabs ß>
          <TabList aria-label="My tabs">
            <Tab>Horaires d'ouverture</Tab>
            <Tab>Fermeture d'urgence</Tab>

            <Tab>Congés</Tab>
            <Tab>Fermetures partielles</Tab>
            <Tab>Paramétrages généraux</Tab>
          </TabList>
          <TabPanels paddingTop="space20">
            <TabPanel>
              <WeeklyConfig
                value={teamScheduleConfig.regularHours}
                addToStagedChanges={handleAddToUnpublishedChanges('regularHours')}
                isReadOnly={isReadOnly}
              />
            </TabPanel>
            <TabPanel>
              <EmergencyConfig
                value={teamScheduleConfig.emergencySettings}
                addToStagedChanges={handleAddToUnpublishedChanges('emergencySettings')}
                isReadOnly={isReadOnly}
              />
            </TabPanel>
            <TabPanel>
              <HolidayConfig
                value={teamScheduleConfig.holidays}
                addToStagedChanges={handleAddToUnpublishedChanges('holidays')}
                isReadOnly={isReadOnly}
              />
            </TabPanel>
            <TabPanel>
              <PartialDayConfig
                value={teamScheduleConfig.partialDays}
                addToStagedChanges={handleAddToUnpublishedChanges('partialDays')}
                isReadOnly={isReadOnly}
              />
            </TabPanel>
            <TabPanel>
              <GeneralConfig
                value={teamScheduleConfig.generalSettings}
                addToStagedChanges={handleAddToUnpublishedChanges('generalSettings')}
                isReadOnly={isReadOnly}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
     
      <Modal isOpen={showInProgress} onDismiss={()=>{}} size="default" ariaLabelledby="loader-modal" >
       
       <ModalBody>
        
         <Flex hAlignContent="center" vAlignContent="center" minHeight={170}>
       <Spinner decorative={false}   size="sizeIcon110" title="Loading" />
       </Flex>
       </ModalBody>
       </Modal>
     
    </Theme.Provider>
  );
}
