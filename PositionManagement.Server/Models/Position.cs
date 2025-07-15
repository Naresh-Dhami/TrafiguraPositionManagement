using System.ComponentModel.DataAnnotations;

namespace PositionManagement.Server.Models
{
    public class Position
    {
        [Key]
        [StringLength(10)]
        public required string SecurityCode { get; set; }
        
        [Required]
        public int Quantity { get; set; }
    }
}
