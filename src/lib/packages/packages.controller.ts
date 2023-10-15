import { UseGuards, Controller, Post, HttpCode, HttpStatus, Body, Request, Header, Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/roles/roles.decorator";
import { RoleEnum } from "src/roles/roles.enum";
import { RolesGuard } from "src/roles/roles.guard";
import { CreatePackageDto } from "./dto/create-package.dto";
import { PackagesService } from "./services/packages.service";

// @ApiBearerAuth()
// @Roles(RoleEnum.admin)
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Packages')
@Controller({
    path: 'packages',
    version: '1',
})
export class PackagesController {
    constructor(private readonly packagesService: PackagesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Request() req, @Body() createPackageDto: CreatePackageDto) {
        console.log(createPackageDto)
        return this.packagesService.create(createPackageDto, req.user);
    }

    @Get("quotation")
    @HttpCode(HttpStatus.CREATED)
    quotation(@Request() req) {
        return this.packagesService.getQuotation();
    }
}