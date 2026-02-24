using WebProdavnica.BusinessLayer.Abstract;
using WebProdavnica.BusinessLayer.Impl;
using WebProdavnica.DAL.Abstract;
using WebProdavnica.DAL.Impl;
using Entities.Configuration;

var builder = WebApplication.CreateBuilder(args);

var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<Entities.Configuration.JwtSettings>()!;
builder.Services.AddSingleton<Entities.Configuration.JwtSettings>(jwtSettings);


builder.Services.AddControllers();

//  REGISTER REPOSITORIES 
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IJobOrderRepository, JobOrderRepository>();
builder.Services.AddScoped<ICraftsmanRepository, CraftsmanRepository>();

//  REGISTER BUSINESS LAYER SERVICES
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICraftsmanService, CraftsmanService>();
builder.Services.AddScoped<IJobOrderService, JobOrderService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// da React može da poziva API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();