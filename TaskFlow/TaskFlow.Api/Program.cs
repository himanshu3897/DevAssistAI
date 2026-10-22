var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors();

var tasks = new List<TaskItem>
{
    new(1, "Set up project structure", true),
    new(2, "Create task API", false),
    new(3, "Connect Angular UI", false)
};
var nextId = 4;

app.MapGet("/", () => Results.Ok(new { name = "TaskFlow API", status = "running" }));
app.MapGet("/api/tasks", () => Results.Ok(tasks));

app.MapPost("/api/tasks", (CreateTaskRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
        return Results.BadRequest(new { message = "Title is required." });

    var task = new TaskItem(nextId++, request.Title.Trim(), false);
    tasks.Add(task);
    return Results.Created($"/api/tasks/{task.Id}", task);
});

app.MapPut("/api/tasks/{id:int}", (int id, UpdateTaskRequest request) =>
{
    var index = tasks.FindIndex(task => task.Id == id);
    if (index < 0) return Results.NotFound(new { message = "Task not found." });
    if (string.IsNullOrWhiteSpace(request.Title))
        return Results.BadRequest(new { message = "Title is required." });

    var updated = new TaskItem(id, request.Title.Trim(), request.IsCompleted);
    tasks[index] = updated;
    return Results.Ok(updated);
});

app.MapDelete("/api/tasks/{id:int}", (int id) =>
{
    var removed = tasks.RemoveAll(task => task.Id == id);
    return removed == 0 ? Results.NotFound() : Results.NoContent();
});

app.Run("http://localhost:5081");

record TaskItem(int Id, string Title, bool IsCompleted);
record CreateTaskRequest(string Title);
record UpdateTaskRequest(string Title, bool IsCompleted);
