import { Controller, Post, HttpCode, HttpStatus, Body, Get, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "../../roles/roles.decorator";
import { RoleEnum } from "../../roles/roles.enum";
import { RolesGuard } from "../../roles/roles.guard";
import { CreatePackageDto } from "../packages/dto/create-package.dto";
import { AddressService } from "./address.service";
import { CreateAddressDto } from "./dto/create-address.dto";

@ApiBearerAuth()
@Roles(RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Address')
@Controller({
    path: 'address',
    version: '1',
})
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Request() req, @Body() createAddressDto: CreateAddressDto) {
        console.log(createAddressDto)
        return this.addressService.create(createAddressDto, req.user);
    }
}