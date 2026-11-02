using System.Security.Claims;
using FootballBooking.Application.Fields;
using FootballBooking.Domain.Fields;
using FootballBooking.Web.Areas.Admin.ViewModels;
using FootballBooking.Web.ViewModels.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballBooking.Web.Areas.Admin.Controllers;

[Area("Admin")]
[Route("admin/fields")]
[Authorize(Policy = "CanManageCatalog")]
public sealed class FieldsController(IFieldService fieldService) : Controller
{
    [HttpGet("")]
    public async Task<IActionResult> Index(CancellationToken cancellationToken)
    {
        ViewData["Title"] = "Quản lý sân";
        ViewData["Breadcrumbs"] = new List<BreadcrumbItemViewModel>
        {
            new("Quản trị", "/admin/dashboard"),
            new("Quản lý sân")
        };

        var fields = await fieldService.ListAdminFieldsAsync(cancellationToken);
        return View(fields);
    }

    [HttpGet("create")]
    public IActionResult Create()
    {
        PrepareEditView("Thêm sân mới");
        return View("Edit", FieldFormViewModel.CreateDefault());
    }

    [HttpPost("create")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(FieldFormViewModel model, CancellationToken cancellationToken)
    {
        PrepareEditView("Thêm sân mới");
        var result = await fieldService.CreateFieldAsync(model.ToCommand(), cancellationToken);
        if (!result.Succeeded)
        {
            AddErrors(result.Errors);
            return View("Edit", model);
        }

        TempData["SuccessMessage"] = "Đã thêm sân mới.";
        return RedirectToAction(nameof(Details), new { id = result.FieldId });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Details(Guid id, CancellationToken cancellationToken)
    {
        var field = await fieldService.GetFieldDetailByIdAsync(id, cancellationToken);
        if (field is null)
        {
            return NotFound();
        }

        ViewData["Title"] = field.Name;
        ViewData["Breadcrumbs"] = new List<BreadcrumbItemViewModel>
        {
            new("Quản trị", "/admin/dashboard"),
            new("Quản lý sân", "/admin/fields"),
            new(field.Name)
        };

        ViewData["BlockForm"] = new FieldBlockFormViewModel { FieldId = id };
        return View(field);
    }

    [HttpGet("{id:guid}/edit")]
    public async Task<IActionResult> Edit(Guid id, CancellationToken cancellationToken)
    {
        var field = await fieldService.GetFieldDetailByIdAsync(id, cancellationToken);
        if (field is null)
        {
            return NotFound();
        }

        PrepareEditView($"Cập nhật {field.Name}");
        return View(FieldFormViewModel.FromDetail(field));
    }

    [HttpPost("{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(Guid id, FieldFormViewModel model, CancellationToken cancellationToken)
    {
        PrepareEditView($"Cập nhật {model.Name}");
        var result = await fieldService.UpdateFieldAsync(id, model.ToCommand(), cancellationToken);
        if (!result.Succeeded)
        {
            AddErrors(result.Errors);
            return View(model);
        }

        TempData["SuccessMessage"] = "Đã cập nhật thông tin sân.";
        return RedirectToAction(nameof(Details), new { id });
    }

    [HttpPost("{id:guid}/blocks")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AddBlock(Guid id, FieldBlockFormViewModel model, CancellationToken cancellationToken)
    {
        var blockDate = model.ParseBlockDate();
        if (blockDate is null)
        {
            TempData["ErrorMessage"] = "Ngày khóa sân cần nhập theo định dạng dd/MM/yyyy.";
            return RedirectToAction(nameof(Details), new { id });
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userId, out var ownerUserId))
        {
            return Forbid();
        }

        var result = await fieldService.AddBlockAsync(
            new FieldBlockCommand(id, blockDate.Value, model.StartMinute, model.EndMinute, model.BlockType, model.Reason, ownerUserId),
            cancellationToken);

        if (!result.Succeeded)
        {
            TempData["ErrorMessage"] = string.Join(" ", result.Errors);
        }
        else
        {
            TempData["SuccessMessage"] = "Đã thêm lịch khóa sân.";
        }

        return RedirectToAction(nameof(Details), new { id });
    }

    private void PrepareEditView(string title)
    {
        ViewData["Title"] = title;
        ViewData["Breadcrumbs"] = new List<BreadcrumbItemViewModel>
        {
            new("Quản trị", "/admin/dashboard"),
            new("Quản lý sân", "/admin/fields"),
            new(title)
        };
    }

    private void AddErrors(IEnumerable<string> errors)
    {
        foreach (var error in errors)
        {
            ModelState.AddModelError(string.Empty, error);
        }
    }
}
