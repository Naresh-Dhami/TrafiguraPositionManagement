using System.ComponentModel.DataAnnotations;

namespace PositionManagement.Server.Models
{
    public class Transaction
    {
        [Key]
        public int TransactionID { get; set; }
        
        [Required]
        public int TradeID { get; set; }
        
        [Required]
        public int Version { get; set; }
        
        [Required]
        [StringLength(10)]
        public required string SecurityCode { get; set; }
        
        [Required]
        public int Quantity { get; set; }
        
        [Required]
        [StringLength(10)]
        public required string Action { get; set; }  // INSERT/UPDATE/CANCEL
        
        [Required]
        [StringLength(5)]
        public required string TradeType { get; set; }  // Buy/Sell
    }
}
