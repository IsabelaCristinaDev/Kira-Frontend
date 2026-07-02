import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ScanFace,
  AlertCircle,
  RefreshCcw,
  SkipForward,
  Settings,
  ShieldAlert,
} from "lucide-react";

type Status = "idle" | "starting" | "ready" | "scanning" | "success" | "error";
type ErrorKind = "permission_denied" | "not_found" | "unknown";

interface Props {
  onBack: () => void;
  onComplete: () => void;
  onSkip?: () => void;
}

const FaceRecognition = ({ onBack, onComplete, onSkip }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errorKind, setErrorKind] = useState<ErrorKind>("unknown");

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    setStatus("starting");
    setErrorMsg("");
    setErrorKind("unknown");
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorKind("unknown");
      setErrorMsg("Seu navegador não suporta acesso à câmera.");
      setStatus("error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 640 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("ready");
    } catch (err: any) {
      console.error(err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorKind("permission_denied");
        setErrorMsg(
          "Acesso à câmera negado. Permita o uso da câmera nas configurações do navegador para continuar."
        );
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setErrorKind("not_found");
        setErrorMsg("Nenhuma câmera encontrada neste dispositivo.");
      } else {
        setErrorKind("unknown");
        setErrorMsg("Não foi possível acessar a câmera. Tente novamente.");
      }
      setStatus("error");
    }
  };

  const handleRetry = () => {
    setProgress(0);
    startCamera();
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleScan = () => {
    setStatus("scanning");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setStatus("success");
          stopCamera();
          return 100;
        }
        return p + 4;
      });
    }, 80);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center p-4">
        <button onClick={onBack} className="p-2 -ml-2 text-foreground">
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="flex-1 px-6 pt-2 pb-8 flex flex-col">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Reconhecimento facial
        </h1>
        <p className="text-muted-foreground font-body mb-6">
          Posicione seu rosto no centro da câmera para validar sua identidade.
        </p>

        <div className="relative mx-auto w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-muted border border-border shadow-kira">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />

          {status === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted text-muted-foreground">
              <Camera size={48} />
              <span className="font-body text-sm">Câmera desativada</span>
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/95 p-6 text-center">
              {errorKind === "permission_denied" ? (
                <ShieldAlert size={48} className="text-destructive" />
              ) : (
                <AlertCircle size={48} className="text-destructive" />
              )}
              <span className="font-body text-sm text-destructive font-medium">
                {errorMsg}
              </span>
              {errorKind === "permission_denied" && (
                <div className="text-xs text-muted-foreground font-body space-y-1 max-w-[240px]">
                  <p>1. Clique no ícone de cadeado 🔒 na barra de endereço</p>
                  <p>2. Encontre <strong>Câmera</strong> e mude para <strong>Permitir</strong></p>
                  <p>3. Recarregue a página e tente novamente</p>
                </div>
              )}
              {errorKind === "not_found" && (
                <span className="text-xs text-muted-foreground font-body">
                  Verifique se há uma câmera conectada ou ativa.
                </span>
              )}
            </div>
          )}

          {(status === "ready" || status === "scanning") && (
            <>
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-3/4 h-3/4 rounded-full border-4 border-primary/70 shadow-[0_0_60px_rgba(255,90,120,0.4)]" />
              </div>
              {status === "scanning" && (
                <div
                  className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(255,90,120,0.9)] transition-all duration-75"
                  style={{ top: `${progress}%` }}
                />
              )}
            </>
          )}

          {status === "success" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/95 text-foreground">
              <CheckCircle2 size={64} className="text-primary" />
              <span className="font-display text-xl font-bold">Identidade verificada</span>
              <span className="font-body text-sm text-muted-foreground">Tudo certo!</span>
            </div>
          )}
        </div>

        {status === "scanning" && (
          <div className="mt-6">
            <div className="flex justify-between text-xs font-body text-muted-foreground mb-2">
              <span>Analisando rosto…</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-kira transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-auto pt-8 flex flex-col gap-3">
          {(status === "idle" || status === "error") && (
            <>
              <button
                onClick={status === "error" ? handleRetry : startCamera}
                className="w-full py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold text-base font-body shadow-kira-glow flex items-center justify-center gap-2"
              >
                {status === "error" ? (
                  <>
                    <RefreshCcw size={20} /> Tentar novamente
                  </>
                ) : (
                  <>
                    <Camera size={20} /> Ativar câmera
                  </>
                )}
              </button>

              {status === "error" && errorKind === "permission_denied" && (
                <button
                  onClick={() => {
                    window.open("chrome://settings/content/camera", "_blank");
                  }}
                  className="w-full py-3 rounded-2xl border border-border bg-card text-foreground font-medium text-sm font-body flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                >
                  <Settings size={18} /> Abrir configurações do navegador
                </button>
              )}

              {onSkip && (
                <button
                  onClick={onSkip}
                  className="w-full py-3 rounded-2xl text-muted-foreground font-medium text-sm font-body flex items-center justify-center gap-2 hover:text-foreground transition-colors"
                >
                  <SkipForward size={18} /> Pular verificação facial
                </button>
              )}
            </>
          )}

          {status === "starting" && (
            <button
              disabled
              className="w-full py-4 rounded-2xl bg-muted text-muted-foreground font-semibold text-base font-body"
            >
              Iniciando câmera…
            </button>
          )}

          {status === "ready" && (
            <button
              onClick={handleScan}
              className="w-full py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold text-base font-body shadow-kira-glow flex items-center justify-center gap-2"
            >
              <ScanFace size={20} /> Iniciar verificação
            </button>
          )}

          {status === "scanning" && (
            <button
              disabled
              className="w-full py-4 rounded-2xl bg-muted text-muted-foreground font-semibold text-base font-body"
            >
              Verificando…
            </button>
          )}

          {status === "success" && (
            <button
              onClick={onComplete}
              className="w-full py-4 rounded-2xl gradient-kira text-primary-foreground font-semibold text-base font-body shadow-kira-glow"
            >
              Continuar
            </button>
          )}

          <p className="text-center text-xs text-muted-foreground font-body">
            Tela de teste — nenhum dado biométrico é armazenado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;
