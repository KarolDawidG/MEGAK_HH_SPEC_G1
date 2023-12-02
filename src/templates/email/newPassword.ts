import { config } from '../../config/config';

export const newPasswordEmailTemplate = (): string => {
  return `
  Informujemy, że nowe hasło do aplikacji zostało ustawione pomyślnie. Możesz się zalogować korzystając z nowego hasła.<br/>
  <a href="${config.crossOrigin}" target="_blank">Kliknij tutaj</a> aby przejść do aplikacji.
  `;
};
