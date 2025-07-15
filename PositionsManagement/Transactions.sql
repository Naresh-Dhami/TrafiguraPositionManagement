CREATE TABLE [dbo].[Transaction] (
    [TransactionId] INT IDENTITY(1,1) PRIMARY KEY,
    [TradeId] INT NOT NULL,
    [Version] INT NOT NULL,
    [SecurityCode] NVARCHAR(16) NOT NULL,
    [Quantity] INT NOT NULL,
    [Action] NVARCHAR(10) NOT NULL, -- 'INSERT', 'UPDATE', 'CANCEL'
    [TradeType] NVARCHAR(10) NOT NULL, -- 'Buy', 'Sell'
    [Timestamp] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
