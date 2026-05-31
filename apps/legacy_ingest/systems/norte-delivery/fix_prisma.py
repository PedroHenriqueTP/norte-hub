
import os

path = 'packages/database/prisma/schema.prisma'
if not os.path.exists(path):
    print(f"File not found: {path}")
    exit(1)

with open(path, 'rb') as f:
    content = f.read()

# Find the enum MovementType block start
target_str = b'enum MovementType {'
idx = content.find(target_str)
if idx == -1:
    print("Could not find MovementType")
    # Fallback: maybe it's not there, just list last 100 chars
    print(content[-100:])
    exit(1)

# Find the closing brace for the enum
# It should be close by
close_idx = content.find(b'}', idx)
if close_idx == -1:
    print("Could not find closing brace")
    exit(1)

# Keep content up to the closing brace '}' + explicit newline
# We treat the file as binary up to that point
good_content = content[:close_idx+1] + b'\n'

# Define the new content
new_section = """
// --- MÓDULO DE CUPONS (COUPONS) ---

enum DiscountType {
  PERCENTAGE
  FIXED
}

model Coupon {
  id           String       @id @default(uuid())
  code         String       @unique
  discountType DiscountType
  value        Decimal      @db.Decimal(10, 2)
  
  minOrderValue Decimal?    @db.Decimal(10, 2)
  maxDiscount   Decimal?    @db.Decimal(10, 2)
  
  usageLimit    Int?
  usedCount     Int         @default(0)
  
  expiresAt     DateTime?
  isActive      Boolean     @default(true)

  tenantId      String
  tenant        Tenant      @relation(fields: [tenantId], references: [id])
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@map("coupons")
}
""".encode('utf-8')

# Write back
with open(path, 'wb') as f:
    f.write(good_content + new_section)

print("Schema fixed successfully.")
