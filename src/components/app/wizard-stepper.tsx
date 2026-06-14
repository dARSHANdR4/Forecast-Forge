"use client";

import { Check, Upload, Search, Sparkles, Brain, BarChart3, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { label: 'Upload', icon: Upload },
  { label: 'Explore', icon: Search },
  { label: 'Clean', icon: Sparkles },
  { label: 'Train', icon: Brain },
  { label: 'Compare', icon: BarChart3 },
  { label: 'Predict', icon: TrendingUp },
];

interface WizardStepperProps {
  currentStep: number; // 1-6 (matches step index from nav)
  className?: string;
}

export function WizardStepper({ currentStep, className }: WizardStepperProps) {
  return (
    <div className={cn("flex items-center justify-center gap-0", className)}>
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const isPending = stepNum > currentStep;

        return (
          <div key={step.label} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                  isCompleted && "border-[var(--color-success-default)] bg-[var(--color-success-subtle)]",
                  isActive && "border-[var(--color-accent-500)] bg-[rgba(232,64,64,0.12)]",
                  isPending && "border-[var(--color-border-default)] bg-transparent"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-[var(--color-success-default)]" />
                ) : (
                  <step.icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-[var(--color-accent-500)]" : "text-[var(--color-text-tertiary)]"
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isCompleted && "text-[var(--color-success-default)]",
                  isActive && "text-[var(--color-accent-500)]",
                  isPending && "text-[var(--color-text-tertiary)]"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-12 h-[2px] mx-2 mt-[-18px] rounded-full transition-colors duration-200",
                  stepNum < currentStep
                    ? "bg-[var(--color-success-default)]"
                    : "bg-[var(--color-border-default)]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
