import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export { openai }

export async function generateProductIdea(input: {
  targetAudience: string
  problem: string
  productType: string
  topic: string
  desiredPrice: number
  complexity: string
  additionalInstructions?: string
}) {
  try {
    const prompt = `
You are an expert digital product strategist. Generate a comprehensive digital product idea based on:

Target Audience: ${input.targetAudience}
Problem to Solve: ${input.problem}
Product Type: ${input.productType}
Topic: ${input.topic}
Desired Price: $${input.desiredPrice}
Complexity Level: ${input.complexity}
${input.additionalInstructions ? `Additional Requirements: ${input.additionalInstructions}` : ''}

Provide a detailed response in JSON format with the following fields:
{
  "productIdea": "string - concise product idea",
  "marketPositioning": "string - how to position this in market",
  "title": "string - product title",
  "subtitle": "string - compelling subtitle",
  "tableOfContents": ["string"],
  "productDescription": "string - detailed description",
  "benefits": ["string"],
  "features": ["string"],
  "faq": [{"question": "string", "answer": "string"}],
  "salesCopy": "string - compelling sales message",
  "seoTitle": "string",
  "seoDescription": "string",
  "marketingHooks": ["string"],
  "socialPosts": ["string"],
  "emailCampaign": ["string"],
  "bonusIdeas": ["string"]
}

Ensure the response is valid JSON.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('No response from OpenAI')

    try {
      return JSON.parse(content)
    } catch {
      return { raw: content }
    }
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
}

export async function generateContentForPlatform(input: {
  product: string
  platform: string
  contentType: string
  hook?: string
  additionalContext?: string
}) {
  try {
    const prompt = `
Generate engaging ${input.contentType} content for ${input.platform} about the product: "${input.product}"
${input.hook ? `Hook/Angle: ${input.hook}` : ''}
${input.additionalContext ? `Context: ${input.additionalContext}` : ''}

Optimize for the platform's best practices and audience. Include engaging hooks, clear CTAs, and platform-appropriate hashtags.

Provide response in JSON format:
{
  "caption": "string",
  "cta": "string",
  "hashtags": ["string"],
  "mediaPrompt": "string - description for generating image/video",
  "hook": "string - opening hook"
}

Ensure valid JSON.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('No response from OpenAI')

    try {
      return JSON.parse(content)
    } catch {
      return { raw: content }
    }
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
}

export async function generateAISupportDraft(input: {
  category: string
  subject: string
  description: string
}) {
  try {
    const prompt = `
You are a professional customer support representative. Draft a helpful response to this support ticket:

Category: ${input.category}
Subject: ${input.subject}
Customer Question/Issue: ${input.description}

Write a professional, empathetic, and helpful response. Be concise but thorough.
Use plain language and avoid jargon.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return response.choices[0].message.content || ''
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
}

export async function generateAICeoAnalysis(data: {
  salesData: any
  trafficData: any
  contentPerformance: any
  emailMetrics: any
  supportTickets: any
}) {
  try {
    const prompt = `
You are an AI CEO analyzing business performance. Based on this data, provide strategic insights:

Sales Data: ${JSON.stringify(data.salesData)}
Traffic Data: ${JSON.stringify(data.trafficData)}
Content Performance: ${JSON.stringify(data.contentPerformance)}
Email Metrics: ${JSON.stringify(data.emailMetrics)}
Support Tickets: ${JSON.stringify(data.supportTickets)}

Provide a JSON response:
{
  "whatHappened": "string - summary of key metrics",
  "whyItHappened": "string - analysis of causes",
  "bestPerformingProduct": "string",
  "bestPerformingChannel": "string",
  "problemsDetected": ["string"],
  "growthOpportunities": ["string"],
  "recommendedActions": [{"action": "string", "priority": "HIGH|MEDIUM|LOW", "impact": "string"}],
  "contentToCreate": ["string"],
  "productIdeas": ["string"],
  "experiments": ["string"]
}

Ensure valid JSON.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('No response from OpenAI')

    try {
      return JSON.parse(content)
    } catch {
      return { raw: content }
    }
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
}
