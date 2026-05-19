/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";

const DEFAULT_LOCALE = "it-IT";

const KEY_WORD_TRANSLATIONS = {
  ACTION: "Azione",
  ACTIVE: "Attivo",
  ADD: "Aggiungi",
  AGENDA: "Agenda",
  ALUNO: "Studente",
  ASSESSMENT: "Valutazione",
  ATTENDANCE: "Presenza",
  BIRTHDATE: "Data di nascita",
  BIRTHDAYS: "Compleanni",
  BADGE: "",
  CANCEL: "Annulla",
  CHAT: "Chat",
  CHECKIN: "Check-in",
  CLIENT: "Studente",
  COL: "",
  COMMUNICATION: "Comunicazione",
  CONFIRM: "Conferma",
  CONFIRMED: "Confermato",
  CONSULT: "Consulenza",
  CREATE: "Crea",
  CREATED: "Creato",
  CUSTOM: "Personalizzato",
  DATE: "Data",
  DAYS: "Giorni",
  DELETE: "Elimina",
  DELETED: "Eliminato",
  DESCRIPTION: "Descrizione",
  DESC: "Descrizione",
  DIET: "Dieta",
  DIETS: "Diete",
  DUE: "Scadenza",
  EDIT: "Modifica",
  EMAIL: "Email",
  EMPTY: "Nessun dato disponibile",
  END: "Fine",
  EQUIPMENT: "Attrezzatura",
  ERROR: "Errore",
  EVENT: "Evento",
  EVENTS: "Eventi",
  EXERCISE: "Esercizio",
  EXERCISES: "Esercizi",
  FILTER: "Filtra",
  FRI: "Venerdi",
  FULL: "Completo",
  GENERAL: "Generale",
  GROUP: "Gruppo",
  HEADER: "",
  INACTIVE: "Inattivo",
  LABEL: "",
  LINKED: "Collegato",
  LIST: "Elenco",
  LOAD: "Carica",
  LOADING: "Caricamento...",
  MESSAGE: "Messaggio",
  MISSED: "Assente",
  MONTHLY: "Mensile",
  NAME: "Nome",
  NEW: "Nuovo",
  NO: "Nessun",
  NOTES: "Note",
  OBJECTIVE: "Obiettivo",
  OTHER: "Altro",
  OVERVIEW: "Panoramica",
  PASSWORD: "Password",
  PENDING: "In attesa",
  PERSONAL: "Personal",
  PHONE: "Telefono",
  PLAN: "Piano",
  PLANS: "Piani",
  PRICE: "Prezzo",
  PROGRESS: "Progresso",
  PUBLIC: "Pubblico",
  RECURRENCE: "Ricorrenza",
  RELATED: "Correlato",
  REPLACE: "Sostituisci",
  REPS: "Ripetizioni",
  REQUIRED: "Obbligatorio",
  REST: "Recupero",
  SAVE: "Salva",
  SAVING: "Salvataggio...",
  SCHEDULE: "Agenda",
  SELECT: "Seleziona",
  SESSION: "Sessione",
  SESSIONS: "Sessioni",
  SETS: "Serie",
  START: "Inizio",
  STATUS: "Stato",
  STUDENT: "Studente",
  STUDENTS: "Studenti",
  STAT: "",
  TAB: "",
  TEMPLATE: "Modello",
  TEMPLATES: "Modelli",
  TITLE: "Titolo",
  TYPE: "Tipo",
  UPDATED: "Aggiornato",
  URL: "URL",
  VIDEO: "Video",
  WEEKDAY: "Giorno",
  WORKOUT: "Allenamento",
  WORKOUTS: "Allenamenti",
};

