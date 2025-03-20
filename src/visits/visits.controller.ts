import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { VisitsService } from './visits.service';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Get('total-visits')
  async getTotalVisits(
    @Query('domain') domain: string,
    @Query('fields') fields: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    if (!domain) {
      throw new BadRequestException('Domain parameter is required');
    }

    const fieldsArray = fields
      ? fields.split(',').map((field) => field.trim().toLowerCase())
      : [];
    return this.visitsService.getTotalVisits(
      domain,
      fieldsArray,
      fromDate,
      toDate,
    );
  }

  @Get('last-month')
  async getLastMonthVisits(
    @Query('domain') domain: string,
    @Query('fields') fields: string,
  ) {
    if (!domain) {
      throw new BadRequestException('Domain parameter is required');
    }

    const fieldsArray = fields
      ? fields.split(',').map((field) => field.trim().toLowerCase())
      : [];
    return this.visitsService.getLastMonthVisits(domain, fieldsArray);
  }

  @Get('last-2-months')
  async getLast2MonthsVisits(
    @Query('domain') domain: string,
    @Query('fields') fields: string,
  ) {
    if (!domain) {
      throw new BadRequestException('Domain parameter is required');
    }

    const fieldsArray = fields
      ? fields.split(',').map((field) => field.trim().toLowerCase())
      : [];
    return this.visitsService.getLast2MonthsVisits(domain, fieldsArray);
  }
}
