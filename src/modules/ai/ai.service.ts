import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly hfApiKey = process.env.AI_API_KEY;
  private readonly model = 'openai/gpt-oss-120b:fireworks-ai';

  private parseAiJson(rawText: string) {
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      ['title', 'content', 'tags'].forEach((key) => {
        if (parsed[key]) {
          parsed[key] = parsed[key]
            .replace(/\\n/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        }
      });

      return parsed;
    } catch {
      return {
        title: '',
        content: rawText.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim(),
        tags: '',
      };
    }
  }

  async getSuggestion(topic: string) {
    const prompt = `Tôi muốn tạo một câu hỏi bằng tiếng Việt hoặc tiếng Anh trên diễn đàn trao đổi học tập tiếng anh về chủ đề: "${topic}".
Hãy trả về kết quả JSON với 3 trường:
{
  "title": "Tiêu đề câu hỏi",
  "content": "Nội dung chi tiết",
  "tags": "tag1, tag2, tag3"
}`;

    try {
      const response = await axios.post(
        'https://router.huggingface.co/v1/chat/completions',
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          stream: false,
        },
        {
          headers: {
            Authorization: `Bearer ${this.hfApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Router API trả text trong response.data.choices[0].message.content
      const rawText = response.data?.choices?.[0]?.message?.content || '';
      try {
        return this.parseAiJson(rawText);
      } catch {
        // Nếu không parse được JSON, vẫn trả content
        return { title: '', content: rawText, tags: '' };
      }
    } catch (err) {
      console.error('Hugging Face Router API error:', err);
      return { title: '', content: '', tags: '' };
    }
  }
}
