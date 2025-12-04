import { DurableObject } from "cloudflare:workers";

export class MyDurableObject extends DurableObject {
  ctx: DurableObjectState;

  constructor(ctx: DurableObjectState, env: any) {
    super(ctx, env);
    this.ctx = ctx;
  }

  async getStatus() {
    let status = (await this.ctx.storage.get("status")) || "Waiting on Vendor";
    let history = (await this.ctx.storage.get("history") as any[]) || [];
    
    return { 
      vendor: "Active", 
      status: status, 
      source: "Durable Object Storage",
      historyCount: history.length
    };
  }

  async logInteraction(data: any) {
    let history = (await this.ctx.storage.get("history") as any[]) || [];
    history.push({ ...data, date: new Date().toISOString() });
    await this.ctx.storage.put("history", history);
    return { success: true };
  }
}

export default {
  async fetch(request: Request, env: any) {
    return new Response("Durable Object Storage Unit Active");
  }
};
