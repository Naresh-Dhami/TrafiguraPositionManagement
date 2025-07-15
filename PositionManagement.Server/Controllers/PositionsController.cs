using Microsoft.AspNetCore.Mvc;
using PositionManagement.Server.Models;
using PositionManagement.Server.Services;

namespace PositionManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PositionsController : ControllerBase
    {
        private readonly IPositionService _positionService;

        public PositionsController(IPositionService positionService)
        {
            _positionService = positionService;
        }

        [HttpPost("transaction")]
        public async Task<ActionResult<Transaction>> ProcessTransaction(Transaction transaction)
        {
            try
            {
                var result = await _positionService.ProcessTransactionAsync(transaction);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Position>>> GetPositions()
        {
            var positions = await _positionService.GetPositionsAsync();
            return Ok(positions);
        }

        [HttpGet("transactions")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
        {
            var transactions = await _positionService.GetTransactionsAsync();
            return Ok(transactions);
        }
    }
}
