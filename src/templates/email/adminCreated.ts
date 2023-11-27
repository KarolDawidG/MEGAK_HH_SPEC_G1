export const adminCreatedEmailTemplate = (
  token: string,
  userid: string,
): string => {
  return `
  Zostałeś(aś) dodany(a) do aplikacji MegaK jako administrator.<br/>
  <a href="https://jakiś tam adres/${userid}/${token}" target="_blank">Kliknij tutaj</a> aby ukończyć rejestrację i aktywować swoje konto.
  `;
};
