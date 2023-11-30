import { config } from '../../config/config';

export const hrCreatedEmailTemplate = (
  token: string,
  userid: string,
): string => {
  return `
  Zostałeś(aś) dodany(a) do aplikacji MegaK jako Hr'owiec.<br/>
  <a href="${config.crossOrigin}/${userid}/${token}" target="_blank">Kliknij tutaj</a> aby ukończyć rejestrację i aktywować swoje konto.
  `;
};
