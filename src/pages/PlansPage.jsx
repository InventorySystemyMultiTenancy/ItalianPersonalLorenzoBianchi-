import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Crown, Loader2, ShieldCheck } from "lucide-react";
import RecurringSubscriptionForm from "../components/RecurringSubscriptionForm.jsx";
import {
  createStudentPlan,
  deleteStudentPlan,
  formatCurrency,
  listRecurringSubscriptionPlans,
  listStudentPlans,
  updateStudentPlan,
} from "../lib/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTenant } from "../contexts/TenantContext.jsx";
import { useI18n } from "../contexts/I18nContext.jsx";

const PLANS_PAGE_FALLBACKS = {
  "en-US": {
    PLANS_TITLE: "Public plans",
    PLANS_SUBTITLE:
      "Here you can browse plans created by the coach and subscribe to the best option when logged in as a student.",
    PLANS_LINK_OPEN_HOME: "Open home page",
    PLANS_LINK_CONTINUE: "Continue",
    PLANS_NEW_TITLE: "New plan",
    PLANS_NAME_LABEL: "Plan name",
    PLANS_PRICE_LABEL: "Monthly price (€)",
    PLANS_DESCRIPTION_LABEL: "Description",
    PLANS_DESCRIPTION_PLACEHOLDER:
      "Describe what is included in the plan",
    PLANS_ACTIVE_LABEL: "Active plan",
    PLANS_CREATE_BUTTON: "Create plan",
    PLANS_LOADING: "Loading plans...",
    PLANS_EMPTY:
      "No subscription plans were found for this tenant.",
    PLANS_PLAN_LABEL: "Plan",
    PLANS_PREMIUM_DESCRIPTION:
      "Premium plan with coach follow-up.",
    PLANS_PER_MONTH: "/month",
    PLANS_MONTHS: "months",
    PLANS_PER_DAY: "/day",
    PLANS_DAYS: "days",
    PLANS_PROTECTED_CONTRACT: "Protected contract",
    PLANS_CHECKOUT_PENDING:
      "Online checkout setup is still pending",
    PLANS_RECURRING_AUTOMATIC:
      "Automatic recurring card billing",
  },
  "it-IT": {
    PLANS_TITLE: "Piani pubblici",
    PLANS_SUBTITLE:
      "Qui puoi vedere i piani creati dal personal trainer e scegliere l'opzione migliore quando sei connesso come studente.",
    PLANS_LINK_OPEN_HOME: "Apri pagina iniziale",
    PLANS_LINK_CONTINUE: "Continua",
    PLANS_NEW_TITLE: "Nuovo piano",
    PLANS_NAME_LABEL: "Nome del piano",
    PLANS_PRICE_LABEL: "Prezzo mensile (€)",
    PLANS_DESCRIPTION_LABEL: "Descrizione",
    PLANS_DESCRIPTION_PLACEHOLDER:
      "Descrivi cosa include il piano",
    PLANS_ACTIVE_LABEL: "Piano attivo",
    PLANS_CREATE_BUTTON: "Crea piano",
    PLANS_LOADING: "Caricamento piani...",
    PLANS_EMPTY:
      "Nessun piano di abbonamento trovato per questo tenant.",
    PLANS_PLAN_LABEL: "Piano",
    PLANS_PREMIUM_DESCRIPTION:
      "Piano premium con supporto del personal trainer.",
    PLANS_PER_MONTH: "/mese",
    PLANS_MONTHS: "mesi",
    PLANS_PER_DAY: "/giorno",
    PLANS_DAYS: "giorni",
    PLANS_PROTECTED_CONTRACT: "Contratto protetto",
    PLANS_CHECKOUT_PENDING:
      "Configurazione checkout online in sospeso",
    PLANS_RECURRING_AUTOMATIC:
      "Pagamento ricorrente automatico con carta",
  },
  "es-ES": {
    PLANS_TITLE: "Planes publicos",
    PLANS_SUBTITLE:
      "Aqui puedes ver los planes creados por el entrenador y contratar la opcion ideal cuando inicies sesion como alumno.",
    PLANS_LINK_OPEN_HOME: "Abrir pagina inicial",
    PLANS_LINK_CONTINUE: "Continuar",
    PLANS_NEW_TITLE: "Nuevo plan",
    PLANS_NAME_LABEL: "Nombre del plan",
    PLANS_PRICE_LABEL: "Precio mensual (€)",
    PLANS_DESCRIPTION_LABEL: "Descripcion",
    PLANS_DESCRIPTION_PLACEHOLDER:
      "Describe lo que incluye el plan",
    PLANS_ACTIVE_LABEL: "Plan activo",
    PLANS_CREATE_BUTTON: "Crear plan",
    PLANS_LOADING: "Cargando planes...",
    PLANS_EMPTY:
      "No se encontraron planes de suscripcion para este tenant.",
    PLANS_PLAN_LABEL: "Plan",
    PLANS_PREMIUM_DESCRIPTION:
      "Plan premium con acompanamiento del entrenador.",
    PLANS_PER_MONTH: "/mes",
    PLANS_MONTHS: "meses",
    PLANS_PER_DAY: "/dia",
    PLANS_DAYS: "dias",
    PLANS_PROTECTED_CONTRACT: "Contrato protegido",
    PLANS_CHECKOUT_PENDING:
      "Configuracion de checkout online pendiente",
    PLANS_RECURRING_AUTOMATIC:
      "Cobro recurrente automatico en tarjeta",
  },
};

