
'use server';
/**
 * @fileOverview A flow to generate course content (summary and quiz) from a video transcript.
 *
 * - generateCourseContent - A function that handles the content generation.
 * - GenerateCourseContentInput - The input type for the function.
 * - GenerateCourseContentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCourseContentInputSchema = z.object({
  title: z.string().describe('The title of the video lesson.'),
  transcript: z.string().describe('The full text transcript of the video.'),
});
export type GenerateCourseContentInput = z.infer<typeof GenerateCourseContentInputSchema>;

const GenerateCourseContentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the video transcript, written in 2-3 paragraphs.'),
  quiz: z.array(z.object({
    question: z.string().describe('A multiple-choice question based on the transcript.'),
    options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
    correctAnswer: z.string().describe('The correct answer from the options array.'),
  })).length(4).describe('An array of exactly 4 multiple-choice questions.'),
});
export type GenerateCourseContentOutput = z.infer<typeof GenerateCourseContentOutputSchema>;

export async function generateCourseContent(input: GenerateCourseContentInput): Promise<GenerateCourseContentOutput> {
  return generateCourseContentFlow(input);
}

const generateCourseContentPrompt = ai.definePrompt({
  name: 'generateCourseContentPrompt',
  input: { schema: GenerateCourseContentInputSchema },
  output: { schema: GenerateCourseContentOutputSchema },
  prompt: `You are an expert instructional designer. Based on the provided video title and transcript, your task is to generate a concise summary and a multiple-choice quiz.

The summary should be 2-3 paragraphs long, capturing the key concepts and main points from the transcript.

The quiz must contain exactly 4 multiple-choice questions. Each question must have exactly 4 options, one of which is the correct answer. The questions should test understanding of the core concepts presented in the transcript.

Video Title: {{{title}}}
Transcript:
{{{transcript}}}`,
});

const generateCourseContentFlow = ai.defineFlow(
  {
    name: 'generateCourseContentFlow',
    inputSchema: GenerateCourseContentInputSchema,
    outputSchema: GenerateCourseContentOutputSchema,
  },
  async input => {
    try {
      console.log('Generating content with gemini-2.5-flash model...');
      
      const { output } = await generateCourseContentPrompt(input, { model: 'googleai/gemini-2.5-flash' });
      
      if (!output) {
        throw new Error('AI model returned no output.');
      }
      
      console.log('Successfully generated content.');
      return output;

    } catch (error) {
      console.error('An error occurred during content generation:', error);
      // Re-throw a user-friendly error to be caught by the client.
      throw new Error('Failed to generate course content from the AI model. Please try again later.');
    }
  }
);
