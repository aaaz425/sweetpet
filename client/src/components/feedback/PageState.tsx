import { AlertCircle, Home } from "lucide-react";
import type { ReactNode } from "react";
import { panelClass, secondaryButtonClass } from "../ui";

type PageStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon: ReactNode;
  isFramed?: boolean;
};

function PageState({ title, description, action, icon, isFramed = true }: PageStateProps) {
  return (
    <section className={`${isFramed ? panelClass : ""} grid min-h-[240px] place-items-center text-center`}>
      <div className="grid max-w-md justify-items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">
          {icon}
        </div>
        <div className="grid gap-2">
          <h1 className="text-xl font-bold text-text-primary">{title}</h1>
          <p className="text-sm leading-6 text-text-secondary">{description}</p>
        </div>
        {action ? <div className="flex flex-wrap justify-center gap-2">{action}</div> : null}
      </div>
    </section>
  );
}

export function NotFoundState({ onGoHome }: { onGoHome: () => void }) {
  return (
    <PageState
      title="페이지를 찾을 수 없습니다"
      description="요청한 주소가 없거나 이동되었습니다. 일상기록 화면에서 다시 시작할 수 있습니다."
      icon={<AlertCircle className="h-6 w-6" aria-hidden="true" />}
      action={
        <button className={secondaryButtonClass} onClick={onGoHome} type="button">
          <Home className="mr-2 inline h-4 w-4" aria-hidden="true" />
          일상기록으로 이동
        </button>
      }
    />
  );
}

export function DataLoadErrorState({
  title = "데이터를 불러오지 못했습니다",
  isFramed = true
}: {
  title?: string;
  isFramed?: boolean;
}) {
  return (
    <PageState
      title={title}
      description="잠시 후 다시 시도해 주세요."
      icon={<AlertCircle className="h-6 w-6" aria-hidden="true" />}
      isFramed={isFramed}
    />
  );
}
