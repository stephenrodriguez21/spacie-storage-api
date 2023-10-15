import { UseGuards, Controller, Post, HttpCode, HttpStatus, Body, Request, Get, Res, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";



@ApiBearerAuth()
// @Roles(RoleEnum.admin)
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Orders')
@Controller({
    path: 'order',
    version: '1',
})
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post('list')
    @HttpCode(HttpStatus.OK)
    async list(@Request() req, @Body() createOrderDto: any) {
        console.log(createOrderDto)
        return await this.orderService.getPagedOrders(createOrderDto);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Request() req, @Body() createOrderDto: any) {
        console.log(createOrderDto)
        return await this.orderService.createOrder(createOrderDto);
    }

    @Get('label/:orderNumber')
    @HttpCode(200)
    async getPrintLabel(@Param('orderNumber') orderNumber, @Res() res) {
        const buffer = await this.orderService.downloadOrderLabelPDF(orderNumber, res)

        res.set({
            // pdf
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=pdf-external.pdf`,
            'Content-Length': buffer.length,
            // prevent cache
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: 0,
        });
        res.end(buffer);
    }
}