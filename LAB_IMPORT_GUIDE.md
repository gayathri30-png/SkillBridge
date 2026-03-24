# College Lab Database Import Guide

Follow these steps to set up the Skillbridge database in your college lab system.

## Prerequisites
1. Ensure **MySQL Server** and **MySQL Workbench** (or Command Line) are installed on the lab computer.
2. Have the `skillbridge_lab_export.sql` file ready on a USB drive or cloud storage.

## Step-by-Step Import

### Method 1: Using MySQL Command Line (Recommended)
1. Open the Command Prompt or terminal.
2. Log in to MySQL:
   ```bash
   mysql -u root -p
   ```
3. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS skillbridge;
   USE skillbridge;
   ```
4. Import the file (replace `path/to/` with the actual folder path):
   ```bash
   source C:/path/to/skillbridge_lab_export.sql;
   ```

### Method 2: Using MySQL Workbench
1. Open MySQL Workbench and connect to your local instance.
2. Go to **Server** > **Data Import**.
3. Select **Import from Self-Contained File** and choose `skillbridge_lab_export.sql`.
4. Under **Default Target Schema**, select `skillbridge` (create it if it doesn't exist).
5. Click **Start Import**.

## Post-Import Check
Run this command to verify the tables are present:
```sql
USE skillbridge;
SHOW TABLES;
```

## Troubleshooting
- **Access Denied**: Ensure you are using the correct username and password provided by your lab instructor.
- **SQL Mode Error**: If you see errors about "strict mode", try running:
  ```sql
  SET GLOBAL sql_mode = '';
  ```
- **File Not Found**: Use double backslashes `\\` or forward slashes `/` in file paths on Windows.
