import React, { useState } from 'react';
import JobCardHeader from './JobCardHeader';
// import TaskManager from './TaskManager'; // Component commented out - missing file
// import InventoryPanel from './InventoryPanel'; // Component commented out - missing file
import JobCardNotes from './JobCardNotes';
// import QAReviewPanel from './QAReviewPanel'; // Component commented out - missing file
// import CompletionPanel from './CompletionPanel'; // Component commented out - missing file 
import { v4 as uuidv4 } from 'uuid';
import { JobCardTask, TaskHistoryEntry } from '../../../types';
import Button from '../../ui/Button';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';

// Mock data for a job card
const mockJobCard = {
  id: 'jc123',
  workOrderNumber: 'JC-2025-0042',
  vehicleId: '28H',
  customerName: 'Internal Service',
  priority: 'high' as const,
  status: 'in_progress' as const,
  createdDate: '2025-06-28',
  scheduledDate: '2025-06-30',
  assignedTo: 'John Smith - Senior Mechanic',
  estimatedCompletion: '4 hours',
  workDescription: 'Replace brake pads and inspect rotors',
  estimatedHours: 4,
  laborRate: 250,
  partsCost: 1500,
  totalEstimate: 2500,
  notes: [],
  faultId: 'f123' // Added faultId property
};

// Mock tasks for the job card
const mockTasks: JobCardTask[] = [
  {
    id: 't1',
    title: 'Remove wheels',
    description: 'Remove all wheels to access brake assemblies',
    category: 'Brakes',
    estimatedHours: 0.5,
    status: 'completed' as const,
    assignedTo: 'John Smith - Senior Mechanic',
    isCritical: false
  },
  {
    id: 't2',
    title: 'Replace brake pads',
    description: 'Install new brake pads on all wheels',
    category: 'Brakes',
    estimatedHours: 2,
    status: 'in_progress' as const,
    assignedTo: 'John Smith - Senior Mechanic',
    isCritical: true,
    parts: [
      { partName: 'Front Brake Pads', quantity: 1, isRequired: true },
      { partName: 'Rear Brake Pads', quantity: 1, isRequired: true }
    ]
  },
  {
    id: 't3',
    title: 'Inspect rotors',
    description: 'Check rotors for wear or damage',
    category: 'Brakes',
    estimatedHours: 0.5,
    status: 'pending' as const,
    isCritical: true
  },
  {
    id: 't4',
    title: 'Reassemble',
    description: 'Reinstall wheels and torque to spec',
    category: 'Brakes',
    estimatedHours: 1,
    status: 'pending' as const,
    isCritical: false
  }
];

// Mock task history
const mockTaskHistory: TaskHistoryEntry[] = [
  {
    id: 'th1',
    taskId: 't1',
    event: 'statusChanged',
    previousStatus: 'pending',
    newStatus: 'in_progress',
    by: 'John Smith - Senior Mechanic',
    at: '2025-06-28T10:15:00Z'
  },
  {
    id: 'th2',
    taskId: 't1',
    event: 'statusChanged',
    previousStatus: 'in_progress',
    newStatus: 'completed',
    by: 'John Smith - Senior Mechanic',
    at: '2025-06-28T11:30:00Z'
  }
];

// Mock parts
const mockAssignedParts = [
  {
    id: 'a1',
    itemId: 'p1',
    quantity: 1,
    assignedAt: '2025-06-28T10:30:00Z',
    assignedBy: 'John Smith',
    status: 'assigned' as const
  }
];

// Mock notes
const mockNotes = [
  {
    id: 'n1',
    text: 'Customer reports squeaking from front brakes during braking',
    createdBy: 'Service Advisor',
    createdAt: '2025-06-28T09:15:00Z',
    type: 'customer' as const
  },
  {
    id: 'n2',
    text: 'Confirmed brake pads are worn beyond service limit. Recommend replacement of all pads and inspection of rotors.',
    createdBy: 'John Smith - Senior Mechanic',
    createdAt: '2025-06-28T10:00:00Z',
    type: 'technician' as const
  }
];

