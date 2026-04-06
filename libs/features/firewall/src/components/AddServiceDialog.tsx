/**
 * AddServiceDialog - Form dialog for adding/editing custom service ports
 *
 * Provides a user-friendly form for creating and editing custom service port definitions.
 * Features:
 * - Add new custom services (port + name + protocol + description)
 * - Edit existing custom services
 * - Validation with Zod schema (CustomServicePortInputSchema)
 * - Conflict detection (built-in + custom service names)
 * - English-only labels and validation messages
 * - Form state management with React Hook Form
 *
 * @module @nasnet/features/firewall/components/AddServiceDialog
 */

import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CustomServicePortInputSchema,
  type CustomServicePortInput,
  DEFAULT_CUSTOM_SERVICE_INPUT,
} from '@nasnet/core/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Button,
  Input,
  Label,
  Textarea,
  RadioGroup,
  RadioGroupItem,
  Alert,
  AlertDescription,
} from '@nasnet/ui/primitives';
import { AlertCircle } from 'lucide-react';
import { useCustomServices } from '../hooks';

// ============================================================================
// Component Props
// ============================================================================

export interface AddServiceDialogProps {
  /** Control dialog open state */
  open: boolean;
  /** Handler for dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Service to edit (undefined = add mode, defined = edit mode) */
  editService?: CustomServicePortInput;
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Dialog for adding or editing custom service port definitions
 *
 * Features:
 * - Service name with conflict detection
 * - Protocol selection (TCP/UDP/Both)
 * - Port number validation (1-65535)
 * - Optional description
 * - Full form validation with Zod
 *
 * @example
 * ```tsx
 * // Add mode
 * <AddServiceDialog
 *   open={isAddDialogOpen}
 *   onOpenChange={setIsAddDialogOpen}
 * />
 *
 * // Edit mode
 * <AddServiceDialog
 *   open={isEditDialogOpen}
 *   onOpenChange={setIsEditDialogOpen}
 *   editService={{
 *     port: 9999,
 *     service: 'my-app',
 *     protocol: 'tcp',
 *     description: 'My custom application'
 *   }}
 * />
 * ```
 *
 * @param props - Component props
 * @returns Dialog component for service management
 */
export const AddServiceDialog = React.memo(function AddServiceDialog({
  open,
  onOpenChange,
  editService,
}: AddServiceDialogProps) {
  const { addService, updateService } = useCustomServices();

  // ============================================================================
  // Form State
  // ============================================================================

  const form = useForm<CustomServicePortInput>({
    resolver: zodResolver(CustomServicePortInputSchema),
    defaultValues: editService || DEFAULT_CUSTOM_SERVICE_INPUT,
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    watch,
  } = form;
  const protocol = watch('protocol');

  // ============================================================================
  // Effects
  // ============================================================================

  // Reset form when dialog opens/closes or editService changes
  useEffect(() => {
    if (open) {
      reset(editService || DEFAULT_CUSTOM_SERVICE_INPUT);
    }
  }, [open, editService, reset]);

  // ============================================================================
  // Handlers
  // ============================================================================

  /**
   * Handle form submission (add or update)
   */
  const onSubmit = useCallback(
    async (data: CustomServicePortInput) => {
      try {
        if (editService) {
          // Edit mode: Update existing service
          await updateService(editService.port, data);
        } else {
          // Add mode: Create new service
          await addService(data);
        }

        // Success: Close dialog and reset form
        onOpenChange(false);
        reset(DEFAULT_CUSTOM_SERVICE_INPUT);
      } catch (error) {
        // Error: Show error message on service field
        const errorMessage = error instanceof Error ? error.message : 'Service name already exists';
        setError('service', {
          message: errorMessage,
        });
      }
    },
    [editService, updateService, addService, onOpenChange, reset, setError]
  );

  /**
   * Handle dialog close (also resets form)
   */
  const handleClose = useCallback(() => {
    onOpenChange(false);
    reset(DEFAULT_CUSTOM_SERVICE_INPUT);
  }, [onOpenChange, reset]);

  // ============================================================================
  // Render
  // ============================================================================

  const isEditMode = !!editService;
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Service' : 'Add Service'}</DialogTitle>
          <DialogDescription>
            {isEditMode ?
              'This action cannot be undone. The service will be removed from your custom list.'
            : 'Add custom services to use in firewall rules'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-component-lg"
        >
          {/* Service Name Field */}
          <div className="space-y-component-sm">
            <Label
              htmlFor="service"
              className="text-sm font-medium"
            >
              {'Service Name'}
              <span className="text-error ml-component-xs">*</span>
            </Label>
            <Input
              id="service"
              type="text"
              placeholder={'e.g., my-app'}
              autoComplete="off"
              {...register('service')}
              aria-invalid={!!errors.service}
              aria-describedby={errors.service ? 'service-error' : 'service-help'}
            />
            {errors.service && (
              <Alert
                variant="destructive"
                className="mt-component-sm"
              >
                <AlertCircle
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                <AlertDescription id="service-error">{errors.service.message}</AlertDescription>
              </Alert>
            )}
            {!errors.service && (
              <p
                className="text-muted-foreground text-xs"
                id="service-help"
              >
                {'Name must be alphanumeric with optional hyphens/underscores'}
              </p>
            )}
          </div>

          {/* Protocol Field */}
          <div className="space-y-component-sm">
            <Label className="text-sm font-medium">
              {'Protocol'}
              <span className="text-error ml-component-xs">*</span>
            </Label>
            <RadioGroup
              value={protocol}
              onValueChange={(value) => form.setValue('protocol', value as 'tcp' | 'udp' | 'both')}
              className="space-y-component-sm flex flex-col"
            >
              <div className="space-x-component-sm flex items-center">
                <RadioGroupItem
                  value="tcp"
                  id="protocol-tcp"
                />
                <Label
                  htmlFor="protocol-tcp"
                  className="cursor-pointer font-normal"
                >
                  {'TCP'}
                </Label>
              </div>
              <div className="space-x-component-sm flex items-center">
                <RadioGroupItem
                  value="udp"
                  id="protocol-udp"
                />
                <Label
                  htmlFor="protocol-udp"
                  className="cursor-pointer font-normal"
                >
                  {'UDP'}
                </Label>
              </div>
              <div className="space-x-component-sm flex items-center">
                <RadioGroupItem
                  value="both"
                  id="protocol-both"
                />
                <Label
                  htmlFor="protocol-both"
                  className="cursor-pointer font-normal"
                >
                  {'TCP & UDP'}
                </Label>
              </div>
            </RadioGroup>
            {errors.protocol && <p className="text-error text-sm">{errors.protocol.message}</p>}
          </div>

          {/* Port Field */}
          <div className="space-y-component-sm">
            <Label
              htmlFor="port"
              className="text-sm font-medium"
            >
              {'Port'}
              <span className="text-error ml-component-xs">*</span>
            </Label>
            <Input
              id="port"
              type="number"
              min={1}
              max={65535}
              placeholder={'e.g., 8080'}
              className="font-mono"
              {...register('port', {
                valueAsNumber: true,
              })}
              aria-invalid={!!errors.port}
              aria-describedby={errors.port ? 'port-error' : 'port-help'}
            />
            {errors.port && (
              <p
                className="text-error text-sm"
                id="port-error"
                role="alert"
              >
                {errors.port.message}
              </p>
            )}
            {!errors.port && (
              <p
                className="text-muted-foreground text-xs"
                id="port-help"
              >
                {'Invalid port number (1-65535)'}
              </p>
            )}
          </div>

          {/* Description Field (Optional) */}
          <div className="space-y-component-sm">
            <Label
              htmlFor="description"
              className="text-sm font-medium"
            >
              {'Description'}
              <span className="text-muted-foreground ml-component-xs text-xs">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder={'Optional description'}
              rows={3}
              maxLength={500}
              {...register('description')}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : 'description-help'}
            />
            {errors.description && (
              <p
                className="text-error text-sm"
                id="description-error"
                role="alert"
              >
                {errors.description.message}
              </p>
            )}
            {!errors.description && (
              <p
                className="text-muted-foreground text-xs"
                id="description-help"
              >
                {'Description must be less than 500 characters'}
              </p>
            )}
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="gap-component-sm">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {'Cancel'}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ?
                isEditMode ?
                  'Updating...'
                : 'Adding...'
              : isEditMode ?
                'Update'
              : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
