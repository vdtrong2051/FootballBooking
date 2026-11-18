using FootballBooking.Application.Fields;
using FootballBooking.Web.ViewModels.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballBooking.Web.Areas.Admin.Controllers;

[Area("Admin")]
[Route("admin/zones")]
[Authorize(Policy = "OwnerOnly")]
public sealed class ZonesController(IFieldZoneService zones) : Controller
{
    [HttpGet("")]
    public async Task<IActionResult> Index(CancellationToken cancellationToken)
    {
        ViewData["Title"] = "Quản lý phân khu";
        ViewData["Breadcrumbs"] = new List<BreadcrumbItemViewModel>
        {
            new("Quản trị", "/admin/dashboard"),
            new("Quản lý sân", "/admin/fields"),
            new("Phân khu")
        };
        return View(await zones.ListAsync(true, cancellationToken));
    }

    [HttpPost("save")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Save(FieldZoneEditorCommand model, CancellationToken cancellationToken)
    {
        var result = await zones.SaveAsync(model, cancellationToken);
        TempData[result.Succeeded ? "SuccessMessage" : "ErrorMessage"] = result.Succeeded
            ? "Đã lưu phân khu." : string.Join(" ", result.Errors);
        return RedirectToAction(nameof(Index));
    }

    [HttpPost("{id:guid}/active")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SetActive(Guid id, bool enabled, CancellationToken cancellationToken)
    {
        var result = await zones.SetActiveAsync(id, enabled, cancellationToken);
        TempData[result.Succeeded ? "SuccessMessage" : "ErrorMessage"] = result.Succeeded
            ? "Đã cập nhật trạng thái phân khu." : string.Join(" ", result.Errors);
        return RedirectToAction(nameof(Index));
    }
}
