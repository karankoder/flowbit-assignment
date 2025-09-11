import { Request, Response } from 'express';
import { Invoice } from '../models/invoice';
import axios from 'axios';
import { GoogleGenAI } from '@google/genai';
import { config } from 'dotenv';
import Groq from 'groq-sdk';
import pdf from 'pdf-parse';
import {
  getGeminiExtractionPrompt,
  getGroqExtractionPrompt,
} from '../utils/prompts';

config({
  path: './data/config.env',
});

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const cleanJsonString = (raw: string): string =>
  raw.replace(/```json\n?|```/g, '').trim();

export const extractDataFromPdf = async (req: Request, res: Response) => {
  const { fileUrl, fileName, model: aiModel } = req.body;

  if (!fileUrl || !aiModel) {
    return res.status(400).json({ message: 'fileUrl and model are required.' });
  }

  try {
    const pdfResponse = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
    });
    const pdfBuffer = Buffer.from(pdfResponse.data);

    let extractedData: any;
    let aiResponseText: string | null = null;

    if (aiModel === 'gemini') {
      const test = await genAI.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
      });
      console.log(test);

      const result = await genAI.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: getGeminiExtractionPrompt() },
              {
                inlineData: {
                  mimeType: 'application/pdf',
                  data: pdfBuffer.toString('base64'),
                },
              },
            ],
          },
        ],
      });

      const aiResponseText =
        result.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || '')
          .join(' ')
          .trim() || '';

      const cleanedJson = cleanJsonString(aiResponseText);
      extractedData = JSON.parse(cleanedJson);
    } else if (aiModel == 'groq') {
      const pdfData = await pdf(pdfBuffer);

      const pdfText = pdfData.text;

      const prompt = getGroqExtractionPrompt(pdfText);

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
      });

      aiResponseText = chatCompletion.choices[0]?.message?.content || null;
      if (!aiResponseText) {
        return res
          .status(500)
          .json({ message: 'AI model failed to return a response.' });
      }

      const cleanedJson = cleanJsonString(aiResponseText);
      extractedData = JSON.parse(cleanedJson);
    } else {
      return res.status(400).json({ message: 'Please use gemini or groq' });
    }

    const invoice = new Invoice({ fileUrl, fileName, ...extractedData });
    await invoice.save();

    res.status(200).json(invoice);
  } catch (error: any) {
    console.error('Extraction failed:', error);
    res
      .status(500)
      .json({ message: 'Failed to extract data.', error: error.message });
  }
};
