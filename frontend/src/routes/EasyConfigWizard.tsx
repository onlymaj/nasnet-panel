import { useParams } from 'react-router-dom';
import { Button, FormError, Inline, Stack, Stepper } from '@nasnet/ui';
import styles from './EasyConfigWizard.module.scss';
import { stepOrder, stepTitles } from './easy-config/state';
import { useEasyConfig } from './easy-config/useEasyConfig';
import { ModeStep } from './easy-config/steps/ModeStep';
import { WanStep } from './easy-config/steps/WanStep';
import { LanStep } from './easy-config/steps/LanStep';
import { ExtraStep } from './easy-config/steps/ExtraStep';
import { ShowStep } from './easy-config/steps/ShowStep';

export function EasyConfigWizard() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch, interfaces, script, onApply, goNext, goPrev } = useEasyConfig(id);
  const activeIndex = stepOrder.indexOf(state.currentStep);

  const footer = (
    <div className={styles.stepFooter}>
      {state.error ? <FormError>{state.error}</FormError> : null}
      <Inline>
        <Button variant="ghost" onClick={goPrev} disabled={activeIndex === 0}>
          Back
        </Button>
        <Button variant="success" onClick={goNext}>
          Next
        </Button>
      </Inline>
    </div>
  );

  const renderStep = () => {
    switch (state.currentStep) {
      case 'mode':
        return <ModeStep state={state} dispatch={dispatch} footer={footer} />;
      case 'wan':
        return (
          <WanStep state={state} dispatch={dispatch} interfaces={interfaces} footer={footer} />
        );
      case 'lan':
        return <LanStep state={state} dispatch={dispatch} footer={footer} />;
      case 'extra':
        return <ExtraStep state={state} dispatch={dispatch} footer={footer} />;
      case 'show':
        return <ShowStep script={script} state={state} onApply={onApply} onBack={goPrev} />;
      default:
        return null;
    }
  };

  return (
    <Stack>
      <Stepper
        orientation="horizontal"
        activeIndex={activeIndex}
        steps={stepOrder.map((stepId) => ({
          id: stepId,
          title: stepTitles[stepId].title,
          description: stepTitles[stepId].description,
        }))}
      />
      {renderStep()}
    </Stack>
  );
}