function translatePlanPage(rawT, locale, key, fallback = "") {
  const remoteValue = rawT(key, "");
  const localValue =
    PLANS_PAGE_FALLBACKS[locale]?.[key] ||
    PLANS_PAGE_FALLBACKS[locale?.split("-")[0]]?.[key] ||
    PLANS_PAGE_FALLBACKS["it-IT"]?.[key];
  const isLikelyUntranslated =
    locale !== "pt-BR" &&
    locale !== "pt-PT" &&
    (remoteValue === fallback || remoteValue === key);

  if (isLikelyUntranslated && localValue) {
    return localValue;
  }

  return remoteValue || localValue || fallback || key;
}

function PlanCard({ plan, onSelect, selected, actionLabel, t }) {
  const price = Number(
    plan.transactionAmount ?? Number(plan.monthlyPriceCents || 0) / 100,
  );
  const frequencyType = plan.frequencyType || "months";
  const frequency = Number(plan.frequency || 1);

  return (
    <article
      className={`flex h-full flex-col rounded-[1.75rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition ${
        selected
          ? "border-[#b5f03c]/70 ring-1 ring-[#b5f03c]/45"
          : "border-white/10"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/40">
            {t("PLANS_PLAN_LABEL", "Piano")}
          </p>
          <h3 className="mt-2 font-title text-2xl text-[#b5f03c]">
            {plan.name}
          </h3>
        </div>
        <div className="rounded-2xl border border-[#b5f03c]/30 bg-[#b5f03c]/10 p-3 text-[#b5f03c]">
          <Crown size={18} />
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-white/68">
        {plan.description ||
          t(
            "PLANS_PREMIUM_DESCRIPTION",
            "Piano premium com acompanhamento do personal.",
          )}
      </p>

      <div className="mt-6 flex items-end gap-2">
        <span className="font-title text-4xl text-white">
          {formatCurrency(price)}
        </span>
        <span className="pb-1 text-sm text-white/50">
          {frequencyType === "months"
            ? frequency === 1
              ? t("PLANS_PER_MONTH", "/mes")
              : `${t("PLANS_EVERY", "/")}${frequency} ${t("PLANS_MONTHS", "meses")}`
            : frequency === 1
              ? t("PLANS_PER_DAY", "/dia")
              : `${t("PLANS_EVERY", "/")}${frequency} ${t("PLANS_DAYS", "dias")}`}
        </span>
      </div>

      <div className="mt-6 space-y-3 text-sm text-white/70">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#b5f03c]" />
          {t("PLANS_PROTECTED_CONTRACT", "Contrato protegido")}
        </div>
        <div className="flex items-center gap-2">
          <Check size={16} className="text-[#b5f03c]" />
          {plan.isRecurringEnabled === false
            ? t(
                "PLANS_CHECKOUT_PENDING",
                "Checkout online pendente de configuracao",
              )
            : t(
                "PLANS_RECURRING_AUTOMATIC",
                "Cobranca recorrente automatica no cartao",
              )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSelect(plan)}
        className={`mt-6 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
          selected
            ? "bg-white text-black"
            : "bg-[#b5f03c] text-black hover:brightness-110"
        }`}
      >
        {actionLabel}
      </button>
    </article>
  );
}

export default function PlansPage({ mode = "public" }) {
  const { t: rawT, locale } = useI18n();
  const t = useCallback(
    (key, fallback = "") => translatePlanPage(rawT, locale, key, fallback),
    [rawT, locale],
  );
  const { tenantId } = useTenant();
  const { user, isClient } = useAuth();
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    monthlyPrice: "",
    isActive: true,
  });

  const isAdminMode = mode === "admin";
  const recurringPersonalId =
    user?.personalId || tenantId || import.meta.env.VITE_PERSONAL_ID;

  useEffect(() => {
    let cancelled = false;

    const loadPlans = async () => {
      setLoading(true);
      setMessage("");

      try {
        const items = isAdminMode
          ? await listStudentPlans(tenantId)
          : await listRecurringSubscriptionPlans(recurringPersonalId, tenantId);
        if (!cancelled) {
          setPlans(Array.isArray(items) ? items : []);
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(
            error?.message ||
              t(
                "PLANS_ERROR_LOAD",
                "Non e stato possibile caricare i piani",
              ),
          );
          setPlans([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (tenantId) {
      loadPlans();
    }

    return () => {
      cancelled = true;
    };
  }, [tenantId, isAdminMode, recurringPersonalId]);

  const actionLabel = useMemo(() => {
    if (isAdminMode)
      return t("PLANS_ACTION_MANAGE", "Gerenciar plano");
    if (isClient && user?.role === "ALUNO")
      return t("PLANS_ACTION_SELECT", "Seleziona piano");
    return t(
      "PLANS_ACTION_CREATE_ACCOUNT",
      "Crea account per abbonarti",
    );
  }, [isAdminMode, isClient, user?.role, t]);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) || null,
    [plans, selectedPlanId],
  );

  const resetForm = () => {
    setEditingPlanId("");
    setForm({
      name: "",
      description: "",
      monthlyPrice: "",
      isActive: true,
    });
  };

  const handleSelect = (plan) => {
    if (isAdminMode) {
      setEditingPlanId(plan.id);
      setForm({
        name: plan.name || "",
        description: plan.description || "",
        monthlyPrice: String(Number(plan.monthlyPriceCents || 0) / 100),
        isActive: plan.isActive !== false,
      });
      setMessage(`Editando plano: ${plan.name}`);
      return;
    }

    if (!user || user.role !== "ALUNO") {
      setMessage(
        t(
          "PLANS_MESSAGE_LOGIN_REQUIRED",
          "Crie uma conta ou faca login como aluno para contratar.",
        ),
      );
      return;
    }

    setSelectedPlanId(plan.id);
    setMessage(
      `${t("PLANS_MESSAGE_PLAN_SELECTED", "Piano")} ${plan.name} ${t("PLANS_MESSAGE_FILL_CARD", "selezionato. Inserisci i dati della carta per completare l'abbonamento.")}`,
    );
  };

  const handleAdminSave = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.monthlyPrice) {
      setMessage(
        t(
          "PLANS_MESSAGE_REQUIRED_FIELDS",
          "Nome e preco mensal sao obrigatorios",
        ),
      );
      return;
    }

    const monthlyPriceNumber = Number(form.monthlyPrice);
    if (!Number.isFinite(monthlyPriceNumber) || monthlyPriceNumber <= 0) {
      setMessage(
        t(
          "PLANS_MESSAGE_INVALID_PRICE",
          "Prezzo mensile non valido",
        ),
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        monthlyPriceCents: Math.round(monthlyPriceNumber * 100),
        isActive: form.isActive,
      };

      if (editingPlanId) {
        const updated = await updateStudentPlan(
          editingPlanId,
          payload,
          tenantId,
        );
        setPlans((prev) =>
          prev.map((plan) => (plan.id === editingPlanId ? updated : plan)),
        );
        setMessage(
          t(
            "PLANS_MESSAGE_UPDATED_SUCCESS",
            "Piano aggiornato con successo",
          ),
        );
      } else {
        const created = await createStudentPlan(payload, tenantId);
        setPlans((prev) => [created, ...prev]);
        setMessage(
          t(
            "PLANS_MESSAGE_CREATED_SUCCESS",
            "Piano creato con successo",
          ),
        );
      }

      resetForm();
    } catch (error) {
      setMessage(
        error?.message ||
          t(
            "PLANS_MESSAGE_SAVE_ERROR",
            "Non e stato possibile salvare il piano",
          ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAdminDelete = async () => {
    if (!editingPlanId) return;

    const confirmed = window.confirm(
      t(
        "PLANS_CONFIRM_DELETE",
        "Tem certeza que deseja excluir este plano? Esta acao nao pode ser desfeita.",
      ),
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      await deleteStudentPlan(editingPlanId, tenantId);
      setPlans((prev) => prev.filter((plan) => plan.id !== editingPlanId));
      setMessage(
        t(
          "PLANS_MESSAGE_DELETED_SUCCESS",
          "Piano eliminato con successo",
        ),
      );
      resetForm();
    } catch (error) {
      setMessage(
        error?.message ||
          t(
            "PLANS_MESSAGE_DELETE_ERROR",
            "Non e stato possibile eliminare il piano",
          ),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="space-y-6">
      <section className="rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(181,240,60,0.2),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mt-2 font-title text-4xl text-[#d4f7a0]">
              {t("PLANS_TITLE", "Piani pubblici")}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
              {t(
                "PLANS_SUBTITLE",
                "Aqui voce ve os planos criados pelo personal e pode contratar a opcao ideal quando estiver logado como aluno.",
              )}
            </p>
          </div>
          {/* Tenant detected via subdomínio — não exibir campo editável */}
        </div>

        {tenantId ? (
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/70">
            <Link
              to={`/`}
              className="rounded-full border border-white/10 px-4 py-2 transition hover:border-[#b5f03c]/50 hover:text-white"
            >
              {t("PLANS_LINK_OPEN_HOME", "Abrir pagina inicial")}
            </Link>
            <Link
              to={user?.role === "ALUNO" ? "/cliente" : "/login"}
              className="rounded-full bg-[#b5f03c] px-4 py-2 font-semibold text-black transition hover:brightness-110"
            >
              {t("PLANS_LINK_CONTINUE", "Continuar")}
            </Link>
          </div>
        ) : null}
      </section>

      {message ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          {message}
        </div>
      ) : null}

      {isAdminMode ? (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-title text-2xl text-[#d4f7a0]">
              {editingPlanId
                ? t("PLANS_EDIT_TITLE", "Modifica piano")
                : t("PLANS_NEW_TITLE", "Nuovo piano")}
            </h2>
            {editingPlanId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/70"
              >
                {t("PLANS_CANCEL_EDIT", "Annulla edicao")}
              </button>
            ) : null}
          </div>

          <form
            className="mt-4 grid gap-3 md:grid-cols-2"
            onSubmit={handleAdminSave}
          >
            <label className="text-sm text-white/70 md:col-span-1">
              {t("PLANS_NAME_LABEL", "Nome del piano")}
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2 text-white outline-none"
                placeholder={t(
                  "PLANS_NAME_PLACEHOLDER",
                  "Es: Piano Premium",
                )}
              />
            </label>

            <label className="text-sm text-white/70 md:col-span-1">
              {t("PLANS_PRICE_LABEL", "Prezzo mensile (€)")}
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.monthlyPrice}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, monthlyPrice: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2 text-white outline-none"
                placeholder="99.90"
              />
            </label>

            <label className="text-sm text-white/70 md:col-span-2">
              {t("PLANS_DESCRIPTION_LABEL", "Descrizione")}
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2 text-white outline-none"
                placeholder={t(
                  "PLANS_DESCRIPTION_PLACEHOLDER",
                  "Descreva o que inclui no plano",
                )}
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-white/75 md:col-span-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
              />
              {t("PLANS_ACTIVE_LABEL", "Piano attivo")}
            </label>

            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-[#b5f03c] px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
                >
                  {saving
                    ? t("PLANS_SAVING", "Salvataggio...")
                    : editingPlanId
                      ? t(
                          "PLANS_SAVE_CHANGES",
                          "Salva modifiche",
                        )
                      : t("PLANS_CREATE_BUTTON", "Crea piano")}
                </button>

                {editingPlanId ? (
                  <button
                    type="button"
                    onClick={handleAdminDelete}
                    disabled={saving}
                    className="rounded-2xl border border-red-400/45 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
                  >
                    {t("PLANS_DELETE_BUTTON", "Elimina piano")}
                  </button>
                ) : null}
              </div>
            </div>
          </form>
        </section>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-white/65">
          <Loader2 className="animate-spin text-[#b5f03c]" size={18} />
          {t("PLANS_LOADING", "Caricamento piani...")}
        </div>
      ) : null}

      {!loading && plans.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-sm text-white/65">
          {t(
            "PLANS_EMPTY",
            "Nessun piano di abbonamento trovato per questo tenant.",
          )}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSelect={handleSelect}
            selected={selectedPlanId === plan.id}
            actionLabel={actionLabel}
            t={t}
          />
        ))}
      </section>

      {!isAdminMode && user?.role === "ALUNO" && selectedPlan ? (
        <RecurringSubscriptionForm
          key={selectedPlan.id}
          plan={selectedPlan}
          personalId={recurringPersonalId}
          onSuccess={() => {
            setMessage(
              `${t("PLANS_SUBSCRIPTION_SUCCESS_PREFIX", "Abbonamento al piano")} ${selectedPlan.name} ${t("PLANS_SUBSCRIPTION_SUCCESS_SUFFIX", "creato con successo.")}`,
            );
          }}
        />
      ) : null}

      {!isAdminMode && (!user || user.role !== "ALUNO") ? (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
          {t(
            "PLANS_CHECKOUT_HINT",
            "O checkout recorrente fica disponivel apos o login do aluno. Se ainda nao tiver conta, faca seu cadastro vinculado ao tenant e volte para escolher o plano.",
          )}
        </section>
      ) : null}
    </main>
  );
}
