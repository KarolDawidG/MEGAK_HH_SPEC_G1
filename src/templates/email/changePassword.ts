import { config } from '../../config/config';

export const changePasswordEmailTemplate = (
  token: string,
  userid: string,
): string => {
  return `
  Aby ustawić nowe hasło do naszej aplikacji kliknij w poniższy link:<br/>
  <a href="${config.crossOrigin}/passwordchange/${userid}/${token}" target="_blank">Kliknij tutaj</a> aby ukończyć rejestrację i aktywować swoje konto.
  `;
};
