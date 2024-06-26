import { isColdTransferEnabled, isMultiParticipantEnabled } from '../../config';
import { registerCustomChatTransferAction } from '../../custom-action/chatTransferTask';
import { registerLeaveChatAction } from '../../custom-action/leaveChat';
import { registerRemoveChatParticipant } from '../../custom-action/removeChatParticipant';
import { registerCancelChatParticipantInvite } from '../../custom-action/cancelChatParticipantInvite';
import { FlexEvent } from '../../../../types/feature-loader';
import logger from '../../../../utils/logger';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = () => {
  const coldTransferEnabled = isColdTransferEnabled();
  const multiParticipantEnabled = isMultiParticipantEnabled();

  if (!(coldTransferEnabled || multiParticipantEnabled)) return;

  logger.debug(
    `[conversation-transfer] settings: cold_transfer=${coldTransferEnabled} multi_participant=${multiParticipantEnabled}`,
  );
  registerCustomChatTransferAction();
  registerLeaveChatAction();
  registerRemoveChatParticipant();
  registerCancelChatParticipantInvite();
};
