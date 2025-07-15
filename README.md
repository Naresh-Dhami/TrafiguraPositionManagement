# PositionManagement

Open solution in Visual studio and create DB 

ConnectionString Data Source=(localdb)\ProjectModels;Initial Catalog=PositionsManagement;Integrated Security=True;Connect Timeout=30;Encrypt=False;Trust Server Certificate=False;Application Intent=ReadWrite;Multi Subnet Failover=False

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

CREATE TABLE [dbo].[Position] (
    [PositionId] INT IDENTITY(1,1) PRIMARY KEY,
    [SecurityCode] NVARCHAR(16) NOT NULL,
    [Quantity] INT NOT NULL
);

cd  positionmanagement.client 
npm install 



<img width="288" height="133" alt="image" src="https://github.com/user-attachments/assets/5dab92c1-79b9-420d-ba86-81e110341e36" />


PositionManagement
<img width="1555" height="788" alt="image" src="https://github.com/user-attachments/assets/75d4242f-0204-4b22-8694-bd79de409b1f" />

<img width="1470" height="822" alt="image" src="https://github.com/user-attachments/assets/b63bd439-153a-49ad-88ed-04037e10cb7f" />

<img width="1417" height="472" alt="image" src="https://github.com/user-attachments/assets/f5125635-ba9d-4557-82e2-13b807a6be85" />

<img width="1360" height="915" alt="image" src="https://github.com/user-attachments/assets/57ee2bb5-272f-452e-b25c-747007adbfd6" />



