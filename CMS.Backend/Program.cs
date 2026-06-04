using CMS.Data;
using CMS.Backend.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ==============================================================
// 1. KHU V?C ??NG KÝ D?CH V? (SERVICES CONTAINER)
// ==============================================================

// Add services to the container.
//L?nh này v?a nh?n di?n các API m?i, v?a gi? quy?n biên d?ch các View (.cshtml) c?a Web MVC c?.
builder.Services.AddControllersWithViews();

// ??ng ký d?ch v? lõi giúp h? th?ng t? ??ng bóc tách thông tin Endpoint ph?c v? Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Kích ho?t b? sinh tài li?u API Swagger

// ??ng ký DbContext vào h? th?ng
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register application services
builder.Services.AddScoped<IAuthService, AuthService>();

// Khai báo d?ch v? xác th?c Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login"; // ???ng d?n n?u ch?a ??ng nh?p
        options.AccessDeniedPath = "/Account/AccessDenied"; // ???ng d?n n?u vào trang không ???c phép
    });

builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Cho phép ReactJS ? port 3000 g?i t?i
              .AllowAnyHeader()                     // Cho phép m?i lo?i Header (Content-Type, Authorization...)
              .AllowAnyMethod()                     // Cho phép m?i ph??ng th?c HTTP (GET, POST, PUT, DELETE)
              .AllowCredentials();                  // H? tr? truy?n Cookie/Session n?u c?n sau này
    });
});


var app = builder.Build();

// ==============================================================
//  2. KHU V?C C?U HÌNH MIDDLEWARE (REQUEST PIPELINE)
// ==============================================================

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "LamCMS Web API v1");
    c.RoutePrefix = "swagger"; // -- ???ng d?n truy c?p m?c ??nh s? là /swagger
});

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// [V? TRÍ ??T CORS]: Ph?i n?m ngay gi?a UseRouting và app.UseAuthentication(); UseAuthorization();
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

// ===============================================================
// 3. KHU V?C ??NH TUY?N PHÂN LU?NG (ROUTING MAP)
// ===============================================================

// Phân lu?ng A: 
// Ánh x? các Endpoint API tuân th? theo c?u trúc [Route("api/[controller]")]
app.MapControllers();

// Phân lu?ng B: Gi? l?i b?n ?? ???ng ?i m?c ??nh cho trang giao di?n Web MVC c?
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
