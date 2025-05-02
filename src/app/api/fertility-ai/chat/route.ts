import { NextRequest, NextResponse } from 'next/server';
import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { MemorySaver, StateGraph, START, END, MessagesAnnotation } from '@langchain/langgraph';
import { v4 as uuidv4 } from 'uuid';

// Define our model - in production use a proper API key
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.5,
});

// Create prompt template with system message
const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system", 
    `You are FertilityAI, a specialized assistant for a sperm donation and fertility platform.
     
     Your primary functions:
     - Answer questions about sperm donation processes
     - Explain fertility clinic services
     - Provide information about compensation, care services, and payment timelines
     - Help users find appropriate donation opportunities based on their preferences
     - Maintain medical accuracy while being conversational and supportive
     
     Important topics you can discuss:
     - The sperm donation process from application to compensation
     - Different care types offered during donation (Standard, Premium, Extended Support)
     - Payment options and timelines (immediate to several weeks)
     - Compensation ranges ($150-$450 typically)
     
     Be concise, medically accurate, and non-judgmental at all times.`
  ],
  ["placeholder", "{messages}"],
]);

// Create a memory saver that persists between API calls
const memory = new MemorySaver();

// Define the workflow
function setupWorkflow() {
  // Define the function that calls the model
  const callModel = async (state: typeof MessagesAnnotation.State) => {
    const prompt = await promptTemplate.invoke(state);
    const response = await llm.invoke(prompt);
    return { messages: [response] };
  };

  // Define workflow graph
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

  // Compile with memory
  return workflow.compile({ checkpointer: memory });
}

// Initialize workflow
const langChainWorkflow = setupWorkflow();

// Handle POST requests to /api/chat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, threadId } = body;
    
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Use provided threadId or generate a new one
    const currentThreadId = threadId || uuidv4();
    
    const config = { configurable: { thread_id: currentThreadId } };
    const input = {
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    };
    
    const result = await langChainWorkflow.invoke(input, config);
    
    // Get the last message (the response)
    const lastMessage = result.messages[result.messages.length - 1];
    
    return NextResponse.json({
      response: lastMessage.content,
      threadId: currentThreadId
    });
  } catch (error) {
    console.error("Error processing chat request:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}