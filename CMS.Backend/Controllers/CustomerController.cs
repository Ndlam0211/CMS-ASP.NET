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
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Customer/Index
        public IActionResult Index()
        {
            var customers = _context.Customers.ToList();
            return View(customers);
        }

        // GET: Customer/Details/5
        public IActionResult Details(int id)
        {
            var customer = _context.Customers
                .Include(c => c.Orders)
                .FirstOrDefault(c => c.Id == id);

            if (customer == null)
                return NotFound();

            return View(customer);
        }

        // GET: Customer/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Customer/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create([Bind("FullName,Email,Phone,Address,Password")] Customer customer)
        {
            if (ModelState.IsValid)
            {
                _context.Customers.Add(customer);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }

            return View(customer);
        }

        // GET: Customer/Edit/5
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null)
                return NotFound();

            return View(customer);
        }

        // POST: Customer/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, [Bind("Id,FullName,Email,Phone,Address,Password")] Customer customer)
        {
            if (id != customer.Id)
                return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(customer);
                    _context.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CustomerExists(customer.Id))
                        return NotFound();
                    throw;
                }
                return RedirectToAction(nameof(Index));
            }

            return View(customer);
        }

        // GET: Customer/Delete/5
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.FirstOrDefault(c => c.Id == id);
            if (customer == null)
                return NotFound();

            return View(customer);
        }

        // POST: Customer/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Id == id);
        }
    }
}
