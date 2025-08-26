import { getFeatureFlags } from '../../utils/configuration';
import V33AvailableworkersConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.v33_availableworkers as V33AvailableworkersConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
