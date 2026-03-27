import axios from 'axios';
import Job from '../models/Job.js';

const systemPrompt = `You are a professional, helpful, and highly intelligent AI Career Assistant for a premium Job Portal platform.
You assist both Job Seekers and Employers.

Your capabilities include:
1. Helping users find jobs based on their skills, location, and experience.
2. Answering career-related questions, providing interview tips, and reviewing resume best practices.
3. Guiding users on how to use the platform (e.g., "How do I apply?", "How do I upload a resume?", "How do I post a job?").

Guidelines:
- Keep your responses concise, well-formatted, and easy to read.
- Use bullet points where appropriate.
- Be encouraging and professional.
- Do not make up fake job listings; if asked for jobs, politely explain that you can guide them on how to search, or provide the current active listings if they are provided to you in the context.

Context format: You will be provided with the user's role (candidate or employer), skills, and potentially some job data from the database. Use this context to personalize your response.
`;

export const chatWithAI = async (req, res) => {
  try {
    const { message, history, context } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Optional: Fetch some recent open jobs if the user is asking about jobs
    let recentJobsContext = '';
    const messageLower = message.toLowerCase();
    if (messageLower.includes('job') || messageLower.includes('role') || messageLower.includes('work')) {
        const recentJobs = await Job.find({ status: 'open' }).sort('-createdAt').limit(5).select('title company location salary jobType');
        if (recentJobs.length > 0) {
            recentJobsContext = `\n\nCurrent open jobs in the database (for context):\n` + recentJobs.map(j => `- ${j.title} at ${j.company} (${j.location}) - ${j.jobType}`).join('\n');
        }
    }

    const fullContext = `User Role: ${context?.role || 'Guest'}\nUser Skills: ${context?.skills?.join(', ') || 'None provided'}${recentJobsContext}`;

    // Map history to OpenRouter (OpenAI) format
    // Exclude the first AI greeting if it's not relevant or format it safely
    const formattedHistory = [];
    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        formattedHistory.push({
          role: msg.role === 'ai' ? 'assistant' : 'user',
          content: msg.content
        });
      });
    }

    const messages = [
      { role: 'system', content: systemPrompt + '\n\n' + fullContext },
      ...formattedHistory,
      { role: 'user', content: message }
    ];

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.5-flash',
        messages: messages,
        max_tokens: 10000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5173', 
          'X-Title': 'Job Portal AI',
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data.choices[0].message.content;

    res.status(200).json({
      success: true,
      message: text,
    });
  } catch (error) {
    console.error('OpenRouter AI Error:', error?.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to process AI request. Please try again later.' });
  }
};
