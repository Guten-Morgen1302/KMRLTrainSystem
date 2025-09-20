import MetroLoadingAnimations, { TrainSpinner, PlatformDots, SignalSequence, MetroLineLoader } from '../animations/MetroLoadingAnimations';

export default function MetroLoadingExamples() {
  return (
    <div className="p-8 space-y-8 bg-background">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Metro-Themed Loading Animations</h1>
        <p className="text-muted-foreground">Railway-inspired loading states for Metro Yukti</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Train Spinner</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Small</p>
                <TrainSpinner size="sm" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Medium</p>
                <TrainSpinner size="md" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Large</p>
                <TrainSpinner size="lg" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Platform Boarding Dots</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Small</p>
                <PlatformDots size="sm" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Medium</p>
                <PlatformDots size="md" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Large</p>
                <PlatformDots size="lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Railway Signal Sequence</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Small</p>
                <SignalSequence size="sm" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Medium</p>
                <SignalSequence size="md" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Large</p>
                <SignalSequence size="lg" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Metro Line Progress</h3>
            <div className="space-y-6">
              <MetroLineLoader text="Processing trainset data..." />
              <MetroLineLoader text="Optimizing allocations..." />
              <MetroLineLoader text="Generating schedule..." />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Combined Loading States</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetroLoadingAnimations variant="train" text="Loading trains..." />
          <MetroLoadingAnimations variant="platform" text="Boarding passengers..." />
          <MetroLoadingAnimations variant="signal" text="Checking signals..." />
          <MetroLoadingAnimations variant="metro-line" text="Processing route..." />
        </div>
      </div>
    </div>
  );
}