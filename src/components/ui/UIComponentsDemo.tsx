import React, { useState } from 'react';
import { 
  ApplicantInfoCard, 
  ProgressStepper, 
  StatsCardGroup, 
  VerticalStepper 
} from '@/components/ui';
import type { StepperItem } from '@/components/ui/ProgressStepper';
import type { VerticalStepItem } from '@/components/ui/VerticalStepper';
import type { StatItem } from '@/components/ui/StatsCardGroup';

const UIComponentsDemo = () => {
  const [activeStep, setActiveStep] = useState('form');

  // Progress stepper data
  const steps: StepperItem[] = [
    { id: 'details', label: 'Job details', status: 'completed' },
    { id: 'form', label: 'Application form', status: 'current' },
    { id: 'preview', label: 'Preview', status: 'pending' }
  ];

  // Vertical stepper data
  const verticalSteps: VerticalStepItem[] = [
    { 
      id: 'account', 
      title: 'Create account', 
      description: 'Vitae sed mi luctus laoreet.', 
      status: 'completed' 
    },
    { 
      id: 'profile', 
      title: 'Profile information', 
      description: 'Cursus semper viverra facilisis et et some more.', 
      status: 'current' 
    },
    { 
      id: 'business', 
      title: 'Business information', 
      description: 'Penatibus eu quis ante.', 
      status: 'pending' 
    },
    { 
      id: 'theme', 
      title: 'Theme', 
      description: 'Faucibus nec enim leo et.', 
      status: 'pending' 
    },
    { 
      id: 'preview', 
      title: 'Preview', 
      description: 'Iusto et officia maiores porro ad non quas.', 
      status: 'pending' 
    }
  ];

  // Stats data
  const statsData: StatItem[] = [
    { 
      id: 'subscribers', 
      title: 'Total Subscribers', 
      value: 71897, 
      previousValue: 70946, 
      change: 12, 
      changeDirection: 'up',
      format: (val) => val.toLocaleString() 
    },
    { 
      id: 'open-rate', 
      title: 'Avg. Open Rate', 
      value: 58.16, 
      previousValue: 56.14, 
      change: 2.02, 
      changeDirection: 'up',
      format: (val) => val + '%' 
    },
    { 
      id: 'click-rate', 
      title: 'Avg. Click Rate', 
      value: 24.57, 
      previousValue: 28.62, 
      change: 4.05, 
      changeDirection: 'down',
      format: (val) => val + '%' 
    }
  ];

  // Applicant data
  const applicantData = {
    fullName: "Margot Foster",
    applicationFor: "Backend Developer",
    email: "margotfoster@example.com",
    salaryExpectation: "$120,000",
    about: "Fugiat ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint.",
    attachments: [
      { file: "resume_back_end_developer.pdf", size: "2.4mb" },
      { file: "coverletter_back_end_developer.pdf", size: "4.5mb" }
    ]
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">UI Components Demo</h1>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Progress Stepper</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <ProgressStepper 
            steps={steps} 
            onStepClick={(stepId) => setActiveStep(stepId)} 
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Vertical Stepper</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <VerticalStepper 
            steps={verticalSteps} 
            onStepClick={(stepId) => console.log('Step clicked:', stepId)} 
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Stats Card Group</h2>
        <StatsCardGroup 
          title="Last 30 days" 
          stats={statsData} 
          className="shadow"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Applicant Info Card</h2>
        <ApplicantInfoCard {...applicantData} />
      </section>
    </div>
  );
};

export default UIComponentsDemo;
