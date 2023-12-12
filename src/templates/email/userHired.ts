export const userHiredEmailTemplate = (companyName: string | null): string => {
  if (!companyName) {
    return `
  Oznaczyłeś/aś siebie jako osobę zatrudnioną. Życzymy wszystkiego najlepszego w nowej pracy. Jednocześnie informujemy, iż twoje konto zostało zdezaktywowane.
  `;
  }
  return `
  Zostałeś zatrudniony przez firmę ${companyName}. Życzymy wszystkiego najlepszego w nowej pracy. Jednocześnie informujemy, iż twoje konto zostało zdezaktywowane.
  `;
};
