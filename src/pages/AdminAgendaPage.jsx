import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Dumbbell,
  Salad,
  Save,
  User,
} from "lucide-react";
import {
  createAgendaEvent,
  deleteAgendaEvent,
  listAgendaEvents,
  listStudents,
  listWorkoutSessions,
  listWorkoutPlans,
  reviewAgendaChangeRequest,
  updateAgendaEvent,
} from "../lib/api.js";
import { useTenant } from "../contexts/TenantContext.jsx";
import { useI18n } from "../contexts/I18nContext.jsx";

const ADMIN_AGENDA_FALLBACKS = {
  "pt-BR": {
    ADMIN_AGENDA_LABEL: "Agenda",
    ADMIN_AGENDA_TITLE: "Agenda do Personal",
    ADMIN_AGENDA_SUBTITLE:
      "Calendario mensal, recorrencia semanal/mensal e presenca do aluno.",
    ADMIN_AGENDA_ERROR_LOAD: "Nao foi possivel carregar agenda",
    ADMIN_AGENDA_REQUIRED_FIELDS:
      "Studente, titulo e horario inicial sao obrigatorios",
    ADMIN_AGENDA_EVENT_UPDATED: "Evento atualizado com sucesso",
    ADMIN_AGENDA_EVENT_CREATED: "Evento criado com sucesso",
    ADMIN_AGENDA_SAVE_ERROR: "Errore nel salvataggio dell'evento",
    ADMIN_AGENDA_CONFIRM_DELETE:
      "Eliminare questo evento dall'agenda?",
    ADMIN_AGENDA_EVENT_DELETED: "Evento removido",
    ADMIN_AGENDA_DELETE_ERROR: "Nao foi possivel excluir evento",
    ADMIN_AGENDA_EDIT_EVENT_TITLE: "Modifica evento",
    ADMIN_AGENDA_NEW_EVENT_TITLE: "Nuovo evento",
    ADMIN_AGENDA_STUDENT_LABEL: "Studente",
    ADMIN_AGENDA_SELECT_STUDENT: "Seleziona",
    ADMIN_AGENDA_TYPE_LABEL: "Tipo",
    ADMIN_AGENDA_TYPE_WORKOUT: "Allenamento",
    ADMIN_AGENDA_TYPE_DIET: "Dieta",
    ADMIN_AGENDA_TYPE_CONSULT: "Consulta",
    ADMIN_AGENDA_TYPE_CHECKIN: "Check-in",
    ADMIN_AGENDA_TYPE_OTHER: "Outro",
    ADMIN_AGENDA_ATTENDANCE_LABEL: "Presenza",
    ADMIN_AGENDA_STATUS_PENDING: "In attesa",
    ADMIN_AGENDA_STATUS_CONFIRMED: "Confermato",
    ADMIN_AGENDA_STATUS_MISSED: "Faltou",
    ADMIN_AGENDA_TITLE_FIELD: "Titulo",
    ADMIN_AGENDA_DESCRIPTION_LABEL: "Descrizione",
    ADMIN_AGENDA_START_LABEL: "Inizio",
    ADMIN_AGENDA_END_LABEL: "Fim",
    ADMIN_AGENDA_RECURRENCE_LABEL: "Ricorrenza",
    ADMIN_AGENDA_RECURRENCE_NONE: "Nao repetir",
    ADMIN_AGENDA_RECURRENCE_WEEKLY: "Settimanale",
    ADMIN_AGENDA_RECURRENCE_MONTHLY: "Mensile",
    ADMIN_AGENDA_REPEAT_UNTIL: "Repetir ate",
    ADMIN_AGENDA_RELATED_WORKOUT: "Allenamento collegato",
    ADMIN_AGENDA_NO_WORKOUT: "Nessun allenamento collegato",
    ADMIN_AGENDA_DIET_NOTES_LABEL: "Dieta / orientacoes",
    ADMIN_AGENDA_SAVE_CHANGES: "Salva modifiche",
    ADMIN_AGENDA_CREATE_EVENT: "Crea evento",
    ADMIN_AGENDA_CANCEL: "Annulla",
    ADMIN_AGENDA_EVENTS_TITLE: "Eventi",
    ADMIN_AGENDA_SELECTED_STUDENT: "Studente selecionado",
    ADMIN_AGENDA_GENERAL_SCHEDULE: "Mostrando agenda geral",
    ADMIN_AGENDA_LOADING: "Caricamento...",
    ADMIN_AGENDA_EMPTY: "Nessun evento registrato.",
    ADMIN_AGENDA_EDIT_BUTTON: "Modifica",
    ADMIN_AGENDA_DELETE_BUTTON: "Elimina",
    CLIENT_AGENDA_EVENTS: "eventos",
  },
  "pt-PT": {
    ADMIN_AGENDA_LABEL: "Agenda",
    ADMIN_AGENDA_TITLE: "Agenda do Personal",
    ADMIN_AGENDA_SUBTITLE:
      "Calendario mensal, recorrencia semanal/mensal e presenca do aluno.",
    ADMIN_AGENDA_ERROR_LOAD:
      "Nao foi possivel carregar a agenda",
    ADMIN_AGENDA_REQUIRED_FIELDS:
      "Studente, titulo e horario inicial sao obrigatorios",
    ADMIN_AGENDA_EVENT_UPDATED: "Evento atualizado com sucesso",
    ADMIN_AGENDA_EVENT_CREATED: "Evento criado com sucesso",
    ADMIN_AGENDA_SAVE_ERROR: "Errore nel salvataggio dell'evento",
    ADMIN_AGENDA_CONFIRM_DELETE:
      "Eliminare questo evento dall'agenda?",
    ADMIN_AGENDA_EVENT_DELETED: "Evento removido",
    ADMIN_AGENDA_DELETE_ERROR: "Nao foi possivel excluir evento",
    ADMIN_AGENDA_EDIT_EVENT_TITLE: "Modifica evento",
    ADMIN_AGENDA_NEW_EVENT_TITLE: "Nuovo evento",
    ADMIN_AGENDA_STUDENT_LABEL: "Studente",
    ADMIN_AGENDA_SELECT_STUDENT: "Seleziona",
    ADMIN_AGENDA_TYPE_LABEL: "Tipo",
    ADMIN_AGENDA_TYPE_WORKOUT: "Allenamento",
    ADMIN_AGENDA_TYPE_DIET: "Dieta",
    ADMIN_AGENDA_TYPE_CONSULT: "Consulta",
    ADMIN_AGENDA_TYPE_CHECKIN: "Check-in",
    ADMIN_AGENDA_TYPE_OTHER: "Outro",
    ADMIN_AGENDA_ATTENDANCE_LABEL: "Presenza",
    ADMIN_AGENDA_STATUS_PENDING: "In attesa",
    ADMIN_AGENDA_STATUS_CONFIRMED: "Confermato",
    ADMIN_AGENDA_STATUS_MISSED: "Faltou",
    ADMIN_AGENDA_TITLE_FIELD: "Titulo",
    ADMIN_AGENDA_DESCRIPTION_LABEL: "Descrizione",
    ADMIN_AGENDA_START_LABEL: "Inizio",
    ADMIN_AGENDA_END_LABEL: "Fim",
    ADMIN_AGENDA_RECURRENCE_LABEL: "Ricorrenza",
    ADMIN_AGENDA_RECURRENCE_NONE: "Nao repetir",
    ADMIN_AGENDA_RECURRENCE_WEEKLY: "Settimanale",
    ADMIN_AGENDA_RECURRENCE_MONTHLY: "Mensile",
    ADMIN_AGENDA_REPEAT_UNTIL: "Repetir ate",
    ADMIN_AGENDA_RELATED_WORKOUT: "Allenamento collegato",
    ADMIN_AGENDA_NO_WORKOUT: "Nessun allenamento collegato",
    ADMIN_AGENDA_DIET_NOTES_LABEL: "Dieta / orientacoes",
    ADMIN_AGENDA_SAVE_CHANGES: "Salva modifiche",
    ADMIN_AGENDA_CREATE_EVENT: "Crea evento",
    ADMIN_AGENDA_CANCEL: "Annulla",
    ADMIN_AGENDA_EVENTS_TITLE: "Eventi",
    ADMIN_AGENDA_SELECTED_STUDENT: "Studente selecionado",
    ADMIN_AGENDA_GENERAL_SCHEDULE: "Mostrando agenda geral",
    ADMIN_AGENDA_LOADING: "A carregar...",
    ADMIN_AGENDA_EMPTY: "Nessun evento registrato.",
    ADMIN_AGENDA_EDIT_BUTTON: "Modifica",
    ADMIN_AGENDA_DELETE_BUTTON: "Elimina",
    CLIENT_AGENDA_EVENTS: "eventos",
  },
  "en-US": {
    ADMIN_AGENDA_LABEL: "Schedule",
    ADMIN_AGENDA_TITLE: "Personal Schedule",
    ADMIN_AGENDA_SUBTITLE:
      "Monthly calendar, weekly/monthly recurrence and student attendance.",
    ADMIN_AGENDA_ERROR_LOAD: "Could not load schedule",
    ADMIN_AGENDA_REQUIRED_FIELDS:
      "Student, title and start time are required",
    ADMIN_AGENDA_EVENT_UPDATED: "Event updated successfully",
    ADMIN_AGENDA_EVENT_CREATED: "Event created successfully",
    ADMIN_AGENDA_SAVE_ERROR: "Failed to save event",
    ADMIN_AGENDA_CONFIRM_DELETE: "Delete this schedule event?",
    ADMIN_AGENDA_EVENT_DELETED: "Event removed",
    ADMIN_AGENDA_DELETE_ERROR: "Could not delete event",
    ADMIN_AGENDA_EDIT_EVENT_TITLE: "Edit event",
    ADMIN_AGENDA_NEW_EVENT_TITLE: "New event",
    ADMIN_AGENDA_STUDENT_LABEL: "Student",
    ADMIN_AGENDA_SELECT_STUDENT: "Select",
    ADMIN_AGENDA_TYPE_LABEL: "Type",
    ADMIN_AGENDA_TYPE_WORKOUT: "Workout",
    ADMIN_AGENDA_TYPE_DIET: "Diet",
    ADMIN_AGENDA_TYPE_CONSULT: "Consultation",
    ADMIN_AGENDA_TYPE_CHECKIN: "Check-in",
    ADMIN_AGENDA_TYPE_OTHER: "Other",
    ADMIN_AGENDA_ATTENDANCE_LABEL: "Attendance",
    ADMIN_AGENDA_STATUS_PENDING: "Pending",
    ADMIN_AGENDA_STATUS_CONFIRMED: "Confirmed",
    ADMIN_AGENDA_STATUS_MISSED: "Missed",
    ADMIN_AGENDA_TITLE_FIELD: "Title",
    ADMIN_AGENDA_DESCRIPTION_LABEL: "Description",
    ADMIN_AGENDA_START_LABEL: "Start",
    ADMIN_AGENDA_END_LABEL: "End",
    ADMIN_AGENDA_RECURRENCE_LABEL: "Recurrence",
    ADMIN_AGENDA_RECURRENCE_NONE: "Do not repeat",
    ADMIN_AGENDA_RECURRENCE_WEEKLY: "Weekly",
    ADMIN_AGENDA_RECURRENCE_MONTHLY: "Monthly",
    ADMIN_AGENDA_REPEAT_UNTIL: "Repeat until",
    ADMIN_AGENDA_RELATED_WORKOUT: "Related workout",
    ADMIN_AGENDA_NO_WORKOUT: "No linked workout",
    ADMIN_AGENDA_DIET_NOTES_LABEL: "Diet / guidance",
    ADMIN_AGENDA_SAVE_CHANGES: "Save changes",
    ADMIN_AGENDA_CREATE_EVENT: "Create event",
    ADMIN_AGENDA_CANCEL: "Cancel",
    ADMIN_AGENDA_EVENTS_TITLE: "Events",
    ADMIN_AGENDA_SELECTED_STUDENT: "Selected student",
    ADMIN_AGENDA_GENERAL_SCHEDULE: "Showing general schedule",
    ADMIN_AGENDA_LOADING: "Loading...",
    ADMIN_AGENDA_EMPTY: "No events registered.",
    ADMIN_AGENDA_EDIT_BUTTON: "Edit",
    ADMIN_AGENDA_DELETE_BUTTON: "Delete",
    CLIENT_AGENDA_EVENTS: "events",
  },
  "it-IT": {
    ADMIN_AGENDA_LABEL: "Agenda",
    ADMIN_AGENDA_TITLE: "Agenda del Personal",
    ADMIN_AGENDA_SUBTITLE:
      "Calendario mensile, ricorrenza settimanale/mensile e presenza dello studente.",
    ADMIN_AGENDA_ERROR_LOAD: "Impossibile caricare l'agenda",
    ADMIN_AGENDA_REQUIRED_FIELDS:
      "Studente, titolo e orario di inizio sono obbligatori",
    ADMIN_AGENDA_EVENT_UPDATED: "Evento aggiornato con successo",
    ADMIN_AGENDA_EVENT_CREATED: "Evento creato con successo",
    ADMIN_AGENDA_SAVE_ERROR: "Errore nel salvataggio",
    ADMIN_AGENDA_CONFIRM_DELETE:
      "Eliminare questo evento dall'agenda?",
    ADMIN_AGENDA_EVENT_DELETED: "Evento rimosso",
    ADMIN_AGENDA_DELETE_ERROR: "Impossibile eliminare l'evento",
    ADMIN_AGENDA_EDIT_EVENT_TITLE: "Modifica evento",
    ADMIN_AGENDA_NEW_EVENT_TITLE: "Nuovo evento",
    ADMIN_AGENDA_STUDENT_LABEL: "Studente",
    ADMIN_AGENDA_SELECT_STUDENT: "Seleziona",
    ADMIN_AGENDA_TYPE_LABEL: "Tipo",
    ADMIN_AGENDA_TYPE_WORKOUT: "Allenamento",
    ADMIN_AGENDA_TYPE_DIET: "Dieta",
    ADMIN_AGENDA_TYPE_CONSULT: "Consulta",
    ADMIN_AGENDA_TYPE_CHECKIN: "Check-in",
    ADMIN_AGENDA_TYPE_OTHER: "Altro",
    ADMIN_AGENDA_ATTENDANCE_LABEL: "Presenza",
    ADMIN_AGENDA_STATUS_PENDING: "In attesa",
    ADMIN_AGENDA_STATUS_CONFIRMED: "Confermato",
    ADMIN_AGENDA_STATUS_MISSED: "Assente",
    ADMIN_AGENDA_TITLE_FIELD: "Titolo",
    ADMIN_AGENDA_DESCRIPTION_LABEL: "Descrizione",
    ADMIN_AGENDA_START_LABEL: "Inizio",
    ADMIN_AGENDA_END_LABEL: "Fine",
    ADMIN_AGENDA_RECURRENCE_LABEL: "Ricorrenza",
    ADMIN_AGENDA_RECURRENCE_NONE: "Non ripetere",
    ADMIN_AGENDA_RECURRENCE_WEEKLY: "Settimanale",
    ADMIN_AGENDA_RECURRENCE_MONTHLY: "Mensile",
    ADMIN_AGENDA_REPEAT_UNTIL: "Ripeti fino a",
    ADMIN_AGENDA_RELATED_WORKOUT: "Allenamento correlato",
    ADMIN_AGENDA_NO_WORKOUT: "Nessun allenamento collegato",
    ADMIN_AGENDA_DIET_NOTES_LABEL: "Dieta / indicazioni",
    ADMIN_AGENDA_SAVE_CHANGES: "Salva modifiche",
    ADMIN_AGENDA_CREATE_EVENT: "Crea evento",
    ADMIN_AGENDA_CANCEL: "Annulla",
    ADMIN_AGENDA_EVENTS_TITLE: "Eventi",
    ADMIN_AGENDA_SELECTED_STUDENT: "Studente selezionato",
    ADMIN_AGENDA_GENERAL_SCHEDULE:
      "Visualizzazione agenda generale",
    ADMIN_AGENDA_LOADING: "Caricamento...",
    ADMIN_AGENDA_EMPTY: "Nessun evento registrato.",
    ADMIN_AGENDA_EDIT_BUTTON: "Modifica",
    ADMIN_AGENDA_DELETE_BUTTON: "Elimina",
    CLIENT_AGENDA_EVENTS: "eventi",
  },
  "es-ES": {
    ADMIN_AGENDA_LABEL: "Agenda",
    ADMIN_AGENDA_TITLE: "Agenda del Personal",
    ADMIN_AGENDA_SUBTITLE:
      "Calendario mensual, recurrencia semanal/mensual y asistencia del alumno.",
    ADMIN_AGENDA_ERROR_LOAD: "No fue posible cargar la agenda",
    ADMIN_AGENDA_REQUIRED_FIELDS:
      "Alumno, titulo y hora de inicio son obligatorios",
    ADMIN_AGENDA_EVENT_UPDATED: "Evento actualizado con exito",
    ADMIN_AGENDA_EVENT_CREATED: "Evento creado con exito",
    ADMIN_AGENDA_SAVE_ERROR: "Error al guardar evento",
    ADMIN_AGENDA_CONFIRM_DELETE:
      "¿Eliminar este evento de la agenda?",
    ADMIN_AGENDA_EVENT_DELETED: "Evento eliminado",
    ADMIN_AGENDA_DELETE_ERROR: "No fue posible eliminar evento",
    ADMIN_AGENDA_EDIT_EVENT_TITLE: "Modifica evento",
    ADMIN_AGENDA_NEW_EVENT_TITLE: "Nuevo evento",
    ADMIN_AGENDA_STUDENT_LABEL: "Alumno",
    ADMIN_AGENDA_SELECT_STUDENT: "Seleccionar",
    ADMIN_AGENDA_TYPE_LABEL: "Tipo",
    ADMIN_AGENDA_TYPE_WORKOUT: "Entrenamiento",
    ADMIN_AGENDA_TYPE_DIET: "Dieta",
    ADMIN_AGENDA_TYPE_CONSULT: "Consulta",
    ADMIN_AGENDA_TYPE_CHECKIN: "Check-in",
    ADMIN_AGENDA_TYPE_OTHER: "Otro",
    ADMIN_AGENDA_ATTENDANCE_LABEL: "Asistencia",
    ADMIN_AGENDA_STATUS_PENDING: "Pendiente",
    ADMIN_AGENDA_STATUS_CONFIRMED: "Confermato",
    ADMIN_AGENDA_STATUS_MISSED: "Faltó",
    ADMIN_AGENDA_TITLE_FIELD: "Titulo",
    ADMIN_AGENDA_DESCRIPTION_LABEL: "Descripcion",
    ADMIN_AGENDA_START_LABEL: "Inizio",
    ADMIN_AGENDA_END_LABEL: "Fin",
    ADMIN_AGENDA_RECURRENCE_LABEL: "Recurrencia",
    ADMIN_AGENDA_RECURRENCE_NONE: "No repetir",
    ADMIN_AGENDA_RECURRENCE_WEEKLY: "Settimanale",
    ADMIN_AGENDA_RECURRENCE_MONTHLY: "Mensual",
    ADMIN_AGENDA_REPEAT_UNTIL: "Repetir hasta",
    ADMIN_AGENDA_RELATED_WORKOUT: "Entrenamiento relacionado",
    ADMIN_AGENDA_NO_WORKOUT: "Sin entrenamiento vinculado",
    ADMIN_AGENDA_DIET_NOTES_LABEL: "Dieta / orientaciones",
    ADMIN_AGENDA_SAVE_CHANGES: "Guardar cambios",
    ADMIN_AGENDA_CREATE_EVENT: "Crear evento",
    ADMIN_AGENDA_CANCEL: "Annulla",
    ADMIN_AGENDA_EVENTS_TITLE: "Eventi",
    ADMIN_AGENDA_SELECTED_STUDENT: "Alumno seleccionado",
    ADMIN_AGENDA_GENERAL_SCHEDULE: "Mostrando agenda general",
    ADMIN_AGENDA_LOADING: "Cargando...",
    ADMIN_AGENDA_EMPTY: "Ningun evento registrado.",
    ADMIN_AGENDA_EDIT_BUTTON: "Modifica",
    ADMIN_AGENDA_DELETE_BUTTON: "Eliminar",
    CLIENT_AGENDA_EVENTS: "eventos",
  },
};

