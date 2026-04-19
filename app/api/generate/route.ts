import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { dishName, ingredients, cookingMethod, price } = await req.json();
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert restaurant menu copywriter. Create marketing-oriented dish descriptions with sensory language, provenance details, and upsell framing. Use markdown.`,
        },
        {
          role: "user",
          content: `Write a menu description for:\n- Dish name: ${dishName}\n- Ingredients: ${ingredients}\n- Cooking method: ${cookingMethod}\n- Price: ${price}\n\nProvide:\n1. Polished menu description (2-3 sentences, sensory language)\n2. Provenance and sourcing notes\n3. Chef's note or story angle\n4. Suggested wine or drink pairing\n5. Upsell framing tips`,
        },
      ],
      temperature: 0.7,
    });
    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
