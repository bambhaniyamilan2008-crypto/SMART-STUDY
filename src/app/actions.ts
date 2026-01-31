// @ts-nocheck
'use server';

import { aiChatTutorStudentQueries } from '@/ai/flows/ai-chat-tutor-student-queries';
import { generateSmartTimetable } from '@/ai/flows/smart-timetable-flow';
import { generateStudyPlan } from '@/ai/flows/study-planner-flow';
import { generateClassReport } from '@/ai/flows/class-report-flow';
import { generateStudentReport } from '@/ai/flows/student-report-flow';
import { z } from 'zod';

const MessageSchema = z.object({
  question: z.string().min(1, { message: 'Message cannot be empty.' }),
});

export async function getAIResponse(prevState: any, formData: FormData) {
  const validatedFields = MessageSchema.safeParse({
    question: formData.get('question'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Message cannot be empty.',
    };
  }

  const { question } = validatedFields.data;

  try {
    const result = await aiChatTutorStudentQueries({ question });
    return { success: true, answer: result.answer, question };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to get a response from the AI tutor.' };
  }
}

export async function smartGenerateTimetable(className: string) {
  try {
    const teachers = [
      { name: 'Mr. Rahul Rathod', subject: 'Mathematics' },
      { name: 'Mr. Vinesh Patel', subject: 'Physics' },
      { name: 'Mr. Bhavesh Gohil', subject: 'English' },
      { name: 'Mr. Mohan Baraiya', subject: 'Chemistry' },
      { name: 'Mr. Kirit Mavani', subject: 'Art' },
      { name: 'Mr. Vishal Bambhaniya', subject: 'Biology' },
    ];
    
    const result = await generateSmartTimetable({
      className,
      teachers,
      constraints: 'Ensure core subjects are spread across the week. Friday should ideally end with a lighter subject like Art or Music if possible.'
    });
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Smart generate error:', error);
    return { success: false, message: 'The AI service encountered an error generating the timetable.' };
  }
}

export async function smartGenerateStudyPlan(subjects: any[], dailyHours: number) {
  try {
    const result = await generateStudyPlan({
      subjects,
      dailyHours
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Study planner error:', error);
    return { success: false, message: 'Failed to generate smart study plan.' };
  }
}

export async function smartGenerateClassReport(className: string) {
  try {
    // Detailed performance data for each class
    const mockData = {
      '9A': {
        averageAttendance: 88,
        subjectsPerformance: [
          { subject: 'Mathematics', averageScore: 72, passPercentage: 85 },
          { subject: 'Physics', averageScore: 68, passPercentage: 80 },
          { subject: 'English', averageScore: 82, passPercentage: 95 }
        ]
      },
      '9B': {
        averageAttendance: 82,
        subjectsPerformance: [
          { subject: 'Mathematics', averageScore: 65, passPercentage: 75 },
          { subject: 'Physics', averageScore: 70, passPercentage: 82 },
          { subject: 'History', averageScore: 78, passPercentage: 90 }
        ]
      },
      '10A': {
        averageAttendance: 94,
        subjectsPerformance: [
          { subject: 'Mathematics', averageScore: 85, passPercentage: 92 },
          { subject: 'Physics', averageScore: 78, passPercentage: 88 },
          { subject: 'Chemistry', averageScore: 82, passPercentage: 90 }
        ]
      },
      '11A': {
        averageAttendance: 91,
        subjectsPerformance: [
          { subject: 'Biology', averageScore: 88, passPercentage: 96 },
          { subject: 'Chemistry', averageScore: 84, passPercentage: 92 },
          { subject: 'English', averageScore: 80, passPercentage: 89 }
        ]
      },
      '12A': {
        averageAttendance: 96,
        subjectsPerformance: [
          { subject: 'Mathematics', averageScore: 92, passPercentage: 98 },
          { subject: 'Physics', averageScore: 89, passPercentage: 95 },
          { subject: 'Computer Science', averageScore: 94, passPercentage: 100 }
        ]
      }
    };

    const inputData = mockData[className] || mockData['10A'];

    const result = await generateClassReport({
      className,
      ...inputData
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Class report error:', error);
    return { success: false, message: 'Failed to generate smart class report.' };
  }
}

export async function smartGenerateStudentReport(studentName: string) {
  try {
    const studentData = {
      'Aarav Patel': {
        className: '10A',
        attendance: 96,
        grades: [
          { subject: 'Mathematics', score: 92, grade: 'A' },
          { subject: 'Physics', score: 88, grade: 'A-' },
          { subject: 'Chemistry', score: 94, grade: 'A' },
          { subject: 'English', score: 85, grade: 'B+' },
          { subject: 'Biology', score: 90, grade: 'A-' }
        ]
      },
      'Riya Shah': {
        className: '9B',
        attendance: 89,
        grades: [
          { subject: 'Mathematics', score: 78, grade: 'B' },
          { subject: 'Physics', score: 82, grade: 'B+' },
          { subject: 'Chemistry', score: 75, grade: 'B' },
          { subject: 'History', score: 94, grade: 'A+' },
          { subject: 'English', score: 88, grade: 'A-' }
        ]
      },
      'Milan bambhaniya': {
        className: '10A',
        attendance: 82,
        grades: [
          { subject: 'Mathematics', score: 98, grade: 'A+' },
          { subject: 'Physics', score: 87, grade: 'A-' },
          { subject: 'Chemistry', score: 83, grade: 'B+' },
          { subject: 'English', score: 69, grade: 'C+' },
          { subject: 'Art', score: 92, grade: 'A' }
        ]
      },
      'Devansh Mehta': {
        className: '11C',
        attendance: 94,
        grades: [
          { subject: 'Mathematics', score: 88, grade: 'A-' },
          { subject: 'Physics', score: 90, grade: 'A-' },
          { subject: 'Biology', score: 95, grade: 'A' },
          { subject: 'English', score: 82, grade: 'B+' }
        ]
      },
      'Kavya Joshi': {
        className: '8A',
        attendance: 98,
        grades: [
          { subject: 'Mathematics', score: 96, grade: 'A+' },
          { subject: 'Science', score: 94, grade: 'A' },
          { subject: 'History', score: 90, grade: 'A-' },
          { subject: 'English', score: 92, grade: 'A' }
        ]
      },
      'Harshil Desai': {
        className: '12A',
        attendance: 85,
        grades: [
          { subject: 'Physics', score: 78, grade: 'B' },
          { subject: 'Mathematics', score: 82, grade: 'B+' },
          { subject: 'Computer Science', score: 94, grade: 'A' },
          { subject: 'English', score: 75, grade: 'B' }
        ]
      }
    };

    const input = studentData[studentName] || {
      className: 'Unknown',
      attendance: 90,
      grades: [{ subject: 'General', score: 85, grade: 'B' }]
    };

    const result = await generateStudentReport({
      studentName,
      ...input
    });
    
    // Return both the AI result and the raw academic data for UI display
    return { 
      success: true, 
      data: {
        ...result,
        academicData: input
      }
    };
  } catch (error) {
    console.error('Student report error:', error);
    return { success: false, message: 'Failed to generate smart student report.' };
  }
}
