/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";

const DEFAULT_LOCALE = "it-IT";

const ITALIAN_TRANSLATIONS = {
  NAV_HOME_THIAGOIAZZETTI: "Home",
  NAV_OVERVIEW_THIAGOIAZZETTI: "Panoramica",
  NAV_STUDENTS_THIAGOIAZZETTI: "Studenti",
  NAV_PLANS_THIAGOIAZZETTI: "Piani",
  NAV_WORKOUTS_THIAGOIAZZETTI: "Allenamenti",
  NAV_SCHEDULE_THIAGOIAZZETTI: "Agenda",
  NAV_DIETS_THIAGOIAZZETTI: "Diete",
  NAV_COMMUNICATION_THIAGOIAZZETTI: "Comunicazione",
  NAV_EVENTS_THIAGOIAZZETTI: "Eventi",
  NAV_PHYSICAL_ASSESSMENT_THIAGOIAZZETTI: "Valutazione fisica",
  NAV_MY_PANEL_THIAGOIAZZETTI: "Il mio pannello",
  NAV_SECTION_TITLE_THIAGOIAZZETTI: "Navigazione",
  NAV_CONTACT_THIAGOIAZZETTI: "Contattami",
  NAV_SIGN_OUT_THIAGOIAZZETTI: "Esci",
  ROLE_PERSONAL_ADMIN_THIAGOIAZZETTI: "Personal Admin",
  ROLE_STUDENT_THIAGOIAZZETTI: "Studente",
  HEADER_PERSONAL_PANEL_THIAGOIAZZETTI: "Pannello del personal",
  HEADER_MY_AREA_THIAGOIAZZETTI: "La mia area",
  HEADER_PUBLIC_PAGE_THIAGOIAZZETTI: "Pagina pubblica",
  LOGIN_ERROR_GENERIC_THIAGOIAZZETTI: "Non e stato possibile accedere",
  LOGIN_BADGE_ROLE_THIAGOIAZZETTI: "Personal admin e studente",
  LOGIN_ACCESS_LABEL_THIAGOIAZZETTI: "Accesso",
  LOGIN_HEADING_THIAGOIAZZETTI: "Login",
  LOGIN_EMAIL_LABEL_THIAGOIAZZETTI: "Email",
  LOGIN_EMAIL_PLACEHOLDER_THIAGOIAZZETTI: "tu@esempio.com",
  LOGIN_PASSWORD_LABEL_THIAGOIAZZETTI: "Password",
  LOGIN_BUTTON_LOADING_THIAGOIAZZETTI: "Accesso in corso...",
  LOGIN_BUTTON_SUBMIT_THIAGOIAZZETTI: "Entra ora",
  LOGIN_LINK_CREATE_ACCOUNT_THIAGOIAZZETTI: "Crea account studente",
  LOGIN_LINK_BACK_HOME_THIAGOIAZZETTI: "Torna alla pagina iniziale",
  REGISTER_ERROR_GENERIC_THIAGOIAZZETTI:
    "Non e stato possibile registrarsi",
  REGISTER_BADGE_SUBTITLE_THIAGOIAZZETTI:
    "Registrazione studente per tenant",
  REGISTER_TITLE_THIAGOIAZZETTI:
    "Entra nel tuo spazio personale e segui i tuoi allenamenti.",
  REGISTER_SUBTITLE_THIAGOIAZZETTI:
    "La registrazione crea l'utente studente e collega l'account al tenant indicato. Dopo la registrazione, il login apre direttamente la tua area.",
  REGISTER_CARD_PLAN_TITLE_THIAGOIAZZETTI: "Piano acquistato",
  REGISTER_CARD_PLAN_TEXT_THIAGOIAZZETTI:
    "Scegli il piano e conferma l'adesione.",
  REGISTER_CARD_WORKOUT_TITLE_THIAGOIAZZETTI: "Allenamenti e agenda",
  REGISTER_CARD_WORKOUT_TEXT_THIAGOIAZZETTI:
    "Segui le routine pubblicate dal tuo personal trainer.",
  REGISTER_NEW_STUDENT_THIAGOIAZZETTI: "Nuovo studente",
  REGISTER_HEADING_THIAGOIAZZETTI: "Registrazione",
  REGISTER_FULL_NAME_THIAGOIAZZETTI: "Nome completo",
  REGISTER_FULL_NAME_PLACEHOLDER_THIAGOIAZZETTI: "Il tuo nome",
  REGISTER_EMAIL_LABEL_THIAGOIAZZETTI: "Email",
  REGISTER_EMAIL_PLACEHOLDER_THIAGOIAZZETTI: "tu@esempio.com",
  REGISTER_PHONE_LABEL_THIAGOIAZZETTI: "Telefono",
  REGISTER_PASSWORD_LABEL_THIAGOIAZZETTI: "Password",
  REGISTER_PASSWORD_PLACEHOLDER_THIAGOIAZZETTI: "Crea una password",
  REGISTER_PERSONAL_ID_LABEL_THIAGOIAZZETTI: "ID del personal",
  REGISTER_PERSONAL_ID_PLACEHOLDER_THIAGOIAZZETTI: "UUID del personal",
  REGISTER_DETECTED_TENANT_THIAGOIAZZETTI:
    "Registrazione collegata rilevata:",
  REGISTER_BUTTON_LOADING_THIAGOIAZZETTI: "Registrazione in corso...",
  REGISTER_BUTTON_SUBMIT_THIAGOIAZZETTI: "Crea account",
  REGISTER_LINK_HAVE_ACCOUNT_THIAGOIAZZETTI: "Ho gia un account",
  REGISTER_LINK_BACK_HOME_THIAGOIAZZETTI: "Torna alla pagina iniziale",
  HOME_MARQUEE_MUSCULATION_THIAGOIAZZETTI: "Muscolazione",
  HOME_MARQUEE_WEIGHT_LOSS_THIAGOIAZZETTI: "Dimagrimento",
  HOME_MARQUEE_MASS_GAIN_THIAGOIAZZETTI: "Aumento massa",
  HOME_MARQUEE_HYPERTROPHY_THIAGOIAZZETTI: "Ipertrofia",
  HOME_MARQUEE_CONDITIONING_THIAGOIAZZETTI: "Condizionamento",
  HOME_MARQUEE_FUNCTIONAL_THIAGOIAZZETTI: "Allenamento funzionale",
  HOME_MARQUEE_HIIT_THIAGOIAZZETTI: "HIIT",
  HOME_MARQUEE_MOBILITY_THIAGOIAZZETTI: "Mobilita",
  HOME_MARQUEE_STRENGTH_THIAGOIAZZETTI: "Forza",
  HOME_MARQUEE_ENDURANCE_THIAGOIAZZETTI: "Resistenza",
  HOME_REVIEWS_VERIFIED_THIAGOIAZZETTI: "recensioni verificate",
  HOME_HERO_LINE_1_THIAGOIAZZETTI: "Trasforma",
  HOME_HERO_LINE_2_THIAGOIAZZETTI: "il tuo percorso",
  HOME_HERO_LINE_3_THIAGOIAZZETTI: "oggi",
  HOME_HERO_DESCRIPTION_THIAGOIAZZETTI:
    "Libera il tuo potenziale con programmi di allenamento personalizzati, pensati apposta per te.",
  HOME_JOIN_US_THIAGOIAZZETTI: "Unisciti a noi",
  HOME_VIEW_PLANS_THIAGOIAZZETTI: "Vedi i piani",
  HOME_MEMBERS_THIAGOIAZZETTI: "membri",
  HOME_STATS_DESCRIPTION_THIAGOIAZZETTI:
    "Allenamenti mirati, progressi monitorati e supporto costante per trasformare il tuo corpo con metodo.",
  HOME_WELCOME_PLATFORM_THIAGOIAZZETTI:
    "Benvenuto! Accedi alla piattaforma di",
  HOME_AVAILABLE_THIAGOIAZZETTI: "Disponibili",
  HOME_OUR_PLANS_THIAGOIAZZETTI: "I nostri piani",
  HOME_NO_PLANS_THIAGOIAZZETTI: "Nessun piano disponibile al momento.",
  HOME_TALK_TO_US_THIAGOIAZZETTI: "Parla con noi",
  HOME_PLAN_LABEL_THIAGOIAZZETTI: "Piano",
  HOME_PER_MONTH_THIAGOIAZZETTI: "/mese",
  HOME_I_WANT_THIS_PLAN_THIAGOIAZZETTI: "Voglio questo piano",
  FOOTER_BRAND_DESCRIPTION_THIAGOIAZZETTI:
    "Personal trainer specializzato in muscolazione e trasformazione corporea.",
  FOOTER_LINKS_TITLE_THIAGOIAZZETTI: "Link",
  FOOTER_CONTACT_TITLE_THIAGOIAZZETTI: "Contatto",
  FOOTER_WHATSAPP_CTA_THIAGOIAZZETTI: "Scrivimi su WhatsApp",
  FOOTER_COPYRIGHT_TEXT_THIAGOIAZZETTI:
    "Lorenzo Bianchi. Tutti i diritti riservati.",
  PLANS_TITLE_THIAGOIAZZETTI: "Piani pubblici",
  PLANS_SUBTITLE_THIAGOIAZZETTI:
    "Qui puoi vedere i piani creati dal personal trainer e scegliere l'opzione ideale quando accedi come studente.",
  PLANS_LINK_OPEN_HOME_THIAGOIAZZETTI: "Apri pagina iniziale",
  PLANS_LINK_CONTINUE_THIAGOIAZZETTI: "Continua",
  PLANS_EDIT_TITLE_THIAGOIAZZETTI: "Modifica piano",
  PLANS_NEW_TITLE_THIAGOIAZZETTI: "Nuovo piano",
  PLANS_CANCEL_EDIT_THIAGOIAZZETTI: "Annulla modifica",
  PLANS_NAME_LABEL_THIAGOIAZZETTI: "Nome del piano",
  PLANS_NAME_PLACEHOLDER_THIAGOIAZZETTI: "Es: Piano Premium",
  PLANS_PRICE_LABEL_THIAGOIAZZETTI: "Prezzo mensile (R$)",
  PLANS_DESCRIPTION_LABEL_THIAGOIAZZETTI: "Descrizione",
  PLANS_DESCRIPTION_PLACEHOLDER_THIAGOIAZZETTI:
    "Descrivi cosa include il piano",
  PLANS_ACTIVE_LABEL_THIAGOIAZZETTI: "Piano attivo",
  PLANS_CREATE_BUTTON_THIAGOIAZZETTI: "Crea piano",
  PLANS_SAVE_CHANGES_THIAGOIAZZETTI: "Salva modifiche",
  PLANS_SAVING_THIAGOIAZZETTI: "Salvataggio...",
  PLANS_DELETE_BUTTON_THIAGOIAZZETTI: "Elimina piano",
  PLANS_LOADING_THIAGOIAZZETTI: "Caricamento piani...",
  PLANS_EMPTY_THIAGOIAZZETTI:
    "Nessun piano di abbonamento trovato per questo tenant.",
  PLANS_PLAN_LABEL_THIAGOIAZZETTI: "Piano",
  PLANS_PREMIUM_DESCRIPTION_THIAGOIAZZETTI:
    "Piano premium con supporto del personal trainer.",
  PLANS_PER_MONTH_THIAGOIAZZETTI: "/mese",
  PLANS_EVERY_THIAGOIAZZETTI: "/",
  PLANS_MONTHS_THIAGOIAZZETTI: "mesi",
  PLANS_PER_DAY_THIAGOIAZZETTI: "/giorno",
  PLANS_DAYS_THIAGOIAZZETTI: "giorni",
  PLANS_PROTECTED_CONTRACT_THIAGOIAZZETTI: "Contratto protetto",
  PLANS_CHECKOUT_PENDING_THIAGOIAZZETTI:
    "Configurazione del checkout online in sospeso",
  PLANS_RECURRING_AUTOMATIC_THIAGOIAZZETTI:
    "Pagamento ricorrente automatico con carta",
  PLANS_ERROR_LOAD_THIAGOIAZZETTI: "Non e stato possibile caricare i piani",
  PLANS_ACTION_MANAGE_THIAGOIAZZETTI: "Gestisci piano",
  PLANS_ACTION_SELECT_THIAGOIAZZETTI: "Seleziona piano",
  PLANS_ACTION_CREATE_ACCOUNT_THIAGOIAZZETTI:
    "Crea account per acquistare",
  PLANS_MESSAGE_LOGIN_REQUIRED_THIAGOIAZZETTI:
    "Crea un account o accedi come studente per acquistare.",
  PLANS_MESSAGE_PLAN_SELECTED_THIAGOIAZZETTI: "Piano",
  PLANS_MESSAGE_FILL_CARD_THIAGOIAZZETTI:
    "selezionato. Inserisci i dati della carta per completare l'abbonamento.",
  PLANS_MESSAGE_REQUIRED_FIELDS_THIAGOIAZZETTI:
    "Nome e prezzo del piano sono obbligatori",
  PLANS_MESSAGE_INVALID_PRICE_THIAGOIAZZETTI: "Inserisci un prezzo valido",
  PLANS_MESSAGE_UPDATED_SUCCESS_THIAGOIAZZETTI:
    "Piano aggiornato con successo",
  PLANS_MESSAGE_CREATED_SUCCESS_THIAGOIAZZETTI:
    "Piano creato con successo",
  PLANS_MESSAGE_SAVE_ERROR_THIAGOIAZZETTI:
    "Non e stato possibile salvare il piano",
  PLANS_CONFIRM_DELETE_THIAGOIAZZETTI:
    "Sei sicuro di voler eliminare questo piano? Questa azione non puo essere annullata.",
  PLANS_MESSAGE_DELETED_SUCCESS_THIAGOIAZZETTI:
    "Piano eliminato con successo",
  PLANS_MESSAGE_DELETE_ERROR_THIAGOIAZZETTI:
    "Non e stato possibile eliminare il piano",
  PLANS_SUBSCRIPTION_SUCCESS_PREFIX_THIAGOIAZZETTI:
    "Abbonamento al piano",
  PLANS_SUBSCRIPTION_SUCCESS_SUFFIX_THIAGOIAZZETTI:
    "creato con successo.",
  PLANS_CHECKOUT_HINT_THIAGOIAZZETTI:
    "Il checkout ricorrente e disponibile dopo il login dello studente. Se non hai ancora un account, registrati sul tenant e torna a scegliere il piano.",
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const t = useCallback(
    (key, fallback = "") => ITALIAN_TRANSLATIONS[key] || fallback || key,
    [],
  );

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
