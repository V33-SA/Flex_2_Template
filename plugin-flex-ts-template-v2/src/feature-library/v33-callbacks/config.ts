import { getFeatureFlags } from '../../utils/configuration';
import V33CallbacksConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.v33_callbacks as V33CallbacksConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
