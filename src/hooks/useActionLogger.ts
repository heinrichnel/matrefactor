import { useCallback } from 'react';
import ActionLogger from '@/utils/actionLogger';
import { ActionType, EntityType, ActionCategory } from '@/types/action-log';
import { DriverBehaviorEvent } from '@/types/trip';

export const useActionLogger = () => {
  const logAction = useCallback((params: {
    action: ActionType;
    entityType: EntityType;
    entityId: string;
    entityName?: string;
    description: string;
    details?: Record<string, any>;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    category: ActionCategory;
    relatedEntityId?: string;
    relatedEntityType?: EntityType;
  }) => {
    ActionLogger.logAction(params);
  }, []);

  const logDriverEvent = useCallback((
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW',
    event: DriverBehaviorEvent,
    additionalDetails?: Record<string, any>
  ) => {
    ActionLogger.logDriverBehaviorEvent(action, event, additionalDetails);
  }, []);

  const logTripAction = useCallback((
    action: ActionType,
    tripId: string,
    tripName: string,
    details?: Record<string, any>
  ) => {
    ActionLogger.logAction({
      action,
      entityType: 'TRIP',
      entityId: tripId,
      entityName: tripName,
      description: `Trip ${action.toLowerCase()}: ${tripName}`,
      details,
      category: 'OPERATIONS',
      severity: 'medium'
    });
  }, []);

  const logMaintenanceAction = useCallback((
    action: ActionType,
    entityType: 'JOB_CARD' | 'INSPECTION' | 'TYRE',
    entityId: string,
    entityName: string,
    details?: Record<string, any>
  ) => {
    ActionLogger.logAction({
      action,
      entityType,
      entityId,
      entityName,
      description: `${entityType.replace('_', ' ').toLowerCase()} ${action.toLowerCase()}: ${entityName}`,
      details,
      category: 'MAINTENANCE',
      severity: 'medium'
    });
  }, []);

  const logFinancialAction = useCallback((
    action: ActionType,
    entityType: 'INVOICE' | 'EXPENSE' | 'FUEL_ENTRY',
    entityId: string,
    entityName: string,
    amount?: number,
    details?: Record<string, any>
  ) => {
    ActionLogger.logAction({
      action,
      entityType,
      entityId,
      entityName,
      description: `${entityType.replace('_', ' ').toLowerCase()} ${action.toLowerCase()}: ${entityName}${amount ? ` ($${amount})` : ''}`,
      details: { amount, ...details },
      category: 'FINANCIAL',
      severity: 'medium'
    });
  }, []);

  const logSystemAction = useCallback((
    action: ActionType,
    description: string,
    details?: Record<string, any>,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ) => {
    ActionLogger.logAction({
      action,
      entityType: 'USER',
      entityId: 'system',
      description,
      details,
      category: 'SYSTEM',
      severity
    });
  }, []);

  return {
    logAction,
    logDriverEvent,
    logTripAction,
    logMaintenanceAction,
    logFinancialAction,
    logSystemAction
  };
};
