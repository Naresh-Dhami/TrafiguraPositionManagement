using Microsoft.EntityFrameworkCore;
using PositionManagement.Server.Models;

namespace PositionManagement.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Position> Positions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Transaction>()
                .HasKey(t => t.TransactionID);

            modelBuilder.Entity<Position>()
                .HasKey(p => p.SecurityCode);

            base.OnModelCreating(modelBuilder);
        }
    }
}
