
import React, { useState, useCallback } from 'react';
import { LeaveRequest, SubmissionStatus } from './types';
import { generateConfirmationMessage } from './services/geminiService';
import LeaveForm from './components/LeaveForm';
import ConfirmationModal from './components/ConfirmationModal';

function App() {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(SubmissionStatus.Idle);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string>('');
  
  const initialFormState: LeaveRequest = {
    leaveType: 'ลาป่วย',
    startDate: '',
    endDate: '',
    reason: '',
  };

  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest>(initialFormState);

  const handleSubmit = useCallback(async (currentLeaveRequest: LeaveRequest) => {
    setSubmissionStatus(SubmissionStatus.Loading);
    setLeaveRequest(currentLeaveRequest);
    
    try {
      const message = await generateConfirmationMessage(currentLeaveRequest);
      setConfirmationMessage(message);
      setSubmissionStatus(SubmissionStatus.Success);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setErrorDetails(`เกิดข้อผิดพลาดในการส่งคำขอ: ${errorMessage}`);
      setSubmissionStatus(SubmissionStatus.Error);
    }
  }, []);

  const handleCloseModal = () => {
    setSubmissionStatus(SubmissionStatus.Idle);
    setConfirmationMessage('');
    setErrorDetails('');
    setLeaveRequest(initialFormState);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-800">ระบบยื่นใบลา</h1>
        <p className="text-slate-600 mt-2">กรุณากรอกข้อมูลด้านล่างเพื่อส่งคำร้องขอลา</p>
      </header>

      <main className="w-full max-w-2xl">
        <LeaveForm 
          onSubmit={handleSubmit} 
          isSubmitting={submissionStatus === SubmissionStatus.Loading}
          initialState={leaveRequest}
        />
      </main>
      
      {submissionStatus !== SubmissionStatus.Idle && (
        <ConfirmationModal
          status={submissionStatus}
          message={confirmationMessage}
          errorDetails={errorDetails}
          onClose={handleCloseModal}
          leaveRequest={leaveRequest}
        />
      )}
    </div>
  );
}

export default App;