const KEY_PHRASE_TRANSLATIONS = {
  REQUIRED_FIELDS: "Compila i campi obbligatori",
  SAVE_CHANGES: "Salva modifiche",
  CREATE_EVENT: "Crea evento",
  NEW_EVENT_TITLE: "Nuovo evento",
  EDIT_EVENT_TITLE: "Modifica evento",
  SELECT_STUDENT: "Seleziona uno studente",
  NO_WORKOUT: "Nessun allenamento collegato",
  RELATED_WORKOUT: "Allenamento collegato",
  REPEAT_UNTIL: "Ripeti fino a",
  RECURRENCE_NONE: "Non ripetere",
  RECURRENCE_WEEKLY: "Settimanale",
  RECURRENCE_MONTHLY: "Mensile",
  STATUS_PENDING: "In attesa",
  STATUS_CONFIRMED: "Confermato",
  STATUS_MISSED: "Assente",
  TYPE_WORKOUT: "Allenamento",
  TYPE_DIET: "Dieta",
  TYPE_CONSULT: "Consulenza",
  TYPE_CHECKIN: "Check-in",
  TYPE_OTHER: "Altro",
  ACTIVE_STUDENTS: "Studenti attivi",
  INACTIVE_STUDENTS: "Studenti inattivi",
  PAYMENT_STATUS: "Stato pagamento",
  POTENTIAL: "Potenziale mensile",
  OVERDUE: "in ritardo",
  PAID: "pagati",
  NO_MESSAGES: "Nessun messaggio ancora",
  NO_STUDENTS: "Nessuno studente registrato",
  NO_PLANS: "Nessun piano disponibile",
  NO_WORKOUTS: "Nessun allenamento disponibile",
  NO_HISTORY: "Nessuna valutazione registrata",
  NO_PHOTOS: "Nessuna foto registrata in questa valutazione.",
  PER_MONTH: "/mese",
  PER_DAY: "/giorno",
  FULL_NAME: "Nome completo",
  PHONE_LABEL: "Telefono",
  EMAIL_LABEL: "Email",
  PASSWORD_LABEL: "Password",
  HISTORY: "Storico",
  EVOLUTION: "Evoluzione",
  SAVE: "Salva",
  DELETE: "Elimina",
  WEIGHT: "Peso",
  HEIGHT: "Altezza",
  LEAN_MASS: "Massa magra",
  LEAN_MASS_PERCENTAGE: "Percentuale massa magra",
  FAT_WEIGHT: "Peso grasso",
  FAT: "Grasso",
};

