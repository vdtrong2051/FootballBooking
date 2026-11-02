using FootballBooking.Application.Bookings;
using FootballBooking.Web.ViewModels.Bookings;
using FootballBooking.Web.ViewModels.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballBooking.Web.Areas.Admin.Controllers;

[Area("Admin")]
[Route("admin/services")]
[Authorize(Policy = "CanManageCatalog")]
public sealed class ServicesController(IBookingService bookingService) : Controller
{
    [HttpGet("")]
    public async Task<IActionResult> Index(CancellationToken cancellationToken)
    {
        ViewData["Title"] = "Dịch vụ";
        ViewData["Breadcrumbs"] = new List<BreadcrumbItemViewModel>
        {
            new("Quản trị", "/admin/dashboard"),
            new("Dịch vụ")
        };

        return View(new ServiceListViewModel
        {
            Services = await bookingService.ListAdminServicesAsync(cancellationToken)
        });
    }

    [HttpGet("create")]
    public IActionResult Create()
    {
        PrepareForm("Thêm dịch vụ");
        return View("Form", new ServiceFormViewModel());
    }

    [HttpPost("create")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(ServiceFormViewModel model, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            PrepareForm("Thêm dịch vụ");
            return View("Form", model);
        }

        var result = await bookingService.SaveServiceAsync(ToCommand(model), cancellationToken);
        if (!result.Succeeded)
        {
            AddErrors(result);
            PrepareForm("Thêm dịch vụ");
            return View("Form", model);
        }

        TempData["SuccessMessage"] = "Đã thêm dịch vụ.";
        return RedirectToAction(nameof(Index));
    }

    [HttpGet("{id:guid}/edit")]
    public async Task<IActionResult> Edit(Guid id, CancellationToken cancellationToken)
    {
        var service = await bookingService.GetServiceAsync(id, cancellationToken);
        if (service is null)
        {
            return NotFound();
        }

        PrepareForm("Cập nhật dịch vụ");
        return View("Form", ServiceFormViewModel.FromDto(service));
    }

    [HttpPost("{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(Guid id, ServiceFormViewModel model, CancellationToken cancellationToken)
    {
        model.Id = id;
        if (!ModelState.IsValid)
        {
            PrepareForm("Cập nhật dịch vụ");
            return View("Form", model);
        }

        var result = await bookingService.SaveServiceAsync(ToCommand(model), cancellationToken);
        if (!result.Succeeded)
        {
            AddErrors(result);
            PrepareForm("Cập nhật dịch vụ");
            return View("Form", model);
        }

        TempData["SuccessMessage"] = "Đã cập nhật dịch vụ.";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost("{id:guid}/toggle")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Toggle(Guid id, bool isActive, CancellationToken cancellationToken)
    {
        var result = await bookingService.SetServiceActiveAsync(id, isActive, cancellationToken);
        TempData[result.Succeeded ? "SuccessMessage" : "ErrorMessage"] = result.Succeeded
            ? (isActive ? "Đã mở lại dịch vụ." : "Đã tạm dừng dịch vụ.")
            : string.Join(" ", result.Errors);

        return RedirectToAction(nameof(Index));
    }

    private void PrepareForm(string title)
    {
        ViewData["Title"] = title;
        ViewData["Breadcrumbs"] = new List<BreadcrumbItemViewModel>
        {
            new("Quản trị", "/admin/dashboard"),
            new("Dịch vụ", "/admin/services"),
            new(title)
        };
    }

    private static ServiceItemUpsertCommand ToCommand(ServiceFormViewModel model)
        => new(
            model.Id,
            model.Code,
            model.Name,
            model.Description,
            model.UnitName,
            model.UnitPrice,
            model.IsQuantityTracked,
            model.AvailableQuantity,
            model.IsActive,
            model.SortOrder);

    private void AddErrors(BookingCommandResult result)
    {
        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(string.Empty, error);
        }
    }
}
