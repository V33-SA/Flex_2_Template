import { getFeatureFlags } from '../../utils/configuration';
import V33DowntimeManager from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.v33_downtimemanager as V33DowntimeManager) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