const ITALIAN_TRANSLATIONS = {
  NAV_HOME: "Home",
  NAV_OVERVIEW: "Panoramica",
  NAV_STUDENTS: "Studenti",
  NAV_PLANS: "Piani",
  NAV_WORKOUTS: "Allenamenti",
  NAV_SCHEDULE: "Agenda",
  NAV_DIETS: "Diete",
  NAV_COMMUNICATION: "Comunicazione",
  NAV_EVENTS: "Eventi",
  NAV_PHYSICAL_ASSESSMENT: "Valutazione fisica",
  NAV_MY_PANEL: "Il mio pannello",
  NAV_SECTION_TITLE: "Navigazione",
  NAV_CONTACT: "Contattami",
  NAV_SIGN_OUT: "Esci",
  ROLE_PERSONAL_ADMIN: "Personal Admin",
  ROLE_STUDENT: "Studente",
  HEADER_PERSONAL_PANEL: "Pannello del personal",
  HEADER_MY_AREA: "La mia area",
  HEADER_PUBLIC_PAGE: "Pagina pubblica",
  LOGIN_ERROR_GENERIC: "Non e stato possibile accedere",
  LOGIN_BADGE_ROLE: "Personal admin e studente",
  LOGIN_ACCESS_LABEL: "Accesso",
  LOGIN_HEADING: "Login",
  LOGIN_EMAIL_LABEL: "Email",
  LOGIN_EMAIL_PLACEHOLDER: "tu@esempio.com",
  LOGIN_PASSWORD_LABEL: "Password",
  LOGIN_BUTTON_LOADING: "Accesso in corso...",
  LOGIN_BUTTON_SUBMIT: "Entra ora",
  LOGIN_LINK_CREATE_ACCOUNT: "Crea account studente",
  LOGIN_LINK_BACK_HOME: "Torna alla pagina iniziale",
  REGISTER_ERROR_GENERIC:
    "Non e stato possibile registrarsi",
  REGISTER_BADGE_SUBTITLE:
    "Registrazione studente per tenant",
  REGISTER_TITLE:
    "Entra nel tuo spazio personale e segui i tuoi allenamenti.",
  REGISTER_SUBTITLE:
    "La registrazione crea l'utente studente e collega l'account al tenant indicato. Dopo la registrazione, il login apre direttamente la tua area.",
  REGISTER_CARD_PLAN_TITLE: "Piano acquistato",
  REGISTER_CARD_PLAN_TEXT:
    "Scegli il piano e conferma l'adesione.",
  REGISTER_CARD_WORKOUT_TITLE: "Allenamenti e agenda",
  REGISTER_CARD_WORKOUT_TEXT:
    "Segui le routine pubblicate dal tuo personal trainer.",
  REGISTER_NEW_STUDENT: "Nuovo studente",
  REGISTER_HEADING: "Registrazione",
  REGISTER_FULL_NAME: "Nome completo",
  REGISTER_FULL_NAME_PLACEHOLDER: "Il tuo nome",
  REGISTER_EMAIL_LABEL: "Email",
  REGISTER_EMAIL_PLACEHOLDER: "tu@esempio.com",
  REGISTER_PHONE_LABEL: "Telefono",
  REGISTER_PASSWORD_LABEL: "Password",
  REGISTER_PASSWORD_PLACEHOLDER: "Crea una password",
  REGISTER_PERSONAL_ID_LABEL: "ID del personal",
  REGISTER_PERSONAL_ID_PLACEHOLDER: "UUID del personal",
  REGISTER_DETECTED_TENANT:
    "Registrazione collegata rilevata:",
  REGISTER_BUTTON_LOADING: "Registrazione in corso...",
  REGISTER_BUTTON_SUBMIT: "Crea account",
  REGISTER_LINK_HAVE_ACCOUNT: "Ho gia un account",
  REGISTER_LINK_BACK_HOME: "Torna alla pagina iniziale",
  HOME_MARQUEE_MUSCULATION: "Muscolazione",
  HOME_MARQUEE_WEIGHT_LOSS: "Dimagrimento",
  HOME_MARQUEE_MASS_GAIN: "Aumento massa",
  HOME_MARQUEE_HYPERTROPHY: "Ipertrofia",
  HOME_MARQUEE_CONDITIONING: "Condizionamento",
  HOME_MARQUEE_FUNCTIONAL: "Allenamento funzionale",
  HOME_MARQUEE_HIIT: "HIIT",
  HOME_MARQUEE_MOBILITY: "Mobilita",
  HOME_MARQUEE_STRENGTH: "Forza",
  HOME_MARQUEE_ENDURANCE: "Resistenza",
  HOME_REVIEWS_VERIFIED: "recensioni verificate",
  HOME_HERO_LINE_1: "Trasforma",
  HOME_HERO_LINE_2: "il tuo percorso",
  HOME_HERO_LINE_3: "oggi",
  HOME_HERO_DESCRIPTION:
    "Libera il tuo potenziale con programmi di allenamento personalizzati, pensati apposta per te.",
  HOME_JOIN_US: "Unisciti a noi",
  HOME_VIEW_PLANS: "Vedi i piani",
  HOME_MEMBERS: "membri",
  HOME_STATS_DESCRIPTION:
    "Allenamenti mirati, progressi monitorati e supporto costante per trasformare il tuo corpo con metodo.",
  HOME_WELCOME_PLATFORM:
    "Benvenuto! Accedi alla piattaforma di",
  HOME_AVAILABLE: "Disponibili",
  HOME_OUR_PLANS: "I nostri piani",
  HOME_NO_PLANS: "Nessun piano disponibile al momento.",
  HOME_TALK_TO_US: "Parla con noi",
  HOME_PLAN_LABEL: "Piano",
  HOME_PER_MONTH: "/mese",
  HOME_I_WANT_THIS_PLAN: "Voglio questo piano",
  FOOTER_BRAND_DESCRIPTION:
    "Personal trainer specializzato in muscolazione e trasformazione corporea.",
  FOOTER_LINKS_TITLE: "Link",
  FOOTER_CONTACT_TITLE: "Contatto",
  FOOTER_WHATSAPP_CTA: "Scrivimi su WhatsApp",
  FOOTER_COPYRIGHT_TEXT:
    "Lorenzo Bianchi. Tutti i diritti riservati.",
  PLANS_TITLE: "Piani pubblici",
  PLANS_SUBTITLE:
    "Qui puoi vedere i piani creati dal personal trainer e scegliere l'opzione ideale quando accedi come studente.",
  PLANS_LINK_OPEN_HOME: "Apri pagina iniziale",
  PLANS_LINK_CONTINUE: "Continua",
  PLANS_EDIT_TITLE: "Modifica piano",
  PLANS_NEW_TITLE: "Nuovo piano",
  PLANS_CANCEL_EDIT: "Annulla modifica",
  PLANS_NAME_LABEL: "Nome del piano",
  PLANS_NAME_PLACEHOLDER: "Es: Piano Premium",
  PLANS_PRICE_LABEL: "Prezzo mensile (R$)",
  PLANS_DESCRIPTION_LABEL: "Descrizione",
  PLANS_DESCRIPTION_PLACEHOLDER:
    "Descrivi cosa include il piano",
  PLANS_ACTIVE_LABEL: "Piano attivo",
  PLANS_CREATE_BUTTON: "Crea piano",
  PLANS_SAVE_CHANGES: "Salva modifiche",
  PLANS_SAVING: "Salvataggio...",
  PLANS_DELETE_BUTTON: "Elimina piano",
  PLANS_LOADING: "Caricamento piani...",
  PLANS_EMPTY:
    "Nessun piano di abbonamento trovato per questo tenant.",
  PLANS_PLAN_LABEL: "Piano",
  PLANS_PREMIUM_DESCRIPTION:
    "Piano premium con supporto del personal trainer.",
  PLANS_PER_MONTH: "/mese",
  PLANS_EVERY: "/",
  PLANS_MONTHS: "mesi",
  PLANS_PER_DAY: "/giorno",
  PLANS_DAYS: "giorni",
  PLANS_PROTECTED_CONTRACT: "Contratto protetto",
  PLANS_CHECKOUT_PENDING:
    "Configurazione del checkout online in sospeso",
  PLANS_RECURRING_AUTOMATIC:
    "Pagamento ricorrente automatico con carta",
  PLANS_ERROR_LOAD: "Non e stato possibile caricare i piani",
  PLANS_ACTION_MANAGE: "Gestisci piano",
  PLANS_ACTION_SELECT: "Seleziona piano",
  PLANS_ACTION_CREATE_ACCOUNT:
    "Crea account per acquistare",
  PLANS_MESSAGE_LOGIN_REQUIRED:
    "Crea un account o accedi come studente per acquistare.",
  PLANS_MESSAGE_PLAN_SELECTED: "Piano",
  PLANS_MESSAGE_FILL_CARD:
    "selezionato. Inserisci i dati della carta per completare l'abbonamento.",
  PLANS_MESSAGE_REQUIRED_FIELDS:
    "Nome e prezzo del piano sono obbligatori",
  PLANS_MESSAGE_INVALID_PRICE: "Inserisci un prezzo valido",
  PLANS_MESSAGE_UPDATED_SUCCESS:
    "Piano aggiornato con successo",
  PLANS_MESSAGE_CREATED_SUCCESS:
    "Piano creato con successo",
  PLANS_MESSAGE_SAVE_ERROR:
    "Non e stato possibile salvare il piano",
  PLANS_CONFIRM_DELETE:
    "Sei sicuro di voler eliminare questo piano? Questa azione non puo essere annullata.",
  PLANS_MESSAGE_DELETED_SUCCESS:
    "Piano eliminato con successo",
  PLANS_MESSAGE_DELETE_ERROR:
    "Non e stato possibile eliminare il piano",
  PLANS_SUBSCRIPTION_SUCCESS_PREFIX:
    "Abbonamento al piano",
  PLANS_SUBSCRIPTION_SUCCESS_SUFFIX:
    "creato con successo.",
  PLANS_CHECKOUT_HINT:
    "Il checkout ricorrente e disponibile dopo il login dello studente. Se non hai ancora un account, registrati sul tenant e torna a scegliere il piano.",
};

