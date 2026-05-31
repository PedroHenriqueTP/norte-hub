# Guia de Referência da API (Auto-Generated)

Atualizado em: 07/02/2026, 16:31:40

| Método | Rota | Controller |
|---|---|---|
| **POST** | `/auth/register` | auth.controller.ts |
| **POST** | `/auth/login` | auth.controller.ts |
| **GET** | `/auth/seed` | auth.controller.ts |
| **POST** | `/billing/checkout` | billing.controller.ts |
| **POST** | `/billing/webhook` | billing.controller.ts |
| **GET** | `/coupons/validate` | coupons.controller.ts |
| **POST** | `/customers/)
    create(@Body() dto: CreateCustomerDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll(` | customers.controller.ts |
| **GET** | `/customers/:id` | customers.controller.ts |
| **GET** | `/dashboard/)
    getStats() {
        return this.service.getStats(` | dashboard.controller.ts |
| **GET** | `/finance/)
    async getSummary(@Request() req: any) {
        / Mock summary for now, or implement a real aggregation service method
        / Ideally should call this.financeService.getDailySummary(req.user.tenantId` | finance.controller.ts |
| **GET** | `/finance/daily-balance` | finance.controller.ts |
| **GET** | `/finance/transactions` | finance.controller.ts |
| **POST** | `/finance/transactions` | finance.controller.ts |
| **POST** | `/finance/invoices` | finance.controller.ts |
| **POST** | `/integrations/ifood/orders` | ifood.controller.ts |
| **GET** | `/integrations/)
    async findAll(@Request() req: any) {
        return this.integrationsService.getIntegrations(req.user.tenantId` | integrations.controller.ts |
| **POST** | `/integrations/connect` | integrations.controller.ts |
| **POST** | `/integrations/store-status` | integrations.controller.ts |
| **DELETE** | `/integrations/:provider` | integrations.controller.ts |
| **POST** | `/inventory/ingredients` | inventory.controller.ts |
| **GET** | `/inventory/ingredients` | inventory.controller.ts |
| **PUT** | `/inventory/ingredients/:id` | inventory.controller.ts |
| **POST** | `/inventory/movements` | inventory.controller.ts |
| **POST** | `/inventory/products/:productId/ingredients` | inventory.controller.ts |
| **DELETE** | `/inventory/products/:productId/ingredients/:ingredientId` | inventory.controller.ts |
| **POST** | `/orders/)
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get(` | orders.controller.ts |
| **GET** | `/orders/:id` | orders.controller.ts |
| **POST** | `/orders/:id/items` | orders.controller.ts |
| **POST** | `/orders/:id/items/:itemId` | orders.controller.ts |
| **POST** | `/orders/:id/items/:itemId/delete` | orders.controller.ts |
| **GET** | `/products/:id` | products.controller.ts |
| **POST** | `/products/)
    create(@Request() req: any, @Body() body: any) {
        return this.productsService.create(req.user.tenantId, body` | products.controller.ts |
| **PUT** | `/products/:id` | products.controller.ts |
| **DELETE** | `/products/:id` | products.controller.ts |
| **POST** | `/tables/)
    async create(@Request() req: any, @Body() createTableDto: { name: string; capacity: number }` | tables.controller.ts |
| **GET** | `/tables/)
    findAll(@Request() req: any) {
        return this.tablesService.findAll(req.user.tenantId` | tables.controller.ts |
| **PATCH** | `/tables/:id` | tables.controller.ts |
| **DELETE** | `/tables/:id` | tables.controller.ts |
| **POST** | `/tables/:id/open` | tables.controller.ts |
| **POST** | `/tables/:id/close` | tables.controller.ts |
| **POST** | `/upload` | upload.controller.ts |
| **GET** | `/upload/:filename` | upload.controller.ts |
| **POST** | `/users/)
    async create(@Request() req: any, @Body() body: { name: string, email: string, role: Role, password: string }) {
        / Enforce that only admins/owners can create users (simplified logic for now)
        / Ideally use a RolesGuard

        return this.usersService.create({
            ...body,
            tenantId: req.user.tenantId
        });
    }

    @Get()
    async findAll(@Request() req: any) {
        return this.usersService.findAll(req.user.tenantId` | users.controller.ts |
| **POST** | `/waiting-list/)
    create(@Body() dto: CreateWaitingListDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll(` | waiting-list.controller.ts |
| **PATCH** | `/waiting-list/:id/status` | waiting-list.controller.ts |
| **DELETE** | `/waiting-list/:id` | waiting-list.controller.ts |
