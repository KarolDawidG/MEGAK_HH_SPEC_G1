import { config } from '../../config/config';

export const registrationSuccessEmailTemplate = (): string => {
  return `
  Informujemy, iż rejestracja przebiegła pomyślnie i twoje konto zostało aktywowane.<br/>
  <a href="${config.crossOrigin}" target="_blank">Kliknij tutaj</a> aby przejść do aplikacji.
  `;
};
