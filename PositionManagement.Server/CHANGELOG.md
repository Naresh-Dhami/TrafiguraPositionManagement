Goal:
Design and implement web application to maintain Equity positions.
Input:
Transactions
TransactionID TradeID Version SecurityCode Quantity Insert/Update/Cancel Buy/Sell
1 1 1 REL 50 INSERT Buy
2 2 1 ITC 40 INSERT Sell
3 3 1 INF 70 INSERT Buy
4 1 2 REL 60 UPDATE Buy
5 2 2 ITC 30 CANCEL Buy
6 4 1 INF 20 INSERT Sell
TransactionID: Primary key (auto generated)
TradeID: Trade Identifier
Version: Starts with 1 for given Trade ID
SecurityCode: Security Identifier e.g. INF => Infosys Quantity:
Quantity of security e.g. 10 Infosys shares
Output:
Position
REL +60
ITC 0
INF +50
Rules:
• The Positions should be updated after each transaction e.g. once transaction 1 and 2 has arrived, the
positions would be REL=+50 and ITC=-40
• INSERT / UPDATE / CANCEL are actions on a Trade (with same trade id but different version)
• INSERT will always be 1st version of a Trade, CANCEL will always be last version of Trade
• For UPDATE, SecurityCode or Quantity or Buy/Sell can change
• For CANCEL, any changes in SecurityCode or Quantity or Buy/Sell may change and should be ignored
• The transactions can arrive in any sequence i.e. UPDATE (version 2) can arrive before INSERT (version 1)
Evaluation Points
• Full Stack working solution
• Design
• UI – look and feel
• Code Testability
• Code Quality
Expected Tech Stack
• Web - Angular
• API – .Net Core
• DB – any