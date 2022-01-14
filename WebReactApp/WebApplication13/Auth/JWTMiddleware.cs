using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication13.Auth
{
    public class JWTMiddleware
    {
        private readonly Microsoft.AspNetCore.Http.RequestDelegate _next;
        private readonly AppSettings _appSettings;

        public JWTMiddleware(Microsoft.AspNetCore.Http.RequestDelegate next, IOptions<AppSettings> appSettings)
        {
            _next = next;
            _appSettings = appSettings.Value;
        }

        public async Task Invoke(HttpContext context, IAcccountService acccountService)
        {
            var requestToken = context.Request.Headers["Authorization"].FirstOrDefault();               //может не отработать, нужно проверить весь массив

            if(requestToken != null) //пользователь типа авторизирован
            {
                attachUserToContext(context, acccountService, requestToken);
            }

            await _next(context);
        }

        private void attachUserToContext(HttpContext context, IAcccountService acccountService, string requestToken)
        {
            
        }
    }
}
