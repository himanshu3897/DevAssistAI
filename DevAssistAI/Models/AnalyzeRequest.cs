namespace DevAssistAI.Models;

public sealed record AnalyzeRequest(string? Code, string? Task, string? Language);

public sealed record AnalyzeResponse(string Result, string Task, string Language);
