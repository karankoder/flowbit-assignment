export const getGeminiExtractionPrompt = (): string => `
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

export const getGroqExtractionPrompt = (text: string): string => {
  return `
    You are an expert data extraction AI.
    Extract the following information from the provided invoice text and return it as a clean JSON object.
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

    Invoice Text:
    ---
    ${text}
    ---
  `;
};
