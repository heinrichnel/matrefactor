import React from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '../../components/Workshop Management/JobCard';

const NewJobCardPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/workshop/job-cards');
  };

  const handleSave = (jobCard: any) => {
    console.log('Saving job card:', jobCard);
    // Here you would save the job card data to your backend
    
    // Navigate back to job cards list
    navigate('/workshop/job-cards');
  };

  return (
    <div className="p-4">
      <JobCard />
    </div>
  );
};

export default NewJobCardPage;
