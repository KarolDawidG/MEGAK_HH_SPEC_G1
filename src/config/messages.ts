export const messages = {
  invalidEmail: 'Nieprawidłowy adres email.',
  invalidPassword: 'Nieprawidłowe hasło.',
  invalidLoginData:
    'Podane dane logowania są nieprawidłowe. Sprawdź poprawność adresu email i hasła.',
  loggedOut: 'Zostałeś pomyślnie wylogowany z aplikacji.',
  emailNotFound: 'Nie znaleziono użytkownika o podanym adresie e-mail.',
  userIdNotFound: 'Nie znaleziono użytkownika o podanym id.',
  studentIdNotFound: 'Kursant z podanym id nie istnieje.',
  userIsNotActive: 'Nie można zresetować hasła dla nieaktywnego użytkownika!',
  userIsActiveError: 'Użytkownik jest już zarejestrowany!',
  changePasswordSubject: 'Aplikacja MegaK - Zmień hasło',
  newPasswordSubject: 'Aplikacja MegaK - Zmieniono hasło',
  newPasswordInvalidBody: 'Link do zmiany hasła jest już nieaktualny.',
  emptySearchResult: `Nie znaleziono rekordów o zadanych parametrach wyszukiwania`,
  registrationInvalidBody:
    'Link do rejestracji użytkownika jest już nieaktualny.',
  // csvImportEmailValidationError: 'Niepoprawny format adresu email.',
  // csvImportEmailExistError: 'Ten email istnieje już w bazie danych.',
  // csvImportCompletionDegreeValidationError:
  //   'Niepoprawny format oceny stopnia przejścia kursu.',
  // csvImportEngagementDegreeValidationError:
  //   'Niepoprawny format oceny stopnia aktywności i zaangażowania w kursie.',
  // csvImportProjectDegreeValidationError:
  //   'Niepoprawny format oceny zadania zaliczeniowego w kursie.',
  // csvImportTeamProjectDegreeValidationError:
  //   'Niepoprawny format oceny pracy w zespole w projekcie bonusowym.',
  accessDenied: 'Nie masz uprawnień administratora.',
  newStudentSubject: 'Aplikacja MegaK - Zostałeś dodany do listy studentów',
  newHrSubject: `Aplikacja MegaK - Zostałeś dodany do listy HR'owców`,
  newAdminSubject: 'Aplikacja MegaK - Zostałeś dodany jako administrator',
  addUserEmailExist: 'Użytkownik o podanym adresie email już istnieje.',
  userRegisteredSubject: 'Aplikacja MegaK - Konto aktywowane',
  newPasswordMustBeDifferent: 'Nowe hasło musi różnić się od poprzedniego',
  passwordsMustBeTheSame: 'Podane hasła się różnią',
  errors: {
    userImport: {
      InvalidEmail: 'Niepoprawny format adresu email.',
      EmailAlreadyExists: 'Ten email istnieje już w bazie danych.',
      InvalidCompletionDegree:
        'Niepoprawny format oceny stopnia przejścia kursu.',
      InvalidEngagementDegree:
        'Niepoprawny format oceny stopnia aktywności i zaangażowania w kursie.',
      InvalidProjectDegree:
        'Niepoprawny format oceny zadania zaliczeniowego w kursie.',
      InvalidTeamProjectDegree:
        'Niepoprawny format oceny pracy w zespole w projekcie bonusowym.',
      InvalidProjectLink: 'Niepoprawny adres URL projektu.',
    },
  },
  updatedUserEmailExist: 'Użytkownik o podanym adresie email już istnieje.',
  notActiveUserError: 'Użytkownik z podanym id jest nieaktywny!',
  notAcceptableRoleError:
    'Użytkownik z podanym id ma przypisaną rolę, która nie pozwala na podgląd tej strony',
  updatedGithubNamExist:
    'Użytkownik Github ze wskazanym loginem już istnieje w bazie',
  githubUsernameNotFound: 'Użytkownik Github ze wskazanym loginem nie istnieje',
  onlyForHrUser: "Ta funkcja możliwa jest tylko dla hr'owców",
  hrProfileNotFound: 'Nie znaleziono profilu HR',
  studentNotAvailable: 'Wybrany student nie jest obecnie dostępny',
  hrMaxStudentLimitExceeded:
    'Nie możesz dodać do rozmowy kolejnego kursanta z powodu przekroczenia limitu maksymalnej ilości kursantów',
  conversationExist: 'Prowadziłeś już rozmowę z tym kursantem',
  conversationNotExist: 'Nie znaleziono aktywnej rozmowy z tym kursantem',
  userHiredSubject: 'Aplikacja MegaK - Zostałeś zatrudniony!',
  newConversationSubject: 'Aplikacja MegaK - Dostępna nowa rozmowa',
  cancelConversationSubject: 'Aplikacja MegaK - Zostałeś odrzucony :(',
};
