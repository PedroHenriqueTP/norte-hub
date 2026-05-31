import { Controller, Post, Param, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { WebhooksService } from "./webhooks.service";

@Controller("webhooks")
export class WebhooksController {
  constructor(private webhooksService: WebhooksService) {}

  @Post("dispatch/:solutionKey/:licenseId")
  @HttpCode(HttpStatus.OK)
  async dispatch(
    @Param("solutionKey") solutionKey: string,
    @Param("licenseId") licenseId: string,
    @Body() payload: any
  ) {
    return this.webhooksService.dispatch(solutionKey, licenseId, payload);
  }
}
