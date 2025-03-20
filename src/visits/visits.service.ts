import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VisitsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTotalVisits(
    domain: string,
    fields: string[],
    fromDate?: string,
    toDate?: string,
  ) {
    const websiteIds = await this.prisma.website.findMany({
      where: { domain },
      select: { id: true },
    });

    if (!websiteIds.length) {
      return {
        'Total Visits': 0,
        'Total Views': 0,
        Devices: {},
        Browsers: {},
        OS: {},
      };
    }

    const websiteId = websiteIds[0].id;

    const totalViews = await this.prisma.websiteEvent.count({
      where: {
        websiteId,
        createdAt: {
          gte: fromDate ? new Date(fromDate) : undefined,
          lte: toDate ? new Date(toDate) : undefined,
        },
      },
    });

    const totalVisits = await this.prisma.websiteEvent
      .findMany({
        where: {
          websiteId,
          createdAt: {
            gte: fromDate ? new Date(fromDate) : undefined,
            lte: toDate ? new Date(toDate) : undefined,
          },
        },
        distinct: ['visitId'],
      })
      .then((res) => res.length);

    const deviceBreakdown = { desktop: 0, mobile: 0, tablet: 0 };
    const browserBreakdown = {
      chrome: 0,
      firefox: 0,
      safari: 0,
      edge: 0,
      opera: 0,
      ie: 0,
    };
    const osBreakdown = {
      windows: 0,
      macos: 0,
      linux: 0,
      android: 0,
      ios: 0,
    };

    const sessions = await this.prisma.session.findMany({
      where: {
        websiteId,
        createdAt: {
          gte: fromDate ? new Date(fromDate) : undefined,
          lte: toDate ? new Date(toDate) : undefined,
        },
      },
    });

    sessions.forEach((session) => {
      if (fields.includes('device') && session.device) {
        const device = session.device.toLowerCase();
        deviceBreakdown[device] = (deviceBreakdown[device] || 0) + 1;
      }
      if (fields.includes('browser') && session.browser) {
        const browser = session.browser.toLowerCase();
        browserBreakdown[browser] = (browserBreakdown[browser] || 0) + 1;
      }
      if (fields.includes('os') && session.os) {
        const os = session.os.toLowerCase();
        osBreakdown[os] = (osBreakdown[os] || 0) + 1;
      }
    });

    return {
      'Total Visits': totalVisits,
      'Total Views': totalViews,
      ...(fields.includes('device') && { Devices: deviceBreakdown }),
      ...(fields.includes('browser') && { Browsers: browserBreakdown }),
      ...(fields.includes('os') && { OS: osBreakdown }),
    };
  }

  async getLastMonthVisits(domain: string, fields: string[]) {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const firstDayLastMonth = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth(),
      1,
    );
    const lastDayLastMonth = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth() + 1,
      0,
    );

    return this.getTotalVisits(
      domain,
      fields,
      firstDayLastMonth.toISOString(),
      lastDayLastMonth.toISOString(),
    );
  }

  async getLast2MonthsVisits(domain: string, fields: string[]) {
    const now = new Date();
    const last2Months = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const firstDayLast2Months = new Date(
      last2Months.getFullYear(),
      last2Months.getMonth(),
      1,
    );
    const lastDayLast2Months = new Date(
      last2Months.getFullYear(),
      last2Months.getMonth() + 2,
      0,
    );

    return this.getTotalVisits(
      domain,
      fields,
      firstDayLast2Months.toISOString(),
      lastDayLast2Months.toISOString(),
    );
  }
}
