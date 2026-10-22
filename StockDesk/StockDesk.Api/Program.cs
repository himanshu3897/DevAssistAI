var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors();

var products = new List<Product>
{
    new(1, "Mechanical Keyboard", "KEY-101", 8, 79.99m),
    new(2, "USB-C Hub", "HUB-202", 3, 34.50m),
    new(3, "Laptop Stand", "STD-303", 24, 26.00m),
    new(4, "Wireless Mouse", "MOU-404", 0, 22.90m)
};
var nextId = 5;

app.MapGet("/", () => Results.Ok(new { name = "StockDesk API", status = "running" }));
app.MapGet("/api/products", (string? search) =>
{
    var result = string.IsNullOrWhiteSpace(search)
        ? products
        : products.Where(p => p.Name.Contains(search, StringComparison.OrdinalIgnoreCase)
            || p.Sku.Contains(search, StringComparison.OrdinalIgnoreCase)).ToList();
    return Results.Ok(result);
});
app.MapPost("/api/products", (CreateProductRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Sku))
        return Results.BadRequest(new { message = "Name and SKU are required." });
    if (request.Quantity < 0 || request.Price < 0)
        return Results.BadRequest(new { message = "Quantity and price must be zero or greater." });
    if (products.Any(p => p.Sku.Equals(request.Sku.Trim(), StringComparison.OrdinalIgnoreCase)))
        return Results.Conflict(new { message = "SKU already exists." });

    var product = new Product(nextId++, request.Name.Trim(), request.Sku.Trim(),
        request.Quantity, decimal.Round(request.Price, 2));
    products.Add(product);
    return Results.Created($"/api/products/{product.Id}", product);
});
app.MapDelete("/api/products/{id:int}", (int id) =>
{
    var removed = products.RemoveAll(p => p.Id == id);
    return removed == 0 ? Results.NotFound() : Results.NoContent();
});
app.Run("http://localhost:5082");

record Product(int Id, string Name, string Sku, int Quantity, decimal Price);
record CreateProductRequest(string Name, string Sku, int Quantity, decimal Price);
