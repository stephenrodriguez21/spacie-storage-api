import { Controller, Post, HttpCode, HttpStatus, Body, Request, Get, Param, UseGuards, Put, ClassSerializerInterceptor, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "../../roles/roles.decorator";
import { RoleEnum } from "../../roles/roles.enum";
import { RolesGuard } from "../../roles/roles.guard";
import { ListFilter } from "../../utils/types/pagination-options";
import { PageDto } from "./dto/page.dto";
import { ScanService, UserDto } from "./services/scan.service";

@ApiTags('Scan')
@Controller({
    path: 'scan',
    version: '1',
})
@UseInterceptors(ClassSerializerInterceptor)
export class ScanController {
    constructor(private readonly scanService: ScanService) { }

    @Post("list")
    @HttpCode(HttpStatus.OK)
    async getUsers(
        @Body() listFilter: ListFilter
    ): Promise<PageDto<UserDto>> {
        return this.scanService.getCodesList(listFilter);
    }

    @Post("code/list")
    @HttpCode(HttpStatus.OK)
    async getQRCodes(
        @Body() listFilter: ListFilter
    ): Promise<PageDto<UserDto>> {
        return this.scanService.getQRCodeList(listFilter);
    }

    @Get("box/:code")
    @HttpCode(HttpStatus.OK)
    getBoxByCode(@Request() req, @Param() params: { code: string }) {
        return this.scanService.getBoxByCode(params.code);
    }

    @Get(":code/public")
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @Roles(RoleEnum.admin)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async scanCode(@Request() req, @Param() params: { code: string }) {
        return await this.scanService.getCode(params.code);
    }

    @Get("customer/:phone")
    @HttpCode(HttpStatus.OK)
    async findCustomerByPhoneNumber(@Request() req, @Param() params: { phone: string }) {
        return await this.scanService.findCustomerByPhoneNumber(params.phone);
    }

    @Post(":code/received")
    @HttpCode(HttpStatus.OK)
    async boxReceived(@Request() req, @Param() params: { code: string }, @Body() body: any) {
        const { orderId } = body;
        return await this.scanService.boxReceived(params.code, orderId);
    }

    @Get(":orderId")
    @HttpCode(HttpStatus.OK)
    async editOrder(@Request() req, @Param() params: { orderId: number }) {
        return await this.scanService.editOrder(params.orderId, req);
    }

    @Put("xxx")
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @Roles(RoleEnum.admin)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async updateCode(@Request() req, @Body() body: any) {
        console.log(req?.isAuthenticated(), body);
        await this.scanService.assignCodeToCustomer(req, body);
    }

    @Post("code/generate")
    @HttpCode(HttpStatus.CREATED)
    // @ApiBearerAuth()
    // @Roles(RoleEnum.user)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    async createCode(@Request() req, @Body() body: any) {
        return await this.scanService.generateCode(req, body);
    }
}