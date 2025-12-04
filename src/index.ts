import { DurableObject } from "cloudflare:workers";

export class MyDurableObject extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx = ctx;
  }

  // THIS is the function your API was trying to find!
  async getStatus() {
    let status = await this.ctx.storage.get("status") || "Waiting on Vendor";
    let history = await this.ctx.storage.get("history") || [];
    
    return { 
      vendor: "Active", 
      status: status, 
      source: "Durable Object Storage",
      historyCount: history.length
    };
  }

  async logInteraction(data) {
    let history = await this.ctx.storage.get("history") || [];
    history.push({ ...data, date: new Date().toISOString() });
    await this.ctx.storage.put("history", history);
    return { success: true };
  }
}

// The Worker part needs to exist, but doesn't do much
export default {
  async fetch(request, env) {
    return new Response("Durable Object Storage Unit Active");
  }
};