const I18nContext = createContext(null);

function titleCase(value) {
  return value
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

function deriveItalianLabel(key) {
  let compactKey = String(key || "").replace(
    /^(WORKOUT_BUILDER|WORKOUT_MODAL|WORKOUT_ITEM)_/,
    "",
  );

  let previousKey = "";
  while (previousKey !== compactKey) {
    previousKey = compactKey;
    compactKey = compactKey.replace(
      /^(ADMIN|CLIENT|DASH|HOME|NAV|LOGIN|REGISTER|PLANS|DIET|WORKOUT|STUDENTS)_/,
      "",
    );
  }

  for (const [phrase, label] of Object.entries(KEY_PHRASE_TRANSLATIONS)) {
    if (compactKey.includes(phrase)) {
      return label;
    }
  }

  const words = compactKey
    .split("_")
    .map((word) => KEY_WORD_TRANSLATIONS[word] ?? titleCase(word))
    .filter(Boolean);

  return words.length ? words.join(" ") : "";
}

export function I18nProvider({ children }) {
  const t = useCallback(function translate(key, fallback) {
    const translated = ITALIAN_TRANSLATIONS[key];
    if (translated) return translated;

    if (arguments.length >= 2 && !fallback) {
      return "";
    }

    const derived = deriveItalianLabel(key);
    if (derived) return derived;

    if (arguments.length >= 2) {
      return fallback || "";
    }

    return key;
  }, []);

  const value = useMemo(
    () => ({
      locale: DEFAULT_LOCALE,
      direction: "ltr",
      t,
    }),
    [t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return ctx;
}
