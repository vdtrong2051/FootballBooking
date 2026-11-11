using System.Net;
using FootballBooking.Web.ViewModels.Account;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace FootballBooking.Tests.Integration;

public sealed class CustomerCenterRoutesTests
{
    [Theory]
    [InlineData("/account")]
    [InlineData("/account/profile")]
    [InlineData("/account/security")]
    [InlineData("/account/change-phone")]
    [InlineData("/account/verify-new-phone")]
    [InlineData("/account/payments")]
    [InlineData("/account/help")]
    public async Task AnonymousAccountPages_MustRedirectToLogin(string route)
    {
        var contentRoot = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory,
            "..", "..", "..", "..", "..", "src", "FootballBooking.Web"));
        await using var factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseEnvironment("Testing");
                builder.UseContentRoot(contentRoot);
            });
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
        using var response = await client.GetAsync(route);
        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        Assert.Equal("/account/login", response.Headers.Location?.AbsolutePath);
    }

    [Fact]
    public void CustomerProfileEdit_RejectsBlankName()
    {
        var model = new CustomerProfileEditViewModel { FullName = "" };
        var context = new System.ComponentModel.DataAnnotations.ValidationContext(model);
        var results = new List<System.ComponentModel.DataAnnotations.ValidationResult>();
        Assert.False(System.ComponentModel.DataAnnotations.Validator.TryValidateObject(model, context, results, true));
        Assert.NotEmpty(results);
    }

    [Fact]
    public void NewPasswordModel_RejectsMismatch()
    {
        var model = new CustomerPasswordViewModel
        {
            CurrentPassword = "test-password",
            NewPassword = "strong-password-123",
            ConfirmPassword = "different-password"
        };
        var context = new System.ComponentModel.DataAnnotations.ValidationContext(model);
        var results = new List<System.ComponentModel.DataAnnotations.ValidationResult>();
        Assert.False(System.ComponentModel.DataAnnotations.Validator.TryValidateObject(model, context, results, true));
    }
}
