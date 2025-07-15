using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SpaServices.Extensions;
using PositionManagement.Server.Data;
using PositionManagement.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IPositionService, PositionService>();

builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Position Management API",
        Version = "v1",
        Description = "API for managing equity positions and transactions"
    });
});

// Configure SPA static files
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "../positionmanagement.client/dist";
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Position Management API V1");
    });
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// // Configure the SPA proxy for non-API routes
// if (app.Environment.IsDevelopment())
// {
//     app.UseSpaStaticFiles();
//     app.UseSpa(spa =>
//     {
//         spa.Options.SourcePath = "../positionmanagement.client";
//         spa.UseProxyToSpaDevelopmentServer("http://localhost:5173");
//     });
// }

app.Run();
