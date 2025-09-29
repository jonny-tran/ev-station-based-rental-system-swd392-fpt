export function StepIndicator({ current }: { current: 1 | 2 | 3 | 4 }) {
  const steps = [
    "Kiểm tra giấy tờ",
    "Bàn giao & kiểm tra xe",
    "Ký hợp đồng",
    "Thanh toán",
  ];

  return (
    <div className="flex items-center gap-3">
      {steps.map((label, index) => (
        <StepItem
          key={label}
          index={index}
          label={label}
          current={current}
          isLast={index === steps.length - 1}
        />
      ))}
    </div>
  );
}

function StepItem({
  index,
  label,
  current,
  isLast,
}: {
  index: number;
  label: string;
  current: 1 | 2 | 3 | 4;
  isLast: boolean;
}) {
  const stepNumber = index + 1;
  const isCompleted = stepNumber < current;
  const isActive = stepNumber === current;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <StepCircle
          number={stepNumber}
          completed={isCompleted}
          active={isActive}
        />
        <div
          className={
            "text-xs sm:text-sm font-medium " +
            (isActive
              ? "text-foreground"
              : isCompleted
                ? "text-muted-foreground"
                : "text-muted-foreground")
          }
          aria-current={isActive ? "step" : undefined}
        >
          {label}
        </div>
      </div>

      {!isLast && <StepConnector completed={isCompleted || isActive} />}
    </div>
  );
}

function StepCircle({
  number,
  completed,
  active,
}: {
  number: number;
  completed?: boolean;
  active?: boolean;
}) {
  const base =
    "flex h-7 w-7 items-center justify-center rounded-full border text-xs transition-colors";
  const state = completed
    ? "bg-green-600 text-white border-green-600"
    : active
      ? "bg-blue-600 text-white border-blue-600"
      : "bg-muted text-muted-foreground";

  return (
    <div className={base + " " + state} aria-hidden>
      {completed ? <CheckIcon /> : number}
    </div>
  );
}

function StepConnector({ completed }: { completed?: boolean }) {
  return (
    <div
      className={
        "h-0.5 w-6 sm:w-10 rounded " + (completed ? "bg-blue-600" : "bg-border")
      }
    />
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
    >
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
