'use client'
import React, { useState, useEffect } from 'react';

interface Payslip {
  id: string;
  month: string;
  year: string;
  // Add other properties if present in your Payslip model
}

const LeavePage = () => {
  const [payslips, setPayslips] = useState<Payslip[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/fetch-payslip');
        if (!response.ok) {
          throw new Error('Failed to fetch payslips');
        }
        const data = await response.json();
        setPayslips(data);
      } catch (error) {
        console.error('Error fetching payslips:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Leave Page</h1>
      <ul>
        {payslips.map((payslip) => (
          <li key={payslip.id}>
            Month: {payslip.month}, Year: {payslip.year}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeavePage;
