/*
 * Sinh vien: Nguyen Dinh Lam
 * MSSV: 2122110509
 * Ngay tao: 21-05-2026
 * Version: 1.0
 */

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize] // Bắt buộc phải đăng nhập mới được vào các hàm bên dưới
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Order/Index
        public IActionResult Index()
        {
            var orders = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                .ToList();
            return View(orders);
        }

        // GET: Order/Details/5
        public IActionResult Details(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
                return NotFound();

            return View(order);
        }

        // GET: Order/Create
        public IActionResult Create()
        {
            ViewBag.Customers = _context.Customers.ToList();
            return View();
        }

        // POST: Order/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create([Bind("Status,Notes,CustomerId")] Order order)
        {
            if (ModelState.IsValid)
            {
                _context.Orders.Add(order);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }

            ViewBag.Customers = _context.Customers.ToList();
            return View(order);
        }

        // GET: Order/Edit/5
        public IActionResult Edit(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null)
                return NotFound();

            ViewBag.Customers = _context.Customers.ToList();
            return View(order);
        }

        // POST: Order/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, [Bind("Id,Status,Notes,CustomerId")] Order order)
        {
            if (id != order.Id)
                return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(order);
                    _context.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!OrderExists(order.Id))
                        return NotFound();
                    throw;
                }
                return RedirectToAction(nameof(Index));
            }

            ViewBag.Customers = _context.Customers.ToList();
            return View(order);
        }

        // GET: Order/Delete/5
        public IActionResult Delete(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
                return NotFound();

            return View(order);
        }

        // POST: Order/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
