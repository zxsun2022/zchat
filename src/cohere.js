// src/cohere.js
export const chatWithCohere = async (apiKey, message, chatHistory, params, preamble, onMessage) => {
  const url = 'https://api.cohere.ai/v1/chat';
  const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
  };

  const data = {
      model: 'command-r-08-2024', 
      query: message,
      chat_history: chatHistory.filter((msg) => msg.message && msg.message.trim() !== ''),
      temperature: params.temperature,
      max_tokens: 2500, 
      return_likelihoods: 'NONE',
      stop_sequences: [],
      p: params.top_p,
      k: params.top_k,
      repetition_penalty: params.repetitionPenalty,
      preamble: preamble || '', 
      stream: true, 
      connectors: [], 
      prompt_truncation: "OFF", 
  };

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'API response fail.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let buffer = '';

      while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
              buffer += decoder.decode(value, { stream: true });
              let boundary = buffer.indexOf('\n');
              while (boundary !== -1) {
                  const chunk = buffer.slice(0, boundary).trim();
                  buffer = buffer.slice(boundary + 1);
                  if (chunk) {
                      try {
                          const parsed = JSON.parse(chunk);
                          if (parsed.text) {
                              onMessage(parsed.text);
                          }
                      } catch (e) {
                          console.error('parse JSON fail:', e, 'block:', chunk);
                      }
                  }
                  boundary = buffer.indexOf('\n');
              }
          }
      }

      return; 
  } catch (error) {
      console.error('chatWithCohere error:', error);
      throw error;
  }
};
