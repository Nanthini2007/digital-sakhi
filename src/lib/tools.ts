// Security Allowlist for AI Tools

export const ALLOWED_TOOLS = [
  "search_service",
  "get_eligibility",
  "get_documents",
  "get_next_step",
  "open_official_site",
  "save_progress",
] as const;

export type AllowedToolName = typeof ALLOWED_TOOLS[number];

export interface ToolCallRequest {
  toolName: string;
  params?: Record<string, unknown>;
}

export function isToolAllowed(toolName: string): toolName is AllowedToolName {
  return ALLOWED_TOOLS.includes(toolName as AllowedToolName);
}

export function validateAndExecuteTool(request: ToolCallRequest) {
  if (!isToolAllowed(request.toolName)) {
    throw new Error(`Security Violation: Tool '${request.toolName}' is not in the Sakhi allowlist.`);
  }

  switch (request.toolName) {
    case "search_service":
      return { status: "success", action: "Search performed" };
    case "get_eligibility":
      return { status: "success", action: "Eligibility retrieved" };
    case "get_documents":
      return { status: "success", action: "Documents retrieved" };
    case "get_next_step":
      return { status: "success", action: "Next step calculated" };
    case "open_official_site":
      return { status: "success", action: "Official site domain validated" };
    case "save_progress":
      return { status: "success", action: "Progress saved" };
    default:
      throw new Error("Invalid tool");
  }
}
