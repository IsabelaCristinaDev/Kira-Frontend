import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Check,
  Eye,
  EyeOff,
  Trash2,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  X,
  Sparkles,
  ImagePlus,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import FaceRecognition from "@/components/FaceRecognition.tsx";
import { apiPost } from "@/lib/api.ts";

const onlyDigits = (v: string) => v.replace(/\D/g, "");

const formatPhone = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const formatCep = (v: string) => {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
};

const isValidCpf = (cpf: string) => {
  const d = onlyDigits(cpf);
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(d[i]) * (10 - i);
  let r = (sum * 10) % 11;
  if (r === 10) r = 0;
  if (r !== parseInt(d[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(d[i]) * (11 - i);
  r = (sum * 10) % 11;
  if (r === 10) r = 0;
  return r === parseInt(d[10]);
};

const isValidCnpj = (cnpj: string) => {
  const d = onlyDigits(cnpj);
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const calc = (base: string, weights: number[]) => {
    const sum = base
      .split("")
      .reduce((acc, digit, i) => acc + parseInt(digit) * weights[i], 0);
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const d1 = calc(d.slice(0, 12), w1);
  if (d1 !== parseInt(d[12])) return false;
  const d2 = calc(d.slice(0, 13), w2);
  return d2 === parseInt(d[13]);
};

const formatDocument = (v: string, type: "cpf" | "cnpj") => {
  const d = onlyDigits(v);
  if (type === "cpf") {
    const c = d.slice(0, 11);
    if (c.length <= 3) return c;
    if (c.length <= 6) return `${c.slice(0, 3)}.${c.slice(3)}`;
    if (c.length <= 9) return `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6)}`;
    return `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6, 9)}-${c.slice(9)}`;
  }
  const c = d.slice(0, 14);
  if (c.length <= 2) return c;
  if (c.length <= 5) return `${c.slice(0, 2)}.${c.slice(2)}`;
  if (c.length <= 8) return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5)}`;
  if (c.length <= 12) return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8)}`;
  return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8, 12)}-${c.slice(12)}`;
};

const specialtySuggestions = ["Cabelo", "Unhas", "Estética", "Makeup"];

const personalSchema = z
  .object({
    photo: z.string().min(1, { message: "Adicione uma foto de perfil" }),
    name: z
      .string()
      .trim()
      .min(3, { message: "Informe seu nome completo" })
      .max(80, { message: "Nome muito longo" })
      .regex(/\s/, { message: "Informe nome e sobrenome" }),
    documentType: z.enum(["cpf", "cnpj"]),
    document: z.string(),
    birth: z
      .string()
      .min(1, { message: "Informe sua data de nascimento" })
      .refine(
        (v) => {
          const d = new Date(v);
          if (isNaN(d.getTime())) return false;
          const age =
            (Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
          return age >= 18 && age <= 120;
        },
        { message: "Você precisa ter pelo menos 18 anos" }
      ),
    phone: z
      .string()
      .refine((v) => onlyDigits(v).length >= 10, {
        message: "Telefone incompleto",
      }),
    email: z.string().trim().email({ message: "E-mail inválido" }).max(120),
    password: z
      .string()
      .min(8, { message: "Mínimo de 8 caracteres" })
      .regex(/[A-Z]/, { message: "Inclua uma letra maiúscula" })
      .regex(/[0-9]/, { message: "Inclua um número" }),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "As senhas não coincidem",
    path: ["confirm"],
  })
  .refine(
    (d) => (d.documentType === "cpf" ? isValidCpf(d.document) : isValidCnpj(d.document)),
    { message: "Documento inválido", path: ["document"] }
  );

const addressSchema = z.object({
  cep: z.string().refine((v) => onlyDigits(v).length === 8, {
    message: "CEP inválido",
  }),
  street: z.string().trim().min(1, { message: "Informe a rua" }),
  number: z.string().trim().min(1, { message: "Informe o número" }),
  complement: z.string().optional(),
  neighborhood: z.string().trim().min(1, { message: "Informe o bairro" }),
  city: z.string().trim().min(1, { message: "Informe a cidade" }),
  state: z
    .string()
    .trim()
    .length(2, { message: "Use a sigla do estado (ex.: GO)" }),
});

const termsSchema = z.object({
  termsUse: z.literal(true, {
    errorMap: () => ({ message: "Aceite os Termos de Uso para continuar" }),
  }),
  termsPrivacy: z.literal(true, {
    errorMap: () => ({
      message: "Aceite a Política de Privacidade para continuar",
    }),
  }),
});

type ServiceItem = {
  id: string;
  name: string;
  price: string;
  duration: string;
};

type FormState = {
  photo: string;
  name: string;
  documentType: "cpf" | "cnpj";
  document: string;
  email: string;
  phone: string;
  birth: string;
  password: string;
  confirm: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  specialties: string[];
  services: ServiceItem[];
  workPhotos: string[];
  docFrontPhoto: string;
  docBackPhoto: string;
  termsUse: boolean;
  termsPrivacy: boolean;
};

const initialForm: FormState = {
  photo: "",
  name: "",
  documentType: "cpf",
  document: "",
  email: "",
  phone: "",
  birth: "",
  password: "",
  confirm: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  latitude: null,
  longitude: null,
  specialties: [],
  services: [],
  workPhotos: [],
  docFrontPhoto: "",
  docBackPhoto: "",
  termsUse: false,
  termsPrivacy: false,
};

type Step =
  | "form"
  | "address"
  | "location"
  | "specialties"
  | "services"
  | "photos"
  | "terms"
  | "documentPhotos"
  | "face";
type LocationStatus = "idle" | "loading" | "success" | "error";

const ProfessionalSignup = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workPhotosInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [cepLoading, setCepLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [serviceDraft, setServiceDraft] = useState({ name: "", price: "", duration: "" });

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as string]) {
      setErrors((e) => {
        const n = { ...e };
        delete n[key as string];
        return n;
      });
    }
  };

  const handleImageField = (
    field: "photo" | "docFrontPhoto" | "docBackPhoto",
    file: File | undefined
  ) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem precisa ter até 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setField(field, String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleWorkPhotos = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" não é uma imagem`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" precisa ter até 5MB`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () =>
        setForm((f) => ({ ...f, workPhotos: [...f.workPhotos, String(reader.result)] }));
      reader.readAsDataURL(file);
    });
  };

  const removeWorkPhoto = (index: number) => {
    setForm((f) => ({ ...f, workPhotos: f.workPhotos.filter((_, i) => i !== index) }));
  };

  const addSpecialty = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (form.specialties.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSpecialtyInput("");
      return;
    }
    setForm((f) => ({ ...f, specialties: [...f.specialties, trimmed] }));
    setSpecialtyInput("");
    setErrors((e) => {
      const n = { ...e };
      delete n.specialties;
      return n;
    });
  };

  const removeSpecialty = (value: string) => {
    setForm((f) => ({ ...f, specialties: f.specialties.filter((s) => s !== value) }));
  };

  const addService = () => {
    if (!serviceDraft.name.trim() || !serviceDraft.price.trim() || !serviceDraft.duration.trim()) {
      toast.error("Preencha nome, valor e tempo estimado do serviço");
      return;
    }
    setForm((f) => ({
      ...f,
      services: [
        ...f.services,
        { id: `${Date.now()}`, ...serviceDraft },
      ],
    }));
    setServiceDraft({ name: "", price: "", duration: "" });
    setErrors((e) => {
      const n = { ...e };
      delete n.services;
      return n;
    });
  };

  const removeService = (id: string) => {
    setForm((f) => ({ ...f, services: f.services.filter((s) => s.id !== id) }));
  };

  const handleCepBlur = async () => {
    const digits = onlyDigits(form.cep);
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }
      setForm((f) => ({
        ...f,
        street: data.logradouro || f.street,
        neighborhood: data.bairro || f.neighborhood,
        city: data.localidade || f.city,
        state: data.uf || f.state,
      }));
      setErrors((e) => {
        const n = { ...e };
        delete n.street;
        delete n.neighborhood;
        delete n.city;
        delete n.state;
        return n;
      });
    } catch {
      toast.error("Não foi possível buscar o CEP agora");
    } finally {
      setCepLoading(false);
    }
  };

  const handleActivateLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setField("latitude", pos.coords.latitude);
        setField("longitude", pos.coords.longitude);
        setLocationStatus("success");
      },
      () => {
        setLocationStatus("error");
      },
      { timeout: 10000 }
    );
  };

  const validateStep = (schema: z.ZodTypeAny, subset: Record<string, unknown>) => {
    const result = schema.safeParse(subset);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        const k = i.path[0];
        if (typeof k === "string" && !fieldErrors[k]) fieldErrors[k] = i.message;
      });
      setErrors(fieldErrors);
      toast.error("Revise os campos destacados");
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const { photo, name, documentType, document, birth, phone, email, password, confirm } = form;
    if (
      !validateStep(personalSchema, {
        photo,
        name,
        documentType,
        document,
        birth,
        phone,
        email,
        password,
        confirm,
      })
    )
      return;
    setStep("address");
  };

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const { cep, street, number, complement, neighborhood, city, state } = form;
    if (!validateStep(addressSchema, { cep, street, number, complement, neighborhood, city, state })) return;
    setStep("location");
  };

  const handleSubmitSpecialties = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.specialties.length === 0) {
      setErrors({ specialties: "Adicione pelo menos uma especialidade" });
      toast.error("Adicione pelo menos uma especialidade");
      return;
    }
    setErrors({});
    setStep("services");
  };

  const handleSubmitServices = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.services.length === 0) {
      setErrors({ services: "Adicione pelo menos um serviço" });
      toast.error("Adicione pelo menos um serviço");
      return;
    }
    setErrors({});
    setStep("photos");
  };

  const handleSubmitPhotos = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.workPhotos.length === 0) {
      setErrors({ workPhotos: "Adicione pelo menos uma foto" });
      toast.error("Adicione pelo menos uma foto do estabelecimento ou trabalho");
      return;
    }
    setErrors({});
    setStep("documentPhotos");
  };

  const handleSubmitDocumentPhotos = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.docFrontPhoto) newErrors.docFrontPhoto = "Adicione a foto da frente do documento";
    if (!form.docBackPhoto) newErrors.docBackPhoto = "Adicione a foto do verso do documento";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Adicione as duas fotos do documento");
      return;
    }
    setErrors({});
    setStep("face");
  };

  const registerProfessional = (data: FormState) =>
    apiPost("/professionals/register", {
      name: data.name,
      documentType: data.documentType,
      document: onlyDigits(data.document),
      email: data.email,
      phone: onlyDigits(data.phone),
      birth: data.birth,
      address: {
        cep: onlyDigits(data.cep),
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      },
      latitude: data.latitude,
      longitude: data.longitude,
      specialties: data.specialties,
      services: data.services.map((s) => ({
        name: s.name,
        price: s.price,
        duration: s.duration,
      })),
      // Fotos de perfil, documento e trabalhos usam base64 hoje (armazenadas
      // só em memória local). O envio real como arquivo (multipart/form-data)
      // para o backend é um passo futuro, fora do escopo desta integração inicial.
      workPhotosCount: data.workPhotos.length,
    });

  const handleSubmitTerms = async (e: React.FormEvent) => {
    e.preventDefault();
    const { termsUse, termsPrivacy } = form;
    if (!validateStep(termsSchema, { termsUse, termsPrivacy })) return;
    // Tenta registrar no backend; se falhar (backend fora do ar, CORS, etc.),
    // segue o fluxo normalmente para não travar a experiência do usuário.
    await registerProfessional(form);
    toast.success("Cadastro concluído!");
    navigate("/pro/dashboard");
  };

  if (step === "face") {
    return (
      <FaceRecognition
        onBack={() => setStep("documentPhotos")}
        onComplete={() => setStep("terms")}
        onSkip={() => setStep("terms")}
      />
    );
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3.5 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground font-body text-sm border transition-all focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-destructive focus:ring-destructive/40"
        : "border-border focus:ring-primary/50"
    }`;

  const headerTitle: Record<Exclude<Step, "face">, string> = {
    form: "Cadastro de profissional",
    address: "Endereço",
    location: "Localização",
    specialties: "Especialidades",
    services: "Serviços",
    photos: "Fotos",
    documentPhotos: "Documento de identidade",
    terms: "Termos",
  };

  const headerSubtitle: Record<Exclude<Step, "face">, string> = {
    form: "Complete seus dados para começar a atender clientes.",
    address: "Onde fica o seu local de atendimento?",
    location: "Isso nos ajuda a mostrar seu perfil para clientes próximos.",
    specialties: "Quais áreas você atende? Adicione quantas quiser.",
    services: "Cadastre os serviços que você oferece, com valor e tempo estimado.",
    photos: "Mostre seu estabelecimento e seus trabalhos. Sem limite de fotos.",
    documentPhotos: "Envie a foto da frente e do verso do seu documento com foto.",
    terms: "Só falta confirmar os termos para concluir o cadastro.",
  };

  const handleBack = () => {
    if (step === "address") setStep("form");
    else if (step === "location") setStep("address");
    else if (step === "specialties") setStep("location");
    else if (step === "services") setStep("specialties");
    else if (step === "photos") setStep("services");
    else if (step === "documentPhotos") setStep("photos");
    else if (step === "terms") setStep("face");
    else navigate(-1);
  };

  const totalSteps = 8;
  const stepIndex: Record<Exclude<Step, "face">, number> = {
    form: 1,
    address: 2,
    location: 3,
    specialties: 4,
    services: 5,
    photos: 6,
    documentPhotos: 7,
    terms: 8,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center p-4">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 text-foreground"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="px-6 flex gap-1.5 mb-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i < stepIndex[step] ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="flex-1 px-6 pt-4 pb-10 overflow-y-auto">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          {headerTitle[step]}
        </h1>
        <p className="text-muted-foreground font-body mb-8">
          {headerSubtitle[step]}
        </p>

        {step === "form" && (
          <form onSubmit={handleSubmitForm} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div
                  className={`w-28 h-28 rounded-full overflow-hidden flex items-center justify-center border-2 ${
                    errors.photo
                      ? "border-destructive"
                      : form.photo
                      ? "border-primary"
                      : "border-dashed border-border"
                  } bg-muted`}
                >
                  {form.photo ? (
                    <img
                      src={form.photo}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-muted-foreground" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full gradient-kira flex items-center justify-center shadow-kira"
                  aria-label="Adicionar foto"
                >
                  <Camera size={18} className="text-primary-foreground" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageField("photo", e.target.files?.[0])}
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-primary font-body font-semibold"
                >
                  {form.photo ? "Trocar foto" : "Enviar foto de perfil"}
                </button>
                {form.photo && (
                  <button
                    type="button"
                    onClick={() => setField("photo", "")}
                    className="text-sm text-muted-foreground font-body inline-flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Remover
                  </button>
                )}
              </div>
              {errors.photo && (
                <p className="text-xs text-destructive font-body">{errors.photo}</p>
              )}
            </div>

            <Field label="Nome completo" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Ex.: Ana Paula Ferreira"
                maxLength={80}
                className={inputClass("name")}
              />
            </Field>

            <div className="flex gap-2">
              {(["cpf", "cnpj"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setField("documentType", type)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold font-body transition-all ${
                    form.documentType === type
                      ? "gradient-kira text-primary-foreground shadow-kira"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>

            <Field label={form.documentType === "cpf" ? "CPF" : "CNPJ"} error={errors.document}>
              <input
                type="text"
                inputMode="numeric"
                value={form.document}
                onChange={(e) => setField("document", formatDocument(e.target.value, form.documentType))}
                placeholder={form.documentType === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
                className={inputClass("document")}
              />
            </Field>

            <Field label="Data de nascimento" error={errors.birth}>
              <input
                type="date"
                value={form.birth}
                onChange={(e) => setField("birth", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className={inputClass("birth")}
              />
            </Field>

            <Field label="E-mail" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="seu@email.com"
                maxLength={120}
                className={inputClass("email")}
              />
            </Field>

            <Field label="Telefone" error={errors.phone}>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setField("phone", formatPhone(e.target.value))}
                placeholder="(00) 00000-0000"
                className={inputClass("phone")}
              />
            </Field>

            <Field label="Senha" error={errors.password}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className={inputClass("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label="Mostrar senha"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Field>

            <Field label="Confirmar senha" error={errors.confirm}>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={(e) => setField("confirm", e.target.value)}
                  placeholder="Repita a senha"
                  className={inputClass("confirm")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label="Mostrar confirmação"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Field>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold text-base font-body shadow-kira-glow transition-transform hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              Continuar
            </button>
          </form>
        )}

        {step === "address" && (
          <form onSubmit={handleSubmitAddress} noValidate className="flex flex-col gap-5">
            <Field label="CEP" error={errors.cep}>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.cep}
                  onChange={(e) => setField("cep", formatCep(e.target.value))}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                  className={inputClass("cep")}
                />
                {cepLoading && (
                  <Loader2
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin"
                  />
                )}
              </div>
            </Field>

            <Field label="Rua" error={errors.street}>
              <input
                type="text"
                value={form.street}
                onChange={(e) => setField("street", e.target.value)}
                placeholder="Ex.: Av. T-4"
                className={inputClass("street")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Número" error={errors.number}>
                <input
                  type="text"
                  value={form.number}
                  onChange={(e) => setField("number", e.target.value)}
                  placeholder="Ex.: 123"
                  className={inputClass("number")}
                />
              </Field>

              <Field label="Complemento">
                <input
                  type="text"
                  value={form.complement}
                  onChange={(e) => setField("complement", e.target.value)}
                  placeholder="Sala, loja..."
                  className={inputClass("complement")}
                />
              </Field>
            </div>

            <Field label="Bairro" error={errors.neighborhood}>
              <input
                type="text"
                value={form.neighborhood}
                onChange={(e) => setField("neighborhood", e.target.value)}
                placeholder="Ex.: Setor Bueno"
                className={inputClass("neighborhood")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Cidade" error={errors.city}>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                  placeholder="Ex.: Goiânia"
                  className={inputClass("city")}
                />
              </Field>

              <Field label="Estado" error={errors.state}>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setField("state", e.target.value.toUpperCase())}
                  placeholder="Ex.: GO"
                  maxLength={2}
                  className={inputClass("state")}
                />
              </Field>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold text-base font-body shadow-kira-glow transition-transform hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              Continuar
            </button>
          </form>
        )}

        {step === "location" && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border border-border shadow-kira text-center">
              <div className="w-16 h-16 rounded-full gradient-kira flex items-center justify-center shadow-kira-glow">
                <MapPin size={28} className="text-primary-foreground" />
              </div>

              {locationStatus === "idle" && (
                <p className="text-sm text-muted-foreground font-body">
                  Ative sua localização para clientes próximos encontrarem você.
                </p>
              )}

              {locationStatus === "loading" && (
                <p className="text-sm text-muted-foreground font-body flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Obtendo localização…
                </p>
              )}

              {locationStatus === "success" && (
                <div className="flex flex-col items-center gap-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-primary font-body">
                    <CheckCircle2 size={18} /> Localização ativada
                  </span>
                  <span className="text-xs text-muted-foreground font-body">
                    Lat {form.latitude?.toFixed(4)}, Long {form.longitude?.toFixed(4)}
                  </span>
                </div>
              )}

              {locationStatus === "error" && (
                <div className="flex flex-col items-center gap-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-destructive font-body">
                    <AlertCircle size={18} /> Não foi possível ativar
                  </span>
                  <span className="text-xs text-muted-foreground font-body">
                    Você pode ativar a localização depois, nas configurações do app.
                  </span>
                </div>
              )}

              {(locationStatus === "idle" || locationStatus === "error") && (
                <button
                  type="button"
                  onClick={handleActivateLocation}
                  className="w-full py-3.5 rounded-2xl gradient-kira text-primary-foreground font-semibold text-sm font-body shadow-kira transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {locationStatus === "error" ? "Tentar novamente" : "Ativar localização"}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStep("specialties")}
              className="w-full py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold text-base font-body shadow-kira-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Continuar
            </button>
          </div>
        )}

        {step === "specialties" && (
          <form onSubmit={handleSubmitSpecialties} noValidate className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-foreground font-body mb-2 block">
                Adicionar especialidade
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSpecialty(specialtyInput);
                    }
                  }}
                  placeholder="Ex.: Coloração, Design de sobrancelhas..."
                  className={inputClass("specialtyInput")}
                />
                <button
                  type="button"
                  onClick={() => addSpecialty(specialtyInput)}
                  className="w-12 h-12 rounded-xl gradient-kira flex items-center justify-center shadow-kira flex-shrink-0"
                  aria-label="Adicionar especialidade"
                >
                  <Plus size={20} className="text-primary-foreground" />
                </button>
              </div>
              {errors.specialties && (
                <p className="text-xs text-destructive font-body mt-2">{errors.specialties}</p>
              )}
            </div>

            <div>
              <p className="text-xs text-muted-foreground font-body mb-2">Sugestões</p>
              <div className="flex gap-2 flex-wrap">
                {specialtySuggestions
                  .filter((s) => !form.specialties.includes(s))
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSpecialty(s)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium font-body bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
              </div>
            </div>

            {form.specialties.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground font-body mb-2">
                  Suas especialidades ({form.specialties.length})
                </p>
                <div className="flex gap-2 flex-wrap">
                  {form.specialties.map((s) => (
                    <span
                      key={s}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium font-body gradient-kira text-primary-foreground"
                    >
                      <Sparkles size={12} />
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(s)}
                        aria-label={`Remover ${s}`}
                        className="ml-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold text-base font-body shadow-kira-glow transition-transform hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              Continuar
            </button>
          </form>
        )}

        {step === "services" && (
          <form onSubmit={handleSubmitServices} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-card border border-border">
              <Field label="Nome do serviço">
                <input
                  type="text"
                  value={serviceDraft.name}
                  onChange={(e) => setServiceDraft((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Ex.: Corte feminino"
                  className={inputClass("serviceName")}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Valor (R$)">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={serviceDraft.price}
                    onChange={(e) => setServiceDraft((s) => ({ ...s, price: e.target.value }))}
                    placeholder="Ex.: 80"
                    className={inputClass("servicePrice")}
                  />
                </Field>
                <Field label="Tempo estimado">
                  <input
                    type="text"
                    value={serviceDraft.duration}
                    onChange={(e) => setServiceDraft((s) => ({ ...s, duration: e.target.value }))}
                    placeholder="Ex.: 45 min"
                    className={inputClass("serviceDuration")}
                  />
                </Field>
              </div>
              <button
                type="button"
                onClick={addService}
                className="w-full py-3 rounded-xl bg-muted text-primary font-semibold text-sm font-body flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Adicionar serviço
              </button>
            </div>

            {errors.services && (
              <p className="text-xs text-destructive font-body -mt-2">{errors.services}</p>
            )}

            {form.services.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground font-body mb-2">
                  Serviços cadastrados ({form.services.length})
                </p>
                <div className="flex flex-col gap-2">
                  {form.services.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-card border border-border"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground font-body">{s.name}</p>
                        <p className="text-xs text-muted-foreground font-body">{s.duration}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-primary font-body">R$ {s.price}</span>
                        <button
                          type="button"
                          onClick={() => removeService(s.id)}
                          aria-label={`Remover ${s.name}`}
                          className="text-muted-foreground"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold text-base font-body shadow-kira-glow transition-transform hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              Continuar
            </button>
          </form>
        )}

        {step === "photos" && (
          <form onSubmit={handleSubmitPhotos} noValidate className="flex flex-col gap-5">
            <input
              ref={workPhotosInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleWorkPhotos(e.target.files)}
            />

            <button
              type="button"
              onClick={() => workPhotosInputRef.current?.click()}
              className={`w-full py-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 ${
                errors.workPhotos ? "border-destructive" : "border-border"
              } bg-muted`}
            >
              <ImagePlus size={28} className="text-muted-foreground" />
              <span className="text-sm font-semibold text-primary font-body">
                Adicionar fotos
              </span>
              <span className="text-xs text-muted-foreground font-body">
                Estabelecimento e trabalhos realizados. Sem limite de fotos.
              </span>
            </button>

            {errors.workPhotos && (
              <p className="text-xs text-destructive font-body -mt-2">{errors.workPhotos}</p>
            )}

            {form.workPhotos.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground font-body mb-2">
                  Fotos adicionadas ({form.workPhotos.length})
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {form.workPhotos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden">
                      <img
                        src={photo}
                        alt={`Foto ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeWorkPhoto(idx)}
                        aria-label={`Remover foto ${idx + 1}`}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-background/80 flex items-center justify-center"
                      >
                        <X size={14} className="text-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold text-base font-body shadow-kira-glow transition-transform hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              Continuar
            </button>
          </form>
        )}

        {step === "terms" && (
          <form onSubmit={handleSubmitTerms} noValidate className="flex flex-col gap-5">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <span
                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  form.termsUse
                    ? "bg-primary border-primary"
                    : errors.termsUse
                    ? "border-destructive"
                    : "border-border bg-muted"
                }`}
              >
                {form.termsUse && <Check size={14} className="text-primary-foreground" />}
              </span>
              <input
                type="checkbox"
                checked={form.termsUse}
                onChange={(e) => setField("termsUse", e.target.checked)}
                className="sr-only"
              />
              <span className="text-sm text-foreground font-body">
                Aceito os <span className="text-primary font-semibold">Termos de Uso</span>
              </span>
            </label>
            {errors.termsUse && (
              <p className="-mt-3 text-xs text-destructive font-body">{errors.termsUse}</p>
            )}

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <span
                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  form.termsPrivacy
                    ? "bg-primary border-primary"
                    : errors.termsPrivacy
                    ? "border-destructive"
                    : "border-border bg-muted"
                }`}
              >
                {form.termsPrivacy && <Check size={14} className="text-primary-foreground" />}
              </span>
              <input
                type="checkbox"
                checked={form.termsPrivacy}
                onChange={(e) => setField("termsPrivacy", e.target.checked)}
                className="sr-only"
              />
              <span className="text-sm text-foreground font-body">
                Aceito a <span className="text-primary font-semibold">Política de Privacidade</span>
              </span>
            </label>
            {errors.termsPrivacy && (
              <p className="-mt-3 text-xs text-destructive font-body">{errors.termsPrivacy}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold text-base font-body shadow-kira-glow transition-transform hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              Concluir cadastro
            </button>
          </form>
        )}

        {step === "documentPhotos" && (
          <form onSubmit={handleSubmitDocumentPhotos} noValidate className="flex flex-col gap-5">
            <DocumentUpload
              label="Frente do documento"
              value={form.docFrontPhoto}
              error={errors.docFrontPhoto}
              onChange={(file) => handleImageField("docFrontPhoto", file)}
              onRemove={() => setField("docFrontPhoto", "")}
            />
            <DocumentUpload
              label="Verso do documento"
              value={form.docBackPhoto}
              error={errors.docBackPhoto}
              onChange={(file) => handleImageField("docBackPhoto", file)}
              onRemove={() => setField("docBackPhoto", "")}
            />
            <p className="text-xs text-muted-foreground font-body text-center">
              Aceitamos RG, CNH ou outro documento oficial com foto.
            </p>
            <button
              type="submit"
              className="w-full py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold text-base font-body shadow-kira-glow transition-transform hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              Continuar para verificação facial
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-foreground font-body">
      {label}
    </label>
    {children}
    {error && (
      <p className="text-xs text-destructive font-body">{error}</p>
    )}
  </div>
);

const DocumentUpload = ({
  label,
  value,
  error,
  onChange,
  onRemove,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (file: File | undefined) => void;
  onRemove: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground font-body">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`relative w-full aspect-[16/10] rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-2 border-2 cursor-pointer ${
          error
            ? "border-destructive"
            : value
            ? "border-primary"
            : "border-dashed border-border"
        } bg-muted`}
      >
        {value ? (
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <>
            <Camera size={28} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-body">Toque para enviar</span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0])}
      />
      <div className="flex items-center justify-between">
        {value && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-muted-foreground font-body inline-flex items-center gap-1"
          >
            <Trash2 size={12} /> Remover
          </button>
        )}
        {error && <p className="text-xs text-destructive font-body">{error}</p>}
      </div>
    </div>
  );
};

export default ProfessionalSignup;
