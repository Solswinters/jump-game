/**
 * Stepper component
 */

'use client'

export interface Step {
  id: string
  label: string
  description?: string
}

export interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
  orientation?: 'horizontal' | 'vertical'
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
}: StepperProps) {
  const isStepComplete = (index: number) => index < currentStep
  const isStepCurrent = (index: number) => index === currentStep
  const isStepClickable = (index: number) => onStepClick && index <= currentStep

  if (orientation === 'vertical') {
    return (
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <button
                onClick={() => isStepClickable(index) && onStepClick?.(index)}
                disabled={!isStepClickable(index)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors ${
                  isStepComplete(index)
                    ? 'border-purple-500 bg-purple-500 text-white'
                    : isStepCurrent(index)
                      ? 'border-purple-500 text-purple-500'
                      : 'border-gray-600 text-gray-600'
                } ${isStepClickable(index) ? 'cursor-pointer hover:border-purple-400' : 'cursor-default'}`}
              >
                {isStepComplete(index) ? '✓' : index + 1}
              </button>
              {index < steps.length - 1 && <div className="my-2 h-8 w-0.5 bg-gray-600" />}
            </div>
            <div className="flex-1 pb-8">
              <h3
                className={`font-medium ${isStepCurrent(index) ? 'text-white' : 'text-gray-400'}`}
              >
                {step.label}
              </h3>
              {step.description && <p className="mt-1 text-sm text-gray-500">{step.description}</p>}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center">
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-1 items-center">
          <div className="flex flex-col items-center">
            <button
              onClick={() => isStepClickable(index) && onStepClick?.(index)}
              disabled={!isStepClickable(index)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors ${
                isStepComplete(index)
                  ? 'border-purple-500 bg-purple-500 text-white'
                  : isStepCurrent(index)
                    ? 'border-purple-500 text-purple-500'
                    : 'border-gray-600 text-gray-600'
              } ${isStepClickable(index) ? 'cursor-pointer hover:border-purple-400' : 'cursor-default'}`}
            >
              {isStepComplete(index) ? '✓' : index + 1}
            </button>
            <span
              className={`mt-2 text-sm ${isStepCurrent(index) ? 'text-white' : 'text-gray-400'}`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`mx-4 h-0.5 flex-1 ${isStepComplete(index) ? 'bg-purple-500' : 'bg-gray-600'}`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
