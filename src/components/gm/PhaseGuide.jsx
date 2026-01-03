'use client'

import { getPhaseGuide } from '@/data/phaseGuides'

export default function PhaseGuide({
  currentPhase,
  currentStep,
  onNextStep,
  onPrevStep,
  onAdvancePhase
}) {
  const guide = getPhaseGuide(currentPhase)

  if (!guide) {
    return (
      <div className="card">
        <p className="text-gray-400">Loading guide...</p>
      </div>
    )
  }

  const stepData = guide.steps[currentStep] || guide.steps[0]
  const isLastStep = currentStep >= guide.steps.length - 1
  const isFirstStep = currentStep === 0

  return (
    <div className="card">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-blood">{guide.title}</h2>
          <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
            Step {currentStep + 1} / {guide.steps.length}
          </span>
        </div>
        <p className="text-gray-400">{guide.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blood h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / guide.steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blood rounded-full flex items-center justify-center text-2xl font-bold">
            {currentStep + 1}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-3">{stepData.instruction}</h3>
            {stepData.details && (
              <div className="bg-gray-800 border-l-4 border-blood p-4 rounded">
                <p className="text-sm text-gray-300 italic">{stepData.details}</p>
              </div>
            )}

            {/* Special indicators */}
            {stepData.useWakeOrder && (
              <div className="mt-4 bg-blue-900/30 border border-blue-700 px-4 py-3 rounded-lg">
                <p className="text-blue-200 text-sm">
                  ℹ️ Lihat "Wake Order" di sidebar untuk urutan karakter yang dibangunkan
                </p>
              </div>
            )}

            {stepData.action === 'wake-minions' && (
              <div className="mt-4 bg-orange-900/30 border border-orange-700 px-4 py-3 rounded-lg">
                <p className="text-orange-200 text-sm font-semibold">
                  😈 Minions Team Setup
                </p>
              </div>
            )}

            {stepData.action === 'wake-demon' && (
              <div className="mt-4 bg-red-900/30 border border-red-700 px-4 py-3 rounded-lg">
                <p className="text-red-200 text-sm font-semibold">
                  👹 Demon Setup
                </p>
              </div>
            )}

            {stepData.action === 'end-night' && (
              <div className="mt-4 bg-yellow-900/30 border border-yellow-700 px-4 py-3 rounded-lg">
                <p className="text-yellow-200 text-sm font-semibold">
                  🌅 Malam berakhir - Lanjut ke siang hari
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onPrevStep}
          disabled={isFirstStep}
          className="btn-secondary flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Step Sebelumnya
        </button>

        {!isLastStep ? (
          <button
            onClick={onNextStep}
            className="btn-primary flex-1"
          >
            Step Selanjutnya →
          </button>
        ) : (
          <button
            onClick={onAdvancePhase}
            className="btn-primary flex-1"
          >
            {currentPhase?.startsWith('night') ? 'Lanjut ke Siang →' : 'Lanjut ke Malam →'}
          </button>
        )}
      </div>

      {/* All Steps Preview (Collapsed) */}
      <details className="mt-6">
        <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition">
          Lihat semua steps
        </summary>
        <div className="mt-4 space-y-2">
          {guide.steps.map((step, index) => (
            <div
              key={index}
              className={`p-3 rounded border ${
                index === currentStep
                  ? 'border-blood bg-blood/10'
                  : index < currentStep
                    ? 'border-green-700 bg-green-900/10'
                    : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === currentStep
                    ? 'bg-blood text-white'
                    : index < currentStep
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-700 text-gray-400'
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </span>
                <p className="text-sm flex-1">{step.instruction}</p>
              </div>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
