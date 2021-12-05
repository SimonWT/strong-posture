import amplitude from 'amplitude-js';

const ampliduteAppId = import.meta.env.VITE_AMPLITUDE_APP_ID

export const initAmplitude = () => {
  amplitude.getInstance().init(ampliduteAppId);
};

export const setAmplitudeUserDevice = installationToken => {
  amplitude.getInstance().setDeviceId(installationToken);
};

export const setAmplitudeUserId = userId => {
  amplitude.getInstance().setUserId(userId);
};

export const setAmplitudeUserProperties = properties => {
  amplitude.getInstance().setUserProperties(properties);
};

export const sendAmplitudeData = (eventType, eventProperties) => {
  amplitude.getInstance().logEvent(eventType, eventProperties);
};