function translateAdminAgenda(rawT, locale, key, fallback = "") {
  const remoteValue = rawT(key, "");
  const localValue =
    ADMIN_AGENDA_FALLBACKS[locale]?.[key] ||
    ADMIN_AGENDA_FALLBACKS[locale?.split("-")[0]]?.[key] ||
    ADMIN_AGENDA_FALLBACKS["it-IT"]?.[key];

  if (remoteValue && remoteValue !== key) {
    return remoteValue;
  }

  return localValue || fallback || key;
}

function eventTone(type) {
  if (type === "TREINO")
    return "border-[#b5f03c]/45 bg-[#b5f03c]/12 text-[#d4f7a0]";
  if (type === "DIETA")
    return "border-emerald-400/45 bg-emerald-500/12 text-emerald-200";
  if (type === "CONSULTA")
    return "border-sky-400/45 bg-sky-500/12 text-sky-200";
  if (type === "CHECKIN")
    return "border-violet-400/45 bg-violet-500/12 text-violet-200";
  return "border-white/20 bg-white/10 text-white/75";
}

function attendanceTone(status) {
  if (status === "CONFIRMADO")
    return "border-emerald-400/40 bg-emerald-500/15 text-emerald-200";
  if (status === "FALTOU")
    return "border-red-400/40 bg-red-500/15 text-red-200";
  return "border-amber-300/40 bg-amber-400/10 text-amber-100";
}

function toInputDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (v) => String(v).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

function formatDurationSeconds(durationSeconds) {
  const total = Math.max(0, Number(durationSeconds || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const WEEKDAY_SLOTS = [
  { key: "SUN", label: "Dom", dayIndex: 0 },
  { key: "MON", label: "Seg", dayIndex: 1 },
  { key: "TUE", label: "Ter", dayIndex: 2 },
  { key: "WED", label: "Qua", dayIndex: 3 },
  { key: "THU", label: "Qui", dayIndex: 4 },
  { key: "FRI", label: "Sex", dayIndex: 5 },
  { key: "SAT", label: "Sab", dayIndex: 6 },
];

function buildDateWithTime(baseDate, timeValue) {
  if (!timeValue || !String(timeValue).includes(":")) {
    return null;
  }

  const [hours, minutes] = String(timeValue).split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }

  const nextDate = new Date(baseDate);
  nextDate.setHours(hours, minutes, 0, 0);
  return nextDate;
}

function timeToMinutes(timeValue) {
  if (!timeValue || !String(timeValue).includes(":")) {
    return null;
  }

  const [hours, minutes] = String(timeValue).split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
}

export default function AdminAgendaPage() {
  const { t: rawT, locale } = useI18n();
  const t = useCallback(
    (key, fallback = "") => translateAdminAgenda(rawT, locale, key, fallback),
    [rawT, locale],
  );
  const { tenantId } = useTenant();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [workoutSessions, setWorkoutSessions] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [monthCursor, setMonthCursor] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [creatingGrid, setCreatingGrid] = useState(false);
  const [eventFilterStudenteId, setEventFilterStudenteId] = useState("");
  const [weeklyGrid, setWeeklyGrid] = useState(() =>
    WEEKDAY_SLOTS.reduce((acc, slot) => {
      acc[slot.key] = {
        enabled: false,
        startsAtTime: "07:00",
        endsAtTime: "08:00",
      };
      return acc;
    }, {}),
  );

  const [form, setForm] = useState({
    alunoId: "",
    title: "",
    description: "",
    type: "TREINO",
    startsAt: "",
    endsAt: "",
    workoutPlanId: "",
    dietNotes: "",
    recurrence: "NONE",
    recurrenceUntil: "",
    attendanceStatus: "PENDENTE",
  });

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === form.alunoId) || null,
    [students, form.alunoId],
  );

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(locale || "it-IT", {
        month: "long",
        year: "numeric",
      }).format(monthCursor),
    [monthCursor, locale],
  );

  const monthRange = useMemo(() => {
    const first = new Date(
      monthCursor.getFullYear(),
      monthCursor.getMonth(),
      1,
    );
    const last = new Date(
      monthCursor.getFullYear(),
      monthCursor.getMonth() + 1,
      0,
    );
    return { first, last };
  }, [monthCursor]);

  const calendarDays = useMemo(() => {
    const first = new Date(monthRange.first);
    const firstWeekDay = first.getDay();
    first.setDate(first.getDate() - firstWeekDay);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(first);
      d.setDate(first.getDate() + i);
      return d;
    });
  }, [monthRange]);

  const loadAllEvents = async () => {
    const fromDate = new Date(
      monthRange.first.getFullYear(),
      monthRange.first.getMonth(),
      1,
      0,
      0,
      0,
    );
    const toDate = new Date(
      monthRange.first.getFullYear(),
      monthRange.first.getMonth() + 1,
      31,
      23,
      59,
      59,
    );

    const filters = {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    };

    const eventsData = await listAgendaEvents(tenantId, filters);
    setEvents(Array.isArray(eventsData) ? eventsData : []);
  };

  const loadSessionsForStudent = async (alunoId) => {
    if (!alunoId) {
      setWorkoutSessions([]);
      return;
    }

    const sessionsData = await listWorkoutSessions(tenantId, {
      alunoId,
      from: new Date(
        monthRange.first.getFullYear(),
        monthRange.first.getMonth(),
        1,
        0,
        0,
        0,
      ).toISOString(),
      to: new Date(
        monthRange.first.getFullYear(),
        monthRange.first.getMonth() + 1,
        31,
        23,
        59,
        59,
      ).toISOString(),
    });
    setWorkoutSessions(Array.isArray(sessionsData) ? sessionsData : []);
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setMessage("");
      try {
        const allStudents = await listStudents(tenantId);
        if (cancelled) return;
        const normalizedStudents = Array.isArray(allStudents)
          ? allStudents
          : [];
        setStudents(normalizedStudents);

        const firstId = normalizedStudents[0]?.id || "";
        if (firstId) {
          setForm((prev) => ({ ...prev, alunoId: prev.alunoId || firstId }));
          const [allEvents, studentWorkouts, sessions] = await Promise.all([
            listAgendaEvents(tenantId, {
              from: new Date(
                monthRange.first.getFullYear(),
                monthRange.first.getMonth(),
                1,
                0,
                0,
                0,
              ).toISOString(),
              to: new Date(
                monthRange.first.getFullYear(),
                monthRange.first.getMonth() + 1,
                31,
                23,
                59,
                59,
              ).toISOString(),
            }),
            listWorkoutPlans(firstId, tenantId),
            listWorkoutSessions(tenantId, {
              alunoId: firstId,
              from: new Date(
                monthRange.first.getFullYear(),
                monthRange.first.getMonth(),
                1,
                0,
                0,
                0,
              ).toISOString(),
              to: new Date(
                monthRange.first.getFullYear(),
                monthRange.first.getMonth() + 1,
                31,
                23,
                59,
                59,
              ).toISOString(),
            }),
          ]);
          if (cancelled) return;
          setEvents(Array.isArray(allEvents) ? allEvents : []);
          setWorkouts(Array.isArray(studentWorkouts) ? studentWorkouts : []);
          setWorkoutSessions(Array.isArray(sessions) ? sessions : []);
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(
            error?.message ||
              t(
                "ADMIN_AGENDA_ERROR_LOAD",
                "Nao foi possivel carregar agenda",
              ),
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (tenantId) load();

    return () => {
      cancelled = true;
    };
  }, [tenantId]);

  useEffect(() => {
    if (!tenantId) return;
    loadAllEvents().catch(() => {});
    loadSessionsForStudent(form.alunoId).catch(() => {});
  }, [
    monthRange.first.getMonth(),
    monthRange.first.getFullYear(),
    form.alunoId,
  ]);

  useEffect(() => {
    let cancelled = false;

    const loadByStudent = async () => {
      if (!form.alunoId) {
        setWorkouts([]);
        return;
      }

      try {
        const [studentWorkouts, sessions] = await Promise.all([
          listWorkoutPlans(form.alunoId, tenantId),
          listWorkoutSessions(tenantId, {
            alunoId: form.alunoId,
            from: new Date(
              monthRange.first.getFullYear(),
              monthRange.first.getMonth(),
              1,
              0,
              0,
              0,
            ).toISOString(),
            to: new Date(
              monthRange.first.getFullYear(),
              monthRange.first.getMonth() + 1,
              31,
              23,
              59,
              59,
            ).toISOString(),
          }),
        ]);
        if (!cancelled) {
          setWorkouts(Array.isArray(studentWorkouts) ? studentWorkouts : []);
          setWorkoutSessions(Array.isArray(sessions) ? sessions : []);
        }
      } catch (_error) {
        if (!cancelled) {
          setWorkouts([]);
          setWorkoutSessions([]);
        }
      }
    };

    if (tenantId) loadByStudent();

    return () => {
      cancelled = true;
    };
  }, [form.alunoId, tenantId]);

  const resetForm = () => {
    setEditingId("");
    setForm((prev) => ({
      ...prev,
      title: "",
      description: "",
      startsAt: "",
      endsAt: "",
      workoutPlanId: "",
      dietNotes: "",
      type: "TREINO",
      recurrence: "NONE",
      recurrenceUntil: "",
      attendanceStatus: "PENDENTE",
    }));
  };

  const checkTimeConflicts = (startsAt, endsAt, excludeEventId = null) => {
    const start = new Date(startsAt);
    const end = endsAt ? new Date(endsAt) : new Date(start.getTime() + 3600000);

    const conflicts = events.filter((ev) => {
      if (excludeEventId && ev.id === excludeEventId) return false;

      const evStart = new Date(ev.startsAt);
      const evEnd = ev.endsAt
        ? new Date(ev.endsAt)
        : new Date(evStart.getTime() + 3600000);

      return !(end <= evStart || start >= evEnd);
    });

    return conflicts;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.alunoId || !form.title.trim() || !form.startsAt) {
      setMessage(
        t(
          "ADMIN_AGENDA_REQUIRED_FIELDS",
          "Studente, titulo e horario inicial sao obrigatorios",
        ),
      );
      return;
    }

    const conflicts = checkTimeConflicts(form.startsAt, form.endsAt, editingId);
    if (conflicts.length > 0) {
      const conflictNames = conflicts
        .map((c) => c.aluno?.fullName || c.title)
        .join(", ");
      setMessage(
        `Conflitto di orario. Esiste gia un allenamento programmato: ${conflictNames}`,
      );
      return;
    }

    const payload = {
      alunoId: form.alunoId,
      title: form.title.trim(),
      description: form.description || null,
      type: form.type,
      startsAt: form.startsAt,
      endsAt: form.endsAt || null,
      workoutPlanId: form.workoutPlanId || null,
      dietNotes: form.dietNotes || null,
      recurrence: form.recurrence,
      recurrenceUntil: form.recurrenceUntil || null,
      attendanceStatus: form.attendanceStatus,
    };

    try {
      if (editingId) {
        const updated = await updateAgendaEvent(editingId, payload, tenantId);
        setEvents((prev) =>
          prev.map((ev) => (ev.id === editingId ? updated : ev)),
        );
        setMessage(
          t(
            "ADMIN_AGENDA_EVENT_UPDATED",
            "Evento atualizado com sucesso",
          ),
        );
      } else {
        await createAgendaEvent(payload, tenantId);
        setMessage(
          t(
            "ADMIN_AGENDA_EVENT_CREATED",
            "Evento criado com sucesso",
          ),
        );
      }
      resetForm();
      await loadAllEvents();
      await loadSessionsForStudent(form.alunoId);
    } catch (error) {
      setMessage(
        error?.message ||
          t("ADMIN_AGENDA_SAVE_ERROR", "Errore nel salvataggio dell'evento"),
      );
    }
  };

  const handleWeeklyGridChange = (slotKey, field, value) => {
    setWeeklyGrid((current) => ({
      ...current,
      [slotKey]: {
        ...current[slotKey],
        [field]: value,
      },
    }));
  };

  const handleCreateMonthlyGrid = async () => {
    if (!form.alunoId || !form.title.trim()) {
      setMessage("Seleziona studente e titolo per generare la griglia.");
      return;
    }

    const enabledSlots = WEEKDAY_SLOTS.filter(
      (slot) => weeklyGrid[slot.key]?.enabled,
    );

    if (enabledSlots.length === 0) {
      setMessage("Seleziona almeno un giorno della settimana per generare la griglia.");
      return;
    }

    if (hasWeeklyGridConflicts) {
      setMessage(
        "Non e possibile creare la griglia: c e un conflitto di orario con un altro studente.",
      );
      return;
    }

    const fromDate = new Date(
      monthRange.first.getFullYear(),
      monthRange.first.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    const toDate = new Date(
      monthRange.first.getFullYear(),
      monthRange.first.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const eventsToCreate = [];

    for (
      let cursor = new Date(fromDate);
      cursor <= toDate;
      cursor.setDate(cursor.getDate() + 1)
    ) {
      const dayIndex = cursor.getDay();
      const daySlot = enabledSlots.find((slot) => slot.dayIndex === dayIndex);
      if (!daySlot) {
        continue;
      }

      const config = weeklyGrid[daySlot.key];
      const startsAt = buildDateWithTime(cursor, config?.startsAtTime);
      const endsAt = buildDateWithTime(cursor, config?.endsAtTime);

      if (!startsAt) {
        continue;
      }

      eventsToCreate.push({
        alunoId: form.alunoId,
        title: form.title.trim(),
        description: form.description || null,
        type: form.type,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt ? endsAt.toISOString() : null,
        workoutPlanId: form.workoutPlanId || null,
        dietNotes: form.dietNotes || null,
        recurrence: "NONE",
        recurrenceUntil: null,
        attendanceStatus: form.attendanceStatus,
      });
    }

    if (eventsToCreate.length === 0) {
      setMessage("Nessun orario valido trovato per creare la griglia.");
      return;
    }

    setCreatingGrid(true);
    let createdCount = 0;
    let conflictCount = 0;

    try {
      for (const payload of eventsToCreate) {
        try {
          await createAgendaEvent(payload, tenantId);
          createdCount += 1;
        } catch (error) {
          if (error?.status === 409) {
            conflictCount += 1;
            continue;
          }
          throw error;
        }
      }

      await loadAllEvents();
      await loadSessionsForStudent(form.alunoId);
      setMessage(
        `Griglia creata: ${createdCount} orari aggiunti${conflictCount ? `, ${conflictCount} in conflitto` : ""}.`,
      );
    } catch (error) {
      setMessage(
        error?.message || "Non e stato possibile creare la griglia oraria.",
      );
    } finally {
      setCreatingGrid(false);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setForm({
      alunoId: event.alunoId || "",
      title: event.title || "",
      description: event.description || "",
      type: event.type || "OUTRO",
      startsAt: toInputDateTime(event.startsAt),
      endsAt: toInputDateTime(event.endsAt),
      workoutPlanId: event.workoutPlanId || "",
      dietNotes: event.dietNotes || "",
      recurrence: event.recurrence || "NONE",
      recurrenceUntil: event.recurrenceUntil
        ? toInputDateTime(event.recurrenceUntil)
        : "",
      attendanceStatus: event.attendanceStatus || "PENDENTE",
    });
  };

  const handleToggleCompletion = async (event) => {
    const newStatus =
      event.attendanceStatus === "CONFIRMADO" ? "PENDENTE" : "CONFIRMADO";
    const payload = {
      ...event,
      attendanceStatus: newStatus,
    };

    try {
      const updated = await updateAgendaEvent(event.id, payload, tenantId);
      setEvents((prev) =>
        prev.map((ev) => (ev.id === event.id ? updated : ev)),
      );
    } catch (error) {
      setMessage(error?.message || "Errore nel segnare come completato.");
    }
  };

  const handleDelete = async (eventId) => {
    const ok = window.confirm(
      t(
        "ADMIN_AGENDA_CONFIRM_DELETE",
        "Eliminare questo evento dall'agenda?",
      ),
    );
    if (!ok) return;
    try {
      await deleteAgendaEvent(eventId, tenantId);
      setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
      setMessage(
        t("ADMIN_AGENDA_EVENT_DELETED", "Evento removido"),
      );
    } catch (error) {
      setMessage(
        error?.message ||
          t(
            "ADMIN_AGENDA_DELETE_ERROR",
            "Nao foi possivel excluir evento",
          ),
      );
    }
  };

  const handleReviewRequest = async (event, decision) => {
    try {
      const response = await reviewAgendaChangeRequest(
        event.id,
        decision,
        tenantId,
      );
      if (response?.deleted) {
        setEvents((prev) => prev.filter((ev) => ev.id !== event.id));
      } else if (response?.event) {
        setEvents((prev) =>
          prev.map((ev) => (ev.id === event.id ? response.event : ev)),
        );
      }
      setMessage(
        decision === "APPROVE"
          ? "Solicitacao aprovada com sucesso."
          : "Solicitacao recusada.",
      );
    } catch (error) {
      setMessage(error?.message || "Non e stato possibile revisionare la richiesta.");
    }
  };

  const eventsByDay = useMemo(() => {
    const map = new Map();
    events.forEach((event) => {
      const key = new Date(event.startsAt).toDateString();
      const arr = map.get(key) || [];
      arr.push(event);
      map.set(key, arr);
    });
    return map;
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!eventFilterStudenteId) {
      return events;
    }
    return events.filter((event) => event.alunoId === eventFilterStudenteId);
  }, [events, eventFilterStudenteId]);

  const filteredEventsByDay = useMemo(() => {
    const map = new Map();
    filteredEvents.forEach((event) => {
      const key = new Date(event.startsAt).toDateString();
      const arr = map.get(key) || [];
      arr.push(event);
      map.set(key, arr);
    });
    return map;
  }, [filteredEvents]);

  const sessionsByDay = useMemo(() => {
    const map = new Map();
    workoutSessions.forEach((session) => {
      const key = new Date(session.startedAt).toDateString();
      const arr = map.get(key) || [];
      arr.push(session);
      map.set(key, arr);
    });
    return map;
  }, [workoutSessions]);

  const selectedDaySessions = useMemo(() => {
    const key = selectedDay.toDateString();
    return sessionsByDay.get(key) || [];
  }, [selectedDay, sessionsByDay]);

  const weeklyGridConflicts = useMemo(() => {
    const conflictsMap = {};

    WEEKDAY_SLOTS.forEach((slot) => {
      const slotState = weeklyGrid[slot.key];
      if (!slotState?.enabled) {
        conflictsMap[slot.key] = { count: 0, names: [] };
        return;
      }

      const startMinutes = timeToMinutes(slotState.startsAtTime);
      const endMinutes =
        timeToMinutes(slotState.endsAtTime) ??
        (startMinutes !== null ? startMinutes + 60 : null);

      if (startMinutes === null) {
        conflictsMap[slot.key] = { count: 0, names: [] };
        return;
      }

      const overlapping = events.filter((event) => {
        if (event.alunoId === form.alunoId) {
          return false;
        }

        const eventStart = new Date(event.startsAt);
        const sameMonth =
          eventStart.getFullYear() === monthRange.first.getFullYear() &&
          eventStart.getMonth() === monthRange.first.getMonth();
        if (!sameMonth || eventStart.getDay() !== slot.dayIndex) {
          return false;
        }

        const eventStartMinutes =
          eventStart.getHours() * 60 + eventStart.getMinutes();
        const eventEndDate = event.endsAt ? new Date(event.endsAt) : null;
        const eventEndMinutes = eventEndDate
          ? eventEndDate.getHours() * 60 + eventEndDate.getMinutes()
          : eventStartMinutes + 60;

        return !(
          endMinutes <= eventStartMinutes || startMinutes >= eventEndMinutes
        );
      });

      const names = [
        ...new Set(
          overlapping.map((event) => event.aluno?.fullName || "Outro aluno"),
        ),
      ];

      conflictsMap[slot.key] = {
        count: overlapping.length,
        names,
      };
    });

    return conflictsMap;
  }, [weeklyGrid, events, form.alunoId, monthRange.first]);

  const hasWeeklyGridConflicts = useMemo(
    () =>
      WEEKDAY_SLOTS.some(
        (slot) => (weeklyGridConflicts[slot.key]?.count || 0) > 0,
      ),
    [weeklyGridConflicts],
  );

  return (
    <main className="space-y-6">
      <section className="rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(181,240,60,0.15),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">
              {t("ADMIN_AGENDA_LABEL", "Agenda")}
            </p>
            <h1 className="mt-2 font-title text-4xl text-[#d4f7a0]">
              {t("ADMIN_AGENDA_TITLE", "Agenda do Personal")}
            </h1>
            <p className="mt-3 text-sm text-white/68">
              {t(
                "ADMIN_AGENDA_SUBTITLE",
                "Calendario mensal, recorrencia semanal/mensal e presenca do aluno.",
              )}
            </p>
          </div>
          <CalendarDays className="text-[#b5f03c]" size={28} />
        </div>
      </section>

      {message ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
          {message}
        </div>
      ) : null}

      <section className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 md:p-6">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              setMonthCursor(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
              )
            }
            className="rounded-lg border border-white/15 p-2 text-white/70"
          >
            <ChevronLeft size={16} />
          </button>
          <h2 className="font-title text-2xl capitalize text-[#b5f03c]">
            {monthLabel}
          </h2>
          <button
            type="button"
            onClick={() =>
              setMonthCursor(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
              )
            }
            className="rounded-lg border border-white/15 p-2 text-white/70"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.08em] text-white/45">
          {[
            t("WEEKDAY_SUN", "Dom"),
            t("WEEKDAY_MON", "Seg"),
            t("WEEKDAY_TUE", "Ter"),
            t("WEEKDAY_WED", "Qua"),
            t("WEEKDAY_THU", "Qui"),
            t("WEEKDAY_FRI", "Sex"),
            t("WEEKDAY_SAT", "Sab"),
          ].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-2">
          {calendarDays.map((day) => {
            const key = day.toDateString();
            const dayEvents = filteredEventsByDay.get(key) || [];
            const daySessions = sessionsByDay.get(key) || [];
            const inMonth = day.getMonth() === monthRange.first.getMonth();
            return (
              <div
                key={key}
                onClick={() => setSelectedDay(day)}
                className={`min-h-28 rounded-xl border p-2 ${inMonth ? "border-white/15 bg-black/25" : "border-white/5 bg-black/10"}`}
              >
                <p
                  className={`text-xs ${inMonth ? "text-white/75" : "text-white/30"}`}
                >
                  {day.getDate()}
                </p>
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="rounded-md border border-white/10 bg-white/5 px-1.5 py-1 text-[10px] text-white/80 flex items-start gap-1"
                    >
                      <input
                        type="checkbox"
                        checked={event.attendanceStatus === "CONFIRMADO"}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleCompletion(event);
                        }}
                        className="h-3 w-3 cursor-pointer accent-[#b5f03c] mt-0.5 flex-shrink-0"
                        title="Segna come completato"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">
                          {new Date(event.startsAt).toLocaleTimeString(
                            locale || "it-IT",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                          {event.endsAt && (
                            <>
                              {" - "}
                              {new Date(event.endsAt).toLocaleTimeString(
                                locale || "it-IT",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </>
                          )}{" "}
                          {event.title}
                        </div>
                        <div className="text-[9px] text-white/60">
                          {event.aluno?.fullName || "Studente"}
                        </div>
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 3 ? (
                    <p className="text-[10px] text-white/55">
                      +{dayEvents.length - 3}{" "}
                      {t("CLIENT_AGENDA_EVENTS", "eventos")}
                    </p>
                  ) : null}
                  {daySessions.length > 0 ? (
                    <p className="text-[10px] text-emerald-200">
                      {daySessions.length} allenamento/i completato/i
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6">
        <h3 className="font-title text-lg text-[#b5f03c]">
          Filtra calendario per studente
        </h3>
        <div className="mt-4">
          <select
            value={eventFilterStudenteId}
            onChange={(e) => setEventFilterStudenteId(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          >
            <option value="">
              Tutti gli studenti (mostra tutti gli eventi)
            </option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                👤 {student.fullName}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <article className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6">
          <h2 className="font-title text-2xl text-[#b5f03c]">
            {editingId
              ? t(
                  "ADMIN_AGENDA_EDIT_EVENT_TITLE",
                  "Modifica evento",
                )
              : t("ADMIN_AGENDA_NEW_EVENT_TITLE", "Nuovo evento")}
          </h2>
          <form className="mt-5 space-y-4" onSubmit={handleSave}>
            <label className="block text-sm text-white/70">
              {t("ADMIN_AGENDA_STUDENT_LABEL", "Studente")}
              <select
                value={form.alunoId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, alunoId: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
              >
                <option value="">
                  {t("ADMIN_AGENDA_SELECT_STUDENT", "Seleziona")}
                </option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.fullName}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block text-sm text-white/70">
                {t("ADMIN_AGENDA_TYPE_LABEL", "Tipo")}
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
                >
                  <option value="TREINO">
                    {t("ADMIN_AGENDA_TYPE_WORKOUT", "Allenamento")}
                  </option>
                  <option value="DIETA">
                    {t("ADMIN_AGENDA_TYPE_DIET", "Dieta")}
                  </option>
                  <option value="CONSULTA">
                    {t("ADMIN_AGENDA_TYPE_CONSULT", "Consulta")}
                  </option>
                  <option value="CHECKIN">
                    {t("ADMIN_AGENDA_TYPE_CHECKIN", "Check-in")}
                  </option>
                  <option value="OUTRO">
                    {t("ADMIN_AGENDA_TYPE_OTHER", "Outro")}
                  </option>
                </select>
              </label>
              <label className="block text-sm text-white/70">
                {t("ADMIN_AGENDA_ATTENDANCE_LABEL", "Presenza")}
                <select
                  value={form.attendanceStatus}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      attendanceStatus: e.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
                >
                  <option value="PENDENTE">
                    {t(
                      "ADMIN_AGENDA_STATUS_PENDING",
                      "In attesa",
                    )}
                  </option>
                  <option value="CONFIRMADO">
                    {t(
                      "ADMIN_AGENDA_STATUS_CONFIRMED",
                      "Confermato",
                    )}
                  </option>
                  <option value="FALTOU">
                    {t("ADMIN_AGENDA_STATUS_MISSED", "Faltou")}
                  </option>
                </select>
              </label>
            </div>
            <label className="block text-sm text-white/70">
              {t("ADMIN_AGENDA_TITLE_FIELD", "Titulo")}
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
              />
            </label>
            <label className="block text-sm text-white/70">
              {t("ADMIN_AGENDA_DESCRIPTION_LABEL", "Descrizione")}
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
              />
            </label>

            {form.recurrence === "NONE" && (
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block text-sm text-white/70">
                  {t("ADMIN_AGENDA_START_LABEL", "Inizio")}
                  <input
                    type="datetime-local"
                    value={form.startsAt}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, startsAt: e.target.value }))
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
                  />
                </label>
                <label className="block text-sm text-white/70">
                  {t("ADMIN_AGENDA_END_LABEL", "Fim")}
                  <input
                    type="datetime-local"
                    value={form.endsAt}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, endsAt: e.target.value }))
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
                  />
                </label>
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              <label className="block text-sm text-white/70">
                {t(
                  "ADMIN_AGENDA_RECURRENCE_LABEL",
                  "Ricorrenza",
                )}
                <select
                  value={form.recurrence}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, recurrence: e.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
                >
                  <option value="NONE">
                    {t(
                      "ADMIN_AGENDA_RECURRENCE_NONE",
                      "Nao repetir",
                    )}
                  </option>
                  <option value="WEEKLY">
                    {t(
                      "ADMIN_AGENDA_RECURRENCE_WEEKLY",
                      "Settimanale",
                    )}
                  </option>
                  <option value="MONTHLY">
                    {t(
                      "ADMIN_AGENDA_RECURRENCE_MONTHLY",
                      "Mensile",
                    )}
                  </option>
                </select>
              </label>
              <label className="block text-sm text-white/70">
                {t("ADMIN_AGENDA_REPEAT_UNTIL", "Repetir ate")}
                <input
                  type="datetime-local"
                  value={form.recurrenceUntil}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      recurrenceUntil: e.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
                  disabled={form.recurrence === "NONE"}
                />
              </label>
            </div>

            {form.recurrence !== "NONE" && (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Griglia settimanale degli orari
                    </p>
                    <p className="text-xs text-white/55">
                      Seleziona giorni e orari per generare la griglia del mese
                      selecionado.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateMonthlyGrid}
                    disabled={creatingGrid || hasWeeklyGridConflicts}
                    className="rounded-xl border border-[#b5f03c]/50 bg-[#b5f03c]/10 px-4 py-2 text-sm font-semibold text-[#b5f03c] transition hover:bg-[#b5f03c]/20 disabled:opacity-50"
                  >
                    {creatingGrid ? "Generazione..." : "Crea griglia del mese"}
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  {WEEKDAY_SLOTS.map((slot) => {
                    const slotState = weeklyGrid[slot.key] || {
                      enabled: false,
                      startsAtTime: "07:00",
                      endsAtTime: "08:00",
                    };
                    const slotConflict = weeklyGridConflicts[slot.key] || {
                      count: 0,
                      names: [],
                    };
                    const hasConflict =
                      slotState.enabled && slotConflict.count > 0;

                    return (
                      <div
                        key={slot.key}
                        className={`grid grid-cols-[auto_1fr_1fr] items-center gap-3 rounded-xl border p-3 ${hasConflict ? "border-red-400/50 bg-red-500/10" : "border-white/10 bg-white/5"}`}
                      >
                        <label className="inline-flex items-center gap-2 text-sm text-white/75">
                          <input
                            type="checkbox"
                            checked={slotState.enabled}
                            onChange={(e) =>
                              handleWeeklyGridChange(
                                slot.key,
                                "enabled",
                                e.target.checked,
                              )
                            }
                          />
                          {slot.label}
                        </label>

                        <input
                          type="time"
                          value={slotState.startsAtTime}
                          disabled={!slotState.enabled}
                          onChange={(e) =>
                            handleWeeklyGridChange(
                              slot.key,
                              "startsAtTime",
                              e.target.value,
                            )
                          }
                          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none disabled:opacity-40"
                        />

                        <input
                          type="time"
                          value={slotState.endsAtTime}
                          disabled={!slotState.enabled}
                          onChange={(e) =>
                            handleWeeklyGridChange(
                              slot.key,
                              "endsAtTime",
                              e.target.value,
                            )
                          }
                          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none disabled:opacity-40"
                        />

                        {hasConflict ? (
                          <p className="col-span-3 text-xs text-red-300">
                            Conflitto: esiste gia un orario con{" "}
                            {slotConflict.names.join(", ")}.
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <label className="block text-sm text-white/70">
              {t(
                "ADMIN_AGENDA_RELATED_WORKOUT",
                "Allenamento collegato",
              )}
              <select
                value={form.workoutPlanId}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    workoutPlanId: e.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
              >
                <option value="">
                  {t(
                    "ADMIN_AGENDA_NO_WORKOUT",
                    "Nessun allenamento collegato",
                  )}
                </option>
                {workouts.map((workout) => (
                  <option key={workout.id} value={workout.id}>
                    {workout.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm text-white/70">
              {t(
                "ADMIN_AGENDA_DIET_NOTES_LABEL",
                "Dieta / orientacoes",
              )}
              <textarea
                rows={3}
                value={form.dietNotes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, dietNotes: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#b5f03c] px-5 py-3 font-semibold text-black"
              >
                <Save size={16} />
                {editingId
                  ? t(
                      "ADMIN_AGENDA_SAVE_CHANGES",
                      "Salva modifiche",
                    )
                  : t(
                      "ADMIN_AGENDA_CREATE_EVENT",
                      "Crea evento",
                    )}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/70"
                >
                  {t("ADMIN_AGENDA_CANCEL", "Annulla")}
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6">
          <h2 className="font-title text-2xl text-[#b5f03c]">
            Storico allenamento do dia (
            {selectedDay.toLocaleDateString(locale || "it-IT")})
          </h2>
          <div className="mt-4 space-y-3">
            {selectedDaySessions.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white/60">
                Nessun allenamento completato in questo giorno.
              </p>
            ) : (
              selectedDaySessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <p className="font-semibold text-white">
                    {session.workoutPlan?.title || "Allenamento"}
                  </p>
                  <p className="mt-1 text-sm text-white/60">
                    Duracao: {formatDurationSeconds(session.durationSeconds)}
                  </p>
                  <p className="text-xs text-white/45">
                    Inizio: {formatDateTime(session.startedAt)}
                  </p>
                  <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                    {(session.items || []).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75"
                      >
                        <p className="font-semibold text-white">
                          {item.exerciseName}
                        </p>
                        <p className="text-white/60">
                          Cargas: {item.loadNotes || "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6">
          <h2 className="font-title text-2xl text-[#b5f03c]">
            {t("ADMIN_AGENDA_EVENTS_TITLE", "Eventi")} (
            {filteredEvents.length})
          </h2>
          <div className="mt-5 space-y-3">
            {loading ? (
              <p className="text-sm text-white/60">
                {t("ADMIN_AGENDA_LOADING", "Caricamento...")}
              </p>
            ) : filteredEvents.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-black/30 px-4 py-5 text-sm text-white/65">
                {t(
                  "ADMIN_AGENDA_EMPTY",
                  "Nessun evento registrato.",
                )}
              </p>
            ) : (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <input
                          type="checkbox"
                          checked={event.attendanceStatus === "CONFIRMADO"}
                          onChange={() => handleToggleCompletion(event)}
                          className="h-5 w-5 cursor-pointer accent-[#b5f03c]"
                          title="Segna come completato"
                        />
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${eventTone(event.type)}`}
                        >
                          {event.type}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${attendanceTone(event.attendanceStatus)}`}
                        >
                          {event.attendanceStatus}
                        </span>
                        <p className="font-semibold text-white">
                          {event.title}
                        </p>
                      </div>
                      <p className="text-xs text-white/50 flex items-center gap-1">
                        <User size={12} className="text-white/30" />
                        {event.aluno?.fullName || "Studente sconosciuto"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(event)}
                        className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white"
                      >
                        {t("ADMIN_AGENDA_EDIT_BUTTON", "Modifica")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(event.id)}
                        className="rounded-lg border border-red-400/30 px-3 py-1 text-xs text-red-200"
                      >
                        {t(
                          "ADMIN_AGENDA_DELETE_BUTTON",
                          "Elimina",
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                    <div className="flex items-center gap-2 text-white/75">
                      <User size={14} className="text-white/45" />
                      <span>{event.aluno?.fullName || "Studente"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/75">
                      <Clock3 size={14} className="text-white/45" />
                      <span>
                        {formatDateTime(event.startsAt)}{" "}
                        {event.endsAt
                          ? `- ${formatDateTime(event.endsAt)}`
                          : ""}
                      </span>
                    </div>
                    {event.workoutPlan?.title ? (
                      <div className="flex items-center gap-2 text-white/75">
                        <Dumbbell size={14} className="text-white/45" />
                        <span>{event.workoutPlan.title}</span>
                      </div>
                    ) : null}
                    {event.dietNotes ? (
                      <div className="flex items-center gap-2 text-white/75">
                        <Salad size={14} className="text-white/45" />
                        <span>{event.dietNotes}</span>
                      </div>
                    ) : null}
                  </div>
                  {event.description ? (
                    <p className="mt-2 text-sm text-white/60">
                      {event.description}
                    </p>
                  ) : null}
                  {event.changeRequestStatus === "PENDING" ? (
                    <div className="mt-3 rounded-xl border border-amber-300/30 bg-amber-500/10 p-3">
                      <p className="text-xs font-semibold text-amber-200">
                        Solicitacao pendente do aluno:{" "}
                        {event.changeRequestType === "RESCHEDULE"
                          ? "Remarcacao"
                          : "Cancelamento"}
                      </p>
                      {event.proposedStartsAt ? (
                        <p className="mt-1 text-xs text-amber-100/85">
                          Nuovo orario proposto:{" "}
                          {formatDateTime(event.proposedStartsAt)}
                        </p>
                      ) : null}
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleReviewRequest(event, "APPROVE")}
                          className="rounded-lg border border-emerald-400/35 px-3 py-1.5 text-xs text-emerald-200"
                        >
                          Aprovar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReviewRequest(event, "REJECT")}
                          className="rounded-lg border border-red-400/35 px-3 py-1.5 text-xs text-red-200"
                        >
                          Recusar
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
