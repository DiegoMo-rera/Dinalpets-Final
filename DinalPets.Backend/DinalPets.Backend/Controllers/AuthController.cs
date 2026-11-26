using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace DinalPets.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] JsonElement body)
        {
            string user = "";
            string pass = "";

            if (body.TryGetProperty("usuario", out var u1)) user = u1.GetString() ?? "";
            else if (body.TryGetProperty("username", out var u2)) user = u2.GetString() ?? "";
            else if (body.TryGetProperty("user", out var u3)) user = u3.GetString() ?? "";

            if (body.TryGetProperty("password", out var p1)) pass = p1.GetString() ?? "";
            else if (body.TryGetProperty("clave", out var p2)) pass = p2.GetString() ?? "";
            else if (body.TryGetProperty("contrasena", out var p3)) pass = p3.GetString() ?? "";

            if (user == "admin" && pass == "admin123")
            {
                return Ok(new
                {
                    token = "dinalpets-admin-token-2026",
                    usuario = user,
                    mensaje = "Inicio de sesión exitoso"
                });
            }

            return Unauthorized(new { mensaje = "Usuario o contraseña incorrectos" });
        }
    }
}