const JobCard: React.FC = () => {
  const [jobCard, setJobCard] = useState(mockJobCard);
  const [tasks, setTasks] = useState(mockTasks);
  // These variables are needed for the commented out components below
  // They will be used once the TaskManager and QAReviewPanel components are implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const taskHistory = mockTaskHistory;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const assignedParts = mockAssignedParts;
  const [notes, setNotes] = useState(mockNotes);
  const [userRole, setUserRole] = useState<'technician' | 'supervisor'>('technician');
  // Adding isLoading state that's used in the functions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [setTaskHistory] = useState(() => (newEntries: TaskHistoryEntry[]) => {
    // This will be replaced with actual function when components are implemented
    console.log('Task history updated:', newEntries);
  });
  
  // Handler functions for tasks
  // These handlers will be used once the TaskManager component is implemented
  const handleTaskUpdate = (taskId: string, updates: Partial<JobCardTask>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };
  
  // Will be used once the TaskManager component is implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTaskAdd = (task: Omit<JobCardTask, 'id'>) => {
    const newTask = {
      ...task,
      id: uuidv4()
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };
  
  // Will be used once the TaskManager component is implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTaskDelete = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };
  
  // Log task history entry
  const handleLogTaskHistory = (entry: Omit<TaskHistoryEntry, 'id'>) => {
    const newEntry: TaskHistoryEntry = {
      ...entry,
      id: uuidv4()
    };
    setTaskHistory(prev => [newEntry, ...prev]);
  };

  // Handler for verifying a task (supervisor only)
  // Will be used when QAReviewPanel component is implemented
  // Will be used when QAReviewPanel component is implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleVerifyTask = async (taskId: string) => {
    if (userRole !== 'supervisor') return;
    
    try {
      // setIsLoading(true); // isLoading state removed
      
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');
      
      // Update task in Firestore
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'verified',
        verifiedBy: 'Current Supervisor',
        verifiedAt: new Date().toISOString()
      });

      handleTaskUpdate(taskId, {
        status: 'verified',
        verifiedBy: 'Current Supervisor',
        verifiedAt: new Date().toISOString()
      });
      
      handleLogTaskHistory({
        taskId,
        event: 'verified',
        by: 'Current Supervisor',
        at: new Date().toISOString(),
        notes: 'Task verified by supervisor'
      });
    } catch (error) {
      console.error('Error verifying task:', error);
    } finally {
      // setIsLoading(false); // isLoading state removed
    }
  };

  // Handler for verifying all tasks at once (supervisor only)
  // Will be used when QAReviewPanel component is implemented
  // Will be used when QAReviewPanel component is implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleVerifyAllTasks = async () => {
    if (userRole !== 'supervisor') return;
    
    try {
      // setIsLoading(true); // isLoading state removed
      
      // Get all completed tasks that haven't been verified
      const tasksToVerify = tasks.filter(
        task => task.status === 'completed' && !task.verifiedBy
      );
      
      // Update each task
      for (const task of tasksToVerify) {
        const updates: Partial<JobCardTask> = {
          status: 'verified',
          verifiedBy: 'Current Supervisor',
          verifiedAt: new Date().toISOString()
        };
        
        handleTaskUpdate(task.id, updates);
        
        // Log the verification action
        handleLogTaskHistory({
          taskId: task.id,
          event: 'verified',
          by: 'Current Supervisor',
          at: new Date().toISOString(),
          notes: 'Task verified in batch by supervisor'
        });
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error verifying all tasks:', error);
      return Promise.reject(error);
    } finally {
      // setIsLoading(false); // isLoading state removed
    }
  };
  
  // Handler functions for parts
  // Will be used when InventoryPanel component is implemented
  // Will be used when InventoryPanel component is implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAssignPart = (partId: string, quantity: number) => {
    // Implementation will be used when component is ready
    console.log(`Would assign part ${partId} with quantity ${quantity}`);
  };
  
  // Will be used when InventoryPanel component is implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRemovePart = (assignmentId: string) => {
    // Implementation will be used when component is ready
    console.log(`Would remove part assignment ${assignmentId}`);
  };
  
  // Will be used when InventoryPanel component is implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdatePart = (assignmentId: string, updates: { quantity?: number; status?: string }) => {
    // Implementation will be used when component is ready
    console.log(`Would update part assignment ${assignmentId} with`, updates);
  };
  
  // Handler functions for notes
  const handleAddNote = (text: string, type: 'general' | 'technician' | 'customer' | 'internal') => {
    const newNote = {
      id: `n${Date.now()}`,
      text,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      type: type as 'technician' | 'customer' // Ensure type compatibility
    };
    setNotes(prevNotes => [...prevNotes, newNote]);
  };
  
  const handleEditNote = (id: string, text: string) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id ? { ...note, text } : note
      )
    );
  };
  
  const handleDeleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };
  
  // Handler for job completion - Will be used by CompletionPanel when it's implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCompleteJob = async () => {
    try {
      setIsLoading(true);

      // Update job card status in Firestore
      const jobCardRef = doc(db, 'jobCards', jobCard.id);
      await updateDoc(jobCardRef, { status: 'completed' });

      setJobCard(prev => ({ ...prev, status: 'completed' as 'in_progress' }));

      // Log the job card completion
      if (jobCard.faultId) {
        console.log(`Fault ${jobCard.faultId} marked as resolved`);
      }
    } catch (error) {
      console.error('Error completing job card:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handler for invoice generation - Will be used by CompletionPanel when it's implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleGenerateInvoice = async () => {
    try {
      setIsLoading(true);

      // Create an invoice in Firestore
      const invoiceRef = doc(db, 'invoices', jobCard.id);
      await updateDoc(invoiceRef, {
        jobCardId: jobCard.id,
        status: 'generated',
        totalAmount: jobCard.totalEstimate,
        createdAt: new Date().toISOString()
      });

      alert(`Invoice generated for job card: ${jobCard.id}`);

      setJobCard(prev => ({ ...prev, status: 'invoiced' as 'in_progress' }));
    } catch (error) {
      console.error('Error generating invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle user role for demo purposes
  const toggleUserRole = () => {
    setUserRole(prev => prev === 'technician' ? 'supervisor' : 'technician');
  };
  
  return (
    <div className="space-y-6">
      {/* Role toggle for demo */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex justify-between items-center">
        <span className="text-blue-700">Current Role: <strong>{userRole === 'technician' ? 'Technician' : 'Supervisor'}</strong></span>
        <Button 
          size="sm" 
          onClick={toggleUserRole} 
          variant="outline"
        >
          Switch to {userRole === 'technician' ? 'Supervisor' : 'Technician'} View
        </Button>
      </div>
      
      <JobCardHeader 
        jobCard={jobCard}
        onBack={() => {}} // No-op for demo
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* TaskManager component temporarily commented out - missing file
          <TaskManager
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskAdd={handleTaskAdd}
            onTaskDelete={handleTaskDelete}
            taskHistory={taskHistory}
            onLogTaskHistory={handleLogTaskHistory}
            userRole={userRole}
          />
          */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-gray-500">Task management functionality is temporarily unavailable.</p>
          </div>
          
          <JobCardNotes
            notes={notes}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
          />
        </div>
        
        <div className="space-y-6">
          {/* QAReviewPanel component temporarily commented out - missing file
          {userRole === 'supervisor' && (
            <QAReviewPanel
              jobCardId={jobCard.id}
              tasks={tasks}
              taskHistory={taskHistory}
              onVerifyTask={handleVerifyTask}
              canVerifyAllTasks={tasks.some(task => task.status === 'completed' && !task.verifiedBy)}
              onVerifyAllTasks={handleVerifyAllTasks}
              isLoading={isLoading}
            />
          )}
          */}
          
          {/* InventoryPanel component temporarily commented out - missing file
          <InventoryPanel
            jobCardId={jobCard.id}
            assignedParts={assignedParts}
            onAssignPart={handleAssignPart}
            onRemovePart={handleRemovePart}
            onUpdatePart={handleUpdatePart}
          />
          */}
          
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md mb-4">
            <p className="text-gray-500">Inventory management functionality is temporarily unavailable.</p>
          </div>
          
          {/* CompletionPanel component temporarily commented out - missing file
          {userRole === 'supervisor' && (
            <CompletionPanel
              jobCardId={jobCard.id}
              status={jobCard.status}
              tasks={tasks}
              onComplete={handleCompleteJob}
              onGenerateInvoice={handleGenerateInvoice}
            />
          )}
          */}
        </div>
      </div>
    </div>
  );
};

export default JobCard;