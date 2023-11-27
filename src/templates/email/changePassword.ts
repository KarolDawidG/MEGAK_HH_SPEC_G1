export const changePasswordEmailTemplate = (
  token: string,
  userid: string,
): string => {
  return `
  Aby ustawić nowe hasło do naszej aplikacji kliknij w poniższy link:<br/>
  <a href="https://jakiś tam adres/${userid}/${token}" target="_blank">Kliknij tutaj</a> aby ukończyć rejestrację i aktywować swoje konto.
  `;
};
