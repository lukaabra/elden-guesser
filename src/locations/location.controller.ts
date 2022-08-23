import { Controller, Get, Param } from '@nestjs/common';
import { Location } from '@prisma/client';

import { LocationService } from './location.service';

@Controller('/location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  // TODO: Add query strings
  @Get()
  async getAll(): Promise<Location[]> {
    return this.locationService.findAll({});
  }

  @Get('/:id')
  async getOne(@Param('id') id: string): Promise<Location> {
    return this.locationService.findOne({ id: Number(id) });
  }
}
