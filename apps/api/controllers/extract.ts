import { Request, Response } from 'express';
import { Invoice } from '../models/invoice';
import axios from 'axios';
import { GoogleGenAI } from '@google/genai';
import { config } from 'dotenv';

config({
  path: './data/config.env',
});

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const getExtractionPrompt = (): string => `
  You are an expert data extraction AI.
  Based on the provided PDF invoice file, extract the following information and return it as a clean JSON object.
  Do not include any explanatory text, markdown formatting, or anything else besides the JSON object.

  The required JSON schema is:
  {
    "vendor": { "name": "string", "address": "string", "taxId": "string" },
    "invoice": {
      "number": "string",
      "date": "string",
      "currency": "string",
      "subtotal": "number",
      "taxPercent": "number",
      "total": "number",
      "poNumber": "string",
      "poDate": "string",
      "lineItems": [{ "description": "string", "unitPrice": "number", "quantity": "number", "total": "number" }]
    }
  }
`;

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
              { text: getExtractionPrompt() },
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
    } else {
      return res
        .status(400)
        .json({ message: "Only 'gemini' model is supported right now." });
    }

    console.log(extractedData);

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
